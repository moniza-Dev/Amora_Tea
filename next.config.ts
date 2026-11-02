import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Classic caching model (fetch revalidate / ISR). Cache Components is intentionally off.
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: { "/*": ["./data/api/**/*.json"] },
  images: {
    // Next.js 16 only allows listed quality values; 90 is used by the product cards.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;