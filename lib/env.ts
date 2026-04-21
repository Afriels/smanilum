const requiredClientVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

for (const key of requiredClientVars) {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  defaultSchoolSlug: process.env.DEFAULT_SCHOOL_SLUG ?? "demo-school",
  defaultSchoolDomain: process.env.DEFAULT_SCHOOL_DOMAIN ?? "localhost:3000"
};
