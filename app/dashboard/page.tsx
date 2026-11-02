import Link from "next/link";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatUSD } from "@/lib/format";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  await requireRole("shop", "/dashboard");
  const [products, lowStock, pending, revenue, unread, customers, recent] = await Promise.all([
    db.productOverlay.count({ where: { isActive: true } }),
    db.productOverlay.count({ where: { isActive: true, stock: { lte: 10 } } }),
    db.order.count({ where: { status: "pending" } }),
    db.order.aggregate({ _sum: { totalCents: true }, where: { paymentStatus: "paid" } }),
    db.message.count({ where: { isRead: false } }),
    db.user.count({ where: { role: "customer" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    { label: "Active products", value: products, href: "/dashboard/products" },
    { label: "Low stock (10 or fewer)", value: lowStock, href: "/dashboard/products", warn: lowStock > 0 },
    { label: "Pending orders", value: pending, href: "/dashboard/orders", warn: pending > 0 },
    { label: "Paid revenue", value: formatUSD(revenue._sum.totalCents ?? 0), href: "/dashboard/orders" },
    { label: "Unread messages", value: unread, href: "/dashboard/messages", warn: unread > 0 },
    { label: "Customers", value: customers, href: "/dashboard" },
  ];
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal as="li" key={c.label} delay={i * 70} dir="zoom">
            <Link href={c.href} className={`block rounded-card bg-card p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${c.warn ? "ring-2 ring-gold/60" : ""}`}>
              <p className="text-xs text-ink-soft">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-forest">{c.value}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
      <section className="rounded-card bg-card p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Latest orders</h2>
        {recent.length === 0 ? <p className="mt-3 text-sm text-ink-soft">No orders yet. They will appear here once checkout is live.</p> : (
          <ul className="mt-3 divide-y divide-black/5 text-sm">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <span><span className="font-medium">{o.number}</span> <span className="text-ink-soft">· {o.fullName}</span></span>
                <span className="flex items-center gap-3"><span className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-xs text-forest">{o.status}</span><span className="font-medium">{formatUSD(o.totalCents)}</span></span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
