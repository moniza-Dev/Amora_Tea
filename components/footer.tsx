import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, MessengerIcon, PhoneIcon, PinIcon, TelegramIcon } from "./icons";

const QUICK = [
  ["Home", "/"], ["Shop", "/shop"], ["Blog", "/blog"], ["Gifts & Sets", "/gifts"],
  ["Our Story", "/our-story"], ["Tea Collections", "/collections"], ["Contact Us", "/contact"],
] as const;
const CARE = [
  ["FAQs", "/faqs"], ["Shipping Policy", "/shipping-policy"], ["Return & Refund", "/returns"],
  ["Pay by QR", "/pay"], ["Track Order", "/track"], ["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"],
] as const;
const SOCIAL_ICONS = { Instagram: InstagramIcon, Telegram: TelegramIcon, Facebook: FacebookIcon, Messenger: MessengerIcon } as const;

function Col({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <h3 className="mb-4 font-medium">{title}</h3>
      <ul className="space-y-2 text-sm text-ink-soft">
        {links.map(([label, href]) => (
          <li key={href}><Link href={href} className="hover:text-forest">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-sand/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
        <div>
          <Logo full />
          <p className="mt-4 text-sm text-ink-soft">More than tea, it&apos;s a way of life.</p>
          <ul className="mt-5 flex gap-3">
            {SITE.social.map((s) => {
              const Icon = SOCIAL_ICONS[s.label as keyof typeof SOCIAL_ICONS];
              return (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded-full bg-forest text-white transition duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-leaf hover:shadow-lift">
                    <Icon width={18} height={18} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <Col title="Quick Link" links={QUICK} />
        <Col title="Customer Care" links={CARE} />
        <div>
          <h3 className="mb-4 font-medium">Contact Us</h3>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li className="flex gap-3"><PinIcon className="mt-0.5 shrink-0 text-forest" />{SITE.address}</li>
            <li className="flex gap-3"><PhoneIcon className="shrink-0 text-forest" /><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-forest">{SITE.phone}</a></li>
            <li className="flex gap-3"><MailIcon className="shrink-0 text-forest" /><a href={`mailto:${SITE.email}`} className="hover:text-forest">{SITE.email}</a></li>
            <li className="flex gap-3"><ClockIcon className="shrink-0 text-forest" />{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-black/5 py-4 text-center text-xs text-ink-soft">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}
