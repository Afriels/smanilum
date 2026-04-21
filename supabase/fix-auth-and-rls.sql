-- Apply this after supabase/schema.sql
-- Fixes:
-- 1. Auto-create public.users rows from auth.users
-- 2. Backfill existing auth users
-- 3. Resolve current school/role without relying on session-local settings
-- 4. Repair RLS for public website data and PPDB submissions

create or replace function public.auth_user_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id
  from public.users
  where id = auth.uid()
  limit 1
$$;

create or replace function public.auth_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.users
  where id = auth.uid()
  limit 1
$$;

create or replace function public.current_school_id()
returns uuid
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'school_id', '')::uuid,
    nullif(auth.jwt() -> 'app_metadata' ->> 'school_id', '')::uuid,
    public.auth_user_school_id()
  )
$$;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'role', ''),
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    public.auth_user_role(),
    'authenticated'
  )
$$;

create or replace function public.prepare_auth_user_metadata()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  default_school_id constant uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  default_role constant text := 'admin';
  resolved_school_id uuid;
  resolved_role text;
  resolved_full_name text;
begin
  resolved_school_id := coalesce(
    nullif(new.raw_user_meta_data ->> 'school_id', '')::uuid,
    default_school_id
  );

  resolved_role := coalesce(
    nullif(new.raw_user_meta_data ->> 'role', ''),
    default_role
  );

  if resolved_role not in ('super_admin', 'admin', 'teacher', 'student') then
    resolved_role := default_role;
  end if;

  resolved_full_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(coalesce(new.email, 'user'), '@', 1)
  );

  new.raw_user_meta_data := coalesce(new.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'school_id', resolved_school_id::text,
    'role', resolved_role,
    'full_name', resolved_full_name
  );

  return new;
end;
$$;

drop trigger if exists before_auth_user_created_prepare on auth.users;
create trigger before_auth_user_created_prepare
before insert on auth.users
for each row
execute function public.prepare_auth_user_metadata();

create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  resolved_school_id uuid;
  resolved_role text;
  resolved_full_name text;
begin
  resolved_school_id := coalesce(
    nullif(new.raw_user_meta_data ->> 'school_id', '')::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid
  );

  resolved_role := coalesce(
    nullif(new.raw_user_meta_data ->> 'role', ''),
    'admin'
  );

  if resolved_role not in ('super_admin', 'admin', 'teacher', 'student') then
    resolved_role := 'admin';
  end if;

  resolved_full_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(coalesce(new.email, 'user'), '@', 1)
  );

  insert into public.users (
    id,
    school_id,
    full_name,
    email,
    role,
    avatar_url
  )
  values (
    new.id,
    resolved_school_id,
    resolved_full_name,
    new.email,
    resolved_role,
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
  set
    school_id = excluded.school_id,
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sync on auth.users;
create trigger on_auth_user_created_sync
after insert on auth.users
for each row
execute function public.handle_auth_user_sync();

update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
  'school_id',
  coalesce(
    nullif(raw_user_meta_data ->> 'school_id', ''),
    '00000000-0000-0000-0000-000000000001'
  ),
  'role',
  case
    when coalesce(nullif(raw_user_meta_data ->> 'role', ''), 'admin') in ('super_admin', 'admin', 'teacher', 'student')
      then coalesce(nullif(raw_user_meta_data ->> 'role', ''), 'admin')
    else 'admin'
  end,
  'full_name',
  coalesce(nullif(raw_user_meta_data ->> 'full_name', ''), split_part(email, '@', 1))
)
where true;

insert into public.users (
  id,
  school_id,
  full_name,
  email,
  role,
  avatar_url
)
select
  au.id,
  coalesce(
    nullif(au.raw_user_meta_data ->> 'school_id', '')::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid
  ) as school_id,
  coalesce(nullif(au.raw_user_meta_data ->> 'full_name', ''), split_part(au.email, '@', 1)) as full_name,
  au.email,
  case
    when coalesce(nullif(au.raw_user_meta_data ->> 'role', ''), 'admin') in ('super_admin', 'admin', 'teacher', 'student')
      then coalesce(nullif(au.raw_user_meta_data ->> 'role', ''), 'admin')
    else 'admin'
  end as role,
  nullif(au.raw_user_meta_data ->> 'avatar_url', '') as avatar_url
from auth.users au
on conflict (id) do update
set
  school_id = excluded.school_id,
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  avatar_url = excluded.avatar_url,
  updated_at = now();

drop policy if exists "tenant can read own profile" on public.users;
create policy "tenant can read own profile" on public.users
for select
using (auth.uid() = id);

drop policy if exists "school admins manage users" on public.users;
create policy "school admins manage users" on public.users
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant public content read" on public.news;
create policy "tenant public content read" on public.news
for select
using (true);

drop policy if exists "tenant activity read" on public.activities;
create policy "tenant activity read" on public.activities
for select
using (true);

drop policy if exists "tenant gallery read" on public.gallery;
create policy "tenant gallery read" on public.gallery
for select
using (true);

drop policy if exists "tenant ppdb insert" on public.ppdb;
create policy "tenant ppdb insert" on public.ppdb
for insert
with check (school_id is not null);

drop policy if exists "tenant ppdb admin manage" on public.ppdb;
create policy "tenant ppdb admin manage" on public.ppdb
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant students manage" on public.students;
create policy "tenant students manage" on public.students
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin', 'teacher')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin', 'teacher')
);

drop policy if exists "tenant news manage" on public.news;
create policy "tenant news manage" on public.news
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant activities manage" on public.activities;
create policy "tenant activities manage" on public.activities
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant gallery manage" on public.gallery;
create policy "tenant gallery manage" on public.gallery
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant payments manage" on public.payments;
create policy "tenant payments manage" on public.payments
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant subscriptions view" on public.subscriptions;
create policy "tenant subscriptions view" on public.subscriptions
for select
using (
  school_id = public.current_school_id()
);

create table if not exists public.website_settings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  key text not null,
  value text,
  created_at timestamptz not null default now(),
  unique (school_id, key)
);

alter table public.website_settings enable row level security;

drop policy if exists "tenant website settings read" on public.website_settings;
create policy "tenant website settings read" on public.website_settings
for select
using (true);

drop policy if exists "tenant website settings manage" on public.website_settings;
create policy "tenant website settings manage" on public.website_settings
for all
using (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
)
with check (
  school_id = public.current_school_id()
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "super admins manage subscriptions" on public.subscriptions;
create policy "super admins manage subscriptions" on public.subscriptions
for all
using (public.current_role() = 'super_admin')
with check (public.current_role() = 'super_admin');

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "tenant assets read" on storage.objects;
create policy "tenant assets read" on storage.objects
for select
using (bucket_id = 'school-assets');

drop policy if exists "tenant assets upload" on storage.objects;
create policy "tenant assets upload" on storage.objects
for insert
with check (
  bucket_id = 'school-assets'
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant ppdb docs access" on storage.objects;
create policy "tenant ppdb docs access" on storage.objects
for select
using (
  bucket_id = 'ppdb-documents'
  and public.current_role() in ('super_admin', 'admin')
);

drop policy if exists "tenant ppdb docs upload" on storage.objects;
create policy "tenant ppdb docs upload" on storage.objects
for insert
with check (bucket_id = 'ppdb-documents');

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects
for select
using (bucket_id = 'images');

drop policy if exists "images admin upload" on storage.objects;
create policy "images admin upload" on storage.objects
for insert
with check (
  bucket_id = 'images'
  and public.current_role() in ('super_admin', 'admin')
);
