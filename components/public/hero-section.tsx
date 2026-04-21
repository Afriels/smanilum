import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { School } from "@/lib/types";

export function HeroSection({ school }: { school: School }) {
  return (
    <section className="section-shell py-10 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Badge className="bg-slate-950">Multi-tenant School SaaS</Badge>
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            {school.name} membangun pengalaman sekolah digital yang rapi, cepat, dan siap tumbuh.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Website sekolah, PPDB online, pembayaran SPP, dan dashboard admin dalam satu platform yang aman dengan isolasi data per sekolah.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="rounded-full px-6 py-3">
              <Link href="/ppdb" className="flex items-center gap-2">
                Mulai PPDB
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" className="rounded-full px-6 py-3">
              <Link href="/dashboard">Lihat Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-[36px] border-0 bg-slate-950 p-7 text-white">
          <div className="rounded-[28px] bg-brand-gradient p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Control Tower</p>
            <p className="mt-4 text-3xl font-bold">All-in-one school operations</p>
            <p className="mt-2 text-sm text-white/80">Dirancang untuk admin sekolah, guru, dan siswa dengan alur kerja yang jelas.</p>
          </div>
          <div className="mt-6 grid gap-4">
            {[
              { icon: Sparkles, text: "Public website yang siap dipakai per tenant sekolah" },
              { icon: WalletCards, text: "Tagihan SPP dan status pembayaran yang siap integrasi Midtrans" },
              { icon: ShieldCheck, text: "Supabase Auth + RLS untuk keamanan data dan akses per role" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-200">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}
