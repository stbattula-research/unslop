"use client";

import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Footnotes — an FAQ styled like scholarly footnotes.
 * Numbered entries, hairline rules, serif questions. Uses system font stacks only.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  heading?: string;
  standfirst?: string;
  items: FaqItem[];
  className?: string;
}

export function Faq({ heading, standfirst, items, className }: FaqProps) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className={cn("w-full bg-[#faf7f0] text-stone-950 dark:bg-stone-950 dark:text-stone-50", className)}>
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        {(heading || standfirst) && (
          <div className="mb-10">
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

        <div className="border-t-2 border-stone-950 dark:border-stone-50">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.question}
                className="border-b border-stone-950/20 dark:border-stone-50/20"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-baseline gap-5 py-6 text-left"
                >
                  <span className="font-mono text-sm text-stone-500 dark:text-stone-400">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-serif text-xl font-bold tracking-tight">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-mono text-xl leading-none transition-transform duration-200",
                      isOpen && "rotate-45"
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pl-10 pr-4 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
