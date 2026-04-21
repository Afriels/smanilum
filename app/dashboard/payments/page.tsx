import { DataTable } from "@/components/dashboard/data-table";
import { PaymentForm } from "@/components/forms/payment-form";
import { getDashboardCollections } from "@/lib/data";
import { currency, formatDate } from "@/lib/utils";

export default async function DashboardPaymentsPage() {
  const { payments } = await getDashboardCollections();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <PaymentForm />
      <DataTable
        title="Daftar Tagihan"
        columns={["Tagihan", "Student ID", "Amount", "Due Date", "Status"]}
        rows={payments.map((item) => [
          item.bill_name,
          item.student_id,
          currency(item.amount),
          formatDate(item.due_date ?? new Date()),
          item.status
        ])}
      />
    </div>
  );
}
