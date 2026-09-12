import type { ReactNode } from "react";
import { Appear } from "@/components/appear";
import { cn } from "@/lib/utils";

/**
 * Inner-page hero — reference geometry: 180px top padding under the fixed
 * header, 80px bottom; eyebrow + 56px/600 h1 in a 600px column on the left,
 * an 18px description in a 400px column bottom-right.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section className={cn("pt-[140px] pb-12 md:pt-[180px] md:pb-20", className)}>
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className={cn("flex flex-col gap-4", wide ? "max-w-[760px]" : "max-w-[600px]")}>
            <Appear><p className="eyebrow">{eyebrow}</p></Appear>
            <Appear delay={0.1}><h1 className="h-page">{title}</h1></Appear>
          </div>
          {description ? (
            <Appear delay={0.2} className="max-w-[400px]">
              <p className="lede">{description}</p>
            </Appear>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
