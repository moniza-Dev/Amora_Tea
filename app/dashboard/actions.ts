"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAY_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

// Server actions are public endpoints: every one re-checks the shop role itself.
async function shopOnly() { return requireRole("shop", "/dashboard"); }
const bump = () => { for (const p of ["/shop", "/", "/gifts", "/collections"]) revalidatePath(p); revalidatePath("/dashboard", "layout"); };

const dollarsToCents = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 && n < 100000 ? Math.round(n * 100) : null;
};

export async function updateProductAction(fd: FormData) {
  await shopOnly();
  const slug = z.string().min(1).max(200).parse(fd.get("slug"));
  const row = await db.productOverlay.findUnique({ where: { slug } });
  if (!row) return;
  const stock = z.coerce.number().int().min(0).max(100000).parse(fd.get("stock"));

  // Weight prices arrive as price_<grams>; only grams that already exist on the product are accepted.
  const weights = (row.weights as { grams: number; priceCents: number; compareAtCents?: number }[]).map((w) => {
    const cents = dollarsToCents(fd.get(`price_${w.grams}`));
    return cents && cents > 0 ? { ...w, priceCents: cents } : w;
  });
  const single = row.kind === "gift_set" ? dollarsToCents(fd.get("price_set")) : null;
  const priceCents = row.kind === "gift_set" ? (single && single > 0 ? single : row.priceCents) : (weights[0]?.priceCents ?? row.priceCents);

  await db.productOverlay.update({
    where: { slug },
    data: {
      stock, priceCents, weights,
      isActive: fd.get("isActive") === "on",
      isBestseller: fd.get("isBestseller") === "on",
      isFeatured: fd.get("isFeatured") === "on",
    },
  });
  bump();
  revalidatePath(`/shop/${slug}`);
}

export async function updateOrderAction(fd: FormData) {
  await shopOnly();
  const id = z.string().min(1).parse(fd.get("id"));
  const status = z.enum(ORDER_STATUSES).parse(fd.get("status"));
  const paymentStatus = z.enum(PAY_STATUSES).parse(fd.get("paymentStatus"));
  await db.order.update({ where: { id }, data: { status, paymentStatus } });
  revalidatePath("/dashboard", "layout");
  revalidatePath("/account");
}

export async function setMessageReadAction(fd: FormData) {
  await shopOnly();
  const id = z.string().min(1).parse(fd.get("id"));
  await db.message.update({ where: { id }, data: { isRead: fd.get("read") === "1" } });
  revalidatePath("/dashboard", "layout");
}
