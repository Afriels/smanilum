import { PPDBForm } from "@/components/forms/ppdb-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getWebsiteSettings } from "@/lib/data";

export default async function PPDBPage() {
  const { tenant, content } = await getWebsiteSettings();

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="PPDB Online"
              title="Pendaftaran siswa baru yang cepat dan terdokumentasi"
              description="Calon siswa mendaftar secara online, unggah dokumen ke Supabase Storage, dan admin memvalidasi dari dashboard."
            />
            <div className="mt-8 space-y-4">
              {[
                "Nomor registrasi dibuat otomatis.",
                "Status pendaftaran: pending, accepted, rejected.",
                "Dokumen siap dihubungkan ke bucket penyimpanan PPDB."
              ].map((item) => (
                <Card key={item} className="rounded-[28px] bg-white">
                  <p className="text-sm text-slate-600">{item}</p>
                </Card>
              ))}
            </div>
          </div>
          <PPDBForm />
        </div>
      </section>
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
