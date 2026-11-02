import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  subject: z.string().trim().max(150).optional(),
  body: z.string().trim().min(5).max(4000),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, message: "Please fill in your name, a valid email and a message." }, { status: 400 });
  await db.message.create({ data: { ...parsed.data, email: parsed.data.email.toLowerCase() } });
  return Response.json({ ok: true, message: "Thank you! We'll get back to you soon." });
}
