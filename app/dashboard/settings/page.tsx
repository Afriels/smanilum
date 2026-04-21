import { Card } from "@/components/ui/card";
import { requireTenant } from "@/lib/tenant";

export default async function DashboardSettingsPage() {
  const tenant = await requireTenant();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-[28px] bg-white">
        <h2 className="text-lg font-semibold text-slate-950">School Settings</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p>School Name: <span className="font-semibold text-slate-950">{tenant.name}</span></p>
          <p>Tenant Slug: <span className="font-semibold text-slate-950">{tenant.slug}</span></p>
          <p>Primary Domain: <span className="font-semibold text-slate-950">{tenant.domain}</span></p>
        </div>
      </Card>
      <Card className="rounded-[28px] bg-white">
        <h2 className="text-lg font-semibold text-slate-950">SaaS Subscription</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Kontrol plan sekolah menggunakan tabel `subscriptions`. Akses dashboard dan fitur premium dapat dibatasi jika status berakhir atau expired.
        </p>
      </Card>
    </div>
  );
}
