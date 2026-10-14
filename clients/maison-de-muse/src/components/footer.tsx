import Link from "next/link";
import { footer as copy } from "@/lib/content";
import { nav, openingHours, serviceHours, site } from "@/lib/site";
import { Wordmark } from "@/components/wordmark";

/**
 * Footer — the template's four-column arrangement (logo and line, pages,
 * contact, address/social) over a credit strip with a back-to-top link.
 */
export function Footer() {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 pt-20 sm:px-10 lg:px-16 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Wordmark variant="stacked" tone="light" />
            <p className="mt-7 max-w-[34ch] text-sm leading-relaxed text-cream/70">
              {copy.descriptor}
            </p>
            <p className="mt-6 text-xs text-cream/50">
              Food hygiene rating {site.hygiene.rating} —{" "}
              <a
                href={site.hygiene.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line text-cream/70"
              >
                Food Standards Agency
              </a>
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="eyebrow eyebrow-on-dark mb-5">Pages</h2>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-line text-sm text-cream/80 transition-colors duration-300 hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow eyebrow-on-dark mb-5">Hours</h2>
            <dl className="space-y-3 text-sm">
              {openingHours.map((row) => (
                <div key={row.label} className="flex justify-between gap-6">
                  <dt className="text-cream/60">{row.label}</dt>
                  <dd className="tabular text-cream/90">{row.display}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-6 border-t border-cream/10 pt-3">
                <dt className="text-cream/60">Food</dt>
                <dd className="tabular text-cream/90">{serviceHours.food.display}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-cream/60">Evening menu</dt>
                <dd className="text-right text-cream/90">Fri &amp; Sat from 4pm</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow eyebrow-on-dark mb-5">Contact</h2>
            <address className="space-y-3 text-sm not-italic">
              <p className="text-cream/80">
                {site.address.street}
                <br />
                {site.address.town}, {site.address.postcode}
              </p>
              <p>
                <a href={site.phoneHref} className="link-line text-cream/90">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="link-line text-cream/90">
                  {site.email}
                </a>
              </p>
            </address>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li>
                <a
                  href={site.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-cream/80"
                >
                  Directions
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-cream/80"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-cream/80"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="link-line text-cream/60">
              Privacy
            </Link>
            <a href="#main" className="link-line text-cream/60">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>

      {/* The template's oversized closing wordmark, clipped at the fold.
          Decorative, but still rendered at a tint that clears WCAG AA for
          large text against the espresso ground — a sighted visitor reads
          it whether or not assistive technology announces it. */}
      <div aria-hidden="true" className="overflow-hidden px-6 sm:px-10 lg:px-16">
        <p className="wordmark -mb-[0.24em] whitespace-nowrap text-center text-[clamp(3rem,11.5vw,11rem)] leading-none text-cream/35">
          {site.name}
        </p>
      </div>
    </footer>
  );
}
