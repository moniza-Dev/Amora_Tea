import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getTeas } from "@/lib/tea-api";
import { syncRatings } from "@/lib/ratings";
import type { Tea } from "@/lib/tea-types";
import { CUSTOM_PRODUCTS } from "./seed-data/custom-products";
import { BLOG_POSTS } from "./seed-data/blog";

// Placeholder commerce data. Prices are USD cents, 50g within $9–$13, up to $35 at 250g.
const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const to99 = (cents: number) => Math.min(3499, Math.floor(cents / 100) * 100 + 99);

function weightsFor(base: number, discounted: boolean, cap = 3499) {
  const to99c = (cents: number) => Math.min(cap, Math.floor(cents / 100) * 100 + 99);
  const mk = (grams: number, price: number) => ({
    grams,
    priceCents: price,
    ...(discounted ? { compareAtCents: to99c(price * 1.25) } : {}),
  });
  return [mk(50, to99c(base)), mk(100, to99c(base * 1.6)), mk(250, to99c(base * 2.7))];
}

async function main() {
  const teas = await getTeas();
  console.log(`Seeding ${teas.length} API teas…`);

  // Exactly five bestsellers, mirroring design/homepage.png: green, black, chamomile, cinnamon, berry.
  // Priced from $29.99 (design). Picked deterministically from the API snapshot; chosen slugs are logged below.
  const typeOf = (t: Tea) => t.tea_type?.slug ?? t.base_type?.slug;
  const sorted = [...teas].sort((a, b) => a.slug.localeCompare(b.slug));
  const pick = (...preds: ((t: Tea) => boolean)[]) => {
    for (const p of preds) {
      const hit = sorted.find(p);
      if (hit) return hit.slug;
    }
  };
  const BEST_PRICE = 2999;
  const bestsellers = new Set(
    [
      pick((t) => typeOf(t) === "green" && t.category.slug === "true-tea", (t) => typeOf(t) === "green"),
      pick((t) => typeOf(t) === "black" && t.category.slug === "true-tea", (t) => typeOf(t) === "black"),
      pick((t) => /chamomile/i.test(t.name), (t) => t.category.slug === "tisane"),
      "ceylon-cinnamon-tea", // custom: cinnamon
      "mixed-berry-infusion", // custom: fruit infusion
    ].filter((x): x is string => !!x),
  );
  console.log("Bestsellers:", [...bestsellers].join(", "));
  const ranked = sorted.map((t) => t.slug).filter((x) => !bestsellers.has(x)).sort((a, b) => hash(a + "ft") - hash(b + "ft"));
  const featured = new Set(ranked.slice(0, 6));

  for (const t of teas) {
    const h = hash(t.slug);
    const base = 900 + (h % 400); // $9.00–$12.99
    const discounted = h % 3 === 0;
    const best = bestsellers.has(t.slug);
    const weights = best ? weightsFor(BEST_PRICE, true, 99999) : weightsFor(base, discounted);
    const data = {
      kind: "tea",
      sku: `AT-${String(t.id).padStart(3, "0")}`,
      priceCents: weights[0].priceCents,
      compareAtCents: weights[0].compareAtCents ?? null,
      weights,
      stock: h % 13 === 0 ? 0 : 20 + (h % 180),
      isBestseller: best,
      isFeatured: featured.has(t.slug),
    };
    // update never overwrites admin edits to imageUrl/nameKm/tags; it only re-applies seed-owned merchandising
    await db.productOverlay.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, teaSlug: t.slug, ...data },
      update: {
        sku: data.sku,
        isBestseller: best,
        ...(best ? { priceCents: data.priceCents, compareAtCents: data.compareAtCents, weights: data.weights } : {}),
      },
    });
  }

  let n = 0;
  for (const c of CUSTOM_PRODUCTS) {
    n++;
    const isGift = c.kind === "gift_set";
    const h = hash(c.slug);
    const best = bestsellers.has(c.slug);
    const discounted = h % 3 === 0;
    const weights = isGift ? [] : best ? weightsFor(BEST_PRICE, true, 99999) : weightsFor(c.base, discounted);
    const data = {
      kind: c.kind,
      name: c.name,
      nameKm: c.nameKm ?? null,
      description: c.description,
      tags: c.tags,
      sku: `AT-C-${String(n).padStart(3, "0")}`,
      priceCents: isGift ? c.base : weights[0].priceCents,
      compareAtCents: isGift ? to99(c.base * 1.2) : (weights[0].compareAtCents ?? null),
      weights,
      stock: 25 + (h % 120),
      details: c.details ?? undefined,
      isBestseller: best,
      isFeatured: !!c.featured,
    };
    await db.productOverlay.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, ...data },
      update: {
        sku: data.sku,
        isBestseller: best,
        ...(best ? { priceCents: data.priceCents, compareAtCents: data.compareAtCents, weights: data.weights } : {}),
      },
    });
  }

  // Shop account (role "shop"): manages products, orders and messages. SHOP_* falls back to the old ADMIN_* names.
  const email = (process.env.SHOP_EMAIL ?? process.env.ADMIN_EMAIL ?? "shop@amoratea.com").toLowerCase();
  const password = process.env.SHOP_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  if (process.env.NODE_ENV === "production" && password === "ChangeMe123!") {
    throw new Error("Set SHOP_PASSWORD before seeding in production.");
  }
  await db.user.upsert({
    where: { email },
    create: { email, name: "Amora-Tea Shop", role: "shop", passwordHash: await bcrypt.hash(password, 12) },
    update: { role: "shop" },
  });
  await db.user.updateMany({ where: { role: "admin" }, data: { role: "shop" } }); // migrate old rows

  // Demo customer (development only)
  if (process.env.NODE_ENV !== "production") {
    await db.user.upsert({
      where: { email: "customer@amoratea.com" },
      create: { email: "customer@amoratea.com", name: "Demo Customer", role: "customer", passwordHash: await bcrypt.hash("Customer123!", 12) },
      update: {},
    });
  }

  // Coupon: 10% off first order
  await db.coupon.upsert({
    where: { code: "AMORATEA" },
    create: { code: "AMORATEA", percentOff: 10, firstOrderOnly: true },
    update: {},
  });

  for (const [i, p] of BLOG_POSTS.entries()) {
    await db.blogPost.upsert({
      where: { slug: p.slug },
      create: { ...p, publishedAt: new Date(Date.now() - i * 7 * 86400_000) },
      update: {},
    });
  }

  // No fake reviews: ratings come only from approved Review rows (0/0 when none, which hides stars on cards).
  await syncRatings();

  const [products, posts] = await Promise.all([db.productOverlay.count(), db.blogPost.count()]);
  console.log(`Done: ${products} products, ${posts} blog posts, shop account ${email}, coupon AMORATEA.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
