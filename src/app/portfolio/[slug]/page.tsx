import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies, projects, site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/cta";
import { ContactBand } from "@/components/page-shell";

/**
 * CASE STUDY — one project, its own URL.
 *
 * A prospect deciding on a five-figure build reads the case study, not the
 * tile. So it gets a real route with its own title, description and canonical,
 * generated statically from `caseStudies` in content.ts.
 *
 * The honesty rule this page is built around: it may describe what we were
 * asked for, what we designed and what we built — all of which is ours to
 * state — but it may not assert a RESULT the project has not produced.
 * B Boutique has not launched, so instead of an empty "results" section with
 * plausible numbers in it, the page says plainly that there are none yet.
 * That is a stronger signal than a fabricated percentage, and it is the only
 * version of this page that stays true when a client checks it.
 */

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return {};

  return {
    title: `${study.title} — case study — ${site.name}`,
    description: study.lede,
    alternates: { canonical: `/portfolio/${study.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  const project = projects.find((p) => p.id === study.projectId);

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {/* ---------- Masthead ---------- */}
        <section
          aria-labelledby="case-heading"
          className="border-b border-ink-300"
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pb-28 lg:pt-56">
            <p className="eyebrow mb-8">Case study</p>
            <h1
              id="case-heading"
              className="display text-display-lg max-w-[14ch] text-ink-1000"
            >
              {study.title}
            </h1>
            <p className="lede mt-10 max-w-[58ch]">{study.lede}</p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              {project?.href ? (
                <Cta href={project.href}>Visit the site</Cta>
              ) : null}
              <Cta href="/portfolio" variant="ghost">
                All work
              </Cta>
            </div>

            {/* Sets expectations before the click, not after it. */}
            <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-ink-600">
              {study.previewNote}
            </p>
          </div>
        </section>

        {/* ---------- At a glance ---------- */}
        <section aria-label="Project facts" className="bg-ink-50">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-6">
              {study.facts.map((f) => (
                <div key={f.label}>
                  <dt className="field-label text-ink-600">{f.label}</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink-1000">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- The brief ---------- */}
        <Section id="brief" eyebrow="The brief" heading="What we were asked for.">
          <div className="max-w-[64ch] space-y-6">
            {study.brief.map((p) => (
              <p key={p.slice(0, 24)} className="lede">
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* ---------- Approach ---------- */}
        <Section
          id="approach"
          eyebrow="The approach"
          heading="How we built it."
          bordered
        >
          <ul className="mt-4 border-t border-ink-300">
            {study.approach.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 0.05}>
                <article className="grid gap-6 border-b border-ink-300 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                  <div className="lg:col-span-1">
                    <span className="eyebrow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="display text-display-sm text-ink-1000 lg:col-span-4">
                    {a.title}
                  </h3>
                  <p className="max-w-[52ch] leading-relaxed text-ink-800 lg:col-span-7">
                    {a.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* ---------- What changed ---------- */}
        <Section
          id="changed"
          eyebrow="What changed"
          heading="Four things we found, and fixed."
          intro="Every one of these was measured rather than assumed. They are the unglamorous half of the work, and they are the half that decides whether a site earns anything."
          bordered
        >
          <ul className="mt-4 grid gap-5 lg:grid-cols-2 lg:gap-6">
            {study.changed.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.05}>
                <div className="bezel h-full">
                  <div className="bezel-core h-full p-8 lg:p-10">
                    <h3 className="display-soft max-w-[24ch] text-xl text-ink-1000">
                      {c.title}
                    </h3>
                    <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">
                      {c.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* ---------- Standards, and the honest note about results ---------- */}
        <Section id="standards" eyebrow="Held to" heading="The standards." bordered>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ul className="space-y-4">
              {study.standards.map((sd) => (
                <li
                  key={sd}
                  className="flex items-start gap-4 text-[0.9375rem] leading-relaxed text-ink-800"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 block h-px w-4 shrink-0 bg-ink-500"
                  />
                  {sd}
                </li>
              ))}
            </ul>

            <div className="bezel h-fit">
              <div className="bezel-core p-8 lg:p-10">
                <p className="field-label text-ink-600">On results</p>
                <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-800">
                  {study.outcomeNote}
                </p>
              </div>
            </div>
          </div>
        </Section>

        <ContactBand
          heading="Want one built like this?"
          body="Tell us what you sell and who you sell it to. We reply within one working day and book a call at a time that suits you — and we will say honestly if we are not the right studio for it."
        />

        <p className="mx-auto mb-24 w-full max-w-[1600px] px-6 text-center text-sm text-ink-700 sm:px-10 lg:px-16">
          <Link
            href="/portfolio"
            className="underline underline-offset-4 transition-colors hover:text-ink-1000"
          >
            Back to the portfolio
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}

/** Section shell, so the five blocks keep identical rhythm. */
function Section({
  id,
  eyebrow,
  heading,
  intro,
  bordered,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={bordered ? "border-t border-ink-300" : undefined}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="max-w-[50ch]">
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h2
            id={`${id}-heading`}
            className="display text-display-md text-ink-1000"
          >
            {heading}
          </h2>
          {intro ? (
            <p className="mt-8 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-700">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="mt-14 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
