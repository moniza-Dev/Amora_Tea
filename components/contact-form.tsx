"use client";
import { useState } from "react";

const field = "w-full rounded-tile bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-forest";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const data = (await res.json()) as { ok: boolean; message: string };
      setState(data.ok ? "done" : "error");
      setMsg(data.message);
      if (data.ok) form.reset();
    } catch {
      setState("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Name<input name="name" required autoComplete="name" className={`${field} mt-1`} /></label>
        <label className="block text-sm">Email<input name="email" type="email" required autoComplete="email" className={`${field} mt-1`} /></label>
      </div>
      <label className="block text-sm">Subject<input name="subject" className={`${field} mt-1`} /></label>
      <label className="block text-sm">Message<textarea name="body" rows={5} required className={`${field} mt-1 resize-y`} /></label>
      <button disabled={state === "loading"} className="btn-press rounded-full bg-forest px-8 py-3 font-medium text-white hover:bg-forest-dark disabled:opacity-60">{state === "loading" ? "Sending…" : "Send Message"}</button>
      <p role="status" aria-live="polite" className={`min-h-5 text-sm ${state === "error" ? "text-danger" : "animate-rise text-forest"}`}>{msg}</p>
    </form>
  );
}
