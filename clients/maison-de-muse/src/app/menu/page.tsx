import type { Metadata } from "next";
import Link from "next/link";
import {
  ALLERGEN_STATEMENT,
  DIETARY_KEY,
  MENU_DISCLAIMER,
  gbp,
  menu,
  type MenuItem,
  type MenuSection,
} from "@/lib/menu";
import { serviceHours, site } from "@/lib/site";
import { MenuNav } from "@/components/menu-nav";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd, MenuJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The Maison de Muse menu: croissants, bagels, sourdough and flatbreads, sweet brunch, speciality coffee, matcha, iced drinks, smoothies, wine, beer and an evening menu on Fridays and Saturdays.",
  alternates: { canonical: "/menu" },
  openGraph: { title: `Menu — ${site.name}`, url: `${site.url}/menu` },
};

function Dietary({ item }: { item: MenuItem }) {
  if (!item.dietary?.length) return null;
  return (
    <span className="ml-2 inline-flex gap-1 align-middle">
      {item.dietary.map((d) => (
        <abbr
          key={d}
          title={DIETARY_KEY[d]}
          className="rounded-full border border-sage/40 px-1.5 py-px text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-sage no-underline"
        >
          {d}
        </abbr>
      ))}
    </span>
  );
}

function PriceRow({ item }: { item: MenuItem }) {
  return (
    <li className="py-4">
      <div className="flex items-baseline gap-2">
        <h4 className="serif text-[1.1875rem] text-espresso">
          {item.name}
          <Dietary item={item} />
        </h4>
        <span aria-hidden="true" className="price-dots" />
        <span className="serif tabular shrink-0 text-[1.125rem] text-plum">
          {item.price !== undefined ? gbp(item.price) : ""}
          {item.sparkling
            ? item.sparkling.glass
              ? `${gbp(item.sparkling.glass)} glass · ${gbp(item.sparkling.bottle)} bottle`
              : `${gbp(item.sparkling.bottle)} bottle`
            : ""}
        </span>
      </div>
      {item.description ? (
        <p className="mt-1 max-w-[52ch] text-[0.9375rem] leading-relaxed text-mocha">
          {item.description}
        </p>
      ) : null}
      {item.extras ? (
        <p className="mt-1 text-[0.875rem] text-espresso-soft">{item.extras}</p>
      ) : null}
    </li>
  );
}

/**
 * Wine rows.
 *
 * Deliberately NOT a <table>. A three-price table needs about 30rem to
 * stay legible, which forces a horizontally scrolling region on a 390px
 * screen — an awkward gesture, and one axe correctly flags as unreachable
 * by keyboard. Labelling each price instead lets the same single markup
 * stack on mobile and align in fixed columns from `sm` up, with no
 * duplicated DOM and nothing to scroll.
 *
 * Each price is a real label/value pair in a <dl>, so "£5.10" is never
 * announced without "175ml".
 */
function WineRow({ item, columns }: { item: MenuItem; columns: MenuSection["columns"] }) {
  const labels = columns ?? ["175ml", "250ml", "Bottle"];
  const values = item.wine
    ? [item.wine.g175, item.wine.g250, item.wine.bottle]
    : [];

  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <h4 className="serif text-[1.1875rem] text-espresso">{item.name}</h4>
        {item.description ? (
          <p className="mt-1 max-w-[44ch] text-[0.9375rem] leading-relaxed text-mocha">
            {item.description}
          </p>
        ) : null}
      </div>

      <dl className="flex shrink-0 gap-5 sm:gap-6">
        {values.map((value, i) => (
          <div key={labels[i]} className="w-[4.25rem] text-left sm:text-right">
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-mocha">
              {labels[i]}
            </dt>
            <dd className="serif tabular mt-0.5 text-[1.125rem] text-plum">{gbp(value)}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Menu" path="/menu" />
      <MenuJsonLd />
      <main id="main" className="flex-1">
        <header className="mx-auto w-full max-w-[1400px] px-6 pb-10 pt-36 sm:px-10 lg:px-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-mocha">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="link-line">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-espresso">
                Menu
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="eyebrow mb-6">Bites, drinks, vibes</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-xl text-display-xl text-espresso">
              The
              <em className="display-italic text-plum"> menu.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid max-w-[60rem] gap-6 md:grid-cols-3">
              <p className="lede md:col-span-2">
                Coffee from 7am, food from 8am to 5pm, and an evening menu with
                the wine list from 4pm on Fridays and Saturdays.
              </p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                    Food served
                  </dt>
                  <dd className="text-espresso">{serviceHours.food.display}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                    Evening menu
                  </dt>
                  <dd className="text-espresso">{serviceHours.evening.display}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* Dietary key */}
          <Reveal delay={0.15}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mocha" aria-label="Dietary key">
              {(Object.keys(DIETARY_KEY) as Array<keyof typeof DIETARY_KEY>).map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className="rounded-full border border-sage/40 px-1.5 py-px text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-sage">
                    {k}
                  </span>
                  {DIETARY_KEY[k]}
                </li>
              ))}
              <li>Vegetarian and vegan options are available — ask the team.</li>
            </ul>
          </Reveal>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-16 lg:pb-36">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <MenuNav />
              <div className="mt-8 hidden rounded-[1.5rem] border border-sand bg-cream/70 p-5 text-sm text-espresso-soft lg:block">
                <p className="font-medium text-espresso">Allergies?</p>
                <p className="mt-2 leading-relaxed">
                  Call{" "}
                  <a href={site.phoneHref} className="link-line text-espresso">
                    {site.phone}
                  </a>{" "}
                  or ask the team before you order.
                </p>
              </div>
            </div>
          </aside>

          <div className="mt-10 lg:col-span-9 lg:mt-0">
            {menu.map((category, ci) => (
              <section
                key={category.id}
                id={category.id}
                aria-labelledby={`${category.id}-heading`}
                className={ci === 0 ? "scroll-mt-40" : "mt-20 scroll-mt-40 lg:mt-28"}
              >
                <div className="border-b border-sand pb-6">
                  <h2 id={`${category.id}-heading`} className="display text-display-md text-espresso">
                    {category.title}
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-mocha">
                    {category.intro}
                  </p>
                </div>

                <div className="grid gap-x-12 gap-y-12 pt-8 md:grid-cols-2">
                  {category.sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      aria-labelledby={`${section.id}-heading`}
                      className={section.columns ? "min-w-0 scroll-mt-40 md:col-span-2" : "min-w-0 scroll-mt-40"}
                    >
                      <h3
                        id={`${section.id}-heading`}
                        className="flex items-baseline gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-plum"
                      >
                        {section.title}
                        <span aria-hidden="true" className="h-px flex-1 bg-sand" />
                      </h3>
                      {section.note ? (
                        <p className="mt-2 text-sm text-mocha">{section.note}</p>
                      ) : null}
                      {section.columns ? (
                        <ul className="mt-2 divide-y divide-sand">
                          {section.items.map((item) => (
                            <WineRow key={item.name} item={item} columns={section.columns} />
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-2 divide-y divide-sand">
                          {section.items.map((item) => (
                            <PriceRow key={item.name} item={item} />
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-20 rounded-[2rem] border border-sand bg-plaster p-8 lg:p-10">
              <h2 className="serif text-2xl text-espresso">Allergens</h2>
              <p className="mt-4 max-w-[64ch] leading-relaxed text-espresso-soft">
                {ALLERGEN_STATEMENT}
              </p>
              <p className="mt-4 max-w-[64ch] text-sm text-mocha">{MENU_DISCLAIMER}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta href={site.phoneHref}>Call {site.phone}</Cta>
                <Cta href={`mailto:${site.email}`} variant="ghost">
                  Email the café
                </Cta>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
