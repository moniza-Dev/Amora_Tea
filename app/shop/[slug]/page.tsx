import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/catalog";
import { displayName } from "@/lib/format";
import { PageHero } from "@/components/page-hero";
import { ProductBuy } from "@/components/product-buy";
import { ProductGrid } from "@/components/product-grid";
import { RatingStars } from "@/components/rating-stars";
import { Reveal } from "@/components/reveal";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { abs } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const p = await getProduct((await props.params).slug);
  if (!p) return {};
  const title = displayName(p);
  const description = (p.description || `${title} by Amora-Tea, premium organic tea from Phnom Penh.`).slice(0, 155);
  return {
    title, description,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { type: "website", title, description, url: `/shop/${p.slug}`, images: [{ url: p.imageUrl, width: 900, height: 900, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [p.imageUrl] },
  };
}

const Chips = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-2">{items.map((x) => <li key={x} className="rounded-full bg-leaf-soft px-3 py-1 text-xs text-forest">{x}</li>)}</ul>
);

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const all = await getProducts();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  const name = displayName(p);
  const t = p.tea;
  const d = p.details;
  const brew = t ? { c: t.temperature_celsius, m: t.steeping_time_minutes, i: t.brewing_instructions } : d ? { c: d.brewing.temperatureC, m: d.brewing.minutes, i: d.brewing.instructions } : null;
  const benefits = t ? t.health_benefits.map((b) => b.name) : (d?.benefits ?? []);
  const flavor = t ? t.characteristics.map((c) => c.name) : (d?.flavor ?? []);
  const ingredients = t ? t.composition.map((c) => `${c.ingredient.name} ${c.amount}`) : (d?.ingredients ?? []);
  const related = all.filter((x) => x.slug !== p.slug && x.kind === p.kind).slice(0, 5);
  const isGift = p.kind === "gift_set";

  const productLd = {
    "@context": "https://schema.org", "@type": "Product", name, description: p.description || name, sku: p.sku, image: [abs(p.imageUrl)],
    brand: { "@type": "Brand", name: "Amora-Tea" }, url: abs(`/shop/${p.slug}`),
    offers: { "@type": "Offer", priceCurrency: "USD", price: (p.priceCents / 100).toFixed(2), url: abs(`/shop/${p.slug}`), availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" },
    // Only real, approved reviews ever produce a rating (ratingCount is 0 until then).
    ...(p.ratingCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.toFixed(1), reviewCount: p.ratingCount } } : {}),
  };
  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: isGift ? "Gifts & Sets" : "Shop", path: isGift ? "/gifts" : "/shop" }, { name, path: `/shop/${p.slug}` }])} />
      <PageHero title={name} crumbs={[{ label: isGift ? "Gifts & Sets" : "Shop", href: isGift ? "/gifts" : "/shop" }, { label: name }]} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2">
        <Reveal dir="left" className="relative aspect-square overflow-hidden rounded-panel bg-sand/70">
          <Image src={p.imageUrl} alt={name} fill priority sizes="(min-width:768px) 50vw, 100vw" className="animate-drift object-cover" />
        </Reveal>
        <Reveal dir="right">
          {p.isBestseller && <span className="rounded-md bg-forest px-2 py-0.5 text-xs font-medium text-white">Bestseller</span>}
          <h2 className="mt-3 font-display text-3xl font-semibold">{name}</h2>
          <div className="mt-2"><RatingStars rating={p.rating} count={p.ratingCount} /></div>
          <p className="mt-4 leading-relaxed text-ink-soft">{p.description}</p>
          <div className="mt-6 border-t border-black/5 pt-6">
            <ProductBuy slug={p.slug} name={name} weights={p.weights} giftPriceCents={isGift ? p.priceCents : undefined} giftCompareCents={isGift ? p.compareAtCents : undefined} stock={p.stock} />
          </div>
          <p className="mt-4 text-xs text-ink-soft">SKU {p.sku}{t?.origin ? ` · Origin: ${t.origin}` : ""}</p>
        </Reveal>
      </section>

      {(brew || flavor.length > 0 || benefits.length > 0 || ingredients.length > 0) && (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-4 md:grid-cols-3">
          {brew && (
            <Reveal className="rounded-card bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold">How to brew</h3>
              <p className="mt-3 text-3xl font-bold text-forest">{brew.c}°C <span className="text-base font-normal text-ink-soft">· {brew.m} min</span></p>
              <p className="mt-2 text-sm text-ink-soft">{brew.i}</p>
            </Reveal>
          )}
          {(flavor.length > 0 || ingredients.length > 0) && (
            <Reveal delay={100} className="rounded-card bg-card p-6 shadow-soft">
              {flavor.length > 0 && <><h3 className="font-display text-lg font-semibold">Flavour</h3><div className="mt-3"><Chips items={flavor} /></div></>}
              {ingredients.length > 0 && <><h3 className="mt-5 font-display text-lg font-semibold">Ingredients</h3><div className="mt-3"><Chips items={ingredients} /></div></>}
            </Reveal>
          )}
          {benefits.length > 0 && (
            <Reveal delay={200} className="rounded-card bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold">Benefits</h3>
              <ul className="mt-3 space-y-2 text-sm">{benefits.map((b) => <li key={b} className="flex gap-2"><span className="text-leaf">✓</span>{b}</li>)}</ul>
            </Reveal>
          )}
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14">
          <Reveal><h2 className="mb-6 font-display text-2xl font-semibold">You may also like</h2></Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
