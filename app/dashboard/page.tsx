import { Card } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { getDashboardData } from "@/lib/data";
import { currency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { stats } = await getDashboardData();

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] bg-white">
          <h2 className="text-lg font-semibold text-slate-950">Operational Snapshot</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Dashboard ini menyiapkan sekolah untuk mengelola PPDB, konten, siswa, dan pembayaran dalam satu tenant.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Subscription Plan</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{stats.activeSubscription?.plan}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Masa aktif sampai</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {formatDate(stats.activeSubscription?.ends_at ?? new Date())}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-[28px] bg-slate-950 text-white">
          <p className="text-sm text-white/70">Revenue Readiness</p>
          <h2 className="mt-2 text-3xl font-bold">{currency(stats.pendingPayments * 450000)}</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Nilai ini mewakili estimasi outstanding pembayaran yang siap ditindaklanjuti melalui validasi pembayaran dan integrasi gateway.
          </p>
        </Card>
      </div>
    </div>
  );
}
