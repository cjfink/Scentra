import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "10");
  const data = await prisma.fragrance.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } }
      ]
    },
    take: Math.min(limit, 20),
    select: { id: true, name: true, brand: true, thumbnailUrl: true }
  });
  return NextResponse.json(data);
}
