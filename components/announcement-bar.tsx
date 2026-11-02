import { SITE } from "@/lib/site";
import { LeafIcon, TruckIcon } from "./icons";

export function AnnouncementBar() {
  return (
    <div className="bg-forest-dark text-white text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <p className="flex items-center gap-2">
          <LeafIcon width={16} height={16} />
          <span>
            Flat 10% OFF on Your First Order | Use Code: <strong>{SITE.coupon}</strong>
          </span>
        </p>
        <p className="hidden items-center gap-5 sm:flex">
          <span className="flex items-center gap-2"><TruckIcon width={16} height={16} />Free Shipping Above ${SITE.freeShippingAboveUSD}</span>
          <span className="flex items-center gap-2"><LeafIcon width={16} height={16} />100% Organic Teas</span>
        </p>
      </div>
    </div>
  );
}
