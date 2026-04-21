import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getWebsiteSettings } from "@/lib/data";

export default async function SPPPage() {
  const { tenant, content } = await getWebsiteSettings();

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="SPP Payment"
          title="Tagihan dan pembayaran sekolah"
          description="Pembayaran sekolah terhubung ke data tenant dan siap diintegrasikan dengan Midtrans."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            { title: "Pembayaran Tenant", text: tenant.name },
            { title: "Kontak Billing", text: content.contactEmail || tenant.contact_email || "-" },
            { title: "Gateway", text: "Midtrans ready" }
          ].map((item) => (
            <Card key={item.title} className="rounded-[28px] bg-white">
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-lg font-semibold text-brand-700">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
