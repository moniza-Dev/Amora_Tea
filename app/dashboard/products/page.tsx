import Image from "next/image";
import { requireRole } from "@/lib/auth";
import { getProducts } from "@/lib/catalog";
import { formatUSD } from "@/lib/format";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";
const field = "w-24 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10";

export default async function ProductsAdmin() {
  await requireRole("shop", "/dashboard/products");
  const products = await getProducts({ includeInactive: true });
  return (
    <section className="space-y-3">
      <p className="text-sm text-ink-soft">{products.length} products. Prices are in USD; saving updates the storefront immediately.</p>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.slug} className="rounded-card bg-card p-4 shadow-soft">
            <form action={updateProductAction} className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <input type="hidden" name="slug" value={p.slug} />
              <div className="flex min-w-56 flex-1 items-center gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-sand"><Image src={p.imageUrl} alt="" fill sizes="48px" className="object-cover" /></span>
                <span className="min-w-0"><span className="block truncate text-sm font-medium">{p.name}</span><span className="text-xs text-ink-soft">{p.sku} · from {formatUSD(p.priceCents)}</span></span>
              </div>
              {p.kind === "gift_set" ? (
                <label className="text-xs text-ink-soft">Set price $<input name="price_set" defaultValue={(p.priceCents / 100).toFixed(2)} inputMode="decimal" className={`${field} ml-1`} /></label>
              ) : p.weights.map((w) => (
                <label key={w.grams} className="text-xs text-ink-soft">{w.grams}g $<input name={`price_${w.grams}`} defaultValue={(w.priceCents / 100).toFixed(2)} inputMode="decimal" className={`${field} ml-1`} /></label>
              ))}
              <label className="text-xs text-ink-soft">Stock <input name="stock" type="number" min={0} defaultValue={p.stock} className={`${field} ml-1 w-20 ${p.stock <= 10 ? "border-gold" : ""}`} /></label>
              {([["isActive", "Active", p.isActive], ["isBestseller", "Bestseller", p.isBestseller], ["isFeatured", "Featured", p.isFeatured]] as const).map(([n, label, v]) => (
                <label key={n} className="flex items-center gap-1.5 text-xs"><input type="checkbox" name={n} defaultChecked={v} className="size-4 accent-forest" />{label}</label>
              ))}
              <button className="btn-press rounded-full bg-forest px-4 py-2 text-xs font-medium text-white hover:bg-forest-dark">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
