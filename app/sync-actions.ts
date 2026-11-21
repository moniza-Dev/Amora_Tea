"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

/**
 * Saves a signed-in customer's favorites and cart so they come back after sign in (on any device).
 * The user always comes from the session cookie (getUser), never from the browser, and the input is
 * validated and size-capped, so nobody can read or overwrite another account's data.
 */
const lineSchema = z.object({
  slug: z.string().min(1).max(120),
  grams: z.number().int().min(0).max(5000),
  quantity: z.number().int().min(1).max(99),
});
const stateSchema = z.object({
  wishlist: z.array(z.string().min(1).max(120)).max(200),
  cart: z.array(lineSchema).max(100),
});

export type SavedState = z.infer<typeof stateSchema>;

export async function loadSaved(): Promise<SavedState | null> {
  const u = await getUser();
  if (!u) return null;
  const row = await db.userData.findUnique({ where: { userId: u.id } });
  const parsed = stateSchema.safeParse({ wishlist: row?.wishlist ?? [], cart: row?.cart ?? [] });
  return parsed.success ? parsed.data : { wishlist: [], cart: [] };
}

export async function saveSaved(input: SavedState): Promise<void> {
  const u = await getUser();
  if (!u) return;
  const parsed = stateSchema.safeParse(input);
  if (!parsed.success) return;
  await db.userData.upsert({
    where: { userId: u.id },
    create: { userId: u.id, ...parsed.data },
    update: parsed.data,
  });
}