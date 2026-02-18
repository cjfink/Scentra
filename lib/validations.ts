import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_]+$/),
  displayName: z.string().trim().min(2).max(48),
});

export const collectionSchema = z.object({
  fragranceId: z.string().cuid(),
  ownershipStatus: z.string().max(40).optional(),
  rating: z.number().int().min(1).max(10).optional(),
  wearCount: z.number().int().min(0).max(1000).default(0),
});

export const wotdSchema = z.object({
  fragranceId: z.string().cuid(),
  caption: z.string().trim().max(280).optional(),
});

export const wearTodaySchema = z.object({
  occasion: z.enum(["office", "date", "night out", "gym", "casual", "formal"]),
  styleVibe: z.enum(["clean", "fresh", "sweet", "dark", "spicy"]),
  intensity: z.enum(["subtle", "moderate", "loud"]),
  location: z.string().trim().min(1).optional(),
});
