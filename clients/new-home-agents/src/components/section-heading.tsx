import type { ReactNode } from "react";
import { Appear } from "@/components/appear";
import { cn } from "@/lib/utils";

/**
 * Section heading row — eyebrow + 48px heading on the left (600px column),
 * an 18px description bottom-aligned on the right (400px column), 64px
 * below to the content. Measured from every homepage section on the
 * reference.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  align = "split",
  className,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  align?: "split" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  if (align === "center") {
    return (
      <div className={cn("mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center", className)}>
        <Appear><p className="eyebrow">{eyebrow}</p></Appear>
        <Appear delay={0.1}><Tag className="h-section">{title}</Tag></Appear>
        {description ? <Appear delay={0.2}><p className="lede">{description}</p></Appear> : null}
        {aside ? <Appear delay={0.3}><div className="mt-2">{aside}</div></Appear> : null}
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex max-w-[600px] flex-col gap-4">
        <Appear><p className="eyebrow">{eyebrow}</p></Appear>
        <Appear delay={0.1}><Tag className="h-section">{title}</Tag></Appear>
      </div>
      {description || aside ? (
        <Appear delay={0.2} className="flex max-w-[400px] flex-col items-start gap-4 md:items-end md:text-left">
          {description ? <p className="lede">{description}</p> : null}
          {aside}
        </Appear>
      ) : null}
    </div>
  );
}
