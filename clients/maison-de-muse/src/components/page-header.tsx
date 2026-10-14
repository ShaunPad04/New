import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/**
 * Shared header for inner pages: breadcrumb, eyebrow, two-beat headline
 * and a lede. The second headline beat is italic serif in plum, as on the
 * home page.
 */
export function PageHeader({
  crumb,
  eyebrow,
  title,
  accent,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-[1400px] px-6 pb-12 pt-36 sm:px-10 lg:px-16 lg:pt-44">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-mocha">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="link-line">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-espresso">
            {crumb}
          </li>
        </ol>
      </nav>
      <Reveal>
        <p className="eyebrow mb-6">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="display-xl text-display-xl max-w-[16ch] text-espresso">
          {title}{" "}
          <em className="display-italic text-plum">{accent}</em>
        </h1>
      </Reveal>
      {children ? (
        <Reveal delay={0.1} className="mt-8">
          {children}
        </Reveal>
      ) : null}
    </header>
  );
}
