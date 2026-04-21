import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicData } from "@/lib/data";

export default async function GalleryPage() {
  const { tenant, gallery } = await getPublicData();

  return (
    <main>
      <SiteHeader school={tenant} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Galeri"
          title="Dokumentasi kegiatan sekolah"
          description="Siap terhubung ke Supabase Storage untuk penyimpanan foto dan dokumentasi event."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {gallery.map((item) => (
            <Card key={item.id} className="rounded-[28px] bg-white p-4">
              <div
                className="h-56 rounded-3xl bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image_url})` }}
              />
              <div className="mt-4">
                <p className="text-sm text-brand-700">{item.category}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{item.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} />
    </main>
  );
}
