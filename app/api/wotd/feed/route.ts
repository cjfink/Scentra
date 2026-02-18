import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  let whereClause = {};
  if (session?.user?.id) {
    const followingRows = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });
    const ids = [
      session.user.id,
      ...followingRows.map((row) => row.followingId),
    ];
    whereClause = { userId: { in: ids } };
  }

  const posts = await prisma.wotdPost.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, displayName: true, id: true } },
      fragrance: true,
    },
    take: 30,
  });

  return NextResponse.json(posts);
}
