import { db } from "@/lib/db";

/** Recompute ratingAvg/ratingCount from approved Review rows. Products with no reviews end at 0/0 (cards hide stars). */
export async function syncRatings(slug?: string) {
  const where = { isApproved: true, ...(slug ? { slug } : {}) };
  const agg = await db.review.groupBy({ by: ["slug"], where, _avg: { rating: true }, _count: { rating: true } });
  await db.productOverlay.updateMany({ where: slug ? { slug } : {}, data: { ratingAvg: 0, ratingCount: 0 } });
  for (const a of agg) {
    await db.productOverlay.update({
      where: { slug: a.slug },
      data: { ratingAvg: a._avg.rating ?? 0, ratingCount: a._count.rating },
    });
  }
}
