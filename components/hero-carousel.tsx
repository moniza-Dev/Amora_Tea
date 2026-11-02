"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AMORA_TINS } from "@/lib/tins";
import { ArrowIcon } from "@/components/icons";

/**
 * Swipeable product hero (Creamy-style).
 * - Active tin is large; the next tins sit smaller/faded to the right.
 * - Swipe/drag LEFT (or press the arrow / → key) = next tea: the name, description,
 *   chips, button link and background colour all change to that tea.
 * - Swipe RIGHT = previous tea.
 * Edit the THEME table below to change the copy / colours per tea.
 * Add `image: "/images/hero/<file>.png"` (transparent PNG) to show only the tea box, no card.
 */

type Theme = { line1: string; line2: string; blurb: string; brew: string; bg: string; accent: string; image?: string };

const THEME: Record<string, Theme> = {
  jasmine: { line1: "Jasmine", line2: "Green Tea.", blurb: "Delicate green tea scented with fresh jasmine blossoms — fragrant, soothing and light.", brew: "80°C · 2 min", bg: "#1f4d2e", accent: "#a8d37f", image: "/images/hero/jasmine.png" },
  oolong: { line1: "Smooth", line2: "Oolong Tea.", blurb: "A partly oxidised tea with a rounded, floral finish that sits between green and black.", brew: "90°C · 3 min", bg: "#4a3a14", accent: "#ecc76d", image: "/images/hero/oolong.png" },
  "earl-grey": { line1: "Classic", line2: "Earl Grey.", blurb: "Black tea brightened with citrusy bergamot for an elegant, uplifting cup any time of day.", brew: "95°C · 4 min", bg: "#34401c", accent: "#d3dc8c", image: "/images/hero/earl.png" },
  hibiscus: { line1: "Bold", line2: "Hibiscus.", blurb: "Vivid ruby petals make a refreshing, tangy tea that is lovely hot or over ice.", brew: "95°C · 5 min", bg: "#5a1f2b", accent: "#ff9fb0", image: "/images/hero/hibiscus.png" },
  chamomile: { line1: "Calm", line2: "Chamomile & Lavender.", blurb: "Gentle chamomile and soft lavender for a relaxing, caffeine-free wind-down.", brew: "95°C · 5 min", bg: "#45365a", accent: "#dcc7f5", image: "/images/hero/chanmomile.png" },
  rooibos: { line1: "Sweet", line2: "Rooibos Tea.", blurb: "Naturally sweet, smooth and caffeine-free — a warm, comforting cup at any hour.", brew: "100°C · 5 min", bg: "#6b3414", accent: "#ffb877", image: "/images/hero/rooibos.png" },
};
const FALLBACK: Theme = THEME.jasmine;

export function HeroCarousel() {
  const n = AMORA_TINS.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);
  const moved = useRef(false);

  const go = (to: number, d?: "next" | "prev") => {
    const target = ((to % n) + n) % n;
    if (target === active) return;
    setDir(d ?? (target > active ? "next" : "prev"));
    setActive(target);
  };
  const next = () => go(active + 1, "next");
  const prev = () => go(active - 1, "prev");

  const tin = AMORA_TINS[active];
  const t = THEME[tin.key] ?? FALLBACK;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured Amora teas"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="hero-root relative overflow-hidden text-white outline-none"
      style={{ backgroundColor: t.bg, transition: "background-color 700ms ease" }}
    >
      <style>{`
        @keyframes hero-in-next{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:none}}
        @keyframes hero-in-prev{from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:none}}
        .hero-text[data-dir="next"]>*{animation:hero-in-next .6s cubic-bezier(.2,.7,.2,1) both}
        .hero-text[data-dir="prev"]>*{animation:hero-in-prev .6s cubic-bezier(.2,.7,.2,1) both}
        .hero-text>*:nth-child(2){animation-delay:.06s}.hero-text>*:nth-child(3){animation-delay:.12s}
        .hero-text>*:nth-child(4){animation-delay:.18s}.hero-text>*:nth-child(5){animation-delay:.24s}
        @media (prefers-reduced-motion:reduce){.hero-text>*{animation:none!important}.hero-card{transition:none!important}}
      `}</style>

      {/* soft glow behind the tins, tinted by the active tea */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 size-[60rem] max-w-none -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${t.accent} 0%, transparent 60%)`, transition: "background 700ms ease" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-32 pt-14 lg:grid-cols-2 lg:pb-40 lg:pt-20">
        {/* ---------- left: text that changes per tea ---------- */}
        <div className="hero-text" key={active} data-dir={dir} aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 19C5 9 12 4 20 4c0 9-5 15-15 15Z" /><path d="M5 19 14 10" /></svg>
            {tin.note}
          </span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {t.line1}
            <span className="block italic" style={{ color: t.accent, transition: "color 700ms ease" }}>{t.line2}</span>
          </h1>

          <div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">{t.blurb}</p>
            <ul className="mt-5 flex flex-wrap gap-2 text-sm">
              {["50g tin", "100% Organic", t.brew].map((c) => (
                <li key={c} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{c}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/shop/${tin.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-forest transition hover:-translate-y-0.5 hover:shadow-lift">
              Shop Now <ArrowIcon width={16} height={16} />
            </Link>
            <Link href="/collections" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-3.5 font-semibold transition hover:bg-white/10">
              View All <ArrowIcon width={16} height={16} />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[["S", "#b7dca0"], ["L", "#f4c9a3"], ["M", "#cbb6e6"]].map(([l, c]) => (
                <span key={l} className="grid size-9 place-items-center rounded-full border-2 text-sm font-semibold text-forest" style={{ background: c, borderColor: t.bg }}>{l}</span>
              ))}
            </div>
            <div className="text-sm leading-tight"><b>10K+ Reviews</b><br /><span className="text-white/70">Customers are satisfied</span></div>
          </div>
        </div>

        {/* ---------- right: swipeable tin stage ---------- */}
        <div>
          <div
            className="relative mx-auto h-[380px] w-full max-w-[680px] cursor-grab select-none active:cursor-grabbing sm:h-[500px] lg:h-[560px]"
            style={{ touchAction: "pan-y" }}
            onPointerDown={(e) => {
              start.current = e.clientX;
              moved.current = false;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (start.current === null) return;
              const d = e.clientX - start.current;
              if (Math.abs(d) > 6) moved.current = true;
              setDx(Math.max(-160, Math.min(160, d)));
            }}
            onPointerUp={() => {
              if (start.current === null) return;
              if (dx < -60) next(); // swipe left  -> next tea
              else if (dx > 60) prev(); // swipe right -> previous tea
              start.current = null;
              setDx(0);
            }}
            onPointerCancel={() => { start.current = null; setDx(0); }}
          >
            {AMORA_TINS.map((p, i) => {
              const o = (i - active + n) % n;
              const dragging = start.current !== null && o === 0;
              const cut = !!THEME[p.key]?.image; // your own transparent tea box (no card)
              let transform: string, opacity: number, z: number;
              if (o === 0) { transform = `translate(${dx}px,-50%) scale(1)`; opacity = 1; z = 4; }
              else if (o === 1) { transform = "translate(59%,-50%) scale(.6) rotate(4deg)"; opacity = 0.92; z = 3; }
              else if (o === 2) { transform = "translate(72%,-50%) scale(.38) rotate(-3deg)"; opacity = 0.65; z = 2; }
              else if (o === n - 1) { transform = "translate(-75%,-50%) scale(.5)"; opacity = 0; z = 1; }
              else { transform = "translate(100%,-50%) scale(.3)"; opacity = 0; z = 0; }
              return (
                <button
                  key={p.slug}
                  type="button"
                  tabIndex={-1}
                  aria-label={o === 0 ? `${p.name} (current)` : `Show ${p.name}`}
                  onClick={() => { if (!moved.current && o !== 0) go(i); }}
                  className={`hero-card absolute left-[4%] top-1/2 aspect-square w-[68%] ${cut ? "" : "overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20"}`}
                  style={{
                    transform, opacity, zIndex: z,
                    pointerEvents: o > 2 || o === n - 1 ? "none" : "auto",
                    transition: dragging ? "none" : "transform 650ms cubic-bezier(.2,.7,.2,1), opacity 500ms ease",
                  }}
                >
                  <Image
                    src={THEME[p.key]?.image ?? p.src}
                    alt={`Amora Premium ${p.name} tin, 50g`}
                    fill
                    priority={i < 3}
                    draggable={false}
                    sizes="(min-width:1024px) 440px, 70vw"
                    className={`pointer-events-none ${cut ? "object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.45)]" : "object-cover"}`}
                  />
                </button>
              );
            })}

            <p className="absolute bottom-0 right-0 font-script text-2xl text-white/80 sm:text-3xl" aria-hidden>Good Tea, Better Days</p>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start lg:pl-[4%]">
            <button type="button" onClick={prev} aria-label="Previous tea" className="grid size-11 place-items-center rounded-full bg-white text-forest transition hover:scale-105">
              <ArrowIcon width={18} height={18} className="rotate-180" />
            </button>
            <button type="button" onClick={next} aria-label="Next tea" className="grid size-11 place-items-center rounded-full bg-white text-forest transition hover:scale-105">
              <ArrowIcon width={18} height={18} />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose tea">
              {AMORA_TINS.map((p, i) => (
                <button key={p.slug} type="button" role="tab" aria-selected={i === active} aria-label={p.name} onClick={() => go(i)}
                  className="h-2 rounded-full bg-white transition-all" style={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.4 }} />
              ))}
            </div>
            <span className="text-sm tabular-nums text-white/70">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* cream wave at the bottom (same as your current hero) */}
      <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-14 w-full md:h-24">
        <path d="M0,70 C240,20 480,100 760,80 C1040,60 1240,20 1440,60 L1440,120 L0,120 Z" fill="#f5f1e8" />
      </svg>
    </section>
  );
}