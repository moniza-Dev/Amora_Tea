import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser, homeFor, safeNext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function Page(props: PageProps<"/login">) {
  const user = await getUser();
  const sp = await props.searchParams;
  const next = safeNext(Array.isArray(sp.next) ? sp.next[0] : sp.next) ?? undefined;
  if (user) redirect(next ?? homeFor(user.role));
  return (
    <>
      <PageHero title="Sign in" subtitle="Welcome back. Customers see their orders; the shop team lands in the dashboard." crumbs={[{ label: "Sign in" }]} />
      <section className="mx-auto max-w-md px-4 py-12">
        <div className="animate-rise rounded-panel bg-card p-7 shadow-soft sm:p-9">
          <Image src="/brand/icon-transparent.png" alt="" width={479} height={435} className="mx-auto mb-5 h-16 w-auto animate-bob" />
          <AuthForm mode="login" next={next} />
        </div>
      </section>
    </>
  );
}
