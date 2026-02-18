import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const notePools = {
  fresh: ["bergamot", "lemon", "grapefruit", "neroli", "mint", "aquatic"],
  sweet: ["vanilla", "tonka", "caramel", "amber", "cacao", "benzoin"],
  dark: ["oud", "smoke", "leather", "patchouli", "incense", "labdanum"],
  clean: ["musk", "iris", "aldehydes", "white tea", "linen", "soap accord"],
  spicy: ["cardamom", "pepper", "cinnamon", "clove", "saffron", "nutmeg"],
};

const brands = [
  "Aether Atelier",
  "Maison Lumen",
  "Nocturne Lab",
  "Velvet Oak",
  "Mistral Works",
];
const concentrations = ["EDT", "EDP", "Parfum"];
const vibes = ["fresh", "sweet", "dark", "clean", "spicy"];
const seasons = ["spring", "summer", "fall", "winter"];
const occasions = ["office", "date", "night out", "gym", "casual", "formal"];

function pick<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.wotdPost.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.fragrance.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const fragrances = Array.from({ length: 60 }, (_, idx) => {
    const vibe = vibes[idx % vibes.length] as keyof typeof notePools;
    const notes = pick(notePools[vibe], 3).concat(
      pick(Object.values(notePools).flat(), 2),
    );
    return {
      name: `${brands[idx % brands.length]} ${vibe.toUpperCase()} ${idx + 1}`,
      brand: brands[idx % brands.length],
      concentration: concentrations[idx % concentrations.length],
      year: 2010 + (idx % 15),
      notes,
      seasons: pick(seasons, 2),
      accords: pick(
        ["citrus", "woody", "aromatic", "amber", "powdery", "green", "aquatic"],
        3,
      ),
      seasonTags: pick(seasons, 2),
      occasionTags: pick(occasions, 2),
      vibeTags: [
        vibe,
        ...pick(
          vibes.filter((v) => v !== vibe),
          1,
        ),
      ],
      longevityScore: 5 + (idx % 6),
      projectionScore: 4 + (idx % 6),
      imageUrl: `https://picsum.photos/seed/scentra-${idx + 1}/800/800`,
      thumbnailUrl: `https://picsum.photos/seed/scentra-thumb-${idx + 1}/200/200`,
    };
  });

  await prisma.fragrance.createMany({ data: fragrances });

  const demoPassword = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@scentra.app",
      passwordHash: demoPassword,
      username: "scentra_demo",
      displayName: "Scentra Demo",
      bio: "Testing modern scent combinations daily.",
      location: "Austin, TX",
      styleTags: ["clean", "fresh", "office"],
      favoriteNotes: ["bergamot", "musk", "vanilla"],
    },
  });

  const sampleFragrances = await prisma.fragrance.findMany({ take: 8 });

  for (const frag of sampleFragrances.slice(0, 6)) {
    await prisma.collectionItem.create({
      data: {
        userId: user.id,
        fragranceId: frag.id,
        rating: 7 + Math.floor(Math.random() * 3),
        wearCount: 3 + Math.floor(Math.random() * 8),
        wouldRepurchase: Math.random() > 0.4,
        signature: Math.random() > 0.7,
        seasonUse: pick(seasons, 2),
        occasionUse: pick(occasions, 2),
      },
    });
  }

  for (const frag of sampleFragrances.slice(0, 3)) {
    await prisma.wotdPost.create({
      data: {
        userId: user.id,
        fragranceId: frag.id,
        caption: `Wearing ${frag.name} today — clean confidence.`,
        occasion: "OFFICE",
        setting: "Studio",
        outfitStyle: "minimal",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
