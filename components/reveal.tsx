"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Dir = "up" | "left" | "right" | "zoom";

/** Fades/slides children in when they scroll into view. `delay` (ms) staggers siblings. */
export function Reveal({ children, as: Tag = "div", dir = "up", delay = 0, className = "" }: {
  children: ReactNode; as?: ElementType; dir?: Dir; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.setAttribute("data-in", ""); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal={dir === "up" ? "" : dir} style={{ "--d": `${delay}ms` } as React.CSSProperties} className={className}>
      {children}
    </Tag>
  );
}
