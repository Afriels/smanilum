import type { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, Newspaper, Settings, Wallet, UserSquare2, Users } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Profile, School } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/ppdb", label: "PPDB", icon: GraduationCap },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardShell({
  school,
  profile,
  children
}: {
  school: School;
  profile: Profile;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/90 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient">
              <UserSquare2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{school.name}</p>
              <p className="text-sm text-slate-400">{profile.role}</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="mt-10">
            <Button type="submit" variant="secondary" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              Keluar
            </Button>
          </form>
        </aside>

        <main className="bg-slate-50 p-4 text-slate-950 sm:p-6 lg:p-8">
          <Card className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-700">School SaaS Control Center</p>
              <h1 className="mt-1 text-2xl font-bold">Kelola operasional sekolah dari satu dashboard</h1>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Tenant aktif: <span className="font-semibold text-slate-900">{school.slug}</span>
            </div>
          </Card>
          {children}
        </main>
      </div>
    </div>
  );
}
