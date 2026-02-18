"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";

export async function signupAction(payload: unknown) {
  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) return { error: "Invalid input" };

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
    },
  });
  if (exists) return { error: "Email or username already exists" };

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      username: parsed.data.username,
      displayName: parsed.data.displayName,
      passwordHash,
      styleTags: [],
    },
  });

  return { ok: true };
}
