import Image from "next/image";
import Link from "next/link";
import { HOME_CATEGORIES, getProducts } from "@/lib/catalog";
import { TIN_FOR_CATEGORY } from "@/lib/tins";
import { HeroCarousel } from "@/components/hero-carousel";
import { NamedTinRow } from "@/components/named-tin-row";
import { GardenBanner } from "@/components/garden-banner";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { LeafSprig } from "@/components/decor";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, LeafIcon, ShieldIcon, SmileHeartIcon, TruckIcon } from "@/components/icons";

export const revalidate = 300; // classic ISR; the catalog changes rarely

const WHY = [
  { label: "Premium Quality Teas", Icon: LeafIcon },
  { label: "100% Organic & Natural", Icon: LeafIcon },
  { label: "Safe & Secure Payments", Icon: ShieldIcon },
  { label: "Fast & Reliable Delivery", Icon: TruckIcon },
  { label: "Happiness Guaranteed", Icon: SmileHeartIcon },
];

const pill = "inline-flex items-center gap-2 rounded-full border border-black/10 bg-card px-5 py-2 text-sm font-medium hover:border-forest hover:text-forest";

export default async function Home() {
  const all = await getProducts();
  const bestsellers = all.filter((p) => p.isBestseller).slice(0, 5);
  // Category tile photo = the matching Amora tin.
  const tiles = HOME_CATEGORIES.map((c) => ({ key: c.key, label: c.label, image: TIN_FOR_CATEGORY[c.key] }));

  return (
    <>
      <HeroCarousel />
      <NamedTinRow />

      <section className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="cat-h">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 id="cat-h" className="font-display text-2xl font-semibold sm:text-3xl">Shop by Category</h2>
            <p className="mt-1 text-sm text-ink-soft">Find your perfect cup from our handpicked collections.</p>
          </div>
          <Link href="/collections" className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-forest">View All Categories <ArrowIcon width={16} height={16} /></Link>
        </Reveal>
        <ul className="mt-7 grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {tiles.map((t, i) => (
            <Reveal as="li" dir="zoom" delay={i * 70} key={t.key}>
              <Link href={`/collections/${t.key}`} className="group flex flex-col items-center gap-2 text-center text-xs font-medium sm:text-sm">
                <span className="relative size-16 overflow-hidden rounded-full bg-sand shadow-soft ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lift sm:size-20">
                  <Image src={t.image} alt="" fill sizes="80px" className="object-cover transition duration-500 group-hover:scale-110" />
                </span>
                {t.label}
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {bestsellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="best-h">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 id="best-h" className="font-display text-2xl font-semibold sm:text-3xl">Our Best Sellers</h2>
              <p className="mt-1 text-sm text-ink-soft">Customer favorites, crafted for a better you.</p>
            </div>
            <Link href="/shop" className={pill}>View All Products <ArrowIcon width={16} height={16} /></Link>
          </Reveal>
          <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {bestsellers.map((p, i) => (
              <Reveal as="li" delay={i * 90} key={p.slug}><ProductCard product={p} priority={i < 2} /></Reveal>
            ))}
          </ul>
        </section>
      )}

      <GardenBanner />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 lg:grid-cols-[1fr_1.2fr]" aria-labelledby="why-h">
        <Reveal dir="left">
          <h2 id="why-h" className="font-display text-2xl font-semibold">Why Choose Amora-Tea?</h2>
          <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
            {WHY.map(({ label, Icon }, i) => (
              <Reveal as="li" dir="zoom" delay={i * 90} key={label} className="group flex flex-col items-center gap-2 text-center text-xs font-medium">
                <span className="grid size-12 place-items-center rounded-full bg-leaf-soft text-forest transition duration-300 group-hover:-translate-y-1 group-hover:bg-forest group-hover:text-white"><Icon width={22} height={22} /></span>
                {label}
              </Reveal>
            ))}
          </ul>
        </Reveal>
        <Reveal dir="right" className="relative isolate overflow-hidden rounded-panel bg-[#f3ece3] p-8 sm:p-10">
          <LeafSprig className="absolute -right-4 bottom-0 -z-10 w-36 animate-sway text-leaf [--r:0deg]" />
          <h2 className="font-display text-3xl font-semibold">Brew Something Special</h2>
          <p className="mt-2">Get 10% OFF on your first order.</p>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
