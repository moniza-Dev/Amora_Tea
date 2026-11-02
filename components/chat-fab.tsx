"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { ChatIcon, CloseIcon, FacebookIcon, InstagramIcon, MessengerIcon, TelegramIcon } from "./icons";

const ICONS = { Telegram: TelegramIcon, Messenger: MessengerIcon, Facebook: FacebookIcon, Instagram: InstagramIcon } as const;
const ORDER = ["Telegram", "Messenger", "Instagram", "Facebook"] as const;

/** Floating "chat with us" button that fans out the shop's social channels. */
export function ChatFab() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  const links = ORDER.map((l) => SITE.social.find((s) => s.label === l)!);

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <ul className="flex flex-col items-end gap-2">
          {[...links].reverse().map((s, i) => {
            const Icon = ICONS[s.label as keyof typeof ICONS];
            return (
              <li key={s.label} style={{ "--d": `${i * 60}ms` } as React.CSSProperties} className="chip-in">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 text-sm font-medium shadow-lift hover:bg-leaf-soft">
                  {s.label}
                  <span className="grid size-9 place-items-center rounded-full bg-forest text-white transition group-hover:scale-110 group-hover:bg-leaf"><Icon width={18} height={18} /></span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <div className="relative">
        {!open && <span aria-hidden className="absolute inset-0 animate-ring rounded-full bg-leaf" />}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close chat options" : "Chat with us"}
          className="relative grid size-14 place-items-center rounded-full bg-forest text-white shadow-lift transition hover:bg-forest-dark active:scale-90"
        >
          <span key={String(open)} className="animate-pop">{open ? <CloseIcon width={24} height={24} /> : <ChatIcon width={24} height={24} />}</span>
        </button>
      </div>
    </div>
  );
}
