"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: new FormData(form).get("email") }),
      });
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
    <form onSubmit={onSubmit} className="mt-5 max-w-md" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Enter your email address"
          className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-forest"
        />
        <button disabled={state === "loading"} className="rounded-full bg-forest-dark px-6 py-3 text-sm font-medium text-white hover:bg-forest disabled:opacity-60">
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-sm ${state === "error" ? "text-danger" : "text-forest"}`}>{msg}</p>
    </form>
  );
}
