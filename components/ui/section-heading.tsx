import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <Badge className="bg-white/80 text-slate-700">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-slate-600">{description}</p>
    </div>
  );
}
