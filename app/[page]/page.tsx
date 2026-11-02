import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INFO_PAGES } from "@/lib/info-pages";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(INFO_PAGES).map((page) => ({ page }));

export async function generateMetadata(props: PageProps<"/[page]">): Promise<Metadata> {
  const key = (await props.params).page;
  const info = INFO_PAGES[key];
  return info ? { title: info.title, description: info.intro, alternates: { canonical: `/${key}` } } : {};
}

export default async function InfoPage(props: PageProps<"/[page]">) {
  const info = INFO_PAGES[(await props.params).page];
  if (!info) notFound();
  return (
    <>
      <PageHero title={info.title} subtitle={info.intro} crumbs={[{ label: info.title }]} />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-12">
        {info.sections.map((s, i) => (
          <Reveal key={s.h} delay={i * 80} className="rounded-card bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.p}</p>
          </Reveal>
        ))}
      </div>
    </>
  );
}
