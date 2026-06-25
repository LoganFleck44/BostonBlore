import Link from "next/link";
import { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wide rounded-md transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-white hover:bg-ember-600 ember-glow hover:-translate-y-0.5",
  outline:
    "border border-ink-600 text-bone hover:border-ember hover:text-ember",
  ghost: "text-bone hover:text-ember",
};

const sizes: Record<Size, string> = {
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  size?: Size;
} & Omit<ComponentProps<typeof Link>, "href">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonAsLink) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
