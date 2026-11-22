"use client";
import { create } from "zustand";

/**
 * Remembers whether a customer is signed in (set by AccountSync) and whether the
 * "please sign in" popup is showing. The cart and wishlist stores use it to block guests.
 */
interface GateState {
  signedIn: boolean;
  promptOpen: boolean;
  setSignedIn: (v: boolean) => void;
  openPrompt: () => void;
  closePrompt: () => void;
}

export const useAuthGate = create<GateState>()((set) => ({
  signedIn: false,
  promptOpen: false,
  setSignedIn: (v) => set({ signedIn: v }),
  openPrompt: () => set({ promptOpen: true }),
  closePrompt: () => set({ promptOpen: false }),
}));

/** true = allowed. false = a guest: the sign-in popup is opened and the action must stop. */
export function canUseAccountFeatures(): boolean {
  const s = useAuthGate.getState();
  if (s.signedIn) return true;
  s.openPrompt();
  return false;
}