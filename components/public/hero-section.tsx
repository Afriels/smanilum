import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WebsiteContent } from "@/lib/types";

const iconMap = [Sparkles, WalletCards, ShieldCheck];

export function HeroSection({ content }: { content: WebsiteContent }) {
  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {content.heroBadge ? <Badge className="bg-slate-950">{content.heroBadge}</Badge> : null}
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {content.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="rounded-full px-6 py-3">
              <Link href={content.heroPrimaryUrl} className="flex items-center gap-2">
                {content.heroPrimaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" className="rounded-full px-6 py-3">
              <Link href={content.heroSecondaryUrl}>{content.heroSecondaryLabel}</Link>
            </Button>
          </div>
        </div>

        <Card
          className="rounded-[36px] border-0 bg-slate-950 p-7 text-white"
          style={
            content.heroBackgroundImage
              ? {
                  backgroundImage: `linear-gradient(rgba(15,23,42,0.74), rgba(15,23,42,0.92)), url(${content.heroBackgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }
              : undefined
          }
        >
          <div className="rounded-[28px] bg-brand-gradient p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{content.heroPanelEyebrow}</p>
            <p className="mt-4 text-3xl font-bold">{content.heroPanelTitle}</p>
            <p className="mt-2 text-sm text-white/80">{content.heroPanelDescription}</p>
          </div>
          <div className="mt-6 grid gap-4">
            {content.heroFeatures.map((item, index) => {
              const Icon = iconMap[index] ?? Sparkles;
              return (
                <div key={item} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}
