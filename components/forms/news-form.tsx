import { createNewsAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewsForm() {
  return (
    <Card className="rounded-[28px] bg-white">
      <h2 className="text-lg font-semibold text-slate-950">Tambah Berita</h2>
      <form action={createNewsAction} className="mt-6 grid gap-4">
        <Input name="title" placeholder="Judul berita" required />
        <Input name="slug" placeholder="slug-berita" required />
        <Input name="cover_image" type="file" accept="image/png,image/jpeg,image/webp" />
        <Textarea name="excerpt" placeholder="Ringkasan berita" required />
        <Textarea name="content" placeholder="Konten lengkap berita" required />
        <SubmitButton label="Simpan berita" pendingLabel="Menyimpan..." className="w-full sm:w-fit" />
      </form>
    </Card>
  );
}
