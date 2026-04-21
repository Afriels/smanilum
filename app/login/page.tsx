import { loginAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireTenant } from "@/lib/tenant";

export default async function LoginPage() {
  const tenant = await requireTenant();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-[32px] bg-white">
        <p className="text-sm font-semibold text-brand-700">Login Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{tenant.name}</h1>
        <p className="mt-3 text-sm text-slate-600">Gunakan akun Supabase Auth untuk masuk sebagai admin, guru, atau siswa.</p>
        <form action={loginAction} className="mt-8 grid gap-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <SubmitButton label="Masuk" pendingLabel="Memproses..." className="w-full" />
        </form>
      </Card>
    </main>
  );
}
