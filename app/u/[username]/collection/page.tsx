import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function PublicCollectionPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({ where: { username: params.username }, include: { collection: { include: { fragrance: true } } } });
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">@{user.username}'s Collection</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user.collection.map((item) => (
          <div key={item.id} className="rounded-xl border p-3">
            <Image src={item.fragrance.thumbnailUrl ?? item.fragrance.imageUrl} alt={item.fragrance.name} width={300} height={180} className="h-40 w-full rounded-md object-cover" />
            <p className="mt-2 font-medium">{item.fragrance.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
