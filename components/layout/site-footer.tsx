import type { School } from "@/lib/types";

export function SiteFooter({ school }: { school: School }) {
  return (
    <footer className="section-shell py-12">
      <div className="glass-panel grid gap-8 rounded-4xl p-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">{school.name}</p>
          <p className="mt-2 text-sm text-slate-600">{school.description}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Kontak</p>
          <p className="mt-2 text-sm text-slate-600">{school.contact_email}</p>
          <p className="text-sm text-slate-600">{school.contact_phone}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Alamat</p>
          <p className="mt-2 text-sm text-slate-600">{school.address}</p>
        </div>
      </div>
    </footer>
  );
}
