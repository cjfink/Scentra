import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wearTodaySchema } from "@/lib/validations";
import { scoreWearToday } from "@/lib/recommendations";

async function getWeather(location?: string) {
  if (!location || !process.env.WEATHER_API_KEY) return undefined;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=imperial`,
    { cache: "no-store" }
  );
  if (!response.ok) return undefined;
  const json = await response.json();
  return { tempF: json.main.temp as number, humidity: json.main.humidity as number, rainy: Boolean(json.rain) };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = wearTodaySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User missing" }, { status: 404 });

  const weather = await getWeather(parsed.data.location ?? user.location ?? undefined);

  const collection = await prisma.collectionItem.findMany({ where: { userId: session.user.id }, include: { fragrance: true } });
  const collectionPool = collection.map((c) => c.fragrance);
  const picks = scoreWearToday({ weather, preference: parsed.data, pool: collectionPool });

  let tryNext: ReturnType<typeof scoreWearToday> = [];
  if (picks.length < 3) {
    const catalog = await prisma.fragrance.findMany({ take: 25 });
    tryNext = scoreWearToday({ weather, preference: parsed.data, pool: catalog });
  }

  return NextResponse.json({ weather, picks, tryNext });
}
