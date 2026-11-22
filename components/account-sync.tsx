"use client";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/use-session";
import { useCart, type CartLine } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { loadSaved, saveSaved } from "@/app/sync-actions";
import { useAuthGate } from "@/lib/auth-gate";

/**
 * Renders nothing. Keeps the cart and favorites tied to the signed-in account:
 *  - sign in  -> load the account's saved lists from the database and merge them with the guest ones
 *  - signed in -> every change is saved to the database (debounced)
 *  - sign out -> wipe the browser copy (the database copy stays for the next sign in)
 */
const OWNER_KEY = "amora-owner"; // whose data is currently in this browser
const SAVE_DELAY_MS = 250; // short, so a quick sign out doesn't lose the last change

function mergeCart(a: CartLine[], b: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const l of [...a, ...b]) {
    const key = `${l.slug}|${l.grams}`;
    const hit = map.get(key);
    map.set(key, hit ? { ...hit, quantity: Math.min(99, Math.max(hit.quantity, l.quantity)) } : { ...l });
  }
  return [...map.values()];
}

export function AccountSync() {
  const user = useSession();
  const checking = user === undefined;
  const email = user?.email ?? null;
  const synced = useRef<string | null>(null); // email whose data is loaded into the stores

  // Sign in / sign out.
  useEffect(() => {
    if (checking) return;

    // Guests are blocked from adding to cart/favorites; signed-in customers are allowed.
    useAuthGate.getState().setSignedIn(!!email);

    if (!email) {
      synced.current = null; // stop saving first, so the wipe below never reaches the database
      // Guests can't have a cart or favorites, so anything left in the browser (from an
      // account that signed out, or from before this rule existed) is removed.
      // The database copy is never touched here.
      useCart.getState().clear();
      useWishlist.getState().clear();
      try { localStorage.removeItem(OWNER_KEY); } catch {}
      return;
    }

    useAuthGate.getState().closePrompt();

    let cancelled = false;
    (async () => {
      let owner: string | null = null;
      try { owner = localStorage.getItem(OWNER_KEY); } catch {}
      if (owner && owner !== email) { // leftovers from a different account on this browser
        useCart.getState().clear();
        useWishlist.getState().clear();
      }

      const saved = await loadSaved();
      if (cancelled || !saved) return;

      const wishlist = [...new Set([...saved.wishlist, ...useWishlist.getState().slugs])];
      const cart = mergeCart(saved.cart, useCart.getState().lines);
      useWishlist.setState({ slugs: wishlist });
      useCart.setState({ lines: cart });
      try { localStorage.setItem(OWNER_KEY, email); } catch {}
      synced.current = email;
      await saveSaved({ wishlist, cart });
    })().catch((e) => console.error("loadSaved failed", e));

    return () => { cancelled = true; };
  }, [email, checking]);

  // While signed in, save changes shortly after they happen.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const saveNow = () => {
      if (!synced.current) return;
      void saveSaved({
        wishlist: useWishlist.getState().slugs,
        cart: useCart.getState().lines,
      }).catch((e) => console.error("saveSaved failed", e));
    };

    const push = () => {
      if (!synced.current) return;
      clearTimeout(timer);
      timer = setTimeout(saveNow, SAVE_DELAY_MS);
    };

    // If the tab is hidden or closed while a save is waiting, save right away.
    const flush = () => {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
      saveNow();
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };

    const offCart = useCart.subscribe(push);
    const offWish = useWishlist.subscribe(push);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);

    return () => {
      offCart();
      offWish();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      clearTimeout(timer);
    };
  }, []);

  return null;
}