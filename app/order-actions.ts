"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

/**
 * Saves a customer's order so the shop sees it in /dashboard and /dashboard/orders.
 * The customer always comes from the session cookie (getUser). Prices are recalculated here from the
 * database, so the browser can never choose its own price. The name sent by the browser is only used
 * for display when the product has no name saved in the database.
 */
const inputSchema = z.object({
  method: z.enum(["cod", "khqr"]),
  location: z.string().trim().min(3).max(500),
  lines: z
    .array(
      z.object({
        slug: z.string().min(1).max(120),
        grams: z.number().int().min(0).max(5000),
        quantity: z.number().int().min(1).max(99),
        name: z.string().max(120).optional(),
      }),
    )
    .min(1)
    .max(100),
});

export type PlaceOrderInput = z.infer<typeof inputSchema>;
export type PlaceOrderResult = { ok: true; number: string } | { ok: false; error: string };

type Weight = { grams: number; priceCents: number };

function orderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `AT-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Please sign in to place your order." };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please enter your delivery location." };
  const { method, location, lines } = parsed.data;

  const products = await db.productOverlay.findMany({
    where: { slug: { in: [...new Set(lines.map((l) => l.slug))] }, isActive: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const items: {
    slug: string;
    name: string;
    nameKm: string | null;
    grams: number;
    quantity: number;
    unitPriceCents: number;
    imageUrl: string | null;
  }[] = [];

  for (const l of lines) {
    const p = bySlug.get(l.slug);
    if (!p) return { ok: false, error: "An item in your cart is no longer available." };

    const weights = Array.isArray(p.weights) ? (p.weights as unknown as Weight[]) : [];
    const unit =
      weights.find((w) => w.grams === l.grams)?.priceCents ??
      (weights.length === 0 || l.grams === 0 ? p.priceCents : undefined);
    if (unit === undefined) return { ok: false, error: "An item in your cart has an invalid size." };

    items.push({
      slug: l.slug,
      name: p.name ?? l.name ?? l.slug,
      nameKm: p.nameKm,
      grams: l.grams,
      quantity: l.quantity,
      unitPriceCents: unit,
      imageUrl: p.imageUrl,
    });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPriceCents * i.quantity, 0);
  const full = await db.user.findUnique({ where: { id: user.id } });
  const number = orderNumber();

  try {
    await db.order.create({
      data: {
        number,
        userId: user.id,
        email: user.email,
        phone: full?.phone || "-",
        fullName: user.name || user.email,
        province: "-",
        address: location,
        paymentMethod: method,
        subtotalCents: subtotal,
        totalCents: subtotal, // shipping and discounts are agreed on Telegram for now
        items: { create: items },
      },
    });
  } catch (e) {
    console.error("placeOrderAction failed", e);
    return { ok: false, error: "Could not save your order. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  return { ok: true, number };
}