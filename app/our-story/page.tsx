import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { ArrowIcon, LeafIcon, SproutIcon, UsersIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Why Amora-Tea exists: sustainable farming, fair partnerships and small-batch blending in Phnom Penh.",
  alternates: { canonical: "/our-story" },
};

const VALUES = [
  { Icon: SproutIcon, title: "Sustainable Farming", text: "We favour organic, sustainable farms that protect soil and water." },
  { Icon: UsersIcon, title: "Fair Partnerships", text: "We work with growers and tea communities as long-term partners." },
  { Icon: LeafIcon, title: "Small-Batch Blending", text: "Blended in small batches so every tin tastes fresh." },
];

export default function OurStoryPage() {
  return (
    <>
      <PageHero title="Our Story" subtitle="More than tea, it's a way of life." crumbs={[{ label: "Our Story" }]} />
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-center leading-relaxed">
        <Reveal><h2 className="font-display text-3xl font-semibold text-forest">From the Gardens to Your Cup</h2></Reveal>
        <Reveal delay={100}><p className="text-ink-soft">Amora-Tea began in Phnom Penh with a simple belief: a good cup of tea can make an ordinary day feel a little better. We choose pure, organic teas and blend them with care, so every cup brings balance, energy and wellness to your everyday life.</p></Reveal>
      </section>
      <section className="bg-leaf-soft/60 py-12">
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 text-center">
          {[{ n: 100, s: "%", l: "Organic & natural" }, { n: 26, s: "+", l: "Teas to explore" }].map((x, i) => (
            <Reveal as="li" key={x.l} dir="zoom" delay={i * 120}><p className="font-display text-5xl font-bold text-forest"><CountUp to={x.n} suffix={x.s} /></p><p className="mt-1 text-sm text-ink-soft">{x.l}</p></Reveal>
          ))}
        </ul>
      </section>
      <ul className="mx-auto grid max-w-7xl gap-5 px-4 py-14 md:grid-cols-3">
        {VALUES.map(({ Icon, title, text }, i) => (
          <Reveal as="li" key={title} delay={i * 120} className="group rounded-card bg-card p-7 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-leaf-soft text-forest transition group-hover:bg-forest group-hover:text-white"><Icon width={26} height={26} /></span>
            <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{text}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal className="pb-4 text-center"><Link href="/shop" className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3 font-medium text-white">Explore Our Teas <ArrowIcon width={18} height={18} /></Link></Reveal>
    </>
  );
}
