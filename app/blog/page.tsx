import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, LeafIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "The Tea Journal",
  description: "Brewing guides, tea rituals and stories from the Amora-Tea team.",
  alternates: { canonical: "/blog" },
};
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PageHero title="The Tea Journal" subtitle="Brewing guides, rituals and stories from our gardens." crumbs={[{ label: "Blog" }]} />
      <ul className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={(i % 3) * 100}>
            <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-card bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid size-11 place-items-center rounded-full bg-leaf-soft text-forest transition group-hover:rotate-12"><LeafIcon /></span>
              <time className="mt-4 text-xs text-ink-soft" dateTime={p.publishedAt.toISOString()}>{p.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
              <h2 className="mt-1 font-display text-xl font-semibold group-hover:text-forest">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">Read more <ArrowIcon width={16} height={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
