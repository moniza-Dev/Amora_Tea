"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { useSession } from "@/lib/use-session";
import { formatUSD } from "@/lib/format";
import { placeOrderAction, loadMyPhone } from "@/app/order-actions";
import { isValidPhone } from "@/lib/phone";
import { openTab } from "@/lib/open-tab";
import { ArrowIcon, CloseIcon, QrIcon } from "./icons";
import { PayDialog } from "./pay-dialog";

export interface CartCatalogItem { name: string; imageUrl: string; weights: { grams: number; priceCents: number }[]; fixedPriceCents: number | null }

interface OrderLine { slug: string; grams: number; quantity: number; name: string }

// Cash on Delivery confirmation panel
function CodPanel({ orderMessage, location, phone, orderLines, onPlaced }: {
  orderMessage: string;
  location: string;
  phone: string;
  orderLines: OrderLine[];
  onPlaced: (orderNumber: string) => void;
}) {
  const user = useSession(); // undefined = checking, null = signed out
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false); // stops a double click from creating two orders

  const fullMsg = [
    orderMessage,
    location && `📍 Delivery location: ${location}`,
    phone.trim() && `📞 Phone: ${phone.trim()}`,
  ].filter(Boolean).join("\n\n");
  const telegramHref = `https://t.me/chanmoniza_cheat?text=${encodeURIComponent(fullMsg)}`;
  const loc = location.trim();
  const canOrder = loc.length >= 3 && isValidPhone(phone) && !!user; // same rules as the server

  // The link opens Telegram right away (popup blockers allow it because it is a real click).
  // At the same time the order is saved, so the shop sees it in the dashboard.
  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // Telegram opens only after the order is saved
    if (!canOrder || busy.current) return;
    busy.current = true;
    setSaving(true);
    setError("");
    const tab = window.open("", "_blank"); // sent to Telegram below, only if the order is saved
    placeOrderAction({ method: "cod", location: loc, phone: phone.trim(), lines: orderLines })
      .then((res) => {
        if (res.ok) {
          openTab(tab, telegramHref);
          onPlaced(res.number);
        } else {
          tab?.close();
          busy.current = false;
          setSaving(false);
          setError(res.error);
        }
      })
      .catch(() => {
        tab?.close();
        busy.current = false;
        setSaving(false);
        setError("Could not save your order. Please try again.");
      });
  }

  return (
    <div className="mt-5 rounded-card border border-dashed border-leaf bg-leaf-soft p-5">
      <p className="font-semibold text-forest">Cash on Delivery</p>
      <p className="mt-1 text-xs text-ink-soft leading-relaxed">
        Place your order and pay in cash when our team delivers to you. Send us the details on Telegram to confirm.
      </p>
      {loc.length < 3 && (
        <p className="mt-2 text-xs font-medium text-danger">⚠️ Please enter your delivery location above first (at least 3 characters).</p>
      )}
      {!isValidPhone(phone) && (
        <p className="mt-2 text-xs font-medium text-danger">⚠️ Please enter a valid phone number above so we can call you for delivery.</p>
      )}
      {user === null && (
        <p className="mt-2 text-xs font-medium text-danger">⚠️ Please sign in first so we can save your order.</p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-danger">⚠️ {error}</p>}
      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-disabled={!canOrder}
        className={`btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition
          ${canOrder ? "bg-forest hover:bg-forest-dark" : "pointer-events-none cursor-not-allowed bg-ink-soft"}`}
      >
        {saving ? "Saving your order…" : "📦 Confirm Cash on Delivery"}
      </a>
    </div>
  );
}

export function CartView({ catalog, freeShippingCents }: { catalog: Record<string, CartCatalogItem>; freeShippingCents: number }) {
  const mounted = useMounted();
  const { lines, setQty, remove, clear } = useCart();
  const [location, setLocation] = useState("");
  const [payMethod, setPayMethod] = useState<"qr" | "cod">("qr");
  const [placed, setPlaced] = useState<string | null>(null); // order number once saved
  const [phone, setPhone] = useState("");

  // Prefill with the phone saved on the account (if any), without overwriting what the customer typed.
  useEffect(() => {
    loadMyPhone().then((p) => { if (p) setPhone((cur) => cur || p); }).catch(() => {});
  }, []);

  if (!mounted) return <div className="skeleton mx-auto my-12 h-48 max-w-3xl rounded-card" aria-busy />;

  if (placed) {
    return (
      <div className="animate-rise mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-display text-2xl">Thank you! Order {placed} received</p>
        <p className="mt-2 text-ink-soft">We&apos;ll confirm it shortly. Please make sure you pressed Send in Telegram.</p>
        <Link href="/shop" className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 font-medium text-white">Continue Shopping <ArrowIcon width={18} height={18} /></Link>
      </div>
    );
  }

  const rows = lines.flatMap((l) => {
    const c = catalog[l.slug];
    if (!c) return [];
    const unit = c.fixedPriceCents ?? c.weights.find((w) => w.grams === l.grams)?.priceCents ?? 0;
    return [{ ...l, c, unit }];
  });
  const subtotal = rows.reduce((n, r) => n + r.unit * r.quantity, 0);

  if (!rows.length) {
    return (
      <div className="animate-rise mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-display text-2xl">Your cart is empty</p>
        <p className="mt-2 text-ink-soft">A good cup is waiting for you.</p>
        <Link href="/shop" className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 font-medium text-white">Start Shopping <ArrowIcon width={18} height={18} /></Link>
      </div>
    );
  }
  const remaining = Math.max(0, freeShippingCents - subtotal);
  const orderMessage = [
    payMethod === "cod" ? "Hello Amora-Tea! I would like to order (Cash on Delivery)." : "Hello Amora-Tea! I paid via ABA KHQR.",
    ...rows.map((r) => `• ${r.quantity} × ${r.c.name}${r.grams > 0 ? ` (${r.grams}g)` : ""} — ${formatUSD(r.unit * r.quantity)}`),
    `Total: ${formatUSD(subtotal)}`,
  ].join("\n");
  const orderLines: OrderLine[] = rows.map((r) => ({ slug: r.slug, grams: r.grams, quantity: r.quantity, name: r.c.name.slice(0, 120) }));

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-4">
        {rows.map((r, i) => (
          <li key={`${r.slug}-${r.grams}`} style={{ animationDelay: `${i * 70}ms` }} className="animate-rise flex gap-4 rounded-card bg-card p-4 shadow-soft">
            <Link href={`/shop/${r.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-tile bg-sand/70"><Image src={r.c.imageUrl} alt={r.c.name} fill sizes="96px" className="object-cover" /></Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <div><Link href={`/shop/${r.slug}`} className="font-medium hover:text-forest">{r.c.name}</Link>{r.grams > 0 && <p className="text-xs text-ink-soft">{r.grams}g</p>}</div>
                <button type="button" onClick={() => remove(r.slug, r.grams)} aria-label={`Remove ${r.c.name}`} className="grid size-8 place-items-center rounded-full hover:bg-leaf-soft active:scale-90"><CloseIcon width={16} height={16} /></button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center rounded-full border border-black/10">
                  <button type="button" aria-label="Decrease" onClick={() => setQty(r.slug, r.grams, r.quantity - 1)} className="size-9 rounded-full hover:bg-leaf-soft active:scale-90">−</button>
                  <span className="w-7 text-center text-sm">{r.quantity}</span>
                  <button type="button" aria-label="Increase" onClick={() => setQty(r.slug, r.grams, r.quantity + 1)} className="size-9 rounded-full hover:bg-leaf-soft active:scale-90">+</button>
                </div>
                <p key={r.quantity} className="animate-pop font-semibold">{formatUSD(r.unit * r.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
        <li><button type="button" onClick={clear} className="text-sm text-ink-soft hover:text-danger">Clear cart</button></li>
      </ul>

      <aside className="h-fit rounded-panel bg-[#f3ece3] p-6 lg:sticky lg:top-24 space-y-4">
        <h2 className="font-display text-xl font-semibold">Order Summary</h2>
        <p className="flex justify-between"><span>Subtotal</span><span key={subtotal} className="animate-pop font-semibold">{formatUSD(subtotal)}</span></p>
        <p className="text-xs text-ink-soft">Shipping and discounts are calculated at checkout.</p>
        <div className="h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={Math.min(100, Math.round((subtotal / freeShippingCents) * 100))} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
          <div className="h-full rounded-full bg-leaf transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / freeShippingCents) * 100)}%` }} />
        </div>
        <p className="text-xs text-ink-soft">{remaining ? `Add ${formatUSD(remaining)} more for free shipping` : "You've unlocked free shipping 🎉"}</p>

        {/* ── Delivery Location ── */}
        <div>
          <label htmlFor="delivery-location" className="mb-1.5 block text-sm font-medium text-ink">
            📍 Delivery Location <span className="text-danger">*</span>
          </label>
          <textarea
            id="delivery-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your address, district or landmark so we can deliver to you…"
            rows={3}
            className="w-full resize-none rounded-tile border border-black/10 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-soft/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          {!location && (
            <p className="mt-1 text-[11px] text-ink-soft">Required for delivery confirmation.</p>
          )}
        </div>

        {/* ── Phone ── */}
        <div>
          <label htmlFor="order-phone" className="mb-1.5 block text-sm font-medium text-ink">
            📞 Phone Number <span className="text-danger">*</span>
          </label>
          <input
            id="order-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 010 569 063 or +855 10 569 063"
            className="w-full rounded-tile border border-black/10 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          {phone && !isValidPhone(phone) && (
            <p className="mt-1 text-[11px] text-danger">Use digits only, 8 to 20 characters (a leading + is fine).</p>
          )}
          {!phone && (
            <p className="mt-1 text-[11px] text-ink-soft">Our delivery team will call this number.</p>
          )}
        </div>

        {/* ── Payment Method Toggle ── */}
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="pay-qr-tab"
              onClick={() => setPayMethod("qr")}
              className={`flex flex-col items-center gap-1 rounded-tile border-2 py-3 text-xs font-semibold transition
                ${payMethod === "qr" ? "border-forest bg-forest text-white" : "border-black/10 bg-white text-ink hover:border-forest"}`}
            >
              <span className="text-xl">📱</span>
              QR / ABA KHQR
            </button>
            <button
              type="button"
              id="pay-cod-tab"
              onClick={() => setPayMethod("cod")}
              className={`flex flex-col items-center gap-1 rounded-tile border-2 py-3 text-xs font-semibold transition
                ${payMethod === "cod" ? "border-forest bg-forest text-white" : "border-black/10 bg-white text-ink hover:border-forest"}`}
            >
              <span className="text-xl">💵</span>
              Cash on Delivery
            </button>
          </div>
        </div>

        {/* ── Payment action ── */}
        {payMethod === "qr" ? (
          <div>
            <PayDialog amountCents={subtotal} order={{ location, phone, lines: orderLines, onPlaced: (number) => { setPlaced(number); clear(); } }} orderMessage={location ? `${orderMessage}\n\n📍 Delivery: ${location}` : orderMessage} className="btn-press flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white hover:bg-forest-dark">
              <QrIcon width={20} height={20} /> Pay with ABA KHQR
            </PayDialog>
            <p className="mt-2 text-center text-xs text-ink-soft">Scan, pay, then send us the screenshot.</p>
          </div>
        ) : (
          <CodPanel
            orderMessage={orderMessage}
            location={location}
            phone={phone}
            orderLines={orderLines}
            onPlaced={(number) => { setPlaced(number); clear(); }}
          />
        )}
      </aside>
    </div>
  );
}