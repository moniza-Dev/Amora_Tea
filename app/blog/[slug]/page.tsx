import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { JsonLd, breadcrumbLd } from "@/components/json-ld";
import { abs } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const p = await db.blogPost.findUnique({ where: { slug: (await props.params).slug } });
  return p ? {
    title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, url: `/blog/${p.slug}`, publishedTime: p.publishedAt.toISOString(), authors: [p.author], ...(p.coverUrl ? { images: [p.coverUrl] } : {}) },
  } : {};
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const post = await db.blogPost.findUnique({ where: { slug: (await props.params).slug } });
  if (!post || !post.isPublished) notFound();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.publishedAt.toISOString(), author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "Amora-Tea", logo: { "@type": "ImageObject", url: abs("/icons/icon-512.png") } }, mainEntityOfPage: abs(`/blog/${post.slug}`), ...(post.coverUrl ? { image: abs(post.coverUrl) } : {}) }} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <PageHero title={post.title} subtitle={`${post.author} · ${post.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`} crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <article className="animate-rise mx-auto max-w-2xl px-4 py-12"><Prose source={post.content} /></article>
    </>
  );
}
