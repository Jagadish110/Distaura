import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  solid: "bg-paper text-ink hover:bg-brass-hi border-transparent",
  line: "border-brass text-brass-hi hover:bg-brass/10 bg-transparent",
} as const;

const sizes = {
  lg: "h-13 px-8 text-base md:text-lg font-medium",
  md: "h-12 px-7 text-base",
  sm: "h-11 px-5 text-sm",
} as const;

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium",
        "transition-[transform,background-color,box-shadow] duration-150 ease-out",
        "active:scale-[0.96]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  type = "submit",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium",
        "transition-[transform,background-color] duration-150 ease-out",
        "active:not-disabled:scale-[0.96] disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
