import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: {
      following: { select: { username: true, displayName: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(following.map((row) => row.following));
}
