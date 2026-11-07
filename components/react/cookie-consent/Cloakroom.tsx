import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Cloakroom — a cookie consent banner staged as a cloakroom ticket.
 * Your data is your coat: you hand it over at the door, you get a numbered
 * ticket, and you can collect it back any time. The banner is the ticket —
 * a perforated stub with the ticket number on the left, the plain-language
 * ask on the right, and three choices in exactly equal weight: "Take the
 * lot" (accept all), "Coat only" (necessary only), and "Pick each item"
 * (customize). The customize panel lists each category as a ticket line
 * with a real checkbox, nothing pre-ticked — the necessary line is locked
 * on and says why. Once you choose, the banner folds down to the stub
 * alone, printed with your choice and a "Change your mind" link that
 * reopens the ticket. The choice lives in component state only; wiring it
 * to a real consent store is the integrator's job, via the optional
 * `onChoice` prop — this demo sets no cookie of its own.
 * No dark patterns: equal buttons (the 2026 equal-weight rule, not a
 * bright Accept next to a grey Reject link), no pre-ticked boxes, no
 * "by scrolling you agree". Flat cloakroom paper, ink, ticket green,
 * static. A ticket is printed on paper, even at night — so the banner
 * stays paper in both modes, by genre.
 */

export interface CloakroomCategory {
  /** e.g. "analytics" */
  id: string;
  /** e.g. "Analytics" */
  label: string;
  /** plain-language one-liner: what this remembers, and why */
  detail: string;
  /** necessary cookies: locked on, with the reason printed */
  locked?: boolean;
}

export type CloakroomChoice = "all" | "necessary" | "custom";

export interface CloakroomProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** printed on the stub, e.g. "Nº 042" — the consent receipt number */
  ticketNumber?: string;
  categories?: CloakroomCategory[];
  /** called with the choice and the per-category decisions, when the integrator wires up a real consent store */
  onChoice?: (choice: CloakroomChoice, accepted: Record<string, boolean>) => void;
  footnote?: string;
  className?: string;
}

const CHOICE_LABELS: Record<CloakroomChoice, string> = {
  all: "Take the lot",
  necessary: "Coat only",
  custom: "Your picks",
};

export function Cloakroom({
  kicker = "Cloakroom · check your data at the door",
  heading = "Your coat, your call.",
  standfirst = "We'd like to remember a few things about your visit — which pages you read, so the site gets better. Nothing leaves the building without your say-so.",
  ticketNumber = "Nº 042",
  categories = [
    {
      id: "necessary",
      label: "Necessary",
      detail: "The coat check itself — remembering that you are logged in, and what is in your basket. The site does not work without these.",
      locked: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      detail: "We count visits, not visitors — which pages get read, never who read them.",
    },
    {
      id: "marketing",
      label: "Marketing",
      detail: "Ads that follow you around the web. We do not run these unless you ask us to.",
    },
  ],
  onChoice,
  footnote,
  className,
}: CloakroomProps) {
  const [view, setView] = React.useState<"banner" | "preferences" | "done">("banner");
  const [choice, setChoice] = React.useState<CloakroomChoice | null>(null);
  const [picks, setPicks] = React.useState<Record<string, boolean>>(() => {
    const start: Record<string, boolean> = {};
    for (const c of categories) start[c.id] = Boolean(c.locked);
    return start;
  });

  const choose = (next: CloakroomChoice, accepted: Record<string, boolean>) => {
    setChoice(next);
    setView("done");
    onChoice?.(next, accepted);
  };

  const acceptAll = () => {
    const all: Record<string, boolean> = {};
    for (const c of categories) all[c.id] = true;
    choose("all", all);
  };

  const necessaryOnly = () => {
    const only: Record<string, boolean> = {};
    for (const c of categories) only[c.id] = Boolean(c.locked);
    choose("necessary", only);
  };

  const savePicks = () => choose("custom", picks);

  const toggle = (id: string) =>
    setPicks((prev) => ({ ...prev, [id]: !prev[id] }));

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const buttonBase =
    "flex-1 min-w-0 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-green-800";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 bg-[#f4efe3] text-stone-900",
        className
      )}
      role="region"
      aria-label="Cookie consent"
    >
      <div className="border-t-2 border-stone-900">
        {view === "done" && choice ? (
          /* The stub, filed away: your choice, printed, with a way back */
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 md:px-6">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-green-800">
              Cloakroom · Ticket {ticketNumber}
            </span>
            <span className="min-w-0 flex-1 break-words font-serif text-base leading-snug">
              Filed {today} — {CHOICE_LABELS[choice]}. Your coat is safe.
            </span>
            <button
              type="button"
              onClick={() => setView("banner")}
              className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.15em] text-green-800 underline underline-offset-4 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-800"
            >
              Change your mind →
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-6xl gap-0 px-4 py-5 md:px-6 md:py-6">
            {/* Perforated stub */}
            <div className="hidden shrink-0 flex-col items-start justify-start border-r border-dashed border-stone-900/50 pr-5 sm:flex">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-green-800">
                Cloakroom
              </span>
              <span className="mt-2 font-mono text-lg font-bold tracking-tight">
                Ticket
              </span>
              <span className="font-serif text-2xl font-black">{ticketNumber}</span>
              <span className="mt-3 max-w-[7rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
                Keep this ticket — it is your receipt
              </span>
            </div>

            {/* The ask */}
            <div className="min-w-0 flex-1 sm:pl-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-green-800">
                {kicker}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-black tracking-tight md:text-3xl">
                {heading}
              </h2>
              <p className="mt-2 max-w-2xl font-serif text-base italic leading-relaxed text-stone-600">
                {standfirst}
              </p>

              {view === "preferences" ? (
                <fieldset className="mt-5 border-t border-stone-900/20 pt-4">
                  <legend className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                    Pick each item — nothing is ticked for you
                  </legend>
                  <ul className="mt-3 space-y-4">
                    {categories.map((c) => (
                      <li key={c.id} className="flex min-w-0 gap-3">
                        <input
                          id={`cloakroom-${c.id}`}
                          type="checkbox"
                          checked={Boolean(picks[c.id])}
                          disabled={c.locked}
                          onChange={() => toggle(c.id)}
                          className="mt-1 h-4 w-4 shrink-0 accent-green-800"
                        />
                        <div className="min-w-0">
                          <label
                            htmlFor={`cloakroom-${c.id}`}
                            className="font-mono text-sm font-bold uppercase tracking-[0.12em]"
                          >
                            {c.label}
                            {c.locked && (
                              <span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-green-800">
                                Always on
                              </span>
                            )}
                          </label>
                          <p className="mt-0.5 break-words font-serif text-sm leading-relaxed text-stone-600">
                            {c.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={savePicks}
                      className="bg-stone-900 px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800"
                    >
                      Save these choices
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("banner")}
                      className="px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-stone-900 underline underline-offset-4 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-800"
                    >
                      ← Back to the ticket
                    </button>
                  </div>
                </fieldset>
              ) : (
                <>
                  {/* Three choices, in exactly equal weight */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={acceptAll}
                      className={cn(buttonBase, "bg-stone-900 text-white hover:bg-green-800")}
                    >
                      Take the lot
                    </button>
                    <button
                      type="button"
                      onClick={necessaryOnly}
                      className={cn(buttonBase, "border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white")}
                    >
                      Coat only
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("preferences")}
                      aria-expanded={view === "preferences"}
                      className={cn(buttonBase, "border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white")}
                    >
                      Pick each item
                    </button>
                  </div>
                  <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
                    All three weigh the same — saying no is as easy as saying
                    yes. No pre-ticked boxes, no “by scrolling you agree”.
                    This demo sets nothing; wire <code>onChoice</code> to your
                    consent store.
                  </p>
                </>
              )}

              {footnote && (
                <p className="mt-4 font-serif text-sm italic text-stone-500">
                  {footnote}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
