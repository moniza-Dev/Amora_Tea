export const SITE = {
  name: "Amora-Tea",
  tagline: "Pure Taste · Better Living",
  coupon: "AMORATEA",
  // Read from a low-res design: confirm both values before Phase 4 shipping rules.
  freeShippingAboveUSD: 39,
  address: "123 Chroy Chongva, Phnom Penh, Cambodia",
  phone: "+855 10 369 158",
  email: "hello@amoratea.com",
  hours: "Mon-Sat: 9:00 AM - 7:00 PM",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/_sweetiesss_zunee_/", handle: "@_sweetiesss_zunee_" },
    { label: "Telegram", href: "https://t.me/chanmoniza_cheat", handle: "@chanmoniza_cheat" },
    { label: "Facebook", href: "https://www.facebook.com/moo.zaaz.56", handle: "moo.zaaz.56" },
    { label: "Messenger", href: "https://m.me/moo.zaaz.56", handle: "moo.zaaz.56" },
  ],
  // ABA KHQR (scan with ABA Mobile or any Bakong-enabled banking app). The QR has no fixed amount: customers type the order total.
  payment: {
    accountName: "CHANMONIZA CHEAT",
    bank: "ABA Bank",
    khr: "004 792 578",
    usd: "004 792 349",
    qr: "/payments/aba-khqr.png",
    qrFull: "/payments/aba-khqr-full.png",
    proofTo: "https://t.me/chanmoniza_cheat",
  },
} as const;

// Brand photography slots. Set to a /public path (e.g. "/images/hero.jpg") once photos are uploaded.
export const IMAGES: { hero: string | null; garden: string | null } = { hero: null, garden: null };

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", menu: "shop" },
  { label: "Tea Collections", href: "/collections", menu: "collections" },
  { label: "Gifts & Sets", href: "/gifts" },
  { label: "Our Story", href: "/our-story" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
] as const;
