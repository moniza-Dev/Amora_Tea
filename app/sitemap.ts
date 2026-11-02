import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { HOME_CATEGORIES } from "@/lib/catalog";
import { INFO_PAGES } from "@/lib/info-pages";
import { abs } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    db.productOverlay.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true } }),
  ]);
  const fixed = [
    ["/", 1], ["/shop", 0.9], ["/collections", 0.8], ["/gifts", 0.8], ["/our-story", 0.6], ["/blog", 0.6], ["/contact", 0.5],
  ] as const;
  return [
    ...fixed.map(([p, priority]) => ({ url: abs(p), changeFrequency: "weekly" as const, priority })),
    ...HOME_CATEGORIES.map((c) => ({ url: abs(`/collections/${c.key}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: abs(`/shop/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...Object.keys(INFO_PAGES).map((k) => ({ url: abs(`/${k}`), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
