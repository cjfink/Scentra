import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddCollectionForm } from "@/components/add-collection-form";
import { Button } from "@/components/ui/button";

export default async function CollectionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await prisma.collectionItem.findMany({ where: { userId: session.user.id }, include: { fragrance: true } });

  return (
    <div className="grid gap-6 md:grid-cols-[380px_1fr]">
      <div className="rounded-xl border p-5"><AddCollectionForm /></div>
      <div className="space-y-4">
        {items.length === 0 && <div className="rounded-xl border p-8 text-center">Start your shelf by adding your first fragrance.</div>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-3">
              <Image src={item.fragrance.thumbnailUrl ?? item.fragrance.imageUrl} alt={item.fragrance.name} width={56} height={56} className="rounded" />
              <div>
                <p className="font-medium">{item.fragrance.name}</p>
                <p className="text-xs text-muted-foreground">Rating {item.rating ?? "-"} • Wears {item.wearCount}</p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await prisma.collectionItem.delete({ where: { userId_fragranceId: { userId: session.user.id, fragranceId: item.fragranceId } } });
              }}
            >
              <Button variant="outline" type="submit">Remove</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
