import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatUSD } from "@/lib/format";
import { logoutAction } from "../auth-actions";
import { PageHero } from "@/components/page-hero";
import { ProfileForm, PasswordForm } from "@/components/account-forms";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireRole("customer", "/account");
  // Orders are matched by account id, or by the same email for orders placed before signing up.
  const orders = await db.order.findMany({ where: { OR: [{ userId: user.id }, { email: user.email }] }, orderBy: { createdAt: "desc" }, include: { items: true }, take: 50 });
  return (
    <>
      <PageHero title="My Account" subtitle={`Hello, ${user.name ?? user.email}. Customer account.`} crumbs={[{ label: "Account" }]} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="animate-rise rounded-panel bg-card p-6 shadow-soft" aria-labelledby="orders-h">
          <h2 id="orders-h" className="font-display text-xl font-semibold">My orders</h2>
          {orders.length === 0 ? (
            <div className="mt-6 text-center"><p className="text-ink-soft">You have no orders yet.</p><Link href="/shop" className="btn-press mt-4 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark">Start shopping</Link></div>
          ) : (
            <ul className="mt-4 divide-y divide-black/5">
              {orders.map((o) => (
                <li key={o.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">{o.number}</p><p className="font-medium">{formatUSD(o.totalCents)}</p></div>
                  <p className="text-sm text-ink-soft">{o.createdAt.toLocaleDateString("en-GB")} · <span className="rounded-full bg-leaf-soft px-2 py-0.5 text-xs text-forest">{o.status}</span> · payment {o.paymentStatus}</p>
                  <p className="mt-1 text-sm">{o.items.map((i) => `${i.name} ${i.grams ? `${i.grams}g ` : ""}×${i.quantity}`).join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="space-y-6">
          <section className="animate-rise rounded-panel bg-card p-6 shadow-soft [animation-delay:100ms]" aria-labelledby="prof-h"><h2 id="prof-h" className="mb-4 font-display text-xl font-semibold">Profile</h2><ProfileForm name={user.name ?? ""} phone={user.phone ?? ""} email={user.email} /></section>
          <section className="animate-rise rounded-panel bg-card p-6 shadow-soft [animation-delay:200ms]" aria-labelledby="pw-h"><h2 id="pw-h" className="mb-4 font-display text-xl font-semibold">Password</h2><PasswordForm /></section>
          <form action={logoutAction}><button className="w-full rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium transition hover:border-danger hover:text-danger">Sign out</button></form>
        </div>
      </div>
    </>
  );
}
