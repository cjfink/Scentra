import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { scoreCollectionRecommendations } from "@/lib/recommendations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, collection, catalog] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.collectionItem.findMany({ where: { userId: session.user.id }, include: { fragrance: true } }),
    prisma.fragrance.findMany()
  ]);
  if (!user) return NextResponse.json({ error: "User missing" }, { status: 404 });

  const recommendations = scoreCollectionRecommendations(user, collection, catalog);
  return NextResponse.json(recommendations);
}
