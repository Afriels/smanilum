import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireTenant } from "@/lib/tenant";
import { currency } from "@/lib/utils";

export default async function SPPPage() {
  const tenant = await requireTenant();

  return (
    <main>
      <SiteHeader school={tenant} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="SPP Payment"
          title="Tagihan dan pembayaran sekolah"
          description="Halaman publik untuk menampilkan kesiapan integrasi tagihan dengan Midtrans dan riwayat status pembayaran."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            { title: "SPP April 2026", amount: 450000, status: "Pending" },
            { title: "SPP Mei 2026", amount: 450000, status: "Belum Dibuka" },
            { title: "Midtrans", amount: 0, status: "Integration Ready" }
          ].map((item) => (
            <Card key={item.title} className="rounded-[28px] bg-white">
              <p className="text-sm text-slate-500">{item.status}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-3xl font-bold text-brand-700">
                {item.amount ? currency(item.amount) : tenant.name}
              </p>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} />
    </main>
  );
}
