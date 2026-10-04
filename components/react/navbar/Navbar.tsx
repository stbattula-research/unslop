import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Masthead — a print-editorial navbar.
 * Serif wordmark between thin rules, an issue-date line, and a
 * subscription box. Structured like a newspaper front page, not a SaaS bar.
 * Uses system font stacks only.
 */

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  wordmark: string;
  dateline?: string;
  links?: NavbarLink[];
  cta?: { label: string; href: string };
  className?: string;
}

export function Navbar({
  wordmark,
  dateline,
  links = [],
  cta,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full border-b-2 border-stone-950 bg-stone-50 text-stone-950",
        "dark:border-stone-100 dark:bg-stone-950 dark:text-stone-50",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Dateline row */}
        <div className="flex items-center justify-between border-b border-stone-950/20 py-2 dark:border-stone-50/20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
            {dateline ?? "Est. MMXXVI · Printed on recycled pixels"}
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:block dark:text-stone-400">
            Vol. I — No. 1
          </p>
        </div>

        {/* Masthead row */}
        <div className="flex items-center justify-between gap-4 py-5">
          <nav className="hidden flex-1 items-center gap-6 md:flex" aria-label="Primary">
            {links.slice(0, 3).map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="/"
            className="flex-1 text-center font-serif text-3xl font-black tracking-tight md:text-4xl"
          >
            {wordmark}
          </a>

          <div className="flex flex-1 items-center justify-end gap-4">
            <nav className="hidden items-center gap-6 md:flex" aria-label="Secondary">
              {links.slice(3).map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            {cta && (
              <a
                href={cta.href}
                className="border-2 border-stone-950 bg-stone-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-stone-50 transition-colors hover:bg-stone-800 dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
              >
                {cta.label}
              </a>
            )}
          </div>
        </div>

        {/* Mobile links */}
        {links.length > 0 && (
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-stone-950/20 py-3 md:hidden dark:border-stone-50/20"
            aria-label="Mobile"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
