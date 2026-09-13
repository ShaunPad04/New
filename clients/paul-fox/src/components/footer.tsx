import { footer, offices, social } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Button } from "./button";
import { Facebook, Instagram, LinkedIn } from "./icons";

const SOCIAL_ICON = { facebook: Facebook, instagram: Instagram, linkedin: LinkedIn } as const;

/**
 * "Keep in touch" link: the brand mark sits in a hairline chip that fills
 * white and lifts on hover while the label slides in behind it.
 */
function SocialLink({ item }: { item: (typeof social)[number] }) {
  const Icon = SOCIAL_ICON[item.icon];
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 !text-ink-200 transition-colors duration-300 hover:!text-ink-50"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-ink-200/30 transition-[background-color,transform,box-shadow] duration-[400ms] ease-[var(--ease-hover)] group-hover:-translate-y-0.5 group-hover:bg-ink-50 group-hover:text-ink-900 group-hover:ring-ink-50 motion-reduce:group-hover:translate-y-0">
        <Icon size={15} className="transition-transform duration-[400ms] ease-[var(--ease-hover)] group-hover:scale-110 motion-reduce:group-hover:scale-100" />
      </span>
      <span className="body-sm !text-current transition-transform duration-[400ms] ease-[var(--ease-hover)] group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
        {item.label}
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-950 py-10">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-10 tablet:flex-row tablet:justify-between">
          <div className="flex w-full flex-col gap-5 tablet:w-[300px]">
            <p className="body-lg !text-ink-50">{footer.wordmark}</p>
            <p className="caption hidden !text-ink-200 tablet:block">{footer.blurb}</p>
            <div>
              <Button variant="secondary" label={footer.cta.label} href={footer.cta.href} />
            </div>
            <div className="flex items-center gap-5 pt-2">
              <img src={asset("guild-logo.png")} alt="The Guild of Property Professionals" loading="lazy" className="h-10 w-auto" />
              <img src={asset("property-ombudsman.png")} alt="The Property Ombudsman" loading="lazy" className="h-10 w-auto" />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-20 gap-y-10">
            <div className="flex flex-col gap-3">
              <p className="body !text-ink-50">{footer.social.heading}</p>
              {social.map((item) => (
                <SocialLink key={item.href} item={item} />
              ))}
            </div>
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
