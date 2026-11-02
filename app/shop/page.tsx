import type { Metadata } from "next";
import Link from "next/link";
import { HOME_CATEGORIES, getProducts, productsInCategory } from "@/lib/catalog";
import { PageHero } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-grid";

export const metadata: Metadata = {
  title: "Shop All Teas",
  description: "Shop premium organic green, black, herbal, oolong, white and fruit teas from Amora-Tea in Phnom Penh.",
  alternates: { canonical: "/shop" },
};
export const revalidate = 300;

const SORTS = { featured: "Featured", "price-asc": "Price: Low to High", "price-desc": "Price: High to Low", name: "Name A–Z" } as const;
type Sort = keyof typeof SORTS;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage(props: PageProps<"/shop">) {
  const sp = await props.searchParams;
  const category = one(sp.category);
  const sort = (one(sp.sort) as Sort) in SORTS ? (one(sp.sort) as Sort) : "featured";
  const all = (await getProducts()).filter((p) => p.kind !== "gift_set");
  let list = category ? productsInCategory(all, category) : all;
  list = [...list].sort((a, b) =>
    sort === "price-asc" ? a.priceCents - b.priceCents
    : sort === "price-desc" ? b.priceCents - a.priceCents
    : sort === "name" ? a.name.localeCompare(b.name)
    : Number(b.isBestseller) - Number(a.isBestseller) || Number(b.isFeatured) - Number(a.isFeatured));

  const href = (c?: string, s: Sort = sort) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (s !== "featured") q.set("sort", s);
    return `/shop${q.size ? `?${q}` : ""}`;
  };
  const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm transition ${on ? "border-forest bg-forest text-white" : "border-black/10 bg-card hover:border-forest hover:text-forest"}`;

  return (
    <>
      <PageHero title="Shop All Teas" subtitle="Premium organic teas and blends, crafted for a healthier, happier you." crumbs={[{ label: "Shop" }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" aria-label="Filter by category">
            <Link href={href()} className={chip(!category)}>All</Link>
            {HOME_CATEGORIES.map((c) => <Link key={c.key} href={href(c.key)} className={chip(category === c.key)}>{c.label}</Link>)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-soft">Sort:</span>
            {(Object.keys(SORTS) as Sort[]).map((s) => <Link key={s} href={href(category, s)} className={chip(sort === s)}>{SORTS[s]}</Link>)}
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-soft" aria-live="polite">{list.length} {list.length === 1 ? "tea" : "teas"}</p>
        <div className="mt-4"><ProductGrid products={list} /></div>
      </section>
    </>
  );
}
