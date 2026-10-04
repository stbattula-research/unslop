import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Poster — a Swiss-poster call to action.
 * Flat color, oversized grotesk type, a rubber-stamp badge.
 * Zero subtlety. Uses system font stacks only.
 */

export interface CtaBannerProps {
  eyebrow?: string;
  headline: React.ReactNode;
  sub?: string;
  cta: { label: string; href: string };
  stamp?: string;
  className?: string;
}

export function CtaBanner({ eyebrow, headline, sub, cta, stamp, className }: CtaBannerProps) {
  return (
    <section className={cn("w-full bg-red-700 text-stone-50", className)}>
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 py-20 md:py-28">
        {/* Giant ghost numeral, purely decorative */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 select-none font-sans text-[16rem] font-black leading-none text-stone-50/10 md:text-[24rem]"
        >
          !
        </span>

        {stamp && (
          <span className="absolute right-8 top-8 hidden rotate-12 border-4 border-stone-50 px-4 py-2 font-mono text-sm font-bold uppercase tracking-[0.24em] md:block">
            {stamp}
          </span>
        )}

        <div className="relative max-w-3xl">
          {eyebrow && (
            <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.3em] text-stone-50/80">
              {eyebrow}
            </p>
          )}
          <h2 className="font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-8xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-stone-50/90">
              {sub}
            </p>
          )}
          <a
            href={cta.href}
            className="mt-10 inline-block border-2 border-stone-50 bg-stone-50 px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.16em] text-red-800 shadow-[6px_6px_0_0_#1c1917] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_#1c1917]"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
