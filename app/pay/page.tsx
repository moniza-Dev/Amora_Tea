import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PayQr } from "@/components/pay-qr";

export const metadata: Metadata = { title: "Pay by QR", robots: { index: false, follow: false } };

export default function PayPage() {
  return (
    <>
      <PageHero title="Pay by QR" subtitle="Scan with ABA Mobile or any Bakong banking app." crumbs={[{ label: "Pay by QR" }]} />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-rise rounded-panel bg-card shadow-soft"><PayQr /></div>
      </section>
    </>
  );
}
