import Link from "next/link";

export default function NotFound() {
  return (
    <div className="animate-rise mx-auto max-w-md px-4 py-24 text-center">
      <p className="animate-float font-script text-6xl text-forest">Oops!</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">This page has gone cold</h1>
      <p className="mt-2 text-ink-soft">We couldn&apos;t find what you were looking for.</p>
      <Link href="/shop" className="btn-press mt-6 inline-flex rounded-full bg-forest px-7 py-3 font-medium text-white">Back to the shop</Link>
    </div>
  );
}
