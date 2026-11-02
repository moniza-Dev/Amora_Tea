import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P): P => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...p,
});
const mk = (d: string) => function Icon(p: P) { return <svg {...base(p)}><path d={d} /></svg>; };

export const SearchIcon = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const UserIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>;
export const CartIcon = (p: P) => <svg {...base(p)}><path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.1L20 8H6.2" /><circle cx="10" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></svg>;
export const HeartIcon = mk("M12 20s-7.5-4.6-9-9.3C2 7.6 4 5 6.8 5c1.9 0 3.4 1 5.2 3 1.8-2 3.3-3 5.2-3C20 5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z");
export const ArrowIcon = mk("M5 12h14m-5-5 5 5-5 5");
export const MenuIcon = mk("M4 7h16M4 12h16M4 17h16");
export const CloseIcon = mk("M6 6l12 12M18 6 6 18");
export const ChevronIcon = mk("m7 10 5 5 5-5");
export const PinIcon = (p: P) => <svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
export const PhoneIcon = mk("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z");
export const MailIcon = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
export const ClockIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const TruckIcon = (p: P) => <svg {...base(p)}><path d="M2 6h11v10H2zM13 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></svg>;
export const ShieldIcon = (p: P) => <svg {...base(p)}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
export const LeafIcon = mk("M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c3-5 6-8 10-10");
export const SmileHeartIcon = (p: P) => <svg {...base(p)}><path d="M12 20s-7.5-4.6-9-9.3C2 7.6 4 5 6.8 5c1.9 0 3.4 1 5.2 3 1.8-2 3.3-3 5.2-3C20 5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z" /><path d="M9 11.5c1 1.5 5 1.5 6 0" /></svg>;
export const UsersIcon = (p: P) => <svg {...base(p)}><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M16 14.5c2.5 0 4.5 1.5 5 5" /></svg>;
export const SproutIcon = mk("M12 21v-8m0 0c0-4-3-6-7-6 0 4 3 6 7 6Zm0 0c0-4 3-7 7-7 0 4-3 7-7 7Z");
export const InstagramIcon = (p: P) => <svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>;
export const TelegramIcon = mk("M21 4 3 11l5.5 2L10 19l3-4 4.5 3.5L21 4ZM8.5 13 17 7.5");
export const FacebookIcon = mk("M14 21v-7h2.5l.5-3H14V9.2C14 8.3 14.5 8 15.3 8H17V5.2C16.5 5.1 15.7 5 14.8 5 12.5 5 11 6.4 11 8.8V11H8.5v3H11v7");
export const MessengerIcon = (p: P) => <svg {...base(p)}><path d="M12 3C7 3 3.5 6.5 3.5 11c0 2.5 1.2 4.6 3 6V21l3.3-1.8c.7.2 1.5.3 2.2.3 5 0 8.5-3.5 8.5-8S17 3 12 3Z" /><path d="m7.5 13 3-3.2 2 2 3.5-2.8" /></svg>;
export const CopyIcon = (p: P) => <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>;
export const CheckIcon = mk("m5 12.5 4.5 4.5L19 7.5");
export const DownloadIcon = mk("M12 4v11m0 0-4-4m4 4 4-4M5 20h14");
export const QrIcon = (p: P) => <svg {...base(p)}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2.5v2.5H14zM19 14v1M14 19h1m2.5 0H20v1" /></svg>;
export const ChatIcon = (p: P) => <svg {...base(p)}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>;
