import { cn } from "../lib/utils";

/**
 * The Dead Letter Office — a 404 page staged as undeliverable mail.
 * Every catalog 404 is the same giant number with a shrug and a joke
 * about being lost; this one is an envelope that came back: the address
 * struck through, a rotated RETURN TO SENDER stamp, and a plain list of
 * what might have happened — moved, mistyped, or taken down — stated as
 * possibilities, not as facts about a page nobody has seen. No fake
 * search box that searches nothing, no "oopsie" copy, no mascot. The
 * way home is a real link, and the attempted address is printed so the
 * visitor can see exactly what went wrong.
 */

export interface DeadLetterProps {
  /** the address that did not arrive, e.g. "/old-guide/2024" */
  attemptedPath?: string;
  /** where the way-home link goes; defaults to "/" */
  homeHref?: string;
  /** label for the way-home link */
  homeLabel?: string;
  /** small print under the envelope */
  footnote?: string;
  className?: string;
}

const POSSIBILITIES = [
  {
    title: "It moved",
    detail: "The page was renamed or rehoused, and the old address was never forwarded.",
  },
  {
    title: "It was mistyped",
    detail: "One wrong character in the address is enough — check the envelope above.",
  },
  {
    title: "It was taken down",
    detail: "Some pages are withdrawn on purpose. Nothing here pretends otherwise.",
  },
];

export function DeadLetter({
  attemptedPath = "/the-page-you-asked-for",
  homeHref = "/",
  homeLabel = "Go to the homepage",
  footnote = "If you followed a link to get here, that link is stale — the page it pointed at is no longer at that address. Nothing was delivered, nothing was charged, nothing was lost except the trip.",
  className,
}: DeadLetterProps) {
  return (
    <section
      aria-label="Page not found"
      className={cn(
        "w-full bg-[#f6f1e7] text-stone-900 dark:bg-stone-900 dark:text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-400">
          Dead Letter Office · Undeliverable
        </p>
        <h1 className="mt-3 font-serif text-6xl font-black leading-none tracking-tight sm:text-8xl">
          404
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-base italic leading-relaxed text-stone-600 dark:text-stone-400">
          This page did not arrive. The address below came back unopened — not
          because you did anything wrong, but because nothing lives there now.
        </p>

        {/* The returned envelope */}
        <div className="relative mt-10 border-2 border-stone-900 bg-[#fdfbf7] p-6 dark:border-stone-100 dark:bg-stone-950 sm:p-8">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-4 rotate-[-6deg] border-[3px] border-red-700 px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em] text-red-700 dark:border-red-400 dark:text-red-400"
          >
            Return to sender
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Addressed to
          </p>
          <p className="mt-2 min-w-0 break-words font-serif text-2xl font-bold leading-snug tracking-tight line-through decoration-red-700 decoration-2 dark:decoration-red-400 sm:text-3xl">
            {attemptedPath}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
            Reason for return: no such address on this site
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-900/20 pt-5 dark:border-stone-100/20">
            <a
              href={homeHref}
              className="shrink-0 bg-stone-900 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#f6f1e7] dark:bg-stone-100 dark:text-stone-900"
            >
              {homeLabel} →
            </a>
            <span className="min-w-0 font-serif text-sm italic text-stone-600 dark:text-stone-400">
              The front door is still open. Start there.
            </span>
          </div>
        </div>

        <h2 className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
          What might have happened
        </h2>
        <ul className="mt-4 list-none p-0 m-0 border-t-2 border-stone-900 dark:border-stone-100">
          {POSSIBILITIES.map((item) => (
            <li
              key={item.title}
              className="flex flex-wrap gap-x-6 gap-y-1 border-b border-stone-900/20 py-4 dark:border-stone-100/20"
            >
              <p className="w-36 shrink-0 font-serif text-lg font-bold leading-snug">
                {item.title}
              </p>
              <p className="min-w-0 flex-1 break-words text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-[0.05em] text-stone-500 dark:text-stone-400">
          {footnote}
        </p>
      </div>
    </section>
  );
}
