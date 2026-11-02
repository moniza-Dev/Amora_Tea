# Amora-Tea: project rules (persist across sessions)

Tea e-commerce site for **Amora-Tea** ("Pure Taste · Better Living"), Phnom Penh, Cambodia.
Match `design/homepage.png` exactly. Stack: Next.js 16 (App Router) + TypeScript + Tailwind v4, Zustand cart (localStorage),
Prisma 7 + SQLite (better-sqlite3 adapter), NextAuth (email + Google), Stripe Checkout, Cash on Delivery, KHQR/Bakong with proof upload.
Mobile-first. English + Khmer (Noto Sans Khmer).

## How to work
- Work phase by phase (1 Setup/schema/API/seed, 2 Layout+homepage, 3 Shop/PDP/collections/search/wishlist, 4 Cart/checkout/payments/track,
  5 Auth/account/admin, 6 Blog/static pages/gifts/SEO/README).
- After each phase: run the app, fix errors, give a 3-line summary, then STOP and wait for "continue".
- Concise, reusable code. Don't re-explain things that weren't asked about.

## Roles & auth
- Exactly two roles: `customer` (default, public sign-up) and `shop` (seed only). No NextAuth: custom signed-cookie sessions in `lib/auth.ts`; always gate with `requireRole()` in pages AND server actions.
- Header reads the session from `/api/me` on the client so public pages stay statically cached.

## Data rules
- Tea API data lives in `data/api/*.json` (local snapshot = source of truth). `lib/tea-api.ts` reads it; live fetch (24h ISR) only when `TEA_API_LIVE=1`, always falling back to the snapshot. Never guess API field names; types are in `lib/tea-types.ts`.
- The API has no prices/stock/images/reviews. `ProductOverlay` (keyed by slug, nullable `teaSlug` for custom products and gift sets) supplies them. Merge via `lib/catalog.ts#getProducts`. Prefer overlay `imageUrl`, fall back to API `image_url`, then `/placeholder-tea.svg`.
- Money = integer cents (USD). Always recalculate prices, coupons, shipping and stock **server-side**; never trust client totals.
- Homepage/collection categories are defined once in `lib/catalog.ts` (`HOME_CATEGORIES`).
- Seed prices are placeholders; real brand photos will be uploaded later (slots in `lib/site.ts#IMAGES`).
- Ratings: `ratingAvg/ratingCount` are a cache of approved `Review` rows (`lib/ratings.ts#syncRatings`). Seed no fake reviews. Hide stars and counts on every card/page when `ratingCount` is 0.
- Exactly 5 bestsellers (green, black, chamomile, cinnamon, berry) matching `design/homepage.png`, priced from $29.99 (50g). Seed re-applies this on every run.
- Khmer names (`nameKm`) stay empty for now; always render via `displayName()` (falls back to English).
- Client components must never import `lib/catalog.ts` values (it pulls in the db); use `import type` or `lib/format.ts`.

## Design tokens (app/globals.css)
forest #1F4D2B, leaf #5A9A3A, cream #F6F1E7, card #FBF9F4, ink #25302A, gold #C9A24B. Playfair Display (headings, italic for taglines), DM Sans (body), Dancing Script (handwritten stickers). Radii 16-24px, pill buttons, round category icons, soft shadows.

## Next.js 16 notes
- Cache Components is OFF (classic `fetch` revalidate / ISR). Route handlers and pages use `PageProps`/`LayoutProps` helpers; `params` is a Promise.
- Images allowed from commons.wikimedia.org, upload.wikimedia.org, images.unsplash.com (see next.config.ts).
- Prisma client is generated to `lib/generated/prisma` (import from `@/lib/generated/prisma/client`). Run `npx prisma db push` then `npm run seed`.
