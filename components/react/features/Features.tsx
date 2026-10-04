import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Ledger — features as an archival index.
 * Numbered rows with hairline dividers and mono index numbers,
 * like a field guide or a library catalog. Uses system font stacks only.
 */

export interface FeatureItem {
  title: string;
  description: string;
  tag?: string;
}

export interface FeaturesProps {
  heading?: string;
  standfirst?: string;
  items: FeatureItem[];
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Features({ heading, standfirst, items, className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "w-full bg-stone-100 text-stone-950 dark:bg-stone-900 dark:text-stone-50",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {(heading || standfirst) && (
          <div className="mb-12 max-w-2xl">
            {heading && (
              <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
                {heading}
              </h2>
            )}
            {standfirst && (
              <p className="mt-4 font-serif text-lg italic text-stone-600 dark:text-stone-400">
                {standfirst}
              </p>
            )}
          </div>
        )}

        <ol className="divide-y divide-stone-950/15 border-y border-stone-950/15 dark:divide-stone-50/15 dark:border-stone-50/15">
          {items.map((item, i) => (
            <li
              key={item.title}
              className="group grid gap-3 py-7 transition-colors sm:grid-cols-[72px_1fr_2fr] sm:items-baseline sm:gap-8"
            >
              <span className="font-mono text-sm text-stone-500 dark:text-stone-400">
                {pad(i + 1)}
              </span>
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                {item.title}
                {item.tag && (
                  <span className="ml-3 inline-block -translate-y-1 border border-stone-950/40 px-2 py-0.5 align-middle font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-stone-600 dark:border-stone-50/40 dark:text-stone-400">
                    {item.tag}
                  </span>
                )}
              </h3>
              <p className="max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
