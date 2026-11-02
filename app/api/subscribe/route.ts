import { z } from "zod";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

const schema = z.object({ email: z.email().max(254) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  await db.subscriber.upsert({ where: { email }, create: { email }, update: {} });
  // Same reply for new and existing subscribers (no email enumeration). Welcome email is wired in Phase 4+.
  return Response.json({ ok: true, message: `You're in! Use code ${SITE.coupon} for 10% off your first order.` });
}
