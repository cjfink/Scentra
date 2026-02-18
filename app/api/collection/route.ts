import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { collectionSchema } from "@/lib/validations";
import { z } from "zod";

const deleteSchema = z.object({ fragranceId: z.string().cuid() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.collectionItem.findMany({
    where: { userId: session.user.id },
    include: { fragrance: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = collectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const item = await prisma.collectionItem.upsert({
    where: {
      userId_fragranceId: {
        userId: session.user.id,
        fragranceId: parsed.data.fragranceId,
      },
    },
    update: parsed.data,
    create: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = deleteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await prisma.collectionItem.delete({
    where: {
      userId_fragranceId: {
        userId: session.user.id,
        fragranceId: parsed.data.fragranceId,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
