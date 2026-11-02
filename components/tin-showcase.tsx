import Image from "next/image";
import { TIN_SRC } from "@/lib/tins";

// Outer div positions the tin; the inner div owns the float animation (both use CSS `translate`, so they must not share an element).
const TINS = [
  { src: TIN_SRC.black, alt: "Amora Premium Black Tea tin", pos: "left-0 top-12 w-32 sm:w-44", tilt: "-7deg", delay: "-1.5s" },
  { src: TIN_SRC.fruit, alt: "Amora Premium Fruit Tea tin", pos: "right-0 top-14 w-32 sm:w-44", tilt: "7deg", delay: "-3s" },
  { src: TIN_SRC.green, alt: "Amora Premium Green Tea tin", pos: "left-1/2 top-0 z-10 w-40 -translate-x-1/2 sm:w-56", tilt: "0deg", delay: "0s", priority: true },
];

/** Floating fan of brand tins for the hero. */
export function TinShowcase() {
  return (
    <div className="relative mx-auto h-60 w-full max-w-md sm:h-80">
      {TINS.map((t) => (
        <div key={t.src} className={`absolute ${t.pos}`}>
          <div className="animate-bob overflow-hidden rounded-card shadow-lift ring-4 ring-white/70" style={{ "--tilt": t.tilt, animationDelay: t.delay } as React.CSSProperties}>
            <Image src={t.src} alt={t.alt} width={900} height={900} sizes="(min-width:640px) 224px, 160px" priority={t.priority} className="h-auto w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
