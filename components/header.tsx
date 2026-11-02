"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";
import { selectCartCount, useCart } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { useSession, type ClientUser } from "@/lib/use-session";
import { logoutAction } from "@/app/auth-actions";
import { Logo } from "./logo";
import { WishlistLink } from "./wishlist-link";
import { ArrowIcon, CartIcon, ChevronIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";

export interface NavCategory { key: string; label: string }
interface MenuLink { label: string; href: string }

/** Hover/focus dropdown. Pure CSS (see .nav-item in globals.css): a hover bridge, a short close delay and staggered items keep it smooth. */
function Panel({ items, align = "left" }: { items: MenuLink[]; align?: "left" | "right" }) {
  return (
    <div className={`nav-panel ${align === "right" ? "right-0" : "left-0"}`}>
      <ul className="nav-panel-inner" role="menu">
        {items.map((m, i) => (
          <li key={m.href} style={{ "--i": i } as React.CSSProperties} role="none">
            <Link href={m.href} role="menuitem" className="nav-sub">{m.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccountMenu({ user }: { user: ClientUser | null | undefined }) {
  const href = user ? (user.role === "shop" ? "/dashboard" : "/account") : "/login";
  const label = user ? (user.role === "shop" ? "Shop dashboard" : "My account") : "Sign in";
  return (
    <div className="nav-item relative">
      <Link href={href} aria-label={label} className="icon-btn relative">
        <UserIcon />
        {user && <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-leaf ring-2 ring-card" aria-hidden />}
      </Link>
      <div className="nav-panel right-0">
        <div className="nav-panel-inner w-56">
          {user ? (
            <>
              <div className="px-3 pb-2 pt-1" style={{ "--i": 0 } as React.CSSProperties}>
                <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
                <p className="mt-0.5 inline-block rounded-full bg-leaf-soft px-2 py-0.5 text-[11px] font-medium text-forest">{user.role === "shop" ? "Shop account" : "Customer"}</p>
              </div>
              <ul role="menu">
                <li style={{ "--i": 1 } as React.CSSProperties} role="none"><Link href={href} role="menuitem" className="nav-sub">{user.role === "shop" ? "Dashboard" : "My account & orders"}</Link></li>
                {user.role === "shop" && <li style={{ "--i": 2 } as React.CSSProperties} role="none"><Link href="/dashboard/orders" role="menuitem" className="nav-sub">Orders</Link></li>}
                <li style={{ "--i": 3 } as React.CSSProperties} role="none">
                  <form action={logoutAction}><button role="menuitem" className="nav-sub w-full text-left hover:!text-danger">Sign out</button></form>
                </li>
              </ul>
            </>
          ) : (
            <ul role="menu">
              <li style={{ "--i": 0 } as React.CSSProperties} role="none"><Link href="/login" role="menuitem" className="nav-sub">Sign in</Link></li>
              <li style={{ "--i": 1 } as React.CSSProperties} role="none"><Link href="/register" role="menuitem" className="nav-sub">Create account</Link></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const count = useCart(selectCartCount);
  const user = useSession();

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [pathname]);

  // Close the mobile menu after navigating (state adjusted during render, not in an effect), and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); setSub(null); }
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      (document.activeElement as HTMLElement | null)?.blur(); // closes focus-within dropdowns
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const menuFor = (menu?: string): MenuLink[] =>
    menu === "shop"
      ? [{ label: "All Products", href: "/shop" }, ...categories.map((c) => ({ label: c.label, href: `/shop?category=${c.key}` }))]
      : menu === "collections"
        ? categories.map((c) => ({ label: c.label, href: `/collections/${c.key}` }))
        : [];

  return (
    <header className={`sticky top-0 z-40 border-b border-black/5 bg-card/90 backdrop-blur-md transition-[box-shadow,background-color] duration-300 ${scrolled || open ? "bg-card/95 shadow-soft" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 text-sm lg:flex">
          {NAV.map((item) => {
            const items = menuFor("menu" in item ? item.menu : undefined);
            return (
              <div key={item.href} className="nav-item relative">
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} aria-haspopup={items.length ? "menu" : undefined} className="nav-link flex items-center gap-1 px-3.5 py-2">
                  <span className="nav-label">{item.label}</span>
                  {items.length > 0 && <ChevronIcon width={14} height={14} className="nav-chev" />}
                </Link>
                {items.length > 0 && <Panel items={items} />}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <Link href="/search" aria-label="Search" className="icon-btn"><SearchIcon /></Link>
          <AccountMenu user={user} />
          <WishlistLink />
          <Link href="/cart" aria-label={`Cart${mounted && count ? `, ${count} items` : ""}`} className="icon-btn relative">
            <CartIcon />
            {mounted && count > 0 && (
              <span key={count} className="animate-pop absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-forest px-1 text-[10px] font-semibold leading-4 text-white">{count}</span>
            )}
          </Link>
          <Link href="/shop" className="btn-press group ml-1 hidden items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-dark sm:inline-flex">
            Order Now <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button type="button" className="icon-btn lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <span className="relative grid size-6 place-items-center">
              <span className={`absolute transition duration-300 ${open ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100"}`}><MenuIcon /></span>
              <span className={`absolute transition duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}><CloseIcon /></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu: always mounted so it can animate height (grid-rows 0fr -> 1fr) */}
      <div id="mobile-menu" className={`mobile-menu lg:hidden ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile" className="overflow-hidden">
          <div className="border-t border-black/5 px-4 pb-5 pt-2">
            <ul className="flex flex-col">
              {NAV.map((item, i) => {
                const items = menuFor("menu" in item ? item.menu : undefined);
                const expanded = sub === item.href;
                return (
                  <li key={item.href} className="mobile-item border-b border-black/5" style={{ "--i": i } as React.CSSProperties}>
                    <div className="flex items-center justify-between">
                      <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`flex-1 py-3 transition-colors ${isActive(item.href) ? "font-medium text-forest" : "hover:text-forest"}`}>{item.label}</Link>
                      {items.length > 0 && (
                        <button type="button" aria-label={`${expanded ? "Hide" : "Show"} ${item.label} menu`} aria-expanded={expanded} onClick={() => setSub(expanded ? null : item.href)} className="grid size-10 place-items-center rounded-full hover:bg-leaf-soft">
                          <ChevronIcon width={18} height={18} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {items.length > 0 && (
                      <div className={`mobile-sub ${expanded ? "is-open" : ""}`} inert={!expanded}>
                        <ul className="overflow-hidden pl-3">
                          {items.map((m) => <li key={m.href}><Link href={m.href} className="block py-2 text-sm text-ink-soft transition-colors hover:text-forest">{m.label}</Link></li>)}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mobile-item mt-4 flex flex-wrap items-center gap-3" style={{ "--i": NAV.length } as React.CSSProperties}>
              <Link href="/shop" className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white">Order Now <ArrowIcon width={16} height={16} /></Link>
              <Link href="/wishlist" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:border-forest hover:text-forest">Favorites</Link>
              {user ? (
                <Link href={user.role === "shop" ? "/dashboard" : "/account"} className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:border-forest hover:text-forest">{user.role === "shop" ? "Shop dashboard" : "My account"}</Link>
              ) : (
                <Link href="/login" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:border-forest hover:text-forest">Sign in</Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div ref={bar} className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-leaf to-gold" aria-hidden />
    </header>
  );
}