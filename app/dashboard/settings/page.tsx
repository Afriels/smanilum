import { requireAuth } from "@/lib/auth";
import { GalleryForm } from "@/components/forms/gallery-form";
import { WebsiteSettingsForm } from "@/components/forms/website-settings-form";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { getDashboardCollections } from "@/lib/data";

export default async function DashboardSettingsPage() {
  await requireAuth(["super_admin", "admin"]);
  const { tenant, settings, gallery } = await getDashboardCollections();

  return (
    <div className="grid gap-6">
      <Card className="rounded-[28px] bg-white">
        <h2 className="text-lg font-semibold text-slate-950">School Settings</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p>School Name: <span className="font-semibold text-slate-950">{tenant.name}</span></p>
          <p>Tenant Slug: <span className="font-semibold text-slate-950">{tenant.slug}</span></p>
          <p>Primary Domain: <span className="font-semibold text-slate-950">{tenant.domain}</span></p>
        </div>
      </Card>
      <WebsiteSettingsForm settings={settings} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GalleryForm />
        <DataTable
          title="Gallery Assets"
          columns={["Title", "Category", "Image URL"]}
          rows={gallery.map((item) => [item.title, item.category, item.image_url])}
        />
      </div>
    </div>
  );
}
