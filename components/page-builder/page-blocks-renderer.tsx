import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActivityItem, GalleryItem, NewsItem, PageBlock } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function limitItems<T>(items: T[], count?: number) {
  return count && count > 0 ? items.slice(0, count) : items;
}

export function PageBlocksRenderer({
  blocks,
  news,
  activities,
  gallery
}: {
  blocks: PageBlock[];
  news: NewsItem[];
  activities: ActivityItem[];
  gallery: GalleryItem[];
}) {
  return (
    <>
      {blocks.map((block) => {
        const cards = block.config.cards ?? [];
        const body = block.config.body ?? "";
        const layout = block.config.layout ?? "grid";

        if (block.block_type === "hero") {
          return (
            <section key={block.id} className="section-shell py-10 sm:py-14">
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  {block.subtitle ? <Badge className="bg-slate-950">{block.subtitle}</Badge> : null}
                  <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                    {block.title}
                  </h1>
                  {body ? <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{body}</p> : null}
                  {block.button_label && block.button_url ? (
                    <div className="mt-8">
                      <Button className="rounded-full px-6 py-3">
                        <Link href={block.button_url}>{block.button_label}</Link>
                      </Button>
                    </div>
                  ) : null}
                </div>

                <Card
                  className="rounded-[36px] border-0 bg-slate-950 p-7 text-white"
                  style={
                    block.image_url
                      ? {
                          backgroundImage: `linear-gradient(rgba(15,23,42,0.74), rgba(15,23,42,0.92)), url(${block.image_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }
                      : undefined
                  }
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Live Preview</p>
                  <h2 className="mt-4 text-3xl font-bold">{block.title}</h2>
                  {body ? <p className="mt-3 text-sm leading-7 text-white/75">{body}</p> : null}
                </Card>
              </div>
            </section>
          );
        }

        if (block.block_type === "rich_text") {
          return (
            <section key={block.id} className="section-shell py-12">
              <SectionHeading
                eyebrow={block.subtitle ?? ""}
                title={block.title ?? ""}
                description={body}
              />
            </section>
          );
        }

        if (block.block_type === "feature_cards" || block.block_type === "contact_cards") {
          return (
            <section key={block.id} className="section-shell py-12">
              <SectionHeading
                eyebrow={block.subtitle ?? ""}
                title={block.title ?? ""}
                description={body || ""}
              />
              <div className={`mt-8 grid gap-4 ${layout === "stack" ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
                {cards.map((card, index) => {
                  const icons = [Mail, Phone, MapPin];
                  const Icon = icons[index] ?? Mail;
                  return (
                    <Card key={`${block.id}-${card.title}-${index}`} className="rounded-[28px] bg-white">
                      {block.block_type === "contact_cards" ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                      ) : null}
                      <h3 className="mt-4 text-xl font-semibold text-slate-950">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        }

        if (block.block_type === "news_feed") {
          const items = limitItems(news, block.config.itemCount);
          return (
            <section key={block.id} className="section-shell py-12">
              <SectionHeading eyebrow={block.subtitle ?? ""} title={block.title ?? ""} description={body || ""} />
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="rounded-[28px] bg-white">
                    {item.cover_url ? (
                      <div className="mb-4 h-44 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${item.cover_url})` }} />
                    ) : null}
                    <p className="text-sm text-brand-700">{formatDate(item.published_at ?? new Date())}</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
                  </Card>
                ))}
              </div>
            </section>
          );
        }

        if (block.block_type === "activities_feed") {
          const items = limitItems(activities, block.config.itemCount);
          return (
            <section key={block.id} className="section-shell py-12">
              <SectionHeading eyebrow={block.subtitle ?? ""} title={block.title ?? ""} description={body || ""} />
              <div className="mt-8 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="rounded-[28px] bg-white">
                    <p className="text-sm text-brand-700">{item.location}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </Card>
                ))}
              </div>
            </section>
          );
        }

        if (block.block_type === "gallery_feed") {
          const items = limitItems(gallery, block.config.itemCount);
          return (
            <section key={block.id} className="section-shell py-12">
              <SectionHeading eyebrow={block.subtitle ?? ""} title={block.title ?? ""} description={body || ""} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="rounded-[28px] bg-white p-4">
                    <div className="h-40 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                    <p className="mt-4 text-sm text-brand-700">{item.category}</p>
                    <h3 className="mt-1 font-semibold text-slate-950">{item.title}</h3>
                  </Card>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
