import { db } from "@/lib/db";
import { getTeas } from "@/lib/tea-api";
import type { Tea } from "@/lib/tea-types";
import { tinFor } from "@/lib/tins";

export const PLACEHOLDER_IMAGE = "/placeholder-tea.svg";

export interface Weight { grams: number; priceCents: number; compareAtCents?: number }
export interface Product {
  slug: string;
  kind: "tea" | "custom" | "gift_set";
  name: string;
  nameKm: string | null;
  description: string;
  imageUrl: string;
  gallery: string[];
  sku: string;
  priceCents: number;
  compareAtCents: number | null;
  weights: Weight[];
  stock: number;
  tags: string[];
  rating: number;
  ratingCount: number;
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  tea: Tea | null; // API data (null for custom products and gift sets)
  details: ProductDetails | null; // custom products only
}
export interface ProductDetails {
  ingredients: string[];
  benefits: string[];
  flavor: string[];
  brewing: { temperatureC: number; minutes: number; instructions: string };
}

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Merge DB overlay rows with Tea API data. Overlay image wins, then the matching Amora tin photo. */
export async function getProducts(opts: { includeInactive?: boolean } = {}): Promise<Product[]> {
  const [rows, teas] = await Promise.all([
    db.productOverlay.findMany({ where: opts.includeInactive ? {} : { isActive: true }, orderBy: { createdAt: "asc" } }),
    getTeas(),
  ]);
  const bySlug = new Map(teas.map((t) => [t.slug, t]));
  const out: Product[] = [];
  for (const r of rows) {
    const tea = r.teaSlug ? (bySlug.get(r.teaSlug) ?? null) : null;
    if (r.teaSlug && !tea) continue; // overlay points at a tea the API no longer lists
    const kind = r.kind as Product["kind"];
    const name = r.name ?? tea?.name ?? r.slug;
    out.push({
      slug: r.slug,
      kind,
      name,
      nameKm: r.nameKm,
      description: r.description ?? tea?.description ?? "",
      imageUrl: r.imageUrl ?? tinFor({ kind, slug: r.slug, name, tags: arr<string>(r.tags), tea }), // admin image > brand tin (API photos are no longer used)
      gallery: arr<string>(r.gallery),
      sku: r.sku,
      priceCents: r.priceCents,
      compareAtCents: r.compareAtCents,
      weights: arr<Weight>(r.weights),
      stock: r.stock,
      tags: arr<string>(r.tags),
      rating: r.ratingAvg,
      ratingCount: r.ratingCount,
      isBestseller: r.isBestseller,
      isFeatured: r.isFeatured,
      isActive: r.isActive,
      tea,
      details: (r.details as ProductDetails | null) ?? null,
    });
  }
  return out;
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

/* ---------- Homepage / collection categories ---------- */

const lc = (s: string) => s.toLowerCase();
const typeSlug = (p: Product) => p.tea?.tea_type?.slug ?? p.tea?.base_type?.slug;
const hasTag = (p: Product, t: string) => p.tags.map(lc).includes(t);
const hasChar = (p: Product, names: string[]) => !!p.tea?.characteristics.some((c) => names.includes(lc(c.name)));
const hasBenefit = (p: Product, names: string[]) => !!p.tea?.health_benefits.some((b) => names.includes(lc(b.name)));

export interface HomeCategory { key: string; label: string; labelKm?: string; match: (p: Product) => boolean }

export const HOME_CATEGORIES: HomeCategory[] = [
  { key: "green", label: "Green Tea", match: (p) => typeSlug(p) === "green" || hasTag(p, "green") },
  { key: "black", label: "Black Tea", match: (p) => typeSlug(p) === "black" || hasTag(p, "black") },
  { key: "herbal", label: "Herbal Tea", match: (p) => p.tea?.category.slug === "tisane" || hasTag(p, "herbal") },
  { key: "oolong", label: "Oolong Tea", match: (p) => typeSlug(p) === "oolong" || hasTag(p, "oolong") },
  {
    key: "cinnamon",
    label: "Cinnamon",
    match: (p) => !!p.tea?.composition.some((c) => lc(c.ingredient.name) === "cinnamon bark") || hasTag(p, "cinnamon"),
  },
  { key: "white", label: "White Tea", match: (p) => typeSlug(p) === "white" },
  {
    key: "fruit-infusions",
    label: "Fruit Infusions",
    match: (p) => hasChar(p, ["fruity", "tart"]) || hasTag(p, "fruit-infusion"),
  },
  {
    key: "detox-wellness",
    label: "Detox & Wellness",
    match: (p) =>
      hasBenefit(p, ["aids digestion", "supports weight management", "lowers cholesterol", "boosts immune system"]) ||
      hasTag(p, "detox"),
  },
];

export const getHomeCategory = (key: string) => HOME_CATEGORIES.find((c) => c.key === key);
export const productsInCategory = (all: Product[], key: string) => {
  const cat = getHomeCategory(key);
  return cat ? all.filter((p) => p.kind !== "gift_set" && cat.match(p)) : [];
};

export { formatUSD, displayName } from "@/lib/format";
