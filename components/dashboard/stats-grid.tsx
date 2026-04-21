import { Newspaper, Wallet, Users, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

const items = [
  { key: "totalStudents", label: "Total Students", icon: Users },
  { key: "totalNews", label: "Published News", icon: Newspaper },
  { key: "pendingPPDB", label: "Pending PPDB", icon: UserPlus },
  { key: "pendingPayments", label: "Pending Payments", icon: Wallet }
] as const;

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="rounded-[28px] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{stats[item.key]}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
