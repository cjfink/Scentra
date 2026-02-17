import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";

export default async function ExplorePage({ searchParams }: { searchParams: { q?: string; vibe?: string; season?: string } }) {
  const q = searchParams.q ?? "";
  const fragrances = await prisma.fragrance.findMany({
    where: {
      AND: [
        q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] } : {},
        searchParams.vibe ? { vibeTags: { has: searchParams.vibe } } : {},
        searchParams.season ? { seasonTags: { has: searchParams.season } } : {}
      ]
    },
    take: 48
  });

  return (
    <div className="space-y-6">
      <form className="grid gap-3 md:grid-cols-3">
        <Input name="q" placeholder="Search fragrance or brand" defaultValue={q} />
        <Input name="vibe" placeholder="Filter vibe (fresh, sweet...)" defaultValue={searchParams.vibe} />
        <Input name="season" placeholder="Filter season" defaultValue={searchParams.season} />
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fragrances.map((frag) => (
          <Link href={`/fragrance/${frag.id}`} key={frag.id} className="rounded-xl border p-3">
            <Image src={frag.thumbnailUrl ?? frag.imageUrl} alt={frag.name} width={320} height={220} className="h-44 w-full rounded-md object-cover" />
            <p className="mt-3 font-medium">{frag.name}</p>
            <p className="text-sm text-muted-foreground">{frag.brand}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
