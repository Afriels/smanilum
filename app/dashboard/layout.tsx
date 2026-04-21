import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuth } from "@/lib/auth";
import { requireTenant } from "@/lib/tenant";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const [tenant, profile] = await Promise.all([requireTenant(), requireAuth()]);

  return (
    <DashboardShell school={tenant} profile={profile}>
      {children}
    </DashboardShell>
  );
}
