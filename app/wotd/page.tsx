import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WotdForm } from "@/components/wotd-form";

export default async function WotdPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const collection = await prisma.collectionItem.findMany({
    where: { userId: session.user.id },
    include: { fragrance: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-2xl">
      <WotdForm options={collection} />
    </section>
  );
}
