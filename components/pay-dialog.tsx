"use client";
import { useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";
import { PayQr } from "./pay-qr";

/** Button that opens the KHQR payment panel in a native <dialog> (focus trap + Esc come for free). */
export function PayDialog({ amountCents, orderMessage, className, children }: { amountCents?: number; orderMessage?: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={className}>{children}</button>
      <dialog
        ref={ref}
        aria-label="Pay with ABA KHQR"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="pay-dialog m-auto max-h-[92vh] w-[min(94vw,52rem)] overflow-auto rounded-panel bg-card p-0 text-ink shadow-lift"
      >
        <div className="relative">
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/80 hover:bg-leaf-soft active:scale-90"><CloseIcon width={18} height={18} /></button>
          <PayQr amountCents={amountCents} orderMessage={orderMessage} />
        </div>
      </dialog>
    </>
  );
}
