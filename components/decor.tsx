import type { CSSProperties } from "react";

/** Decorative leaf sprig (placeholder until brand photography is uploaded). */
export function LeafSprig({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M60 158V40" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M60 40C40 30 36 10 60 2c24 8 20 28 0 38Z" />
      <path d="M60 80C32 76 20 56 30 38c26 2 38 18 30 42Z" opacity=".85" />
      <path d="M60 100c28-4 42-24 32-42-26 2-38 18-32 42Z" opacity=".75" />
      <path d="M60 135C38 134 22 120 26 102c22 0 36 12 34 33Z" opacity=".65" />
    </svg>
  );
}
