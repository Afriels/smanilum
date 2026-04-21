import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireTenant } from "@/lib/tenant";
import type { Profile, UserRole } from "@/lib/types";

export async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const tenant = await requireTenant();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .eq("school_id", tenant.id)
    .maybeSingle<Profile>();

  if (error) {
    console.error("Failed to fetch current profile", error);
  }

  return data ?? null;
}

export async function requireAuth(roles?: UserRole[]) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (roles && !roles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}
