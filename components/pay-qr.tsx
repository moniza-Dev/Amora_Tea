"use client";
import Image from "next/image";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { formatUSD } from "@/lib/format";
import { CheckIcon, CopyIcon, DownloadIcon, MessengerIcon, TelegramIcon } from "./icons";

const PAY = SITE.payment;
const MESSENGER = SITE.social.find((s) => s.label === "Messenger")!.href;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function CopyButton({ text, label, children }: { text: string; label: string; children?: React.ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => { await copyText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${done ? "bg-leaf text-white" : "bg-leaf-soft text-forest hover:bg-forest hover:text-white"}`}
    >
      <span key={String(done)} className={done ? "animate-pop" : ""}>{done ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}</span>
      {done ? "Copied" : (children ?? "Copy")}
    </button>
  );
}

/** ABA KHQR payment panel. The QR is static (no fixed amount), so we show the total to type in and a message to send with the receipt. */
export function PayQr({ amountCents, orderMessage }: { amountCents?: number; orderMessage?: string }) {
  const accounts = [{ cur: "USD", no: PAY.usd }, { cur: "KHR", no: PAY.khr }];
  return (
    <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[17rem_1fr] md:items-start">
      <div className="mx-auto w-64">
        <div className="relative overflow-hidden rounded-card bg-white shadow-lift ring-1 ring-black/5">
          <Image src={PAY.qr} alt={`ABA KHQR code for ${PAY.accountName}`} width={478} height={646} priority className="h-auto w-full" />
          {/* scan line, aligned to the QR area of the image */}
          <div aria-hidden className="pointer-events-none absolute left-[10.7%] top-[34.4%] h-[58.2%] w-[78.5%]">
            <div className="absolute inset-x-0 h-0.5 animate-scan rounded-full bg-leaf shadow-[0_0_14px_3px_rgb(90_154_58/0.7)]" />
          </div>
        </div>
        <a href={PAY.qrFull} download="amora-tea-aba-khqr.png" className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-soft hover:text-forest">
          <DownloadIcon width={16} height={16} /> Save QR to your phone
        </a>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold text-forest">Pay with ABA KHQR</h2>
        <p className="mt-1 text-sm text-ink-soft">{PAY.bank} · <span className="font-medium text-ink">{PAY.accountName}</span></p>

        {amountCents != null && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-tile bg-[#f3ece3] px-4 py-3">
            <div><p className="text-xs text-ink-soft">Amount to pay (USD)</p><p key={amountCents} className="animate-pop font-display text-2xl font-semibold">{formatUSD(amountCents)}</p></div>
            <CopyButton text={(amountCents / 100).toFixed(2)} label="Copy amount">Copy amount</CopyButton>
          </div>
        )}

        <ol className="mt-5 space-y-3 text-sm">
          {[
            "Open ABA Mobile (or any Bakong / KHQR banking app) and tap Scan.",
            amountCents != null ? "Scan the code, choose USD and type the amount above." : "Scan the code, choose USD and type your order total.",
            "Send us the payment screenshot on Telegram or Messenger so we can confirm your order.",
          ].map((t, i) => (
            <li key={i} style={{ "--d": `${200 + i * 120}ms` } as React.CSSProperties} className="chip-in flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-semibold text-white">{i + 1}</span>
              <span className="pt-0.5">{t}</span>
            </li>
          ))}
        </ol>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {accounts.map((a) => (
            <li key={a.cur} className="flex items-center justify-between gap-2 rounded-tile border border-black/10 px-3 py-2">
              <div><p className="text-xs text-ink-soft">{a.cur} account</p><p className="font-medium tabular-nums">{a.no}</p></div>
              <CopyButton text={a.no.replace(/\s/g, "")} label={`Copy ${a.cur} account number`} />
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {orderMessage && <CopyButton text={orderMessage} label="Copy order message">Copy order message</CopyButton>}
          <a href={PAY.proofTo} target="_blank" rel="noopener noreferrer" className="btn-press inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-dark"><TelegramIcon width={16} height={16} />Send receipt on Telegram</a>
          <a href={MESSENGER} target="_blank" rel="noopener noreferrer" className="btn-press inline-flex items-center gap-2 rounded-full border border-forest px-4 py-2 text-sm font-medium text-forest hover:bg-forest hover:text-white"><MessengerIcon width={16} height={16} />Messenger</a>
        </div>
      </div>
    </div>
  );
}
