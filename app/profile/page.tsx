import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getWebsiteSettings } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("profile", "/profile");
}

export default async function ProfilePage() {
  const { tenant, content } = await getWebsiteSettings();

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.aboutEyebrow}
          title={content.aboutTitle}
          description={content.aboutText}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            { title: content.profileVisionTitle, text: content.profileVisionText },
            { title: content.profileMissionTitle, text: content.profileMissionText },
            { title: content.profileValuesTitle, text: content.profileValuesText }
          ].map((item) => (
            <Card key={item.title} className="rounded-[28px] bg-white">
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
