import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireTenant } from "@/lib/tenant";

export default async function ProfilePage() {
  const tenant = await requireTenant();

  return (
    <main>
      <SiteHeader school={tenant} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Profil Sekolah"
          title={tenant.name}
          description={tenant.description ?? "Sekolah modern dengan pengelolaan akademik dan layanan digital yang terintegrasi."}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            { title: "Visi", text: "Membangun lulusan berkarakter, unggul, dan siap beradaptasi dengan perkembangan zaman." },
            { title: "Misi", text: "Menghadirkan proses belajar yang efektif, kolaboratif, dan terukur berbasis teknologi." },
            { title: "Nilai", text: "Integritas, prestasi, disiplin, kolaborasi, dan pelayanan prima untuk seluruh warga sekolah." }
          ].map((item) => (
            <Card key={item.title} className="rounded-[28px] bg-white">
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} />
    </main>
  );
}
