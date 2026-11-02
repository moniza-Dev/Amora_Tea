"use client";
import { useEffect, useState } from "react";
import { ChevronIcon } from "./icons";

/** Back-to-top button that eases in after the first screen of scrolling. Sits above the chat button. */
export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button type="button" aria-label="Back to top" tabIndex={show ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-4 z-30 grid size-11 place-items-center rounded-full bg-card text-forest shadow-lift ring-1 ring-black/5 transition duration-500 hover:-translate-y-1 hover:bg-forest hover:text-white sm:bottom-28 sm:right-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <ChevronIcon className="rotate-180" />
    </button>
  );
}
