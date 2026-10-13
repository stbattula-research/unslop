import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Logbook — release notes kept like a ship's log.
 * Dated entries, oversized version numerals, and rubber-stamp
 * change tags. Flat color, no cards, no motion. Uses system font
 * stacks only (pair with a serif via `font-serif` mapping to Fraunces
 * or Georgia).
 */

export type ChangelogTag = "new" | "improved" | "fixed";

export interface ChangelogItem {
  /** new | improved | fixed — rendered as a rubber stamp. */
  tag: ChangelogTag;
  text: string;
}

export interface ChangelogEntry {
  /** e.g. "2.4.0" */
  version: string;
  /** e.g. "The Cartographer" */
  codename?: string;
  /** e.g. "October 9, 2026" — plain text, your format. */
  date: string;
  items: ChangelogItem[];
}

export interface ChangelogProps {
  heading?: string;
  standfirst?: string;
  entries: ChangelogEntry[];
  footnote?: string;
  className?: string;
}

const TAG_LABEL: Record<ChangelogTag, string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

const TAG_STYLE: Record<ChangelogTag, string> = {
  new: "border-stone-950 bg-amber-300 text-stone-950 dark:border-stone-50 dark:bg-amber-200",
  improved:
    "border-stone-950 bg-stone-950 text-stone-50 dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950",
  fixed: "border-stone-950 bg-transparent text-stone-950 dark:border-stone-50 dark:text-stone-50",
};

export function Changelog({
  heading = "Every voyage, logged.",
  standfirst = "What changed, when it shipped, and nothing we would be embarrassed to read aloud.",
  entries,
  footnote,
  className,
}: ChangelogProps) {
  return (
    <section
      className={cn(
        "w-full bg-[#faf7f0] text-stone-950 dark:bg-stone-950 dark:text-stone-50",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
          The logbook · release notes
        </p>
        <h2 className="mt-4 font-serif text-4xl font-black tracking-tight md:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg italic text-stone-600 dark:text-stone-400">
          {standfirst}
        </p>

        <div className="mt-14 border-t-2 border-stone-950 dark:border-stone-50">
          {entries.map((entry) => (
            <article
              key={entry.version}
              className="grid gap-6 border-b border-stone-950/20 py-10 md:grid-cols-[11rem_1fr] md:gap-10 dark:border-stone-50/20"
            >
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                  {entry.date}
                </p>
                <p className="mt-2 font-serif text-6xl font-black tracking-tight">
                  {entry.version}
                </p>
                {entry.codename && (
                  <p className="mt-2 font-serif text-base italic text-stone-600 dark:text-stone-400">
                    “{entry.codename}”
                  </p>
                )}
              </div>

              <ul className="m-0 list-none space-y-4 p-0">
                {entry.items.map((item, i) => (
                  <li key={i} className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "inline-block -rotate-1 border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap",
                        TAG_STYLE[item.tag]
                      )}
                    >
                      {TAG_LABEL[item.tag]}
                    </span>
                    <span className="text-[15px] leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
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
