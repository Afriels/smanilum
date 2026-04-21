create extension if not exists "pgcrypto";

create or replace function public.set_current_school_id(school uuid)
returns void
language plpgsql
security definer
as $$
begin
  perform set_config('app.current_school_id', school::text, true);
end;
$$;

create or replace function public.current_school_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('app.current_school_id', true), '')::uuid
$$;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', 'authenticated')
$$;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  school_id uuid null,
  slug text not null unique,
  domain text unique,
  name text not null,
  tagline text,
  description text,
  logo_url text,
  primary_color text default '#576ac7',
  contact_email text,
  contact_phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('super_admin', 'admin', 'teacher', 'student')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  nis text not null,
  full_name text not null,
  grade text,
  class_name text,
  guardian_name text,
  guardian_phone text,
  status text default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, nis)
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content text,
  cover_url text,
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, slug)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null,
  description text,
  activity_date timestamptz,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null,
  image_url text not null,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_settings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  key text not null,
  value text,
  created_at timestamptz not null default now(),
  unique (school_id, key)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  bill_name text not null,
  amount numeric(12, 2) not null default 0,
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  payment_method text,
  paid_at timestamptz,
  midtrans_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ppdb (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  registration_no text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  previous_school text,
  document_url text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, registration_no)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  plan text not null check (plan in ('Basic', 'Pro', 'Premium')),
  status text not null check (status in ('trial', 'active', 'expired')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists schools_updated_at on public.schools;
create trigger schools_updated_at before update on public.schools for each row execute procedure public.handle_updated_at();
drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users for each row execute procedure public.handle_updated_at();
drop trigger if exists students_updated_at on public.students;
create trigger students_updated_at before update on public.students for each row execute procedure public.handle_updated_at();
drop trigger if exists news_updated_at on public.news;
create trigger news_updated_at before update on public.news for each row execute procedure public.handle_updated_at();
drop trigger if exists activities_updated_at on public.activities;
create trigger activities_updated_at before update on public.activities for each row execute procedure public.handle_updated_at();
drop trigger if exists gallery_updated_at on public.gallery;
create trigger gallery_updated_at before update on public.gallery for each row execute procedure public.handle_updated_at();
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments for each row execute procedure public.handle_updated_at();
drop trigger if exists ppdb_updated_at on public.ppdb;
create trigger ppdb_updated_at before update on public.ppdb for each row execute procedure public.handle_updated_at();
drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute procedure public.handle_updated_at();

alter table public.schools enable row level security;
alter table public.users enable row level security;
alter table public.students enable row level security;
alter table public.news enable row level security;
alter table public.activities enable row level security;
alter table public.gallery enable row level security;
alter table public.payments enable row level security;
alter table public.ppdb enable row level security;
alter table public.subscriptions enable row level security;
alter table public.website_settings enable row level security;

create policy "public read schools" on public.schools
for select using (true);

create policy "tenant can read own profile" on public.users
for select using (
  school_id = public.current_school_id()
  and auth.uid() = id
);

create policy "school admins manage users" on public.users
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (
  school_id = public.current_school_id()
);

create policy "tenant public content read" on public.news
for select using (school_id = public.current_school_id());

create policy "tenant activity read" on public.activities
for select using (school_id = public.current_school_id());

create policy "tenant gallery read" on public.gallery
for select using (school_id = public.current_school_id());

create policy "tenant ppdb insert" on public.ppdb
for insert with check (school_id = public.current_school_id());

create policy "tenant ppdb admin manage" on public.ppdb
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant students manage" on public.students
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin', 'teacher')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant news manage" on public.news
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant activities manage" on public.activities
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant gallery manage" on public.gallery
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant payments manage" on public.payments
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "tenant subscriptions view" on public.subscriptions
for select using (
  school_id = public.current_school_id()
);

create policy "tenant website settings read" on public.website_settings
for select using (true);

create policy "tenant website settings manage" on public.website_settings
for all using (
  school_id = public.current_school_id()
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
)
with check (school_id = public.current_school_id());

create policy "super admins manage subscriptions" on public.subscriptions
for all using (
  exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.role = 'super_admin'
  )
)
with check (school_id is not null);

insert into public.schools (
  id, school_id, slug, domain, name, tagline, description, contact_email, contact_phone, address
)
values (
  '00000000-0000-0000-0000-000000000001',
  null,
  'demo-school',
  'localhost:3000',
  'SMA Nilum Demo',
  'Smart School Management SaaS',
  'Platform sekolah modern untuk website, PPDB, SPP, dan dashboard admin.',
  'halo@smanilum.sch.id',
  '+62 812 0000 0000',
  'Jl. Pendidikan No. 1, Indonesia'
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('school-assets', 'school-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ppdb-documents', 'ppdb-documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "tenant assets read" on storage.objects
for select using (bucket_id = 'school-assets');

create policy "tenant assets upload" on storage.objects
for insert with check (
  bucket_id = 'school-assets'
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
);

create policy "tenant ppdb docs access" on storage.objects
for select using (
  bucket_id = 'ppdb-documents'
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
);

create policy "tenant ppdb docs upload" on storage.objects
for insert with check (
  bucket_id = 'ppdb-documents'
);

create policy "images public read" on storage.objects
for select using (bucket_id = 'images');

create policy "images admin upload" on storage.objects
for insert with check (
  bucket_id = 'images'
  and exists (
    select 1 from public.users me
    where me.id = auth.uid()
      and me.school_id = public.current_school_id()
      and me.role in ('super_admin', 'admin')
  )
);
