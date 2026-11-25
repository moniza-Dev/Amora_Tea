import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DashNav } from "@/components/dash-nav";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Shop Dashboard", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireRole("shop", "/dashboard");
  const [unread, pendingOrders] = await Promise.all([
    db.message.count({ where: { isRead: false } }),
    db.order.count({ where: { status: "pending" } }),
  ]);
  return (
    <>
      <PageHero title="Shop Dashboard" subtitle={`Signed in as ${user.name ?? user.email} · Shop account`} crumbs={[{ label: "Dashboard" }]} />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <DashNav unread={unread} pendingOrders={pendingOrders} />
        {children}
      </div>
    </>
  );
}