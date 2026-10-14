import { Appear } from "./appear";
import { Button } from "./button";

type Props = {
  eyebrow: string;
  title: string;
  copy?: string;
  image?: string;
  ctas: { label: string; href: string; external?: boolean }[];
};

/** Closing dark band used at the foot of inner pages. */
export function CtaBand({ eyebrow, title, copy, image, ctas }: Props) {
  return (
    <section data-dark className="section-lg relative overflow-clip bg-ink-900">
      {image && <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
      <div className="dark-strip absolute inset-0" />
      <div className="container relative flex flex-col gap-8 tablet:flex-row tablet:items-end tablet:justify-between">
        <div className="flex max-w-[560px] flex-col gap-3">
          <Appear>
            <p className="caption2 !text-ink-200">{eyebrow}</p>
          </Appear>
          <Appear delay={0.1}>
            <h2 className="h2 !text-ink-50">{title}</h2>
          </Appear>
          {copy && (
            <Appear delay={0.2}>
              <p className="body-sm !text-ink-200">{copy}</p>
            </Appear>
          )}
        </div>
        <Appear delay={0.3} className="flex flex-wrap gap-2.5">
          {ctas.map((c) => (
            <Button key={c.href} label={c.label} href={c.href} external={c.external} variant="secondary" />
          ))}
        </Appear>
      </div>
    </section>
  );
}
