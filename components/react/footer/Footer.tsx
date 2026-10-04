import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Colophon — a footer set like a book's colophon.
 * Small caps, credits, set-in-type details, hairline rules.
 * Uses system font stacks only.
 */

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  wordmark: string;
  tagline?: string;
  columns?: FooterColumn[];
  colophon?: string;
  className?: string;
}

export function Footer({ wordmark, tagline, columns = [], colophon, className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("w-full bg-stone-950 text-stone-300", className)}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="font-serif text-3xl font-black tracking-tight text-stone-50">
              {wordmark}
            </p>
            {tagline && (
              <p className="mt-3 max-w-xs font-serif text-sm italic text-stone-400">
                {tagline}
              </p>
            )}
          </div>

          {columns.length > 0 && (
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Footer">
              {columns.map((col) => (
                <div key={col.heading}>
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500">
                    {col.heading}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="text-sm text-stone-300 underline-offset-4 hover:text-stone-50 hover:underline"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="mt-14 border-t border-stone-50/15 pt-8">
          <p className="max-w-3xl font-mono text-[11px] uppercase leading-loose tracking-[0.18em] text-stone-500">
            {colophon ??
              "Colophon — Set in the system serif and grotesk. Printed on recycled pixels. No gradients were harmed in the making of this footer."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
              © {year} {wordmark}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
              Finis coronat opus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
