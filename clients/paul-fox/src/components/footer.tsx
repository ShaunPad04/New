import { footer, offices } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Button } from "./button";

export function Footer() {
  return (
    <footer className="bg-ink-950 py-10">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-10 tablet:flex-row tablet:justify-between">
          <div className="flex w-full flex-col gap-5 tablet:w-[300px]">
            <p className="body-lg !text-ink-50">{footer.wordmark}</p>
            <p className="caption !text-ink-200">{footer.blurb}</p>
            <div>
              <Button variant="secondary" label={footer.cta.label} href={footer.cta.href} />
            </div>
            <div className="flex items-center gap-5 pt-2">
              <img src={asset("guild-logo.png")} alt="The Guild of Property Professionals" loading="lazy" className="h-10 w-auto" />
              <img src={asset("property-ombudsman.png")} alt="The Property Ombudsman" loading="lazy" className="h-10 w-auto" />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-20 gap-y-10">
            {footer.columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="body !text-ink-50">{col.heading}</p>
                {col.links.map((link) => (
                  <a
                    key={link.href + link.label}
                    href={link.href}
                    className="body-sm !text-ink-200 transition-colors duration-300 hover:!text-ink-50"
                    {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <p className="body !text-ink-50">Our offices</p>
              {offices.map((o) => (
                <a
                  key={o.name}
                  href={`tel:${o.phone.replace(/\s/g, "")}`}
                  className="body-sm !text-ink-200 transition-colors duration-300 hover:!text-ink-50"
                >
                  {o.name} — {o.phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footer.legal.map((l) => (
              <a key={l.href} href={l.href} className="caption !text-ink-200 transition-colors duration-300 hover:!text-ink-50">
                {l.label}
              </a>
            ))}
          </div>
          <p className="caption !text-ink-200">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
