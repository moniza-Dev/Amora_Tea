import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOME_CATEGORIES, getProducts, productsInCategory } from "@/lib/catalog";
import { AMORA_TINS, BANNERS, SCENE_SRC, TEA_COLLECTION_BOX, TIN_SCENES } from "@/lib/tins";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Tea Collections",
  description: "Explore Amora-Tea collections: green, black, herbal, oolong, cinnamon, white, fruit infusions and detox & wellness teas from Phnom Penh.",
  alternates: { canonical: "/collections" },
};
export const revalidate = 300;

export default async function CollectionsPage() {
  const all = await getProducts();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Tea Collections", path: "/collections" }])} />
      <PageHero title="Tea Collections" subtitle="Find your perfect cup from our handpicked collections." crumbs={[{ label: "Collections" }]} />
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <Reveal dir="zoom" className="relative overflow-hidden rounded-panel shadow-lift">
          <Image
            src={BANNERS.collections}
            alt="Amora-Tea collection: green, black, chamomile, spiced, lemongrass and fruit tea tins on a wooden shelf"
            width={1447}
            height={1087}
            priority
            sizes="(min-width:1280px) 1216px, 100vw"
            className="h-auto w-full"
          />
        </Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <div className="text-center">
          <p className="font-script text-2xl text-leaf">Good Tea, Better Days</p>
          <h2 className="font-display text-3xl font-semibold text-forest">Our Signature Tins</h2>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {AMORA_TINS.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={(i % 3) * 90} dir="zoom">
              <Link href={`/shop/${t.slug}`} className="group block overflow-hidden rounded-card bg-sand/70 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={t.src} alt={`Amora Premium ${t.name} tin, 50g`} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4"><h3 className="font-display text-lg font-semibold">{t.name}</h3><p className="text-xs text-ink-soft">{t.note}</p></div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-forest">The Tins Inside</h2>
          <p className="mt-1 text-ink-soft">Every tin in our gift sets, in the garden where the flavours grow.</p>
        </div>

        {/* Tea set: full-width row on its own */}
        <Reveal dir="zoom" className="relative mt-8 aspect-[2.4/1] overflow-hidden rounded-card shadow-soft">
          <Image src={TEA_COLLECTION_BOX} alt="Amora Tea Collection box with six premium flavours" fill sizes="(min-width:1280px) 1216px, 100vw" className="object-cover" />
        </Reveal>

        {/* Six tins: separate grid below */}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {TIN_SCENES.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90} dir="zoom" className="relative aspect-[1.16/1] overflow-hidden rounded-card shadow-soft">
              <Image src={t.src} alt={`${t.name} tin by Amora-Tea`} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
            </Reveal>
          ))}
        </div>
      </section>
      <h2 className="mx-auto max-w-7xl px-4 pt-14 text-center font-display text-3xl font-semibold text-forest">Browse by Type</h2>
      <ul className="mx-auto grid max-w-7xl gap-5 px-4 py-8 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {HOME_CATEGORIES.map((c, i) => {
          const items = productsInCategory(all, c.key);
          return (
            <Reveal as="li" key={c.key} delay={(i % 4) * 90} dir="zoom">
              <Link href={`/collections/${c.key}`} className="group block overflow-hidden rounded-card bg-sand/70 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[3/4] overflow-hidden bg-leaf-soft">
                  <Image src={SCENE_SRC[c.key]} alt={`${c.label} tin by Amora-Tea`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div><h2 className="font-display text-lg font-semibold">{c.label}</h2><p className="text-xs text-ink-soft">{items.length} {items.length === 1 ? "tea" : "teas"}</p></div>
                  <span className="grid size-9 place-items-center rounded-full bg-forest text-white transition group-hover:translate-x-1"><ArrowIcon width={16} height={16} /></span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </>
  );
}