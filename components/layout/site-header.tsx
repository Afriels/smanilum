import Link from "next/link";
import Image from "next/image";
import { Building2, MenuSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { School, WebsiteContent } from "@/lib/types";

const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/profile", label: "Profil" },
  { href: "/news", label: "Berita" },
  { href: "/gallery", label: "Galeri" },
  { href: "/contact", label: "Kontak" }
];

export function SiteHeader({ school, content }: { school: School; content: WebsiteContent }) {
  return (
    <header className="section-shell sticky top-0 z-30 py-4">
      <div className="glass-panel flex items-center justify-between rounded-4xl px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            {content.schoolLogoUrl ? (
              <Image src={content.schoolLogoUrl} alt={school.name} width={44} height={44} className="rounded-2xl object-cover" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{school.name}</p>
            <p className="text-xs text-slate-500">{school.tagline ?? "School Management SaaS"}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="secondary" className="rounded-full">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button className="rounded-full">
            <Link href={content.heroPrimaryUrl || "/ppdb"}>{content.heroPrimaryLabel || "Daftar PPDB"}</Link>
          </Button>
        </div>

        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden">
          <MenuSquare className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
