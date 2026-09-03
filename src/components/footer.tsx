import { founders, nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";

export function Footer() {
  return (
    <footer className="border-t border-ink-300">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-[34ch]">
            <Wordmark variant="stacked" className="items-start" />
            <p className="mt-7 text-sm leading-relaxed text-ink-700">
              A founder-led web design and online marketing studio. Websites,
              search, email, SMS, hosting and maintenance — built and run by
              the same two people.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav aria-label="Footer">
              <h2 className="eyebrow mb-5">Site</h2>
              <ul className="space-y-3">
                {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-ink-800 transition-colors duration-300 hover:text-ink-1000"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="eyebrow mb-5">Contact</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-ink-800 transition-colors duration-300 hover:text-ink-1000"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="text-sm text-ink-800 transition-colors duration-300 hover:text-ink-1000"
                  >
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-600">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-600">
            Designed &amp; built in-house by{" "}
            {founders.map((f) => f.name).join(" & ")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
