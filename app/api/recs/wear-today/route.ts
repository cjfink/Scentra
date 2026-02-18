import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wearTodaySchema } from "@/lib/validations";
import { scoreWearToday } from "@/lib/recommendations";

type WeatherSnapshot = {
  tempF: number;
  humidity: number;
  rainy: boolean;
  source: "live" | "fallback";
};

const fallbackWeather: WeatherSnapshot = {
  tempF: 68,
  humidity: 50,
  rainy: false,
  source: "fallback",
};

async function getWeather(location?: string): Promise<WeatherSnapshot> {
  if (
    !location ||
    !process.env.WEATHER_API_KEY ||
    process.env.WEATHER_PROVIDER === "none"
  ) {
    return fallbackWeather;
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location,
    )}&appid=${process.env.WEATHER_API_KEY}&units=imperial`,
    { cache: "no-store" },
  );

  if (!response.ok) return fallbackWeather;

  const json = (await response.json()) as {
    main?: { temp?: number; humidity?: number };
    rain?: unknown;
  };

  return {
    tempF: json.main?.temp ?? fallbackWeather.tempF,
    humidity: json.main?.humidity ?? fallbackWeather.humidity,
    rainy: Boolean(json.rain),
    source: "live",
  };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = wearTodaySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user)
    return NextResponse.json({ error: "User missing" }, { status: 404 });

  const weather = await getWeather(
    parsed.data.location ?? user.location ?? undefined,
  );

  const collection = await prisma.collectionItem.findMany({
    where: { userId: session.user.id },
    include: { fragrance: true },
  });

  const collectionPool = collection.map((c) => c.fragrance);
  if (collectionPool.length === 0) {
    return NextResponse.json({
      weather,
      picks: [],
      tryNext: [],
      message: "Add fragrances to your collection to get recommendations.",
    });
  }

  const ranked = scoreWearToday({
    weather,
    preference: parsed.data,
    pool: collectionPool,
    limit: collectionPool.length,
  });

  return NextResponse.json({
    weather,
    picks: ranked.slice(0, 3),
    tryNext: ranked.slice(3, 6),
  });
}
