import { formatAddress, site } from "@/lib/site";

/**
 * MAP PREVIEW
 *
 * A lightweight, no-third-party map plate: a designed street-grid
 * illustration with a pin at the café, and links out to Google Maps for
 * the real thing. No embed iframe is loaded — an embedded map is the
 * heaviest third-party payload a café site can carry, and it is not
 * needed to find a shop on a named street. The plate is decorative; the
 * address and links carry the information.
 */
export function MapPreview() {
  return (
    <div className="relative min-h-[18rem] overflow-hidden bg-plaster lg:min-h-[22rem]">
      {/* Street grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(43,29,24,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(43,29,24,0.08) 1px, transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 60% at 62% 50%, rgba(240,181,144,0.35) 0%, transparent 70%), linear-gradient(115deg, transparent 55%, rgba(155,178,131,0.18) 56%, rgba(155,178,131,0.18) 100%)",
        }}
      />
      {/* Sea View Street */}
      <div
        aria-hidden="true"
        className="absolute left-[-10%] right-[-10%] top-1/2 h-10 -translate-y-1/2 -rotate-[8deg] bg-cream/80"
      />
      <span
        aria-hidden="true"
        className="absolute left-[16%] top-1/2 -translate-y-1/2 -rotate-[8deg] text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-mocha"
      >
        Sea View Street
      </span>
      {/* Pin */}
      <div aria-hidden="true" className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-full">
        <span className="display flex h-11 w-11 items-center justify-center rounded-full bg-plum text-xl text-cream shadow-[0_18px_30px_-12px_rgba(91,42,58,0.6)]">
          M
        </span>
        <span className="mx-auto block h-3 w-px bg-plum" />
      </div>

      <div className="relative flex h-full min-h-[18rem] flex-col justify-end p-6 lg:min-h-[22rem] lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[26rem] rounded-[1.25rem] border border-sand bg-cream/85 p-4 text-sm leading-relaxed text-espresso-soft backdrop-blur-sm">
            <span className="serif block text-lg text-espresso">{site.name}</span>
            {formatAddress()}
          </p>
          <a
            href={site.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line self-start text-sm font-medium text-espresso sm:self-auto"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}
