import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Menu — pricing laid out like a bistro menu.
 * Serif prices, dotted leaders, and one "chef's pick" tier set in ink.
 * Uses system font stacks only.
 */

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface PricingProps {
  heading?: string;
  standfirst?: string;
  tiers: PricingTier[];
  footnote?: string;
  className?: string;
}

export function Pricing({ heading, standfirst, tiers, footnote, className }: PricingProps) {
  return (
    <section className={cn("w-full bg-[#faf7f0] text-stone-950 dark:bg-stone-950 dark:text-stone-50", className)}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {(heading || standfirst) && (
          <div className="mb-14 text-center">
            {heading && (
              <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
                {heading}
              </h2>
            )}
            {standfirst && (
              <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-stone-600 dark:text-stone-400">
                {standfirst}
              </p>
            )}
            <div className="mx-auto mt-6 flex max-w-xs items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-stone-950/25 dark:bg-stone-50/25" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">✦</span>
              <span className="h-px flex-1 bg-stone-950/25 dark:bg-stone-50/25" />
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "relative flex flex-col border-2 p-8",
                tier.featured
                  ? "border-stone-950 bg-stone-950 text-stone-50 shadow-[8px_8px_0_0_#b45309] dark:border-stone-50 dark:bg-stone-900"
                  : "border-stone-950/25 bg-transparent dark:border-stone-50/25"
              )}
            >
              {tier.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 -rotate-2 border-2 border-stone-950 bg-amber-300 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-950 dark:border-stone-50">
                  Chef&rsquo;s pick
                </span>
              )}

              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.28em]">
                {tier.name}
              </h3>

              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-black tracking-tight">{tier.price}</span>
                {tier.period && (
                  <span className={cn("font-mono text-xs uppercase tracking-[0.18em]", tier.featured ? "text-stone-400" : "text-stone-500")}>
                    {tier.period}
                  </span>
                )}
              </p>

              {tier.blurb && (
                <p className={cn("mt-3 font-serif text-sm italic", tier.featured ? "text-stone-300" : "text-stone-600 dark:text-stone-400")}>
                  {tier.blurb}
                </p>
              )}

              <ul className="mt-7 flex-1 space-y-0">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={cn(
                      "flex items-baseline gap-2 border-b border-dotted py-2.5 text-[15px]",
                      tier.featured ? "border-stone-50/25" : "border-stone-950/25 dark:border-stone-50/25"
                    )}
                  >
                    <span className="flex-1">{f}</span>
                    <span aria-hidden="true" className={tier.featured ? "text-amber-300" : "text-amber-700"}>
                      ✓
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.cta.href}
                className={cn(
                  "mt-8 block border-2 px-5 py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.14em] transition-colors",
                  tier.featured
                    ? "border-amber-300 bg-amber-300 text-stone-950 hover:bg-amber-200"
                    : "border-stone-950 hover:bg-stone-950 hover:text-stone-50 dark:border-stone-50 dark:hover:bg-stone-50 dark:hover:text-stone-950"
                )}
              >
                {tier.cta.label}
              </a>
            </article>
          ))}
        </div>

        {footnote && (
          <p className="mx-auto mt-12 max-w-xl text-center font-serif text-sm italic text-stone-500 dark:text-stone-400">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
