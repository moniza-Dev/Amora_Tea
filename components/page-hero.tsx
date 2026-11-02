import Link from "next/link";
import { LeafSprig } from "./decor";

export function PageHero({ title, subtitle, crumbs = [] }: { title: string; subtitle?: string; crumbs?: { label: string; href?: string }[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-cream via-leaf-soft to-leaf/30">
      <LeafSprig className="absolute -right-4 -top-4 -z-10 w-32 animate-sway text-leaf/40 [--r:20deg]" />
      <LeafSprig className="absolute bottom-0 left-8 -z-10 w-20 animate-float text-forest/20 max-sm:hidden" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="animate-rise text-xs text-ink-soft">
          <Link href="/" className="hover:text-forest">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}> / {c.href ? <Link href={c.href} className="hover:text-forest">{c.label}</Link> : <span className="text-ink">{c.label}</span>}</span>
          ))}
        </nav>
        <h1 className="animate-rise mt-3 font-display text-3xl font-bold text-forest [animation-delay:100ms] sm:text-5xl">{title}</h1>
        {subtitle && <p className="animate-rise mt-3 max-w-xl text-ink-soft [animation-delay:200ms]">{subtitle}</p>}
      </div>
    </section>
  );
}
