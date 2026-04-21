import { DataTable } from "@/components/dashboard/data-table";
import { Card } from "@/components/ui/card";
import { getDashboardCollections } from "@/lib/data";

export default async function DashboardPPDBPage() {
  const { ppdb } = await getDashboardCollections();

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] bg-white">
        <h2 className="text-lg font-semibold text-slate-950">Validation Queue</h2>
        <p className="mt-3 text-sm text-slate-600">
          Validasi calon siswa, verifikasi dokumen, dan update status pendaftaran dari dashboard admin.
        </p>
      </Card>
      <DataTable
        title="Data PPDB"
        columns={["No Registrasi", "Nama", "Email", "Asal Sekolah", "Status"]}
        rows={ppdb.map((item) => [
          item.registration_no,
          item.full_name,
          item.email,
          item.previous_school,
          item.status
        ])}
      />
    </div>
  );
}
