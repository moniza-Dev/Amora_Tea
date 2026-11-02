import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { CartView, type CartCatalogItem } from "@/components/cart-view";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false, follow: false } };
export const revalidate = 300;

export default async function CartPage() {
  const catalog: Record<string, CartCatalogItem> = {};
  for (const p of await getProducts()) {
    catalog[p.slug] = { name: p.name, imageUrl: p.imageUrl, weights: p.weights.map(({ grams, priceCents }) => ({ grams, priceCents })), fixedPriceCents: p.kind === "gift_set" ? p.priceCents : null };
  }
  return (
    <>
      <PageHero title="Your Cart" crumbs={[{ label: "Cart" }]} />
      <CartView catalog={catalog} freeShippingCents={SITE.freeShippingAboveUSD * 100} />
    </>
  );
}
