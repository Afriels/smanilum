import { requireAuth } from "@/lib/auth";
import { GalleryForm } from "@/components/forms/gallery-form";
import { WebsiteSettingsForm } from "@/components/forms/website-settings-form";
import { PageBuilderStudio } from "@/components/page-builder/page-builder-studio";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { getDashboardCollections, getPageBuilderData } from "@/lib/data";

export default async function DashboardSettingsPage() {
  await requireAuth(["super_admin", "admin"]);
  const [{ tenant, settings, gallery, news, activities }, { pageBlocks }] = await Promise.all([
    getDashboardCollections(),
    getPageBuilderData()
  ]);

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
      <PageBuilderStudio initialBlocks={pageBlocks} news={news} activities={activities} gallery={gallery} />
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
