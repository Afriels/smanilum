import type { Metadata } from "next";
import { HeroSection } from "@/components/public/hero-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", "/");
}

export default async function HomePage() {
  const { tenant, content, news, activities, gallery } = await getPublicData();
  const orderedSections = content.homeSectionOrder.length > 0
    ? content.homeSectionOrder
    : ["features", "news", "activities", "gallery"];
  const visibleSections = orderedSections.filter((section) => !content.homeHiddenSections.includes(section));

  const sectionMap: Record<string, React.ReactNode> = {
    features: (
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.homeFeatureEyebrow}
          title={content.homeFeatureTitle}
          description={content.homeFeatureDescription}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.homeFeatureCards.map((item) => (
            <Card key={item} className="rounded-[28px] bg-white">
              <p className="text-base leading-7 text-slate-600">{item}</p>
            </Card>
          ))}
        </div>
      </section>
    ),
    news: (
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.homeNewsEyebrow}
          title={content.homeNewsTitle}
          description={content.homeNewsDescription}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="rounded-[28px] bg-white">
              {item.cover_url ? (
                <div
                  className="mb-4 h-44 rounded-3xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.cover_url})` }}
                />
              ) : null}
              <p className="text-sm text-brand-700">{formatDate(item.published_at ?? new Date())}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
            </Card>
          ))}
        </div>
      </section>
    ),
    activities: (
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.homeActivitiesEyebrow}
          title={content.homeActivitiesTitle}
          description={content.homeActivitiesDescription}
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
      </section>
    ),
    gallery: (
      <section className="section-shell py-12">
        <SectionHeading
          eyebrow={content.homeGalleryEyebrow}
          title={content.homeGalleryTitle}
          description={content.homeGalleryDescription}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    )
  };

  return (
    <main>
      <SiteHeader school={tenant} content={content} />
      <HeroSection content={content} />
      {visibleSections.map((section) => (
        <div key={section}>{sectionMap[section]}</div>
      ))}
      <SiteFooter school={tenant} content={content} />
    </main>
  );
}
