import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");
  if (!location) return NextResponse.json({ error: "Location required" }, { status: 400 });

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "WEATHER_API_KEY missing" }, { status: 500 });

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Weather lookup failed" }, { status: 400 });
  const json = await response.json();

  return NextResponse.json({
    tempF: json.main.temp,
    humidity: json.main.humidity,
    rainy: Boolean(json.rain),
    description: json.weather?.[0]?.description ?? ""
  });
}
