import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Margin Notes — testimonials as literary pull-quotes.
 * Oversized serif type with a giant quotation mark and book-blurb
 * attribution. No star ratings, no avatar circles. Uses system font stacks only.
 */

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  marginNote?: string;
}

export interface TestimonialsProps {
  heading?: string;
  items: Testimonial[];
  className?: string;
}

export function Testimonials({ heading, items, className }: TestimonialsProps) {
  return (
    <section className={cn("w-full bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50", className)}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {heading && (
          <h2 className="mb-14 font-serif text-4xl font-black tracking-tight md:text-5xl">
            {heading}
          </h2>
        )}

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {items.map((t) => (
            <figure key={t.name} className="relative border-t-2 border-stone-950 pt-8 dark:border-stone-50">
              <span
                aria-hidden="true"
                className="absolute -top-7 left-0 select-none font-serif text-7xl font-black leading-none text-amber-600"
              >
                &ldquo;
              </span>
              <blockquote className="font-serif text-xl italic leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                  — {t.name}
                </p>
                {t.role && (
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                    {t.role}
                  </p>
                )}
                {t.marginNote && (
                  <p className="mt-3 border-l-2 border-amber-600 pl-3 font-serif text-sm italic text-stone-600 dark:text-stone-400">
                    {t.marginNote}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
