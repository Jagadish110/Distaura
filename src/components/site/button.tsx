import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "alt" | "line";
type Size = "lg" | "md" | "sm";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
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
        "btn",
        (variant === "alt" || variant === "line") && "alt",
        size === "sm" && "sm",
        size === "lg" && "!px-8 !py-4 text-lg",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
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
        "btn",
        (variant === "alt" || variant === "line") && "alt",
        size === "sm" && "sm",
        size === "lg" && "!px-8 !py-4 text-lg",
        className,
      )}
      {...props}
    />
  );
}
