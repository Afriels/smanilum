import { createStudentAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StudentForm() {
  return (
    <Card className="rounded-[28px] bg-white">
      <h2 className="text-lg font-semibold text-slate-950">Tambah Siswa</h2>
      <form action={createStudentAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input name="nis" placeholder="NIS" required />
        <Input name="full_name" placeholder="Nama lengkap" required />
        <Input name="grade" placeholder="Tingkat" required />
        <Input name="class_name" placeholder="Kelas" required />
        <Input name="guardian_name" placeholder="Nama wali" required />
        <Input name="guardian_phone" placeholder="Telepon wali" required />
        <SubmitButton label="Simpan siswa" pendingLabel="Menyimpan..." className="md:col-span-2 w-full sm:w-fit" />
      </form>
    </Card>
  );
}
