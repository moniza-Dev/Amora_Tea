import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Lightweight session probe for the client header (keeps public pages statically cacheable). */
export async function GET() {
  const u = await getUser();
  return Response.json(u ? { user: { name: u.name, email: u.email, role: u.role } } : { user: null }, { headers: { "Cache-Control": "no-store" } });
}
