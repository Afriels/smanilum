import { createPaymentAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PaymentForm() {
  return (
    <Card className="rounded-[28px] bg-white">
      <h2 className="text-lg font-semibold text-slate-950">Buat Tagihan SPP</h2>
      <form action={createPaymentAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input name="student_id" placeholder="Student ID / UUID" required />
        <Input name="bill_name" placeholder="Nama tagihan" required />
        <Input name="amount" type="number" placeholder="Jumlah" required />
        <Input name="due_date" type="date" required />
        <SubmitButton label="Simpan tagihan" pendingLabel="Menyimpan..." className="md:col-span-2 w-full sm:w-fit" />
      </form>
    </Card>
  );
}
