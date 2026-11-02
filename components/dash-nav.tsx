"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/messages", label: "Messages" },
];

export function DashNav({ unread }: { unread: number }) {
  const path = usePathname();
  return (
    <nav aria-label="Dashboard" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1">
      {TABS.map((t) => {
        const active = t.href === "/dashboard" ? path === t.href : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${active ? "bg-forest text-white" : "text-ink hover:bg-leaf-soft hover:text-forest"}`}>
            {t.label}
            {t.label === "Messages" && unread > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-ink">{unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
