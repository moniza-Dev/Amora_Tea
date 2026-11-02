"use client";
import { useState } from "react";
import { formatUSD } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";
import { CartIcon, HeartIcon } from "./icons";

interface W { grams: number; priceCents: number; compareAtCents?: number }

export function ProductBuy({ slug, name, weights, giftPriceCents, giftCompareCents, stock }: {
  slug: string; name: string; weights: W[]; giftPriceCents?: number; giftCompareCents?: number | null; stock: number;
}) {
  const [i, setI] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.slugs.includes(slug));
  const toggle = useWishlist((s) => s.toggle);
  const mounted = useMounted();
  const isWished = mounted && wished;
  const w = weights[i];
  const price = w?.priceCents ?? giftPriceCents ?? 0;
  const compare = w?.compareAtCents ?? giftCompareCents ?? undefined;
  const soldOut = stock <= 0;

  return (
    <div>
      <p className="flex items-baseline gap-3">
        <span key={price} className="animate-pop inline-block font-display text-3xl font-bold text-forest">{formatUSD(price * qty)}</span>
        {compare && <span className="text-ink-soft line-through">{formatUSD(compare * qty)}</span>}
      </p>

      {weights.length > 0 && (
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium">Size</legend>
          <div className="flex gap-2">
            {weights.map((x, idx) => (
              <button key={x.grams} type="button" onClick={() => setI(idx)} aria-pressed={idx === i}
                className={`rounded-full border px-5 py-2 text-sm transition active:scale-95 ${idx === i ? "border-forest bg-forest text-white" : "border-black/10 bg-card hover:border-forest"}`}>
                {x.grams}g
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-black/10 bg-card">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-11 rounded-full text-lg hover:bg-leaf-soft active:scale-90">−</button>
          <span className="w-8 text-center" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))} className="size-11 rounded-full text-lg hover:bg-leaf-soft active:scale-90">+</button>
        </div>
        <button type="button" disabled={soldOut}
          onClick={() => { add(slug, w?.grams ?? 0, qty); setAdded((n) => n + 1); setTimeout(() => setAdded(0), 1500); }}
          className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 font-medium text-white hover:bg-forest-dark disabled:opacity-50">
          {added ? <span key={added} className="animate-pop">✓ Added to cart</span> : <><CartIcon width={18} height={18} />{soldOut ? "Sold out" : "Add to Cart"}</>}
        </button>
        <button type="button" onClick={() => toggle(slug)} aria-pressed={isWished} aria-label={isWished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className={`grid size-12 place-items-center rounded-full border border-black/10 bg-card transition hover:scale-105 active:scale-90 ${isWished ? "text-danger" : ""}`}>
          <span key={String(isWished)} className={isWished ? "animate-pop" : ""}><HeartIcon fill={isWished ? "currentColor" : "none"} /></span>
        </button>
      </div>
    </div>
  );
}
