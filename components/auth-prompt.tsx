"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthGate } from "@/lib/auth-gate";

/** Renders nothing until a guest tries to add to cart or favorites. */
export function AuthPrompt() {
  const open = useAuthGate((s) => s.promptOpen);
  const close = useAuthGate((s) => s.closePrompt);
  const pathname = usePathname();
  const next = encodeURIComponent(pathname || "/");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-rise w-full max-w-sm rounded-panel bg-card p-6 text-center shadow-soft"
      >
        <h2 id="auth-prompt-title" className="font-display text-xl font-semibold text-forest">Sign in to continue</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Please sign in or create an account first to add teas to your cart or favorites.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href={`/login?next=${next}`}
            onClick={close}
            className="btn-press rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark"
          >
            Sign in
          </Link>
          <Link
            href={`/register?next=${next}`}
            onClick={close}
            className="btn-press rounded-full border border-forest px-6 py-3 text-sm font-medium text-forest hover:bg-leaf-soft"
          >
            Create account
          </Link>
          <button type="button" onClick={close} className="py-2 text-sm text-ink-soft hover:text-forest">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}