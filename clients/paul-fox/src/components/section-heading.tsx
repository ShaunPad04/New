import { Appear } from "./appear";
import { Button } from "./button";

type Props = {
  eyebrow: string;
  title: string;
  copy?: string;
  cta?: { label: string; href: string };
  dark?: boolean;
};

export function SectionHeading({ eyebrow, title, copy, cta, dark }: Props) {
  const tone = dark ? "!text-ink-50" : "";
  return (
    <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
      <div className="flex flex-col gap-3 tablet:max-w-[560px]">
        <Appear>
          <p className={`caption2 ${dark ? "!text-ink-200" : ""}`}>{eyebrow}</p>
        </Appear>
        <Appear delay={0.1}>
          <h2 className={`h2 ${tone}`}>{title}</h2>
        </Appear>
      </div>
      {(copy || cta) && (
        <div className="flex flex-col gap-5 tablet:max-w-[460px]">
          {copy && (
            <Appear delay={0.2}>
              <p className={`body-sm ${dark ? "!text-ink-200" : ""}`}>{copy}</p>
            </Appear>
          )}
          {cta && (
            <Appear delay={0.3}>
              <Button label={cta.label} href={cta.href} variant={dark ? "secondary" : "primary"} />
            </Appear>
          )}
        </div>
      )}
    </div>
  );
}
