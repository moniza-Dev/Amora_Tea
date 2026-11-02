import Image from "next/image";
import Link from "next/link";

/** Real Amora-Tea mark. `full` = the stacked logo (footer); default = icon + live wordmark (header). */
export function Logo({ full = false }: { full?: boolean }) {
  if (full) {
    return (
      <Link href="/" aria-label="Amora-Tea home" className="group inline-block">
        <Image src="/brand/logo-sm.png" alt="Amora Tea: Good Tea, Better Days" width={358} height={410} className="w-36 mix-blend-multiply transition duration-500 group-hover:scale-105 group-hover:-rotate-2" />
      </Link>
    );
  }
  return (
    <Link href="/" aria-label="Amora-Tea home" className="group inline-flex items-center gap-2.5">
      <Image
        src="/brand/icon-v2.png"
        alt=""
        width={1418}
        height={1130}
        className="h-15 w-auto"
      />     
       <span className="leading-none"></span>
    </Link>
  );
}
