import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CustomersAdmin() {
  await requireRole("shop", "/dashboard/customers");
  const customers = await db.user.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { orders: true } } },
  });
  if (!customers.length) return <p className="rounded-card bg-card p-8 text-center text-ink-soft shadow-soft">No customers yet. New accounts will show up here.</p>;
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-soft">{customers.length} customer{customers.length === 1 ? "" : "s"}, newest first</p>
      <ul className="space-y-3">
        {customers.map((c) => (
          <li key={c.id} className="rounded-card bg-card p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm"><span className="font-medium">{c.name || "No name"}</span> · <a href={`mailto:${c.email}`} className="link-underline text-forest">{c.email}</a></p>
              <p className="text-xs text-ink-soft">Joined {c.createdAt.toLocaleString("en-GB")}</p>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{c.phone || "No phone saved"} · {c._count.orders} order{c._count.orders === 1 ? "" : "s"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}