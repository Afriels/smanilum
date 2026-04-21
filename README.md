# School Management SaaS

Multi-tenant school management SaaS built with Next.js App Router, Tailwind CSS, and Supabase.

## Features

- Public school website per tenant
- Admin dashboard
- PPDB online registration
- SPP billing foundation with Midtrans-ready fields
- Student management
- Subscription plan model for SaaS billing
- Supabase Auth, PostgreSQL, Storage, and RLS

## Folder Structure

```text
app/
  dashboard/
  login/
  ppdb/
  spp/
components/
  dashboard/
  forms/
  layout/
  public/
  ui/
lib/
  supabase/
supabase/
  schema.sql
```

## Run

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env.local
```

3. Fill these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_SCHOOL_SLUG=demo-school
DEFAULT_SCHOOL_DOMAIN=localhost:3000
```

4. Run the SQL in [supabase/schema.sql](/c:/Users/Homes/Documents/Website%20smanilum%202026/smanilum/supabase/schema.sql:1) inside Supabase SQL Editor.

5. Start development server:

```bash
npm run dev
```

## Deployment

- Deploy frontend to Vercel
- Add the same environment variables in Vercel
- Set tenant domains/subdomains to map each school
- Apply `supabase/schema.sql` to production Supabase project

## Notes

- All business tables use `school_id` for multi-tenant isolation
- Tenant detection uses `domain` or subdomain slug from request host
- Dashboard auth uses Supabase Auth and the public `users` profile table
- Bucket names used: `school-assets`, `ppdb-documents`
