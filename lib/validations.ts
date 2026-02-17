import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(2).max(48)
});

export const collectionSchema = z.object({
  fragranceId: z.string().cuid(),
  rating: z.number().min(1).max(10).optional(),
  wearCount: z.number().min(0).max(1000).default(0),
  wouldRepurchase: z.boolean().default(false),
  signature: z.boolean().default(false),
  seasonUse: z.array(z.string()).default([]),
  occasionUse: z.array(z.string()).default([])
});

export const wotdSchema = z.object({
  fragranceId: z.string().cuid(),
  layeringFragranceId: z.string().cuid().optional(),
  caption: z.string().max(280).optional(),
  occasion: z.enum(["OFFICE", "DATE", "NIGHT_OUT", "GYM", "CASUAL", "FORMAL", "OUTDOORS"]).optional(),
  setting: z.string().max(40).optional(),
  outfitStyle: z.string().max(24).optional()
});

export const wearTodaySchema = z.object({
  occasion: z.enum(["office", "date", "night out", "gym", "casual", "formal"]),
  styleVibe: z.enum(["clean", "fresh", "sweet", "dark", "spicy"]),
  intensity: z.enum(["subtle", "moderate", "loud"]),
  temperatureSensitive: z.boolean().optional(),
  location: z.string().optional()
});
