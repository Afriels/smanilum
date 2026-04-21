import { Mail, MapPin, Phone } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireTenant } from "@/lib/tenant";

export default async function ContactPage() {
  const tenant = await requireTenant();

  return (
    <main>
      <SiteHeader school={tenant} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Kontak"
          title="Hubungi tim sekolah"
          description="Halaman kontak tenant sekolah yang bisa dikustomisasi dari data profil sekolah."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: tenant.contact_email ?? "-" },
            { icon: Phone, label: "Telepon", value: tenant.contact_phone ?? "-" },
            { icon: MapPin, label: "Alamat", value: tenant.address ?? "-" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="rounded-[28px] bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{item.value}</p>
              </Card>
            );
          })}
        </div>
      </section>
      <SiteFooter school={tenant} />
    </main>
  );
}
