import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ClosingCta } from "@/components/closing-cta";
import { cookiePolicy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "How New Home Agents uses cookies and similar technologies on its website.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Policies" title="Cookie policy" description="Reproduced from newhomeagents.co.uk. This preview sets no analytics or advertising cookies." />
      <section className="pb-20">
        <div className="container max-w-[820px]">
          <div className="flex flex-col gap-4 text-lg text-slate">
            {cookiePolicy.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="mt-10 flex flex-col gap-8">
            {cookiePolicy.sections.map((s) => (
              <section key={s.title}>
                <h2 className="h-sub">{s.title}</h2>
                <p className="mt-3 text-slate">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}
