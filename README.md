# Amora-Tea

Tea e-commerce site (Next.js 16, Prisma 7 + SQLite, Tailwind v4). Phnom Penh, Cambodia.

## Setup

```bash
cp .env.example .env        # then edit values
npm i
npx prisma db push
npm run db:generate
npm run seed
npm run dev                 # http://localhost:3000
```

Put the Tea API snapshot files in `data/api/*.json` before seeding (`teas.json`, `categories.json`, ...).

### Windows: better-sqlite3

npm blocks install scripts by default, so the native `better-sqlite3` build is skipped. If you see a bindings error, run:

```bash
npm install-scripts approve better-sqlite3
npm rebuild better-sqlite3
```

### Notes

- Re-running `npm run seed` is safe: it never overwrites admin edits to images, Khmer names or tags.
- Ratings on cards come only from approved `Review` rows. With no reviews, stars and counts are hidden.
- Khmer product names are optional; the UI falls back to English when `nameKm` is empty.

## Roles

Two roles, stored in `User.role`:

| Role | Who | Lands on | Can do |
| --- | --- | --- | --- |
| `customer` | anyone who registers at `/register` | `/account` | see own orders, edit profile, change password |
| `shop` | the shop owner/staff (created by the seed, never by public sign-up) | `/dashboard` | edit prices/stock/visibility, update order and payment status, read messages |

- Sessions are an HMAC-signed, httpOnly cookie (`lib/auth.ts`); the user and role are re-read from the DB on every request.
- Every dashboard page and server action re-checks the role itself. A customer opening `/dashboard` is redirected to `/account`.
- Set `AUTH_SECRET` (required in production) and `SHOP_EMAIL` / `SHOP_PASSWORD` in `.env`, then `npm run seed`.
- Dev-only demo logins after seeding: `shop@amoratea.com` / `ChangeMe123!` and `customer@amoratea.com` / `Customer123!`.
- Existing databases: the seed converts old `admin` users to `shop`.

## SEO

Metadata and Open Graph in `app/layout.tsx` and each page, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, JSON-LD (Organization, WebSite, Product, BlogPosting, BreadcrumbList) via `components/json-ld.tsx`. Set `NEXT_PUBLIC_SITE_URL` to the real domain before deploying so canonical URLs and the sitemap are correct. Cart, pay, search, login, account and dashboard are `noindex`.

(Full README: Phase 6.)
