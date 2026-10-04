import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Manifesto — an asymmetric editorial hero.
 * Oversized serif display type, left-aligned (never centered), a mono kicker,
 * and a marginalia column. Warm paper with a faint dotted texture.
 * Uses system font stacks only.
 */

export interface HeroProps {
  kicker?: string;
  title: React.ReactNode;
  lede?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  marginNote?: React.ReactNode;
  className?: string;
}

export function Hero({
  kicker,
  title,
  lede,
  primaryCta,
  secondaryCta,
  marginNote,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-[#f6f1e7] text-stone-950",
        "bg-[image:radial-gradient(#d9d0ba_1px,transparent_1.5px)] bg-[size:26px_26px]",
        "dark:bg-stone-950 dark:text-stone-50 dark:bg-none",
        className
      )}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1fr_280px]">
        <div>
          {kicker && (
            <p className="mb-6 inline-block border-y border-stone-950/30 py-1.5 font-mono text-xs uppercase tracking-[0.28em] dark:border-stone-50/30">
              {kicker}
            </p>
          )}
          <h1 className="max-w-3xl font-serif text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            {title}
          </h1>
          {lede && (
            <p className="mt-8 max-w-xl font-serif text-xl italic leading-relaxed text-stone-700 dark:text-stone-300">
              {lede}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {primaryCta && (
                <a
                  href={primaryCta.href}
                  className="border-2 border-stone-950 bg-stone-950 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-stone-50 shadow-[4px_4px_0_0_#b45309] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#b45309] dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950 dark:shadow-[4px_4px_0_0_#b45309]"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="font-mono text-sm font-bold uppercase tracking-[0.14em] underline decoration-amber-700 decoration-2 underline-offset-8 hover:decoration-4"
                >
                  {secondaryCta.label} →
                </a>
              )}
            </div>
          )}
        </div>

        {marginNote && (
          <aside className="hidden border-l-2 border-stone-950/20 pl-6 lg:block dark:border-stone-50/20">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
              Marginalia
            </p>
            <div className="mt-4 font-serif text-sm italic leading-relaxed text-stone-600 dark:text-stone-400">
              {marginNote}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
