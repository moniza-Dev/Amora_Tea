import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { WishlistView, type WishCatalogItem } from "@/components/wishlist-view";

export const metadata: Metadata = {
  title: "My Favorites",
  robots: { index: false },
};
export const revalidate = 300;

export default async function WishlistPage() {
  const all = await getProducts();

  const catalog: Record<string, WishCatalogItem> = {};
  for (const p of all) {
    catalog[p.slug] = {
      name: p.name,
      imageUrl: p.imageUrl,
      weights: p.weights,
     fixedPriceCents: p.priceCents ?? null,
    };
  }

  return <WishlistView catalog={catalog} />;
}