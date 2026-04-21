import { createPPDBAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PPDBForm() {
  return (
    <Card className="rounded-[32px] bg-white">
      <h2 className="text-xl font-semibold text-slate-950">Form Pendaftaran PPDB</h2>
      <form action={createPPDBAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input name="full_name" placeholder="Nama lengkap" required />
        <Input name="email" type="email" placeholder="Email aktif" required />
        <Input name="phone" placeholder="Nomor WhatsApp" required />
        <Input name="previous_school" placeholder="Asal sekolah" required />
        <Input name="document" type="file" accept="image/png,image/jpeg,image/webp" className="md:col-span-2" />
        <SubmitButton label="Kirim pendaftaran" pendingLabel="Mengirim..." className="md:col-span-2 w-full sm:w-fit" />
      </form>
      <p className="mt-4 text-sm text-slate-500">Unggah dokumen dalam format JPG, PNG, atau WEBP dengan ukuran maksimum 5MB.</p>
    </Card>
  );
}
