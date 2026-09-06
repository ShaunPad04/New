import { business, services } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";

export function Footer() {
  return (
    <footer className="border-t border-obsidian-line bg-obsidian py-16">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-6 text-sm leading-relaxed text-bone-muted">
              Vintage and pre-owned wristwatches in the Royal Arcade, Old Bond
              Street, since {business.onBondStreetSince}.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <dt className="spec-label">Warranty</dt>
              <dd className="mt-3 text-sm text-bone-dim">
                {business.warrantyYears} years on every watch, covering function
                and originality.
              </dd>
            </div>
            <div>
              <dt className="spec-label">Shipping</dt>
              <dd className="mt-3 text-sm text-bone-dim">
                Free next-day UK delivery and free worldwide shipping, fully
                insured.
              </dd>
            </div>
            <div>
              <dt className="spec-label">Part exchange</dt>
              <dd className="mt-3 text-sm text-bone-dim">
                {services[2].body}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-obsidian-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="spec-label">
            {business.address.street}, {business.address.locality}{" "}
            {business.address.postcode}
          </p>
          <div className="flex gap-6">
            <a
              href={business.phoneHref}
              className="spec-label transition-colors duration-300 hover:text-champagne"
            >
              {business.phone}
            </a>
            <a
              href={`mailto:${business.email}`}
              className="spec-label transition-colors duration-300 hover:text-champagne"
            >
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
