import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amora-Tea",
    short_name: "Amora Tea",
    description: "Premium organic teas from Phnom Penh, Cambodia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e7",
    theme_color: "#1f4d2b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
