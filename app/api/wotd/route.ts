import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wotdSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = wotdSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const collectionItem = await prisma.collectionItem.findUnique({
    where: {
      userId_fragranceId: {
        userId: session.user.id,
        fragranceId: parsed.data.fragranceId,
      },
    },
  });

  if (!collectionItem) {
    return NextResponse.json(
      { error: "You can only post fragrances from your collection." },
      { status: 400 },
    );
  }

  const post = await prisma.wotdPost.create({
    data: {
      userId: session.user.id,
      fragranceId: parsed.data.fragranceId,
      caption: parsed.data.caption,
    },
    include: { user: true, fragrance: true },
  });

  return NextResponse.json(post);
}
