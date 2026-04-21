import { Card } from "@/components/ui/card";

export function DataTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] bg-white p-0">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((value, cellIndex) => (
                  <td key={cellIndex} className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {value ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
