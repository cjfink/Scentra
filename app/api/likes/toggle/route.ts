import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = (await request.json()) as { postId: string };

  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: session.user.id, postId } } });
  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId: session.user.id, postId } } });
  } else {
    await prisma.like.create({ data: { userId: session.user.id, postId } });
  }

  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ likes: count });
}
