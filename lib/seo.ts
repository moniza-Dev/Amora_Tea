import { SITE } from "@/lib/site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const abs = (path: string) => (/^https?:/.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export const SEO_DESCRIPTION =
  "Premium organic teas from Phnom Penh, Cambodia. Green, black, herbal, oolong, cinnamon, white and fruit teas, plus gift sets. A healthier, happier you, one cup at a time.";

export const SEO_KEYWORDS = [
  "Amora Tea", "Amora-Tea", "tea Cambodia", "tea Phnom Penh", "organic tea", "green tea", "black tea", "herbal tea",
  "oolong tea", "white tea", "fruit infusion", "detox tea", "tea gift set", "buy tea online Cambodia",
];

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE_URL,
  logo: abs("/icons/icon-512.png"),
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", streetAddress: "123 Chroy Chongva", addressLocality: "Phnom Penh", addressCountry: "KH" },
  sameAs: SITE.social.map((s) => s.href),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE_URL,
  potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
});
