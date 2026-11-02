import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { PageHero } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-grid";
import { SearchIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";
  const needle = q.toLowerCase();
  const results = needle
    ? (await getProducts()).filter((p) => [p.name, p.description, ...p.tags, p.tea?.tea_type?.name ?? "", ...(p.tea?.characteristics.map((c) => c.name) ?? [])].join(" ").toLowerCase().includes(needle))
    : [];
  return (
    <>
      <PageHero title="Search" crumbs={[{ label: "Search" }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <form action="/search" role="search" className="animate-rise mx-auto flex max-w-xl gap-2">
          <label htmlFor="q" className="sr-only">Search teas</label>
          <input id="q" name="q" defaultValue={q} placeholder="Search green, chamomile, cinnamon…" autoFocus className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-forest" />
          <button className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white"><SearchIcon width={18} height={18} />Search</button>
        </form>
        {q && <p className="mt-8 text-sm text-ink-soft" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        {q && <div className="mt-4"><ProductGrid products={results} /></div>}
      </section>
    </>
  );
}
