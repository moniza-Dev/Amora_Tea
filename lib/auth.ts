import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type Role = "customer" | "shop";
export interface SessionUser { id: string; name: string | null; email: string; role: Role; phone: string | null }

const COOKIE = "amora_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set (16+ chars) in production.");
  return "dev-only-secret-change-me-amora-tea";
}
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function pack(uid: string, exp: number) {
  const body = Buffer.from(JSON.stringify({ uid, exp })).toString("base64url");
  return `${body}.${sign(body)}`;
}
function unpack(token: string | undefined): { uid: string; exp: number } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = Buffer.from(sign(body));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    return typeof data.uid === "string" && typeof data.exp === "number" && data.exp > Date.now() / 1000 ? data : null;
  } catch { return null; }
}

export async function startSession(userId: string) {
  (await cookies()).set(COOKIE, pack(userId, Math.floor(Date.now() / 1000) + MAX_AGE), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE,
  });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

/** Current user, re-read from the DB on every call so role changes and deletions take effect immediately. */
export async function getUser(): Promise<SessionUser | null> {
  const data = unpack((await cookies()).get(COOKIE)?.value);
  if (!data) return null;
  const u = await db.user.findUnique({ where: { id: data.uid }, select: { id: true, name: true, email: true, role: true, phone: true } });
  return u ? { ...u, role: u.role === "shop" ? "shop" : "customer" } : null;
}

export const homeFor = (role: Role) => (role === "shop" ? "/dashboard" : "/account");

/** Server-side gate for pages and actions. Customers hitting a shop page are sent to their own area, never shown shop data. */
export async function requireRole(role: Role, from = "/"): Promise<SessionUser> {
  const u = await getUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(from)}`);
  if (u.role !== role) redirect(homeFor(u.role));
  return u;
}

/** Only same-site relative paths are allowed as post-login targets (blocks open redirects). */
export const safeNext = (v: unknown) => (typeof v === "string" && /^\/(?!\/|\\)/.test(v) ? v : null);

/* Tiny in-memory throttle for login/register attempts (per key). Good enough for one node process. */
const hits = new Map<string, { n: number; reset: number }>();
export function tooMany(key: string, limit = 8, windowMs = 10 * 60_000) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + windowMs }); return false; }
  h.n += 1;
  return h.n > limit;
}
