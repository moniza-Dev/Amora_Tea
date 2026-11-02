import Image from "next/image";
import Link from "next/link";

export interface NamedTin {
  src: string;
  name: string;
  tagline: string;
  lidColor: string; // tailwind bg colour for the lid badge
  href: string;
}

export const NAMED_TINS: NamedTin[] = [
  {
    src: "/images/tins/jasmine-green.webp",
    name: "Jasmine Green Tea",
    tagline: "Fragrant & Soothing",
    lidColor: "#4caf50",
    href: "/collections/green",
  },
  {
    src: "/images/tins/oolong-premium.webp",
    name: "Oolong Tea",
    tagline: "Smooth & Floral",
    lidColor: "#795548",
    href: "/collections/oolong",
  },
  {
    src: "/images/tins/earl-grey.webp",
    name: "Earl Grey Tea",
    tagline: "Citrusy & Elegant",
    lidColor: "#1a237e",
    href: "/collections/black",
  },
  {
    src: "/images/tins/hibiscus.webp",
    name: "Hibiscus Tea",
    tagline: "Refreshing & Tangy",
    lidColor: "#e91e63",
    href: "/collections/herbal",
  },
  {
    src: "/images/tins/chamomile-lavender.webp",
    name: "Chamomile & Lavender Tea",
    tagline: "Relaxing & Calm",
    lidColor: "#9c27b0",
    href: "/collections/herbal",
  },
  {
    src: "/images/tins/rooibos.webp",
    name: "Rooibos Tea",
    tagline: "Naturally Sweet & Smooth",
    lidColor: "#bf360c",
    href: "/collections/herbal",
  },
];

/** Horizontal scrollable row of the 6 named Amora tea tins. */
export function NamedTinRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="tin-row-h">
      <div className="mb-7 text-center">
        <p className="font-script text-2xl text-leaf">Our Premium Collection</p>
        <h2 id="tin-row-h" className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
          Box Teas
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Handcrafted in 50 g tins — explore every flavour.
        </p>
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Fade edges hint */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-cream to-transparent sm:w-12" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent sm:w-12" />

        <ul
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {NAMED_TINS.map((tin, i) => (
            <li
              key={tin.name}
              className="group flex-shrink-0"
              style={{ scrollSnapAlign: "start", animationDelay: `${i * 80}ms` }}
            >
              <Link
                href={tin.href}
                className="flex w-44 flex-col items-center rounded-2xl bg-card p-4 shadow-soft ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-lift sm:w-52"
              >
                {/* Tin image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image
                    src={tin.src}
                    alt={`Amora ${tin.name} tin`}
                    fill
                    sizes="(min-width:640px) 208px, 176px"
                    priority={i < 3}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                {/* Info */}
                <div className="mt-3 text-center">
                  <p className="text-xs font-semibold leading-snug text-ink">{tin.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink-soft">{tin.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
