import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { formatUSD, getProducts } from "@/lib/catalog";
import { BANNERS, GIFT_SETS } from "@/lib/tins";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Gifts & Sets",
  description: "Thoughtful Amora-Tea gift sets for tea lovers: six tins in a ribbon-tied box, perfect for every occasion.",
  alternates: { canonical: "/gifts" },
};
export const revalidate = 300;

/** Poppins (installed via @fontsource/poppins): 700 for titles, prices and labels, 400 for description text. */
const POPPINS = { fontFamily: '"Poppins", ui-sans-serif, system-ui, sans-serif' } as const;

export default async function GiftsPage() {
  const gifts = (await getProducts()).filter((p) => p.kind === "gift_set");
  const bySlug = new Map(gifts.map((g) => [g.slug, g]));
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Gifts & Sets", path: "/gifts" }])} />
      <PageHero title="Gifts & Sets" subtitle="Thoughtfully curated tea sets, ready to give." crumbs={[{ label: "Gifts & Sets" }]} />
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Reveal dir="left" className="overflow-hidden rounded-panel shadow-lift">
          <Image src={BANNERS.gifts} alt="Amora-Tea gift box with six tea tins, a green ribbon and a handwritten tag" width={624} height={1024} priority sizes="(min-width:1024px) 420px, 100vw" className="animate-drift h-auto max-h-[560px] w-full object-cover" />
        </Reveal>
        <Reveal dir="right" className="space-y-4">
          <p className="font-script text-2xl text-leaf">Share Good Moments</p>
          <h2 className="font-display text-3xl font-semibold text-forest">A little happiness in every cup</h2>
          <p className="max-w-lg text-ink-soft">Each set is packed by hand in a keepsake box with a ribbon and a note card, so it is ready to give the moment it arrives.</p>
          <Link href="/contact" className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark">Ask about custom sets <ArrowIcon width={16} height={16} /></Link>
        </Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-14">
        <div className="text-center">
          <p className="font-script text-2xl text-leaf">Ready to give</p>
          <h2 className="font-display text-3xl font-semibold text-forest">Our Gift Sets</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {GIFT_SETS.map((g, i) => {
            const p = bySlug.get(g.slug);
            const save = p?.compareAtCents && p.compareAtCents > p.priceCents ? p.compareAtCents - p.priceCents : 0;
            return (
              <Reveal as="li" key={g.slug} delay={80} dir="zoom">
                <article className="grid overflow-hidden rounded-card bg-white/70 shadow-soft md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
                  <Link href={`/shop/${g.slug}`} className="group relative block aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[320px]" aria-label={`View ${p?.name ?? g.title}`}>
                    <Image src={g.src} alt={g.alt} fill priority={i < 2} quality={90} sizes="(min-width:768px) 560px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </Link>
                  <div style={POPPINS} className="flex flex-col justify-center gap-4 p-6 md:p-10">
                    <p className="font-script text-xl text-leaf">{g.title}</p>
                    <h3 className="text-2xl font-bold text-forest md:text-3xl">{p?.name ?? g.title}</h3>
                    {p?.description && <p className="max-w-md font-normal leading-relaxed text-ink-soft">{p.description}</p>}
                    <div>
                      <p className="text-sm font-bold text-forest">What&apos;s inside</p>
                      <ul className="mt-2 space-y-1.5 text-sm font-normal text-ink-soft">
                        {g.includes.map((line) => (
                          <li key={line} className="flex gap-2"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf" />{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-3">
                      {p && (
                        <p className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-forest">{formatUSD(p.priceCents)}</span>
                          {save > 0 && <span className="text-sm font-normal text-ink-soft line-through">{formatUSD(p.compareAtCents!)}</span>}
                          {save > 0 && <span className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-xs font-bold text-forest">Save {formatUSD(save)}</span>}
                        </p>
                      )}
                      <Link href={`/shop/${g.slug}`} className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-white hover:bg-forest-dark">View set <ArrowIcon width={16} height={16} /></Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </>
  );
}
