import { Fragrance, CollectionItem, User } from "@prisma/client";

type CollectionWithFrag = CollectionItem & { fragrance: Fragrance };

export function scoreCollectionRecommendations(
  user: User,
  collection: CollectionWithFrag[],
  catalog: Fragrance[],
) {
  const owned = new Set(collection.map((c) => c.fragranceId));
  const noteWeights = new Map<string, number>();
  const vibeWeights = new Map<string, number>();

  user.favoriteNotes.forEach((n) =>
    noteWeights.set(n, (noteWeights.get(n) ?? 0) + 3),
  );
  user.styleTags.forEach((v) =>
    vibeWeights.set(v, (vibeWeights.get(v) ?? 0) + 2),
  );

  collection.forEach((item) => {
    const weight = (item.rating ?? 6) + item.wearCount * 0.2;
    item.fragrance.notes.forEach((n) =>
      noteWeights.set(n, (noteWeights.get(n) ?? 0) + weight),
    );
    item.fragrance.vibeTags.forEach((v) =>
      vibeWeights.set(v, (vibeWeights.get(v) ?? 0) + weight),
    );
  });

  const seasonCoverage = new Set(
    collection.flatMap((c) => c.fragrance.seasonTags),
  );

  return catalog
    .filter((f) => !owned.has(f.id))
    .map((f) => {
      let score = 0;
      f.notes.forEach((n) => (score += noteWeights.get(n) ?? 0));
      f.vibeTags.forEach((v) => (score += vibeWeights.get(v) ?? 0));
      if (!seasonCoverage.has("summer") && f.seasonTags.includes("summer"))
        score += 15;
      if (!seasonCoverage.has("winter") && f.seasonTags.includes("winter"))
        score += 12;

      const sweetHeavy =
        (vibeWeights.get("sweet") ?? 0) > (vibeWeights.get("fresh") ?? 0) * 1.2;
      if (sweetHeavy && f.vibeTags.includes("fresh")) score += 14;
      if (!sweetHeavy && f.vibeTags.includes("sweet")) score += 8;

      const explanation =
        !seasonCoverage.has("summer") && f.seasonTags.includes("summer")
          ? "Fills a fresh summer daytime gap"
          : sweetHeavy && f.vibeTags.includes("fresh")
            ? "Complements your sweet amber-heavy lineup with citrus/green"
            : "Great office-safe clean musk option";

      return { fragrance: f, score, explanation };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function scoreWearToday({
  weather,
  preference,
  pool,
  limit = 3,
}: {
  weather?: { tempF: number; humidity: number; rainy: boolean };
  preference: { occasion: string; styleVibe: string; intensity: string };
  pool: Fragrance[];
  limit?: number;
}) {
  return pool
    .map((f) => {
      let score = 0;
      let reason = "Balanced match for your profile.";
      if (f.occasionTags.includes(preference.occasion)) score += 18;
      if (f.vibeTags.includes(preference.styleVibe)) score += 14;

      if (weather) {
        if (weather.tempF >= 80 || weather.humidity >= 75) {
          if (
            f.vibeTags.some((v) => ["fresh", "clean"].includes(v)) ||
            f.notes.some((n) => ["citrus", "aquatic"].includes(n))
          ) {
            score += 20;
            reason = `It's ${Math.round(weather.tempF)}°F and humid — this fresh citrus-musky profile stays clean.`;
          }
        } else if (weather.tempF <= 50) {
          if (
            f.notes.some((n) =>
              ["vanilla", "amber", "spice", "woody"].includes(n),
            )
          ) {
            score += 20;
            reason =
              "Cold day + date night — warm vanilla/amber with strong longevity.";
          }
        } else if (
          weather.rainy &&
          f.notes.some((n) => ["tea", "musk", "woods"].includes(n))
        ) {
          score += 16;
          reason = "Rainy weather calls for cozy tea-musk woods.";
        }
      }

      if (preference.intensity === "subtle") score += 12 - f.projectionScore;
      if (preference.intensity === "loud") score += f.projectionScore;

      return { fragrance: f, score, explanation: reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
