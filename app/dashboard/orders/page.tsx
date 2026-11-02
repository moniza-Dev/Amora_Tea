import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatUSD } from "@/lib/format";
import { updateOrderAction } from "../actions";

export const dynamic = "force-dynamic";
const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAY = ["pending", "paid", "failed", "refunded"];
const sel = "rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-forest";

export default async function OrdersAdmin() {
  await requireRole("shop", "/dashboard/orders");
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { items: true } });
  if (!orders.length) return <p className="rounded-card bg-card p-8 text-center text-ink-soft shadow-soft">No orders yet. Orders placed at checkout will show up here.</p>;
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="rounded-card bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{o.number} <span className="font-normal text-ink-soft">· {o.createdAt.toLocaleDateString("en-GB")}</span></p>
              <p className="text-sm text-ink-soft">{o.fullName} · {o.phone} · {o.paymentMethod.toUpperCase()}</p>
              <p className="mt-1 text-sm">{o.items.map((i) => `${i.name} ${i.grams ? `${i.grams}g ` : ""}×${i.quantity}`).join(", ")}</p>
            </div>
            <p className="font-display text-xl font-semibold text-forest">{formatUSD(o.totalCents)}</p>
          </div>
          <form action={updateOrderAction} className="mt-3 flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={o.id} />
            <select name="status" defaultValue={o.status} className={sel} aria-label="Order status">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <select name="paymentStatus" defaultValue={o.paymentStatus} className={sel} aria-label="Payment status">{PAY.map((s) => <option key={s}>{s}</option>)}</select>
            <button className="btn-press rounded-full bg-forest px-4 py-2 text-xs font-medium text-white hover:bg-forest-dark">Update</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
