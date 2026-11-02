"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Guest wishlist (localStorage). Phase 3 syncs this with WishlistItem rows for signed-in users.
interface WishlistState { slugs: string[]; toggle: (slug: string) => void }

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) => set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] })),
    }),
    { name: "amora-wishlist" },
  ),
);
