"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { displayName, formatUSD } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";
import { CartIcon, HeartIcon } from "./icons";
import { RatingStars } from "./rating-stars";

// Per-image tweak so every tin looks the same size in the shop grid.
// Matched by KEYWORD inside the image URL, so "green.webp", "green-scene.webp"
// and "/images/tins/green-xyz.jpg" all match "green".
// scale > 1 = bigger tin, origin = the point the image grows from.
const TIN_ADJUST: { match: string; scale: number; origin?: string }[] = [
  { match: "cinnamon", scale: 1 }, // reference size
  { match: "fruit", scale: 1 },
  { match: "detox", scale: 1.03 },
  { match: "jasmine", scale: 1 }, // must stay above "green" (jasmine-green contains "green")
  { match: "green", scale: 1 }, // new green.webp already has the tin the right size
  { match: "black", scale: 1.12, origin: "50% 55%" },
  { match: "herbal", scale: 1 },
  { match: "white", scale: 1 },
];

function getAdjust(url: string) {
  const u = url.toLowerCase();
  return TIN_ADJUST.find((a) => u.includes(a.match));
}

export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.slugs.includes(p.slug));
  const toggle = useWishlist((s) => s.toggle);
  const mounted = useMounted();
  const name = displayName(p);
  const soldOut = p.stock <= 0;
  const grams = p.weights[0]?.grams ?? 0; // smallest weight = the "from" price shown on the card (gift sets: 0 = whole set)
  const buyable = p.kind === "gift_set" || grams > 0;
  const [added, setAdded] = useState(false);
  const isWished = mounted && wished;
  const adjust = getAdjust(p.imageUrl);

  return (
    <article className="group relative flex flex-col rounded-card bg-sand/70 p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      {p.isBestseller && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-forest px-2 py-0.5 text-[11px] font-medium text-white">Bestseller</span>
      )}
      <button
        type="button"
        onClick={() => toggle(p.slug)}
        aria-pressed={isWished}
        aria-label={isWished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        className={`absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full transition hover:scale-110 hover:bg-white/70 active:scale-90 ${isWished ? "text-danger" : "text-ink"}`}
      >
        <span key={String(isWished)} className={isWished ? "animate-pop" : ""}><HeartIcon width={18} height={18} fill={isWished ? "currentColor" : "none"} /></span>
      </button>

      <Link href={`/shop/${p.slug}`} className="shine relative mx-auto mt-4 block aspect-square w-full max-w-56 overflow-hidden rounded-tile">
        <Image
          src={p.imageUrl}
          alt={name}
          fill
          sizes="(min-width:1024px) 400px, (min-width:640px) 45vw, 90vw"
          quality={90}
          priority={priority}
          className="object-cover transition duration-700 group-hover:scale-110"
          style={
            adjust
              ? { transform: `scale(${adjust.scale})`, transformOrigin: adjust.origin ?? "50% 50%" }
              : undefined
          }
        />
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1.5 px-1 pb-1">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5">
          <Link href={`/shop/${p.slug}`} className="hover:text-forest">{name}</Link>
        </h3>
        <RatingStars rating={p.rating} count={p.ratingCount} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <p className="text-sm">
            {soldOut ? (
              <span className="text-ink-soft">Sold out</span>
            ) : (
              <>
                <span className="font-semibold">{formatUSD(p.priceCents)}</span>
                {p.compareAtCents && <span className="ml-2 text-xs text-ink-soft line-through">{formatUSD(p.compareAtCents)}</span>}
              </>
            )}
          </p>
          <button
            type="button"
            disabled={soldOut || !buyable}
            onClick={() => { add(p.slug, grams); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
            aria-label={`Add ${name} to cart`}
            className={`grid size-10 shrink-0 place-items-center rounded-full text-white transition hover:scale-105 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 ${added ? "bg-leaf" : "bg-ink hover:bg-forest"}`}
          >
            {added ? <span className="animate-pop text-lg leading-none">✓</span> : <CartIcon width={18} height={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}