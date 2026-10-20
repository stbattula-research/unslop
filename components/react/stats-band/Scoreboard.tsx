import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Scoreboard — a stats band staged as a stadium scoreboard.
 * Warm-black LED board, oversized amber tabular numerals, uppercase
 * mono labels, and a sports-ticker strip of small print along the
 * bottom. The board stays dark in both modes — a scoreboard never
 * goes light. Flat color with conviction, typography as the ornament,
 * no gradients, no number-grid template, static.
 */

export interface BoardStat {
  /** e.g. "12,408" — the big amber tabular numeral */
  value: string;
  /** e.g. "Sites shipped" — uppercase mono label */
  label: string;
  /** e.g. "give or take a weekend" — small honest sub note */
  sub?: string;
}

export interface ScoreboardProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  stats: BoardStat[];
  /** sports-ticker items printed along the board's bottom edge */
  ticker?: string[];
  footnote?: string;
  className?: string;
}

export function Scoreboard({
  kicker = "The scoreboard · proof, without the fine print",
  heading = "Big numbers. Read aloud.",
  standfirst = "Every stat on this board earned its place. The small print disagrees with marketing, politely.",
  stats = [
    { value: "12,408", label: "Sites shipped", sub: "give or take a weekend" },
    { value: "99.1%", label: "Gradient-free guarantee", sub: "the 0.9% is that comma" },
    { value: "0", label: "Star ratings shown", sub: "nobody believed them anyway" },
    { value: "14", label: "Human-grade components", sub: "this shelf, plus your taste" },
  ],
  ticker = [
    "Numbers rounded by marketing",
    "Audited by nobody",
    "Trends pointing up since Tuesday",
    "Footnotes available on request",
  ],
  footnote,
  className,
}: ScoreboardProps) {
  return (
    <section
      className={cn(
        // Dark by genre, not by theme: a scoreboard never goes light.
        "w-full bg-[#161310] text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-red-700 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </span>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
            {kicker}
          </p>
        </div>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl font-black tracking-tight md:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg italic text-stone-400">
          {standfirst}
        </p>

        {/* The board */}
        <div className="mt-14 border-2 border-stone-700/60">
          <div className="grid grid-cols-2 gap-px bg-stone-700/60 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="min-w-0 bg-[#161310] p-6 md:p-8">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  S{i + 1 < 10 ? `0${i + 1}` : i + 1}
                </p>
                <p className="mt-4 whitespace-nowrap font-mono text-[1.75rem] font-black tabular-nums tracking-tight text-amber-400 md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-4 break-words font-mono text-xs font-bold uppercase tracking-[0.25em] text-stone-200">
                  {stat.label}
                </p>
                {stat.sub && (
                  <p className="mt-1 font-serif text-sm italic text-stone-500">
                    {stat.sub}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Sports ticker: the small print, on the record */}
          <div className="border-t-2 border-stone-700/60 px-6 py-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
              {ticker.join("  ▪  ")}
            </p>
          </div>
        </div>

        {footnote && (
          <p className="mx-auto mt-12 max-w-xl text-center font-serif text-sm italic text-stone-500">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
