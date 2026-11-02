"use client";
import { useActionState } from "react";
import { changePasswordAction, updateProfileAction, type FormState } from "@/app/auth-actions";

const input = "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-normal outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10";
const init: FormState = {};

function Msg({ s }: { s: FormState }) {
  return <p role="status" aria-live="polite" className={`text-sm transition-opacity duration-300 ${s.error || s.ok ? "opacity-100" : "opacity-0"} ${s.error ? "text-danger" : "text-forest"}`}>{s.error ?? s.ok ?? "\u00a0"}</p>;
}

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [s, action, pending] = useActionState(updateProfileAction, init);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium">Full name<input name="name" defaultValue={name} required className={input} /></label>
      <label className="block text-sm font-medium">Phone<input name="phone" type="tel" defaultValue={phone} className={input} /></label>
      <label className="block text-sm font-medium">Email<input value={email} readOnly disabled className={`${input} opacity-60`} /></label>
      <div className="flex items-center gap-4"><button disabled={pending} className="btn-press rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark disabled:opacity-60">{pending ? "Saving…" : "Save profile"}</button><Msg s={s} /></div>
    </form>
  );
}

export function PasswordForm() {
  const [s, action, pending] = useActionState(changePasswordAction, init);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium">Current password<input name="current" type="password" autoComplete="current-password" required className={input} /></label>
      <label className="block text-sm font-medium">New password<input name="next" type="password" autoComplete="new-password" minLength={8} required className={input} /></label>
      <div className="flex items-center gap-4"><button disabled={pending} className="btn-press rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-forest disabled:opacity-60">{pending ? "Updating…" : "Change password"}</button><Msg s={s} /></div>
    </form>
  );
}
