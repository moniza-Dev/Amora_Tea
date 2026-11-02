import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ArrowIcon, LeafIcon } from "./icons";
import { TinShowcase } from "./tin-showcase";

// Mock reviewer avatars (plant-based placeholder colours)
const AVATARS = [
  { bg: "#a8d5a2", initials: "S" },
  { bg: "#f5c6a0", initials: "L" },
  { bg: "#c3b1e1", initials: "M" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest" aria-label="Hero">
      {/* Falling leaf particles */}
      {[8, 27, 46, 66, 84].map((left, i) => (
        <span
          key={left}
          aria-hidden
          className="leaf-fall pointer-events-none absolute -z-0 w-5 text-white/20 max-sm:[&:nth-of-type(n+4)]:hidden"
          style={{ left: `${left}%`, "--dur": `${15 + i * 3}s`, "--delay": `${-i * 4}s` } as React.CSSProperties}
        >
          <LeafIcon width={20} height={20} />
        </span>
      ))}

      {/* ── Content grid ─────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid min-h-[480px] max-w-7xl items-center gap-8 px-6 py-14 md:min-h-[540px] md:grid-cols-2 lg:gap-16">

        {/* Left: text + CTA */}
        <div className="flex flex-col items-start">
          {/* Brand label */}
          <p className="animate-rise flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <LeafIcon width={16} height={16} />
            {SITE.tagline}
          </p>

          {/* Main headline */}
          <h1 className="animate-rise mt-6 font-display text-4xl font-bold leading-tight text-white [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            Sip Wellness<br />
            <span className="mt-1 block font-display italic text-[#b8e4a0] sm:text-5xl lg:text-6xl">
              Every Day.
            </span>
          </h1>

          <p className="animate-rise mt-5 max-w-md text-sm leading-relaxed text-white/75 [animation-delay:240ms] sm:text-base">
            Discover the natural goodness of our premium teas — crafted to bring balance, energy and wellness to your everyday life.
          </p>

          {/* CTA buttons */}
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:360ms]">
            <Link
              href="/shop"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-forest shadow-lift hover:bg-[#b8e4a0]"
            >
              <LeafIcon width={18} height={18} /> Shop Now
            </Link>
            <Link
              href="/collections"
              className="btn-press inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 font-medium text-white hover:border-white hover:bg-white/10"
            >
              View All <ArrowIcon width={16} height={16} />
            </Link>
          </div>

          {/* Social proof: avatars + review count */}
          <div className="animate-rise mt-10 flex items-center gap-3 [animation-delay:480ms]">
            <div className="flex -space-x-3">
              {AVATARS.map((a) => (
                <span
                  key={a.initials}
                  className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-forest text-xs font-bold text-forest"
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">10K+ Reviews</p>
              <p className="text-xs text-white/60">Customers are satisfied</p>
            </div>
          </div>
        </div>

        {/* Right: floating tin showcase */}
        <div className="animate-rise flex flex-col items-center [animation-delay:300ms]">
          <TinShowcase />
          <p className="mt-3 text-center font-script text-3xl text-white/70 md:text-4xl" aria-hidden>
            Good Tea, Better Days
          </p>
        </div>
      </div>

      {/* ── Wave divider ─────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none relative -mb-px">
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: "clamp(48px, 8vw, 90px)" }}
        >
          <path
            d="M0,0 C240,90 480,0 720,45 C960,90 1200,0 1440,60 L1440,90 L0,90 Z"
            fill="#f6f1e7"
          />
        </svg>
      </div>
    </section>
  );
}
