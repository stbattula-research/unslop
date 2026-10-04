import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Honest Button — workwear-inspired.
 * Chunky ink border, hard offset shadow, uppercase grotesk label.
 * No gradients, no glow, no glass. Uses system font stacks only.
 */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-300 text-stone-950 border-stone-950 hover:bg-amber-200 dark:bg-amber-300 dark:text-stone-950",
  secondary:
    "bg-stone-50 text-stone-950 border-stone-950 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-50 dark:border-stone-50 dark:hover:bg-stone-800",
  ghost:
    "bg-transparent text-stone-950 border-transparent hover:bg-stone-950/5 dark:text-stone-50 dark:hover:bg-stone-50/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-none border-2",
        "font-mono font-bold uppercase tracking-[0.14em]",
        "shadow-[4px_4px_0_0_#1c1917] transition-all duration-150",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1c1917]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "dark:shadow-[4px_4px_0_0_#e7e5e4] dark:hover:shadow-[2px_2px_0_0_#e7e5e4]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
