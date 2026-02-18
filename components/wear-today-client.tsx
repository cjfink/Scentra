"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Rec = {
  fragrance: {
    id: string;
    name: string;
    imageUrl: string;
    thumbnailUrl?: string | null;
  };
  explanation: string;
};

type Weather = {
  tempF: number;
  humidity: number;
  source?: "live" | "fallback";
};

type WearTodayResult = {
  weather?: Weather;
  picks: Rec[];
  tryNext: Rec[];
  message?: string;
};

export function WearTodayClient() {
  const [occasion, setOccasion] = useState("office");
  const [styleVibe, setStyleVibe] = useState("fresh");
  const [intensity, setIntensity] = useState("moderate");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<WearTodayResult | null>(null);

  async function getRecs() {
    const res = await fetch("/api/recs/wear-today", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occasion, styleVibe, intensity, location }),
    });

    const data = (await res.json()) as WearTodayResult;
    setResult(data);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-5">
        <h1 className="text-2xl font-semibold">What should I wear today?</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="occasion"
          />
          <Input
            value={styleVibe}
            onChange={(e) => setStyleVibe(e.target.value)}
            placeholder="style vibe"
          />
          <Input
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            placeholder="intensity"
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Austin, TX"
          />
        </div>
        <Button onClick={getRecs} className="mt-4">
          Generate picks
        </Button>
      </div>

      {result?.weather ? (
        <p className="text-sm text-muted-foreground">
          Weather: {Math.round(result.weather.tempF)}°F • humidity{" "}
          {result.weather.humidity}%
          {result.weather.source === "fallback" ? " (fallback)" : ""}
        </p>
      ) : null}

      {result?.message ? (
        <p className="text-sm text-muted-foreground">{result.message}</p>
      ) : null}

      <section>
        <h2 className="mb-2 text-lg font-semibold">
          Top picks from your collection
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {result?.picks?.map((pick) => (
            <div key={pick.fragrance.id} className="rounded-xl border p-3">
              <Image
                src={pick.fragrance.thumbnailUrl ?? pick.fragrance.imageUrl}
                alt={pick.fragrance.name}
                width={240}
                height={140}
                className="h-36 w-full rounded-md object-cover"
              />
              <p className="mt-2 font-medium">{pick.fragrance.name}</p>
              <p className="text-sm text-muted-foreground">
                {pick.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Try next</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {result?.tryNext?.map((pick) => (
            <div key={pick.fragrance.id} className="rounded-xl border p-3">
              <Image
                src={pick.fragrance.thumbnailUrl ?? pick.fragrance.imageUrl}
                alt={pick.fragrance.name}
                width={240}
                height={140}
                className="h-36 w-full rounded-md object-cover"
              />
              <p className="mt-2 font-medium">{pick.fragrance.name}</p>
              <p className="text-sm text-muted-foreground">
                {pick.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
