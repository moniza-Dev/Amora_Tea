"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { canUseAccountFeatures } from "@/lib/auth-gate";

// Favorites. Only signed-in customers can use them; AccountSync saves them to the account (UserData).
interface WishlistState { slugs: string[]; toggle: (slug: string) => void; clear: () => void }

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) => {
        // Guests can't favorite: this opens the "sign in or create an account" popup instead.
        if (!canUseAccountFeatures()) return;
        set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] }));
      },
      clear: () => set({ slugs: [] }),
    }),
    { name: "amora-wishlist" },
  ),
);