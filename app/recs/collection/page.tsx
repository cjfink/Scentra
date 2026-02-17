import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { scoreCollectionRecommendations } from "@/lib/recommendations";

export default async function CollectionRecsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, collection, catalog] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.collectionItem.findMany({ where: { userId: session.user.id }, include: { fragrance: true } }),
    prisma.fragrance.findMany()
  ]);
  if (!user) return <div>No user found.</div>;

  const data = scoreCollectionRecommendations(user, collection, catalog);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Collection Gap & Compliment Recs</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((rec) => (
          <div key={rec.fragrance.id} className="rounded-xl border p-3">
            <Image src={rec.fragrance.thumbnailUrl ?? rec.fragrance.imageUrl} alt={rec.fragrance.name} width={300} height={180} className="h-40 w-full rounded-md object-cover" />
            <p className="mt-2 font-medium">{rec.fragrance.name}</p>
            <p className="text-sm text-muted-foreground">{rec.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
