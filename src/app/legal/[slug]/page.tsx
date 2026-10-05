import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/lib/content";
import {
  LEGAL_DETAILS_VERIFIED,
  LEGAL_LAST_UPDATED,
  legalDocuments,
} from "@/lib/legal";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/v3/page-hero";
import { LABEL } from "@/components/v3/page-grid";

/**
 * LEGAL DOCUMENTS — privacy policy and terms of use.
 *
 * In the homepage's system since 2026-10-05 (Brad: "do the remaining old
 * pages"): the page top every inner page has, without its "Start a project"
 * bar, then the document on the page's grid, the contents in the first
 * column (held in view on desktop) and the clauses across the other two.
 * Still deliberately plain where it matters: no reveal animations on the
 * text, a 68-character measure, every heading anchored so a clause can be
 * linked. A legal document that performs is a legal document nobody trusts.
 *
 * The `LEGAL_DETAILS_VERIFIED` notice is visible on a preview build and gone
 * on a real one — but it is also wired into `pnpm verify`, so an indexable
 * build cannot ship while the controller's postal address and ICO
 * registration are still missing. A privacy notice without the controller's
 * full identity does not satisfy UK GDPR Article 13, and it is exactly the
 * detail that gets forgotten on launch day.
 */

export function generateStaticParams() {
  return legalDocuments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.lede,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

const two = (n: number) => String(n).padStart(2, "0");

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) notFound();
  const other = legalDocuments.find((d) => d.slug !== doc.slug);

  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="legal-heading"
          title={doc.title}
          word={doc.slug}
          label="Legal"
          ja="法的事項"
          count={{ value: two(doc.sections.length), label: "sections" }}
          lede={doc.lede}
          cta={false}
          asidePhone
          aside={
            <dl className={LABEL}>
              <div className="flex min-h-9 items-center justify-between gap-4 border-b border-white/12">
                <dt className="text-ink-600">Last updated</dt>
                <dd className="m-0 text-ink-900">{LEGAL_LAST_UPDATED}</dd>
              </div>
              {other ? (
                <div className="flex min-h-9 items-center justify-between gap-4 border-b border-white/12">
                  <dt className="text-ink-600">Also</dt>
                  <dd className="m-0">
                    <Link href={`/legal/${other.slug}`} className="text-ink-900 transition-colors hover:text-accent">
                      {other.title} →
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          }
        />

        <div className="bg-ink-0 px-6 sm:px-10">
          {/* Preview-only. The machine gate in `pnpm verify` is what actually
              stops this shipping incomplete; this is so nobody reviewing the
              preview mistakes the gaps for finished copy. */}
          {!LEGAL_DETAILS_VERIFIED ? (
            <div className="mt-12 max-w-[68ch] border border-dashed border-ink-400 p-6 lg:ml-[calc(100%/3)]">
              <p className={`${LABEL} text-ink-600`}>Not yet complete</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-800">
                One disclosure is still missing: a geographic address at which
                the business can be contacted and documents served, required by
                the Electronic Commerce Regulations 2002 and the Companies Act
                2006 s.1202. It need not be a home address. This document has
                also not been reviewed by a solicitor.{" "}
                <code>pnpm verify</code> fails any indexable build until both
                are settled.
              </p>
            </div>
          ) : null}

          <div className="grid gap-12 py-16 lg:grid-cols-3 lg:gap-0 lg:py-24">
            {/* Contents. Long documents are navigated, not read start to end. */}
            <nav aria-label="On this page" className="lg:pr-10">
              <div className="lg:sticky lg:top-24">
                <h2 className={`${LABEL} text-ink-700`}>On this page</h2>
                <ol className="mt-4 border-t border-ink-300">
                  {doc.sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex min-h-11 items-baseline gap-3 border-b border-ink-300 py-3 text-[0.9375rem] leading-snug text-ink-800 transition-colors hover:text-ink-1000">
                        <span aria-hidden="true" className="w-6 shrink-0 font-[family-name:var(--font-cal-ui)] tabular-nums text-accent">
                          {two(i + 1)}
                        </span>
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <div className="space-y-14 lg:col-span-2 lg:pl-3">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="max-w-[68ch] scroll-mt-28">
                  <h2 id={`${s.id}-heading`} className="flex items-baseline gap-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] text-ink-1000">
                    <span aria-hidden="true" className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] font-normal tabular-nums text-accent">
                      {two(i + 1)}
                    </span>
                    {s.heading}
                  </h2>

                  <div className="mt-5 space-y-4">
                    {s.body.map((p) => (
                      <p key={p.slice(0, 24)} className="text-[1rem] leading-relaxed text-ink-800">
                        {p}
                      </p>
                    ))}
                  </div>

                  {s.list ? (
                    <ul className="mt-5 space-y-3">
                      {s.list.map((item) => (
                        <li key={item} className="flex items-start gap-4 text-[1rem] leading-relaxed text-ink-800">
                          <span aria-hidden="true" className="mt-3 block h-px w-4 shrink-0 bg-ink-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <p className="max-w-[68ch] border-t border-ink-300 pt-10 text-[1rem] leading-relaxed text-ink-700">
                Questions about any of this? Email{" "}
                <a href={`mailto:${site.email}`} className="text-ink-1000 underline underline-offset-4 hover:text-accent">
                  {site.email}
                </a>{" "}
                or call{" "}
                <a href={site.phoneHref} className="text-ink-1000 underline underline-offset-4 hover:text-accent">
                  {site.phone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
