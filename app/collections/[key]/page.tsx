import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOME_CATEGORIES, getHomeCategory, getProducts, productsInCategory } from "@/lib/catalog";
import { SCENE_SRC } from "@/lib/tins";
import { PageHero } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-grid";

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => HOME_CATEGORIES.map((c) => ({ key: c.key }));

export async function generateMetadata(props: PageProps<"/collections/[key]">): Promise<Metadata> {
  const { key } = await props.params;
  const cat = getHomeCategory(key);
  if (!cat) return { title: "Collection" };
  const description = `Shop Amora-Tea ${cat.label} collection: premium organic teas from Phnom Penh, Cambodia.`;
  return {
    title: cat.label, description, alternates: { canonical: `/collections/${key}` },
    openGraph: { title: `${cat.label} | Amora-Tea`, description, url: `/collections/${key}`, images: [{ url: SCENE_SRC[key], width: 768, height: 1024, alt: `${cat.label} tin` }] },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[key]">) {
  const { key } = await props.params;
  const cat = getHomeCategory(key);
  if (!cat) notFound();
  const items = productsInCategory(await getProducts(), key);
  return (
    <>
      <PageHero title={cat.label} subtitle={`${items.length} handpicked ${items.length === 1 ? "tea" : "teas"} in this collection.`} crumbs={[{ label: "Collections", href: "/collections" }, { label: cat.label }]} />
      <section className="mx-auto max-w-7xl px-4 py-10"><ProductGrid products={items} /></section>
    </>
  );
}
