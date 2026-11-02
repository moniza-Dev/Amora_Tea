"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, registerAction, type FormState } from "@/app/auth-actions";

const input = "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10";
const initial: FormState = {};

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? loginAction : registerAction, initial);
  const [show, setShow] = useState(false);
  const isLogin = mode === "login";
  return (
    <form action={action} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {!isLogin && (
        <>
          <label className="block text-sm font-medium">Full name<input name="name" required autoComplete="name" className={`${input} mt-1.5 font-normal`} /></label>
          <label className="block text-sm font-medium">Phone <span className="font-normal text-ink-soft">(optional)</span><input name="phone" type="tel" autoComplete="tel" className={`${input} mt-1.5 font-normal`} /></label>
        </>
      )}
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className={`${input} mt-1.5 font-normal`} /></label>
      <label className="block text-sm font-medium">
        Password
        <span className="relative mt-1.5 block">
          <input name="password" type={show ? "text" : "password"} required minLength={isLogin ? 1 : 8} autoComplete={isLogin ? "current-password" : "new-password"} className={`${input} pr-16 font-normal`} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-forest hover:bg-leaf-soft" aria-pressed={show}>{show ? "Hide" : "Show"}</button>
        </span>
        {!isLogin && <span className="mt-1 block text-xs font-normal text-ink-soft">At least 8 characters.</span>}
      </label>
      <p role="alert" aria-live="polite" className={`overflow-hidden rounded-xl bg-danger/10 px-4 text-sm text-danger transition-all duration-300 ${state.error ? "max-h-24 py-3 opacity-100" : "max-h-0 py-0 opacity-0"}`}>{state.error}</p>
      <button disabled={pending} className="btn-press w-full rounded-full bg-forest px-6 py-3 font-medium text-white hover:bg-forest-dark disabled:opacity-60">
        {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {isLogin ? "New to Amora-Tea? " : "Already have an account? "}
        <Link href={`${isLogin ? "/register" : "/login"}${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="link-underline font-medium text-forest">{isLogin ? "Create an account" : "Sign in"}</Link>
      </p>
    </form>
  );
}
