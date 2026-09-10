import { Appear } from "./appear";
import { Button } from "./button";

type Cta = { label: string; href: string; external?: boolean };

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  image?: string;
  imageAlt?: string;
  ctas?: Cta[];
  /** Compact header for text-only pages (legal, 404). */
  compact?: boolean;
};

/**
 * Inner-page opener: a dark stage with an optional photograph, the eyebrow
 * label, a lower-case display heading and a short lede. Marked `data-dark`
 * so the fixed nav inverts to white while it is in view.
 */
export function PageHeader({ eyebrow, title, copy, image, imageAlt = "", ctas, compact }: PageHeaderProps) {
  return (
    <section
      data-dark
      className={`relative flex flex-col justify-end overflow-clip bg-ink-900 ${compact ? "min-h-[320px] tablet:min-h-[380px]" : "min-h-[520px] tablet:min-h-[70vh]"}`}
    >
      {image && (
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-70" fetchPriority="high" />
      )}
      <div className="dark-strip absolute inset-x-0 bottom-0 h-[60%]" />
      <div className="container relative flex flex-col gap-5 pb-10 pt-40 tablet:flex-row tablet:items-end tablet:justify-between">
        <div className="flex max-w-[720px] flex-col gap-4">
          <Appear onMount>
            <p className="caption2 !text-ink-200">{eyebrow}</p>
          </Appear>
          <Appear onMount delay={0.1}>
            <h1 className="h1 !text-ink-50">{title}</h1>
          </Appear>
          {copy && (
            <Appear onMount delay={0.2}>
              <p className="body-sm max-w-[560px] !text-ink-200">{copy}</p>
            </Appear>
          )}
        </div>
        {ctas && ctas.length > 0 && (
          <Appear onMount delay={0.3} className="flex flex-wrap gap-2.5">
            {ctas.map((c, i) => (
              <Button key={c.href} label={c.label} href={c.href} external={c.external} variant={i === 0 ? "secondary" : "icon"} />
            ))}
          </Appear>
        )}
      </div>
    </section>
  );
}
