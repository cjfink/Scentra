import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function FragrancePage({ params }: { params: { id: string } }) {
  const fragrance = await prisma.fragrance.findUnique({ where: { id: params.id } });
  if (!fragrance) return <div>Not found.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <Image src={fragrance.imageUrl} alt={fragrance.name} width={320} height={320} className="rounded-xl" />
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{fragrance.name}</h1>
        <p className="text-muted-foreground">{fragrance.brand} • {fragrance.concentration}</p>
        <div className="flex flex-wrap gap-2">{fragrance.notes.map((n) => <Badge key={n}>{n}</Badge>)}</div>
      </div>
    </div>
  );
}
