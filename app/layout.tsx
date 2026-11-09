import type { Metadata, Viewport } from "next";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/noto-sans-khmer";
import "@fontsource-variable/dancing-script";
import "./globals.css";
import { HOME_CATEGORIES } from "@/lib/catalog";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollTop } from "@/components/scroll-top";
import { JsonLd } from "@/components/json-ld";
import { SEO_DESCRIPTION, SEO_KEYWORDS, SITE_URL, organizationLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Amora-Tea | Premium Organic Tea from Phnom Penh", template: "%s | Amora-Tea" },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: "Amora-Tea",
  authors: [{ name: "Amora-Tea" }],
  creator: "Amora-Tea",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: "Amora-Tea", locale: "en_US", url: "/",
    title: "Amora-Tea | Pure Taste · Better Living", description: SEO_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Amora-Tea | Pure Taste · Better Living", description: SEO_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true, email: true },
  category: "shopping",
};

export const viewport: Viewport = { themeColor: "#1f4d2b", width: "device-width", initialScale: 1 };

// Only plain data crosses into the client Header (category matchers are functions).
const navCategories = HOME_CATEGORIES.map(({ key, label }) => ({ key, label }));

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The "js" class lets the scroll-reveal animations in globals.css work (see .js [data-reveal]).
    <html lang="en" className="js" suppressHydrationWarning>
      <head><JsonLd data={organizationLd()} /><JsonLd data={websiteLd()} /></head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
        <AnnouncementBar />
        <Header categories={navCategories} />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <ScrollTop />
      </body>
    </html>
  );
}