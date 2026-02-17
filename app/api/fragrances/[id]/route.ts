import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const fragrance = await prisma.fragrance.findUnique({ where: { id: params.id } });
  if (!fragrance) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fragrance);
}
