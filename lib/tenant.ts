import { headers } from "next/headers";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { School } from "@/lib/types";

function sanitizeHost(host: string | null) {
  return (host ?? env.defaultSchoolDomain).replace(/^www\./, "").toLowerCase();
}

function getSlugFromHost(host: string) {
  if (host === "localhost:3000" || host === env.defaultSchoolDomain) {
    return env.defaultSchoolSlug;
  }

  const [subdomain] = host.split(".");
  return subdomain || env.defaultSchoolSlug;
}

export async function getCurrentTenant() {
  const host = sanitizeHost(headers().get("host"));
  const slug = getSlugFromHost(host);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .or(`domain.eq.${host},slug.eq.${slug}`)
    .limit(1)
    .maybeSingle<School>();

  if (error) {
    console.error("Failed to fetch tenant", error);
  }

  if (data) {
    return data;
  }

  return {
    id: "00000000-0000-0000-0000-000000000001",
    school_id: null,
    slug: env.defaultSchoolSlug,
    domain: env.defaultSchoolDomain,
    name: "SMA Nilum Demo",
    tagline: "Smart School Management SaaS",
    description:
      "Platform operasional sekolah modern untuk website, PPDB, pembayaran SPP, dan dashboard administrasi.",
    logo_url: null,
    primary_color: "#576ac7",
    contact_email: "halo@smanilum.sch.id",
    contact_phone: "+62 812 0000 0000",
    address: "Jl. Pendidikan No. 1, Indonesia"
  } satisfies School;
}

export async function requireTenant() {
  const tenant = await getCurrentTenant();
  if (!tenant?.id) {
    throw new Error("Tenant not found.");
  }
  return tenant;
}
