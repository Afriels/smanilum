import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("news", "/news");
}

export default async function NewsPage() {
  const { tenant, content, news } = await getPublicData();

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.homeNewsEyebrow}
          title={content.homeNewsTitle}
          description={content.homeNewsDescription}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {news.map((item) => (
            <Card key={item.id} className="rounded-[28px] bg-white">
              {item.cover_url ? (
                <div
                  className="mb-4 h-52 rounded-3xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.cover_url})` }}
                />
              ) : null}
              <p className="text-sm text-brand-700">{formatDate(item.published_at ?? new Date())}</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.content}</p>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
