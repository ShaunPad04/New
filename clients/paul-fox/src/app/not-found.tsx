import type { Metadata } from "next";
import Link from "next/link";
import { notFoundPage } from "@/lib/pages";
import { nav } from "@/lib/content";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main>
      <section data-dark className="relative flex min-h-[80vh] flex-col justify-end overflow-clip bg-ink-900">
        <div className="container relative flex flex-col gap-10 pb-16 pt-40">
          <div className="flex flex-col gap-4">
            <Appear onMount>
              <p className="caption2 !text-ink-300">{notFoundPage.eyebrow}</p>
            </Appear>
            <Appear onMount delay={0.1}>
              <h1 className="wordmark !text-[80px] tablet:!text-[140px] desktop:!text-[200px]">404</h1>
            </Appear>
            <Appear onMount delay={0.2}>
              <h2 className="h3 !text-ink-50">{notFoundPage.title}</h2>
            </Appear>
            <Appear onMount delay={0.3}>
              <p className="body-sm max-w-[560px] !text-ink-200">{notFoundPage.copy}</p>
            </Appear>
          </div>
          <Appear onMount delay={0.4} className="flex flex-wrap gap-2.5">
            <Button label="Back to homepage" href="/" variant="secondary" />
            <Button label="Search properties" href="/search-results" variant="icon" />
          </Appear>
          <Appear onMount delay={0.5} className="flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-700 pt-5">
            {nav.links.map((l) => (
              <Link key={l.href} href={l.href} className="caption2 !text-ink-300 transition-colors hover:!text-ink-50">
                {l.label}
              </Link>
            ))}
          </Appear>
        </div>
      </section>
    </main>
  );
}
