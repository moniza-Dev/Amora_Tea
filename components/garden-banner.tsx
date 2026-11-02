import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/site";
import { ArrowIcon, SproutIcon, UsersIcon, LeafIcon } from "./icons";
import { LeafSprig } from "./decor";
import { Reveal } from "./reveal";

const PILLARS = [
  { label: "Sustainable Farming", Icon: SproutIcon },
  { label: "Supports Tea Communities", Icon: UsersIcon },
  { label: "A Greener Tomorrow", Icon: LeafIcon },
];

export function GardenBanner() {
  return (
    <section className="relative isolate mt-16 overflow-hidden bg-gradient-to-r from-leaf-soft via-cream to-leaf/30">
      {IMAGES.garden && <Image src={IMAGES.garden} alt="" fill sizes="100vw" className="-z-10 object-cover" />}
      <LeafSprig className="absolute bottom-0 left-1/3 -z-10 w-40 animate-float text-leaf/40 max-md:hidden" />
      <div className="mx-auto grid min-h-72 max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2">
        <Reveal dir="left">
          <h2 className="font-display text-3xl font-bold text-forest sm:text-4xl">
            From the Gardens<br /><span className="font-normal italic">to Your Cup</span>
          </h2>
          <p className="mt-3 text-sm text-ink-soft">Ethically sourced. Expertly blended.<br />Simply exceptional.</p>
          <Link href="/our-story" className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark btn-press">
            Our Story <ArrowIcon width={16} height={16} />
          </Link>
        </Reveal>
        <ul className="flex flex-wrap justify-center gap-6 md:justify-end">
          {PILLARS.map(({ label, Icon }, i) => (
            <Reveal as="li" dir="zoom" delay={i * 120} key={label} className="group flex w-24 flex-col items-center gap-2 text-center text-xs font-medium text-forest">
              <span className="grid size-14 place-items-center rounded-full bg-white/80 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6"><Icon width={26} height={26} /></span>
              {label}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
