"use client";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";

/** Heart button for the navbar. Links to /wishlist and shows how many teas are saved. */
export function WishlistLink() {
  const mounted = useMounted();
  const count = useWishlist((s) => s.slugs.length);
  const n = mounted ? count : 0; // favorites live in localStorage, so wait until mounted

  return (
    <Link href="/wishlist" aria-label={n ? `Favorites, ${n} saved` : "Favorites"} className="icon-btn relative">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7.5-4.6-9-9.3C2 7.6 4 5 6.8 5c1.9 0 3.4 1 5.2 3 1.8-2 3.3-3 5.2-3C20 5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z" />
      </svg>
      {n > 0 && (
        <span key={n} className="animate-pop absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-forest px-1 text-[10px] font-semibold leading-4 text-white">
          {n}
        </span>
      )}
    </Link>
  );
}