import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, MessengerIcon, PhoneIcon, PinIcon, QrIcon, TelegramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a tea, an order or a gift? Contact Amora-Tea in Phnom Penh by phone, email or chat.",
  alternates: { canonical: "/contact" },
};

const SOCIAL_ICONS = { Instagram: InstagramIcon, Telegram: TelegramIcon, Facebook: FacebookIcon, Messenger: MessengerIcon } as const;

export default function ContactPage() {
  const items = [
    { Icon: PinIcon, label: "Visit us", value: SITE.address },
    { Icon: PhoneIcon, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    { Icon: MailIcon, label: "Email us", value: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: ClockIcon, label: "Opening hours", value: SITE.hours },
  ];
  return (
    <>
      <PageHero title="Contact Us" subtitle="Questions about a tea, an order or a gift? We'd love to hear from you." crumbs={[{ label: "Contact Us" }]} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-4">
          {items.map(({ Icon, label, value, href }, i) => (
            <Reveal as="li" key={label} dir="left" delay={i * 90} className="group flex items-center gap-4 rounded-card bg-card p-5 shadow-soft">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-leaf-soft text-forest transition group-hover:bg-forest group-hover:text-white"><Icon /></span>
              <div><p className="text-xs text-ink-soft">{label}</p>{href ? <a href={href} className="font-medium hover:text-forest">{value}</a> : <p className="font-medium">{value}</p>}</div>
            </Reveal>
          ))}
          <Reveal as="li" dir="left" delay={items.length * 90}>
            <p className="mb-3 text-sm font-medium">Chat with us</p>
            <ul className="grid grid-cols-2 gap-3">
              {SITE.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-card bg-card p-3 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-white transition group-hover:rotate-12 group-hover:bg-leaf"><Icon width={18} height={18} /></span>
                      <span className="min-w-0"><span className="block text-sm font-medium">{s.label}</span><span className="block truncate text-xs text-ink-soft">{s.handle}</span></span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal as="li" dir="left" delay={(items.length + 1) * 90}>
            <Link href="/pay" className="group flex items-center gap-4 rounded-card bg-forest p-5 text-white shadow-soft transition duration-300 hover:-translate-y-1 hover:bg-forest-dark hover:shadow-lift">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15"><QrIcon /></span>
              <span><span className="block font-medium">Pay by QR</span><span className="block text-xs text-white/75">ABA KHQR · scan and send us the receipt</span></span>
            </Link>
          </Reveal>
        </ul>
        <Reveal dir="right" className="rounded-panel bg-[#f3ece3] p-6 sm:p-8"><ContactForm /></Reveal>
      </section>
    </>
  );
}
