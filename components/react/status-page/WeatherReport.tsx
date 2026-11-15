import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Weather Report — a status page staged as a weather forecast.
 * Every service is a region with a forecast, not a green dot: Sunny
 * means it worked, Cloudy means it worked slowly, a Storm means it
 * didn't — and the incident log below says when, for how long, and
 * what was done about it. Each service carries a 90-day bar strip
 * (one bar per day) and its uptime printed to two decimals, never
 * rounded up to 100%. Grey bars are days with no data — a gap in
 * the record, never a green day. Flat sky paper/ink, static. A
 * forecast is printed, so it stays on paper in both modes, by genre.
 */

export type ServiceStatus =
  | "operational"
  | "degraded"
  | "partial-outage"
  | "major-outage";

/** One day of the 90-day history strip. "nodata" is a gap, never green. */
export type DayStatus = "up" | "degraded" | "outage" | "nodata";

export interface Service {
  /** e.g. "api" */
  id: string;
  /** the service, e.g. "API" */
  name: string;
  /** where it runs, e.g. "US-East" */
  region: string;
  status: ServiceStatus;
  /** uptime over the last 90 days, printed as given, e.g. "99.97" */
  uptime90: string;
  /** median latency in ms, e.g. 142 */
  latencyMs: number;
  /** 90 entries, oldest first — one bar per day */
  history: DayStatus[];
}

export interface Incident {
  /** the date it happened, e.g. "2026-11-09" */
  date: string;
  /** plain-language title, e.g. "API responses slow in US-East" */
  title: string;
  status: "investigating" | "monitoring" | "resolved";
  /** timestamped updates, in order — appended to, never edited */
  updates: string[];
}

export interface Maintenance {
  /** e.g. "2026-11-22" */
  date: string;
  /** e.g. "Database maintenance — expect brief read-only windows" */
  title: string;
  /** e.g. "02:00–04:00 UTC" */
  window: string;
}

export interface WeatherReportProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** when this forecast was issued, e.g. "15 November 2026, 09:52 CST" */
  asOf?: string;
  services?: Service[];
  incidents?: Incident[];
  /** work already announced — the forecast for tomorrow */
  maintenance?: Maintenance[];
  footnote?: string;
  className?: string;
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: "Sunny",
  degraded: "Cloudy",
  "partial-outage": "Overcast",
  "major-outage": "Storm",
};

const STATUS_GLYPH: Record<ServiceStatus, string> = {
  operational: "☀",
  degraded: "⛅",
  "partial-outage": "☁",
  "major-outage": "⛈",
};

const DAY_CLASS: Record<DayStatus, string> = {
  up: "bg-emerald-600",
  degraded: "bg-amber-500",
  outage: "bg-red-700",
  nodata: "bg-stone-400/60",
};

/** 90 days, oldest first: mostly up, two cloudy days, one two-day storm, one gap. */
function defaultHistory(): DayStatus[] {
  const days: DayStatus[] = Array<DayStatus>(90).fill("up");
  days[12] = "degraded";
  days[33] = "outage";
  days[34] = "outage";
  days[47] = "degraded";
  days[71] = "nodata";
  return days;
}

function historyFor(id: string): DayStatus[] {
  // Each service gets its own weather: the storm days belong to the API,
  // the cloudy days to background jobs, the gap to email. The rest is sun.
  const days = defaultHistory();
  if (id === "web-app") {
    days[33] = "up";
    days[34] = "up";
    days[71] = "up";
  }
  if (id === "background-jobs") {
    days[33] = "up";
    days[34] = "up";
    days[47] = "degraded";
    days[71] = "up";
  }
  if (id === "email") {
    days[12] = "up";
    days[33] = "up";
    days[34] = "up";
    days[47] = "up";
  }
  return days;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "api",
    name: "API",
    region: "US-East",
    status: "operational",
    uptime90: "99.97",
    latencyMs: 142,
    history: historyFor("api"),
  },
  {
    id: "web-app",
    name: "Web app",
    region: "US-East",
    status: "operational",
    uptime90: "99.95",
    latencyMs: 210,
    history: historyFor("web-app"),
  },
  {
    id: "background-jobs",
    name: "Background jobs",
    region: "EU-West",
    status: "degraded",
    uptime90: "99.82",
    latencyMs: 480,
    history: historyFor("background-jobs"),
  },
  {
    id: "email",
    name: "Email delivery",
    region: "Global",
    status: "operational",
    uptime90: "99.99",
    latencyMs: 95,
    history: historyFor("email"),
  },
];

const DEFAULT_INCIDENTS: Incident[] = [
  {
    date: "2026-11-09",
    title: "API responses slow in US-East",
    status: "resolved",
    updates: [
      "09:12 — Investigating elevated latency on API requests.",
      "09:40 — Identified: a queue backing up behind a deploy.",
      "10:05 — Resolved: queue drained, latency back under 200ms.",
    ],
  },
  {
    date: "2026-10-28",
    title: "Background jobs delayed",
    status: "resolved",
    updates: [
      "14:20 — Investigating jobs running behind schedule.",
      "15:02 — Resolved: a stuck worker restarted, backlog cleared.",
    ],
  },
];

const DEFAULT_MAINTENANCE: Maintenance[] = [
  {
    date: "2026-11-22",
    title: "Database maintenance — expect brief read-only windows",
    window: "02:00–04:00 UTC",
  },
];

function overallForecast(services: Service[]): string {
  const sunny = services.filter((s) => s.status === "operational").length;
  if (services.some((s) => s.status === "major-outage")) {
    return `STORM — ${services.length - sunny} of ${services.length} services down. See the log below.`;
  }
  if (services.some((s) => s.status === "partial-outage")) {
    return `OVERCAST — ${services.length - sunny} of ${services.length} services partly down. See the log below.`;
  }
  if (services.some((s) => s.status === "degraded")) {
    return `CLOUDY IN PLACES — ${sunny} of ${services.length} services sunny, ${
      services.length - sunny
    } cloudy. No storms today.`;
  }
  return `SUNNY ACROSS THE BOARD — all ${services.length} services working.`;
}

export function WeatherReport({
  kicker = "Status · updated hourly, written by a human",
  heading = "The weather, for the machines.",
  standfirst = "Every service gets a forecast, not a green dot. Sunny means it worked. Cloudy means it worked slowly. A storm means it didn't — and the log below says when, for how long, and what we did about it.",
  asOf = "15 November 2026, 09:52 CST",
  services = DEFAULT_SERVICES,
  incidents = DEFAULT_INCIDENTS,
  maintenance = DEFAULT_MAINTENANCE,
  footnote,
  className,
}: WeatherReportProps) {
  return (
    <section
      className={cn("bg-[#e9eff1] text-stone-950", className)}
      role="region"
      aria-label="Service status"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        {/* Forecast header */}
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-900">
            {kicker}
          </p>
          <h2 className="mt-2 break-words font-serif text-3xl font-black tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl break-words font-serif text-base italic leading-relaxed text-stone-700">
            {standfirst}
          </p>
        </div>

        {/* The overall forecast */}
        <div className="mt-6 border-2 border-stone-950 bg-[#dce7ea] px-4 py-3">
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs font-black uppercase tracking-[0.15em]">
            <span className="shrink-0">Forecast</span>
            <span className="min-w-0 break-words">{overallForecast(services)}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">
            Issued {asOf} · Next update within the hour, sooner if the sky changes
          </p>
        </div>

        {/* The regions */}
        <ul className="mt-6 border-t-2 border-stone-950">
          {services.map((s) => (
            <li key={s.id} className="border-b border-stone-950/15 py-5">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
                <span aria-hidden="true" className="shrink-0 font-serif text-2xl leading-none">
                  {STATUS_GLYPH[s.status]}
                </span>
                <p className="min-w-0 flex-1 break-words font-serif text-2xl font-black leading-tight">
                  {s.name}
                </p>
                <p className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">
                  {s.region}
                </p>
                <p className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-sky-900">
                  {STATUS_LABEL[s.status]}
                </p>
              </div>
              <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-xs text-stone-700">
                <span>
                  Uptime, 90 days:{" "}
                  <strong className="text-stone-950">{s.uptime90}%</strong>
                </span>
                <span>
                  Median latency:{" "}
                  <strong className="text-stone-950">{s.latencyMs}ms</strong>
                </span>
              </div>
              <div
                className="mt-3 flex h-8 items-end gap-[2px]"
                role="img"
                aria-label={`90-day history for ${s.name}: ${s.uptime90}% uptime`}
              >
                {s.history.map((day, i) => (
                  <span
                    key={i}
                    title={day === "up" ? "Up" : day === "degraded" ? "Degraded" : day === "outage" ? "Outage" : "No data"}
                    className={cn(
                      "min-w-0 flex-1",
                      day === "outage" ? "h-8" : day === "degraded" ? "h-5" : "h-3",
                      DAY_CLASS[day],
                    )}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">
                <span className="text-emerald-700">■ Up</span>
                {" · "}
                <span className="text-amber-600">■ Degraded</span>
                {" · "}
                <span className="text-red-700">■ Outage</span>
                {" · "}
                <span>■ No data</span>
                {" — "}90 days, oldest first
              </p>
            </li>
          ))}
        </ul>

        {/* The incident log */}
        <div className="mt-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-900">
            The log — what happened, in plain language
          </p>
          {incidents.length === 0 ? (
            <p className="mt-3 break-words font-serif text-base italic leading-relaxed text-stone-700">
              No storms recorded — yet. The log stays open, and the first
              incident will be written here, not hidden.
            </p>
          ) : (
            <ol className="mt-3 border-t border-stone-950/15">
              {incidents.map((incident) => (
                <li key={incident.date + incident.title} className="border-b border-stone-950/15 py-4">
                  <p className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-stone-500">
                      {incident.date}
                    </span>
                    <span className="min-w-0 flex-1 break-words font-serif text-lg font-bold leading-snug">
                      {incident.title}
                    </span>
                    <span className="shrink-0 border border-stone-950 px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.15em]">
                      {incident.status}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-1">
                    {incident.updates.map((update) => (
                      <li key={update} className="break-words font-mono text-xs leading-relaxed text-stone-700">
                        {update}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Forecast for tomorrow */}
        {maintenance.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-900">
              Forecast for tomorrow — planned work, announced in advance
            </p>
            <ul className="mt-3 border-t border-stone-950/15">
              {maintenance.map((m) => (
                <li
                  key={m.date + m.title}
                  className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-dashed border-stone-950/15 py-2"
                >
                  <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-stone-500">
                    {m.date}
                  </span>
                  <span className="min-w-0 flex-1 break-words font-serif text-base font-bold">
                    {m.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-stone-500">{m.window}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          Uptime is printed to two decimals and never rounded up to 100%. A
          page that claims 100% forever is lying, or not looking. Grey bars
          are days we have no data for — a gap in the record, not a green
          day. The incident log is never edited after the fact, only
          appended to.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-700">{footnote}</p>
        )}
      </div>
    </section>
  );
}
