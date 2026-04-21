import { createGalleryAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function GalleryForm() {
  return (
    <Card className="rounded-[28px] bg-white">
      <h2 className="text-lg font-semibold text-slate-950">Upload Gallery</h2>
      <form action={createGalleryAction} className="mt-6 grid gap-4">
        <Input name="title" placeholder="Judul foto" required />
        <Input name="category" placeholder="Kategori" required />
        <Input name="image" type="file" accept="image/png,image/jpeg,image/webp" required />
        <SubmitButton label="Upload gambar" pendingLabel="Mengunggah..." className="w-full sm:w-fit" />
      </form>
    </Card>
  );
}
