"use client";
import { useState, useRef } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";

const PAGE_SIZE = 12;

function PageButton({
  active,
  onClick,
  children,
  disabled,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`grid min-w-9 place-items-center rounded-full px-3 py-1.5 text-sm font-medium transition duration-200
        ${active ? "bg-forest text-white shadow-soft" : "border border-black/10 bg-card hover:border-forest hover:text-forest"}
        disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  if (!products.length)
    return (
      <p className="py-16 text-center text-ink-soft">
        No teas found. Try another filter.
      </p>
    );

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = products.slice(start, start + PAGE_SIZE);

  function goTo(p: number) {
    setPage(p);
    // Scroll to top of grid smoothly
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  }

  // Build page numbers with ellipsis
  function pageNums(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | "…")[] = [1];
    if (page > 3) nums.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
    if (page < totalPages - 2) nums.push("…");
    nums.push(totalPages);
    return nums;
  }

  return (
    <div>
      <div ref={topRef} className="scroll-mt-28" />
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-live="polite">
        {visible.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={(i % 5) * 80}>
            <ProductCard product={p} priority={i < 4} />
          </Reveal>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav aria-label="Product pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <PageButton onClick={() => goTo(page - 1)} disabled={page === 1} label="Previous page">
            ‹ Prev
          </PageButton>

          {pageNums().map((n, i) =>
            n === "…" ? (
              <span key={`ell-${i}`} className="px-1 text-ink-soft">…</span>
            ) : (
              <PageButton key={n} active={page === n} onClick={() => goTo(n as number)} label={`Page ${n}`}>
                {n}
              </PageButton>
            )
          )}

          <PageButton onClick={() => goTo(page + 1)} disabled={page === totalPages} label="Next page">
            Next ›
          </PageButton>
        </nav>
      )}

      {/* Item count hint */}
      <p className="mt-4 text-center text-xs text-ink-soft">
        Showing {start + 1}–{Math.min(start + PAGE_SIZE, products.length)} of {products.length} teas
      </p>
    </div>
  );
}
