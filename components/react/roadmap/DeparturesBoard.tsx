import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Departures Board — a product roadmap staged as a railway station
 * departures board. Each feature is a departure: the horizon is the time
 * (NOW / NEXT / LATER — a horizon, never a date), the destination is the
 * feature, and the status is the platform announcement: BOARDING for what
 * is being built now, ON TIME for what is planned next, DELAYED — said
 * plainly, with the reason printed — for what slipped, and NO DATE
 * PROMISED for Later items, which are a direction, not a commitment.
 * Shipped work leaves the board for the "Recently departed" strip below,
 * where it keeps its real ship date — a date is fine once it is a fact.
 * The last-updated line is a prop the integrator sets, so a board that
 * has sat untouched for a quarter is visibly stale instead of quietly
 * lying. Flat warm-black board, amber departures, cream type, static.
 * A departures board is lit, not printed — so it stays dark in both
 * modes, by genre.
 */

export type DepartureHorizon = "now" | "next" | "later";
export type DepartureStatus = "boarding" | "on-time" | "delayed" | "no-date";

export interface Departure {
  /** e.g. "offline-mode" */
  id: string;
  /** the feature, as the destination — e.g. "Offline mode" */
  destination: string;
  /** one plain line: what it is, and why it matters */
  detail: string;
  /** now = being built, next = planned, later = a direction */
  horizon: DepartureHorizon;
  /** boarding = in progress, on-time = planned, delayed = slipped, no-date = Later */
  status: DepartureStatus;
  /** printed only when status is "delayed" — the honest reason it slipped */
  delayReason?: string;
}

export interface DepartedItem {
  /** e.g. "Two-factor login" */
  name: string;
  /** the real ship date — a fact, e.g. "14 October 2026" */
  shipped: string;
}

export interface DeparturesBoardProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the station this board hangs in, e.g. "Central" */
  station?: string;
  /** the date this board was last revised — set it every time the board changes */
  lastUpdated?: string;
  departures?: Departure[];
  /** shipped work, most recent first */
  departed?: DepartedItem[];
  footnote?: string;
  className?: string;
}

const HORIZON_LABEL: Record<DepartureHorizon, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
};

const STATUS_LABEL: Record<DepartureStatus, string> = {
  boarding: "Boarding",
  "on-time": "On time",
  delayed: "Delayed",
  "no-date": "No date promised",
};

const DEFAULT_DEPARTURES: Departure[] = [
  {
    id: "offline-mode",
    destination: "Offline mode",
    detail:
      "The whole app, usable on a dead connection. It syncs when the signal returns — nothing typed is ever lost to a tunnel.",
    horizon: "now",
    status: "boarding",
  },
  {
    id: "shared-workspaces",
    destination: "Shared workspaces",
    detail:
      "One project, many hands. Permissions that say who can do what, in plain words, not role codes.",
    horizon: "now",
    status: "boarding",
  },
  {
    id: "usage-billing",
    destination: "Usage-based billing",
    detail:
      "Pay for what you use, counted in the open. No tiers, no surprise at the end of the month.",
    horizon: "next",
    status: "on-time",
  },
  {
    id: "native-apps",
    destination: "Native mobile apps",
    detail:
      "The apps are built and waiting on one thing: the accessibility audit. A keyboard that works everywhere comes first.",
    horizon: "next",
    status: "delayed",
    delayReason: "Held for the accessibility audit, which jumped the queue.",
  },
  {
    id: "team-analytics",
    destination: "Team analytics",
    detail:
      "A direction, not a date. It gets built when the first three carriages are running and we know what teams actually ask for.",
    horizon: "later",
    status: "no-date",
  },
  {
    id: "public-api",
    destination: "Public API",
    detail:
      "Same rule: a direction, no date promised. Ask for it, and your request is counted — that count is what moves it up the board.",
    horizon: "later",
    status: "no-date",
  },
];

const DEFAULT_DEPARTED: DepartedItem[] = [
  { name: "Two-factor login", shipped: "14 October 2026" },
  { name: "Export to CSV", shipped: "30 September 2026" },
  { name: "Dark mode that respects the system", shipped: "12 September 2026" },
];

export function DeparturesBoard({
  kicker = "Departures · all lines",
  heading = "Where this product is going.",
  standfirst = "Every feature on this board is a departure. The time column is a horizon — Now, Next, Later — because a date on a public roadmap is a promise, and promises are what get broken. A delayed train says so, out loud.",
  station = "Central",
  lastUpdated = "Revised 3 November 2026",
  departures = DEFAULT_DEPARTURES,
  departed = DEFAULT_DEPARTED,
  footnote,
  className,
}: DeparturesBoardProps) {
  return (
    <section
      className={cn("bg-[#17140f] text-[#f2ead8]", className)}
      role="region"
      aria-label="Product roadmap"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        {/* Board header */}
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
              {kicker}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-xl font-serif text-base italic leading-relaxed text-[#f2ead8]/70">
              {standfirst}
            </p>
          </div>
          <span
            aria-label={`Departures board for ${station} station`}
            className="shrink-0 -rotate-3 border-[3px] border-double border-amber-400 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-amber-400"
          >
            {station}
          </span>
        </div>

        {/* Last-updated line — the board's honesty clock */}
        <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-[#f2ead8]/50">
          {lastUpdated} · Revised monthly. A row that has sat untouched for
          a quarter is archived, not left to rot.
        </p>

        {/* Column headings */}
        <div
          aria-hidden="true"
          className="mt-6 hidden gap-4 border-b border-[#f2ead8]/25 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ead8]/50 md:grid md:grid-cols-[7rem_minmax(0,1fr)_auto]"
        >
          <span>Time</span>
          <span>Destination</span>
          <span className="text-right">Status</span>
        </div>

        {/* The departures */}
        <ol className="border-b border-[#f2ead8]/25">
          {departures.map((d) => (
            <li
              key={d.id}
              className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-1 border-t border-[#f2ead8]/15 py-4 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:gap-y-0"
            >
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
                <span className="shrink-0 font-mono text-sm font-black uppercase tracking-[0.2em] text-amber-400">
                  {HORIZON_LABEL[d.horizon]}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#f2ead8]/50">
                  {d.horizon === "now"
                    ? "Being built"
                    : d.horizon === "next"
                      ? "Planned"
                      : "A direction"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="break-words font-serif text-xl font-black leading-snug">
                  {d.destination}
                </p>
                <p className="mt-1 break-words font-serif text-sm leading-relaxed text-[#f2ead8]/70">
                  {d.detail}
                </p>
                {d.status === "delayed" && d.delayReason && (
                  <p className="mt-1 break-words font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-red-400">
                    Delayed — {d.delayReason}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  "mt-1 w-fit shrink-0 border px-2 py-1 font-mono text-[11px] font-black uppercase tracking-[0.15em] md:mt-0",
                  d.status === "boarding" &&
                    "border-amber-400 text-amber-400",
                  d.status === "on-time" &&
                    "border-[#f2ead8]/60 text-[#f2ead8]",
                  d.status === "delayed" && "border-red-400 text-red-400",
                  d.status === "no-date" &&
                    "border-[#f2ead8]/30 text-[#f2ead8]/50"
                )}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </li>
          ))}
        </ol>

        {/* Recently departed */}
        {departed.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
              Recently departed
            </p>
            <ul className="mt-2">
              {departed.map((item) => (
                <li
                  key={item.name}
                  className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-dashed border-[#f2ead8]/15 py-2"
                >
                  <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-[#f2ead8]/50">
                    ✓ Departed
                  </span>
                  <span className="min-w-0 flex-1 break-words font-serif text-base font-bold">
                    {item.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-[#f2ead8]/50">
                    {item.shipped}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-[#f2ead8]/50">
          All trains leave when they are ready. None before. A date on this
          board would be a promise — so the board prints horizons instead,
          and the shipped dates below are the only dates it ever carries.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-[#f2ead8]/70">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
