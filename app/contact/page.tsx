import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getWebsiteSettings } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const { tenant, content } = await getWebsiteSettings();

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Kontak"
          title={content.contactTitle}
          description={content.contactDescription}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: content.contactEmail || tenant.contact_email || "-" },
            { icon: Phone, label: "Telepon", value: content.contactPhone || tenant.contact_phone || "-" },
            { icon: MapPin, label: "Alamat", value: content.contactAddress || tenant.address || "-" }
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
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
