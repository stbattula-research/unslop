import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Gallery Wall — a logo cloud staged as a museum gallery wall.
 * Each logo hangs in its own frame, set in a different type treatment
 * (serif, grotesk, mono, italic, small caps, black weight) the way a
 * gallery hangs different artists on one wall — and each frame gets a
 * wall plaque: exhibit number, medium, year. No greyed-out logo soup,
 * no five-column strip of apologetic thumbnails. Flat paper, hairline
 * rules, typography as the ornament, static.
 */

export type LogoTreatment =
  | "serif"
  | "grotesk"
  | "mono"
  | "italic"
  | "smallcaps"
  | "black";

export interface WallLogo {
  /** e.g. "Northwind & Co." — the wordmark itself is the exhibit */
  name: string;
  /** e.g. "Wordmark, ink on paper" — the plaque's medium line */
  medium?: string;
  /** e.g. "2019" — the plaque's year line */
  year?: string;
  /** how the wordmark is set; defaults rotate through the six treatments */
  treatment?: LogoTreatment;
}

export interface GalleryWallProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  logos: WallLogo[];
  /** the curator's note, printed on the wall beside the heading */
  curatorsNote?: string;
  footnote?: string;
  className?: string;
}

const TREATMENTS: Record<LogoTreatment, string> = {
  serif: "font-serif font-black tracking-tight",
  grotesk: "font-sans font-black uppercase tracking-tight",
  mono: "font-mono font-bold uppercase tracking-[0.2em]",
  italic: "font-serif font-black italic tracking-tight",
  smallcaps: "font-sans font-bold uppercase tracking-[0.3em]",
  black: "font-sans font-black uppercase tracking-[-0.05em] scale-y-125",
};

const TREATMENT_ORDER: LogoTreatment[] = [
  "serif",
  "grotesk",
  "mono",
  "italic",
  "smallcaps",
  "black",
];

export function GalleryWall({
  kicker = "The gallery wall · on view now",
  heading = "Hung at eye level.",
  standfirst = "Every logo on this wall earned its frame. None of them were shrunk to apologize for themselves.",
  logos = [
    { name: "Northwind & Co.", medium: "Wordmark, ink on paper", year: "2019" },
    { name: "ATLAS PAPER", medium: "Letterpress mark", year: "2021" },
    { name: "Fern & Fable", medium: "Mono logotype", year: "2018" },
    { name: "HALCYON", medium: "Italic serif wordmark", year: "2023" },
    { name: "The Daily Ledger", medium: "Small-caps masthead", year: "2016" },
    { name: "MERIDIAN", medium: "Black-weight capitals", year: "2020" },
    { name: "Owl & Oak", medium: "Serif wordmark", year: "2022" },
    { name: "KESTREL", medium: "Grotesk capitals", year: "2024" },
  ],
  curatorsNote = "Curator's note — most logo clouds are a grey strip of thumbnails begging you not to look. These are hung like paintings: one frame each, room to breathe, a plaque that says what it is. If a logo can't hold a wall, it doesn't belong on one.",
  footnote,
  className,
}: GalleryWallProps) {
  return (
    <section
      className={cn(
        "w-full bg-[#f6f1e7] text-stone-900 dark:bg-stone-950 dark:text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <p className="border-y border-stone-900/20 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.3em] dark:border-stone-100/20">
              {kicker}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-black tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 font-serif text-lg italic text-stone-500 dark:text-stone-400">
              {standfirst}
            </p>
          </div>
          <p className="max-w-sm border-l-2 border-amber-700 pl-4 font-serif text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            {curatorsNote}
          </p>
        </div>

        {/* The wall */}
        <div className="mt-14 border-t-2 border-stone-900 dark:border-stone-100">
          <div className="grid grid-cols-2 gap-px bg-stone-900/20 dark:bg-stone-100/20 md:grid-cols-4">
            {logos.map((logo, i) => {
              const treatment =
                logo.treatment ?? TREATMENT_ORDER[i % TREATMENT_ORDER.length];
              const exhibit = `Nº ${String(i + 1).padStart(2, "0")}`;
              return (
                <figure
                  key={logo.name}
                  className="min-w-0 bg-[#f6f1e7] p-5 dark:bg-stone-950 md:p-6"
                >
                  {/* The frame: a thin double rule, the way galleries mat prints */}
                  <div className="flex h-32 items-center justify-center border border-stone-900/60 p-3 dark:border-stone-100/60 md:h-36">
                    <div className="flex h-full w-full items-center justify-center border border-stone-900/20 px-3 dark:border-stone-100/20">
                      <span
                        className={cn(
                          "min-w-0 break-words text-center text-xl md:text-2xl",
                          TREATMENTS[treatment]
                        )}
                      >
                        {logo.name}
                      </span>
                    </div>
                  </div>
                  {/* The wall plaque */}
                  <figcaption className="mt-4">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
                      {exhibit}
                    </p>
                    <p className="mt-1 font-serif text-sm font-bold">{logo.name}</p>
                    {(logo.medium || logo.year) && (
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                        {[logo.medium, logo.year].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
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
