import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "black" | "secondary" | "outline" | "white";

/**
 * Button — measured from the reference "Main/Black" component:
 * 44px tall, 12px radius, padding 8px 8px 8px 16px, 14px label, and a
 * white 28px circle holding an arrow. On hover the button eases to 85%
 * opacity (650ms) and the arrow swaps upward (the reference stacks two
 * arrows and slides them; same idea here with translate + opacity).
 */
export function Button({
  href,
  children,
  variant = "black",
  arrow = true,
  className,
  onClick,
  type,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = cn(
    "group inline-flex h-11 items-center gap-3 rounded-[12px] text-sm font-normal leading-none whitespace-nowrap",
    "transition-[opacity,transform,background-color,color,border-color] duration-[650ms] ease-out-soft",
    "hover:opacity-85 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none",
    arrow ? "pl-4 pr-2" : "px-5",
    variant === "black" && "bg-ink text-white card-shadow",
    variant === "secondary" && "bg-mist text-ink",
    variant === "white" && "bg-white text-ink",
    variant === "outline" && "border border-line bg-transparent text-ink hover:border-ink",
    className
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? (
        <span
          aria-hidden="true"
          className={cn(
            "relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full",
            variant === "black" ? "bg-white text-ink" : "bg-ink text-white"
          )}
        >
          <ArrowIcon className="absolute transition-transform duration-[650ms] ease-out-soft group-hover:-translate-y-[14px] group-hover:translate-x-[14px]" />
          <ArrowIcon className="absolute translate-x-[-14px] translate-y-[14px] transition-transform duration-[650ms] ease-out-soft group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      ) : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={base} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={base} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-3.5 w-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
