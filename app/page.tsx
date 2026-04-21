import { HeroSection } from "@/components/public/hero-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const { tenant, news, activities, gallery } = await getPublicData();

  return (
    <main>
      <SiteHeader school={tenant} />
      <HeroSection school={tenant} />

      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Kenapa platform ini"
          title="Website publik dan operasional sekolah berjalan dalam satu sistem"
          description="Setiap tenant sekolah mendapatkan branding, konten, PPDB, pembayaran, dan dashboard yang terisolasi lewat school_id."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Dashboard admin untuk berita, siswa, PPDB, dan tagihan.",
            "Website publik yang mudah dipersonalisasi untuk tiap sekolah.",
            "Supabase Auth, Storage, dan PostgreSQL untuk backend production-ready."
          ].map((item) => (
            <Card key={item} className="rounded-[28px] bg-white">
              <p className="text-base leading-7 text-slate-600">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Berita Terkini"
          title="Informasi terbaru untuk siswa dan orang tua"
          description="Konten dinamis per tenant sekolah, siap dikelola dari dashboard admin."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="rounded-[28px] bg-white">
              <p className="text-sm text-brand-700">{formatDate(item.published_at ?? new Date())}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Agenda Sekolah"
              title="Aktivitas akademik dan non-akademik yang aktif"
              description="Kegiatan sekolah dapat dipublikasikan agar komunikasi dengan komunitas sekolah lebih rapi."
            />
            <div className="mt-8 space-y-4">
              {activities.map((item) => (
                <Card key={item.id} className="rounded-[28px] bg-white">
                  <p className="text-sm text-brand-700">{item.location}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Galeri"
              title="Cerita visual sekolah"
              description="Galeri berbasis Supabase Storage untuk dokumentasi kegiatan sekolah."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {gallery.map((item) => (
                <Card key={item.id} className="rounded-[28px] bg-white p-4">
                  <div
                    className="h-40 rounded-3xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image_url})` }}
                  />
                  <p className="mt-4 text-sm text-brand-700">{item.category}</p>
                  <h3 className="mt-1 font-semibold text-slate-950">{item.title}</h3>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter school={tenant} />
    </main>
  );
}
