"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Client cart holds only references (slug + grams + qty). Prices are always recalculated server-side (Phase 4).
export interface CartLine { slug: string; grams: number; quantity: number }

interface CartState {
  lines: CartLine[];
  add: (slug: string, grams: number, quantity?: number) => void;
  setQty: (slug: string, grams: number, quantity: number) => void;
  remove: (slug: string, grams: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, grams, quantity = 1) =>
        set((s) => {
          const hit = s.lines.find((l) => l.slug === slug && l.grams === grams);
          return {
            lines: hit
              ? s.lines.map((l) => (l === hit ? { ...l, quantity: l.quantity + quantity } : l))
              : [...s.lines, { slug, grams, quantity }],
          };
        }),
      setQty: (slug, grams, quantity) =>
        set((s) => ({
          lines: s.lines.flatMap((l) => (l.slug === slug && l.grams === grams ? (quantity > 0 ? [{ ...l, quantity: Math.min(quantity, 99) }] : []) : [l])),
        })),
      remove: (slug, grams) => set((s) => ({ lines: s.lines.filter((l) => !(l.slug === slug && l.grams === grams)) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "amora-cart" },
  ),
);

export const selectCartCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
