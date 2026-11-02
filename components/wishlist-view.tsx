"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store"; // <-- check: see note below the code
import { useMounted } from "@/lib/use-mounted";
import { formatUSD } from "@/lib/format";
import { ArrowIcon, CartIcon } from "./icons";

export interface WishCatalogItem {
  name: string;
  imageUrl: string;
  weights: { grams: number; priceCents: number }[];
  fixedPriceCents: number | null;
}

function HeartIcon({ filled = false, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7.5-4.6-9-9.3C2 7.6 4 5 6.8 5c1.9 0 3.4 1 5.2 3 1.8-2 3.3-3 5.2-3C20 5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

/** Empty open tin illustration, drawn with the site palette. */
function EmptyIllustration() {
  return (
    <svg viewBox="0 0 220 180" className="mx-auto h-44 w-auto" role="img" aria-label="An empty box">
      <path d="M30 100c-8-34 22-70 64-76 40-6 88 8 100 44 12 38-24 74-70 80-46 6-86-12-94-48Z" fill="var(--color-leaf-soft)" />
      <polygon points="62,84 116,70 158,80 104,96" fill="#8a6a2a" />
      <polygon points="62,84 104,96 104,140 62,126" fill="var(--color-gold)" />
      <polygon points="104,96 158,80 158,124 104,140" fill="#b98a35" />
      <rect x="147" y="30" width="7" height="24" rx="3.5" fill="var(--color-danger)" />
      <circle cx="150.5" cy="62" r="4" fill="var(--color-danger)" />
      <path d="M44 56c10-2 16 4 16 12-9 2-16-3-16-12Z" fill="var(--color-leaf)" />
      <circle cx="176" cy="116" r="4" fill="none" stroke="var(--color-forest)" strokeWidth="2" />
    </svg>
  );
}

function PageBar({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link href="/shop" aria-label="Back to shop" className="grid size-11 place-items-center rounded-full bg-card text-ink shadow-soft transition hover:text-forest active:scale-90">
        <ArrowIcon width={18} height={18} className="rotate-180" />
      </Link>
      <h1 className="font-display text-2xl font-semibold text-forest sm:text-3xl">My Favorites</h1>
      <span aria-label={`${count} saved`} className="grid size-11 place-items-center rounded-full bg-card text-sm font-semibold text-forest shadow-soft">
        {count}
      </span>
    </div>
  );
}

export function WishlistView({ catalog }: { catalog: Record<string, WishCatalogItem> }) {
  const mounted = useMounted();
  const { slugs, toggle } = useWishlist(); // <-- check: see note below the code
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  if (!mounted) return <div className="skeleton mx-auto my-12 h-48 max-w-2xl rounded-card" aria-busy />;

  const items = slugs.flatMap((slug) => {
    const c = catalog[slug];
    if (!c) return [];
    const first = c.weights[0];
    return [{ slug, c, grams: first?.grams ?? 0, price: c.fixedPriceCents ?? first?.priceCents ?? 0 }];
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <PageBar count={items.length} />

      {items.length === 0 ? (
        <div className="animate-rise mt-10 rounded-panel bg-card px-6 py-12 text-center shadow-soft">
          <EmptyIllustration />
          <p className="mt-6 font-display text-2xl font-semibold">You have no favorites yet</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">Tap the heart on any tea to save it here for later.</p>
          <Link href="/shop" className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-medium text-white hover:bg-forest-dark">
            Browse teas <ArrowIcon width={16} height={16} />
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((it, i) => (
            <li key={it.slug} style={{ animationDelay: `${i * 60}ms` }} className="animate-rise flex items-center gap-4 rounded-card bg-card p-3 shadow-soft">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-tile bg-sand/70 sm:size-32">
                <Link href={`/shop/${it.slug}`} aria-label={`View ${it.c.name}`} className="absolute inset-0">
                  <Image src={it.c.imageUrl} alt={it.c.name} fill sizes="128px" className="object-cover" />
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(it.slug)}
                  aria-label={`Remove ${it.c.name} from favorites`}
                  className="absolute left-2 top-2 grid size-8 place-items-center rounded-full bg-white/85 text-danger shadow-soft transition hover:bg-white active:scale-90"
                >
                  <HeartIcon filled size={16} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <Link href={`/shop/${it.slug}`} className="block truncate font-display text-lg font-semibold hover:text-forest">{it.c.name}</Link>
                {it.grams > 0 && <p className="mt-0.5 text-xs text-ink-soft">{it.grams}g tin</p>}
                <p className="mt-2 font-semibold text-forest">{formatUSD(it.price)}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/shop/${it.slug}`} aria-label={`View ${it.c.name}`} className="grid size-10 place-items-center rounded-xl bg-leaf-soft text-forest transition hover:bg-forest hover:text-white active:scale-90">
                    <ArrowIcon width={16} height={16} />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Add ${it.c.name} to cart`}
                    onClick={() => { add(it.slug, it.grams); setAdded(it.slug); setTimeout(() => setAdded(null), 1200); }}
                    className="grid size-10 place-items-center rounded-xl bg-forest text-white transition hover:bg-forest-dark active:scale-90"
                  >
                    {added === it.slug ? <span className="animate-pop text-base leading-none">✓</span> : <CartIcon width={17} height={17} />}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}