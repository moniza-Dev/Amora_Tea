import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser, homeFor, safeNext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Create your account", robots: { index: false, follow: false } };

export default async function Page(props: PageProps<"/register">) {
  const user = await getUser();
  const sp = await props.searchParams;
  const next = safeNext(Array.isArray(sp.next) ? sp.next[0] : sp.next) ?? undefined;
  if (user) redirect(next ?? homeFor(user.role));
  return (
    <>
      <PageHero title="Create your account" subtitle="Join Amora-Tea for faster checkout and order history." crumbs={[{ label: "Create your account" }]} />
      <section className="mx-auto max-w-md px-4 py-12">
        <div className="animate-rise rounded-panel bg-card p-7 shadow-soft sm:p-9">
          <Image src="/brand/icon-transparent.png" alt="" width={479} height={435} className="mx-auto mb-5 h-16 w-auto animate-bob" />
          <AuthForm mode="register" next={next} />
        </div>
      </section>
    </>
  );
}
