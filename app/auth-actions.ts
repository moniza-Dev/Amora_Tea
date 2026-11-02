"use server";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { endSession, getUser, homeFor, safeNext, startSession, tooMany } from "@/lib/auth";

export interface FormState { error?: string; ok?: string }

const ip = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
// Pre-computed hash so a missing account takes as long as a wrong password (no user enumeration by timing).
const DUMMY = bcrypt.hashSync("not-a-real-password", 12);

const loginSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(200) });

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: String(fd.get("email") ?? "").trim().toLowerCase(), password: fd.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and your password." };
  const { email, password } = parsed.data;
  if (tooMany(`login:${await ip()}:${email}`)) return { error: "Too many attempts. Please wait a few minutes and try again." };

  const user = await db.user.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY);
  if (!user || !user.passwordHash || !ok) return { error: "Incorrect email or password." };

  await startSession(user.id);
  redirect(safeNext(fd.get("next")) ?? homeFor(user.role === "shop" ? "shop" : "customer"));
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Enter a valid email.").max(254),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

/** Public sign-up always creates a customer. The shop role can only be granted through the seed/DB. */
export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: fd.get("name"), email: String(fd.get("email") ?? "").trim().toLowerCase(), phone: String(fd.get("phone") ?? "") || undefined, password: fd.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (tooMany(`register:${await ip()}`, 5, 60 * 60_000)) return { error: "Too many sign-ups from this network. Please try again later." };
  const { name, email, phone, password } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) return { error: "An account with this email already exists. Try signing in." };

  const user = await db.user.create({ data: { name, email, phone, role: "customer", passwordHash: await bcrypt.hash(password, 12) } });
  await startSession(user.id);
  redirect(safeNext(fd.get("next")) ?? "/account");
}

export async function logoutAction() {
  await endSession();
  redirect("/");
}

const profileSchema = z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().max(30).optional() });

export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
  const u = await getUser();
  if (!u) return { error: "Please sign in again." };
  const parsed = profileSchema.safeParse({ name: fd.get("name"), phone: String(fd.get("phone") ?? "") || undefined });
  if (!parsed.success) return { error: "Please enter your name (2+ characters)." };
  await db.user.update({ where: { id: u.id }, data: { name: parsed.data.name, phone: parsed.data.phone ?? null } });
  return { ok: "Profile saved." };
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const u = await getUser();
  if (!u) return { error: "Please sign in again." };
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 8 || next.length > 200) return { error: "New password must be at least 8 characters." };
  if (tooMany(`pw:${u.id}`, 6)) return { error: "Too many attempts. Please wait a few minutes." };
  const row = await db.user.findUnique({ where: { id: u.id } });
  if (!row?.passwordHash || !(await bcrypt.compare(current, row.passwordHash))) return { error: "Current password is incorrect." };
  await db.user.update({ where: { id: u.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: "Password updated." };
}
