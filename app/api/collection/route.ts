import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { collectionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = collectionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await prisma.collectionItem.upsert({
    where: { userId_fragranceId: { userId: session.user.id, fragranceId: parsed.data.fragranceId } },
    update: parsed.data,
    create: { ...parsed.data, userId: session.user.id }
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fragranceId } = (await request.json()) as { fragranceId: string };
  await prisma.collectionItem.delete({ where: { userId_fragranceId: { userId: session.user.id, fragranceId } } });
  return NextResponse.json({ ok: true });
}
