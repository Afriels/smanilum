import { DataTable } from "@/components/dashboard/data-table";
import { StudentForm } from "@/components/forms/student-form";
import { getDashboardCollections } from "@/lib/data";

export default async function DashboardStudentsPage() {
  const { students } = await getDashboardCollections();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <StudentForm />
      <DataTable
        title="Daftar Siswa"
        columns={["NIS", "Nama", "Kelas", "Wali", "Status"]}
        rows={students.map((item) => [
          item.nis,
          item.full_name,
          `${item.grade} - ${item.class_name}`,
          `${item.guardian_name} (${item.guardian_phone})`,
          item.status
        ])}
      />
    </div>
  );
}
