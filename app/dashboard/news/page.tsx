import { NewsForm } from "@/components/forms/news-form";
import { DataTable } from "@/components/dashboard/data-table";
import { getDashboardCollections } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function DashboardNewsPage() {
  const { news } = await getDashboardCollections();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <NewsForm />
      <DataTable
        title="Daftar Berita"
        columns={["Judul", "Slug", "Publish Date"]}
        rows={news.map((item) => [item.title, item.slug, formatDate(item.published_at ?? new Date())])}
      />
    </div>
  );
}
