import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Weigh-In — a comparison table (us vs them) staged as a boxing
 * fight card. A "tale of the tape" stat block, numbered rounds with
 * check/cross marks, and a judge's decision at the end. Flat paper
 * and ink with a red corner accent, typography as the ornament,
 * no gradients, no cards, static.
 */

export interface TaleRow {
  /** e.g. "Founded" */
  label: string;
  /** e.g. "2026" */
  us: string;
  /** e.g. "2019" */
  them: string;
}

export interface FightRound {
  /** the feature being judged, e.g. "Exports to PDF" */
  feature: string;
  /** "yes" | "no" | "partial" | any short string — rendered as ✓ / ✕ / ≈ / text */
  us: string;
  them: string;
}

export interface VsTableProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** red corner — defaults to "Unslop" */
  usName?: string;
  /** blue corner — defaults to "The other guys" */
  themName?: string;
  tape?: TaleRow[];
  rounds: FightRound[];
  footnote?: string;
  className?: string;
}

function Mark({ value, side }: { value: string; side: "us" | "them" }) {
  const v = value.trim().toLowerCase();
  if (v === "yes") {
    return (
      <span
        aria-label="yes"
        className={cn(
          "text-2xl font-black",
          side === "us" ? "text-red-700 dark:text-red-400" : "text-stone-900 dark:text-stone-100"
        )}
      >
        ✓
      </span>
    );
  }
  if (v === "no") {
    return (
      <span aria-label="no" className="text-2xl font-light text-stone-400 dark:text-stone-600">
        ✕
      </span>
    );
  }
  if (v === "partial") {
    return (
      <span aria-label="partially" className="text-2xl font-black text-amber-600 dark:text-amber-400">
        ≈
      </span>
    );
  }
  return <span className="text-sm font-semibold leading-snug">{value}</span>;
}

export function VsTable({
  kicker = "The weigh-in · an honest comparison",
  heading = "Two contenders. One honest scorecard.",
  standfirst = "We asked both sides the same questions. One of them flinched.",
  usName = "Unslop",
  themName = "The other guys",
  tape = [
    { label: "Founded", us: "2026", them: "2019" },
    { label: "Price", us: "Free, MIT", them: "$29/mo" },
    { label: "Users", us: "You, hopefully", them: "Everyone else" },
  ],
  rounds,
  footnote,
  className,
}: VsTableProps) {
  const score = rounds.reduce(
    (acc, r) => {
      if (r.us.trim().toLowerCase() === "yes" && r.them.trim().toLowerCase() !== "yes") acc.us += 1;
      else if (r.them.trim().toLowerCase() === "yes" && r.us.trim().toLowerCase() !== "yes") acc.them += 1;
      return acc;
    },
    { us: 0, them: 0 }
  );
  const winner =
    score.us > score.them ? usName : score.them > score.us ? themName : "Nobody";

  return (
    <section
      className={cn(
        "w-full bg-[#faf7f0] text-stone-900 dark:bg-stone-950 dark:text-stone-50",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
          {kicker}
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl font-black tracking-tight md:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg italic text-stone-600 dark:text-stone-400">
          {standfirst}
        </p>

        {/* Tale of the tape */}
        <div className="mt-14 border-2 border-stone-900 dark:border-stone-50">
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b-2 border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950">
            <p className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
              Tale of the tape
            </p>
            <p className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-red-400 dark:text-red-700">
              Red corner — {usName}
            </p>
            <p className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300 dark:text-blue-800">
              Blue corner — {themName}
            </p>
          </div>
          {tape.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_1fr_1fr] border-b border-stone-900/20 last:border-b-0 dark:border-stone-50/20"
            >
              <p className="px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                {row.label}
              </p>
              <p className="px-4 py-3 font-serif text-lg font-bold">{row.us}</p>
              <p className="px-4 py-3 font-serif text-lg text-stone-500 dark:text-stone-400">
                {row.them}
              </p>
            </div>
          ))}
        </div>

        {/* Fight card */}
        <div className="mt-10 border-t-2 border-stone-900 dark:border-stone-50">
          {rounds.map((round, i) => (
            <div
              key={i}
              className="grid grid-cols-[3rem_1fr] items-center gap-x-4 border-b border-stone-900/20 py-5 md:grid-cols-[4rem_1fr_8rem_8rem] md:gap-x-8 dark:border-stone-50/20"
            >
              <p className="font-mono text-sm font-bold text-stone-400 dark:text-stone-600">
                R{i + 1 < 10 ? `0${i + 1}` : i + 1}
              </p>
              <p className="text-[15px] font-semibold leading-snug md:text-base">
                {round.feature}
              </p>
              <div className="col-start-2 flex items-center gap-3 md:col-start-3 md:justify-center">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 md:hidden dark:text-red-400">
                  Us
                </span>
                <Mark value={round.us} side="us" />
              </div>
              <div className="col-start-2 flex items-center gap-3 md:col-start-4 md:justify-center">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 md:hidden">
                  Them
                </span>
                <Mark value={round.them} side="them" />
              </div>
            </div>
          ))}
        </div>

        {/* The decision */}
        <div className="mt-12 bg-stone-900 px-6 py-10 text-center text-stone-50 md:py-12 dark:bg-stone-50 dark:text-stone-950">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
            The judges' decision
          </p>
          <p className="mt-3 font-serif text-6xl font-black tracking-tight md:text-7xl">
            {score.us} <span className="text-stone-500 dark:text-stone-400">–</span> {score.them}
          </p>
          <p className="mt-4 inline-block -rotate-2 border-2 border-red-500 px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-red-400 dark:text-red-700">
            Winner: {winner}
          </p>
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
