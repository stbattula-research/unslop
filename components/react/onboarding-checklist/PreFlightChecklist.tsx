import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Pre-Flight Checklist — an onboarding checklist staged as a pilot's
 * pre-flight checklist. The flight-plan header names the flight, the
 * destination (the activation event — the one real thing the user came to
 * do), and the estimated time gate to takeoff. Each check is a row: a
 * grease-pencil checkbox, a mono CHK number, what the step actually does,
 * how long it takes, and whether it is REQUIRED or OPTIONAL. Progress is
 * counted honestly — "2 of 5 checks complete" — and the CLEARED FOR
 * TAKEOFF stamp appears only when every required check is actually done.
 * Optional steps never block takeoff. The demo starts two checks in,
 * because a checklist that opens at 100% is a lie, and one that opens at
 * 0% with confetti for setup steps that create no value is a bribe.
 * The state lives in the component; wiring real completion to a backend is
 * the integrator's job, via the optional `onStep` prop — this demo stores
 * nothing of its own. Flat flight-plan paper, ink, aviation blue, static.
 * A checklist is printed on paper, even at night — so it stays paper in
 * both modes, by genre.
 */

export interface PreFlightStep {
  /** e.g. "verify-email" */
  id: string;
  /** e.g. "Verify your email" */
  title: string;
  /** plain-language one-liner: what this step actually does, and why */
  detail: string;
  /** e.g. "30 seconds" — the honest cost of the step */
  minutes: string;
  /** required steps gate the stamp; optional steps never do */
  required: boolean;
  /** done in the demo's opening state — the honest starting point */
  done?: boolean;
  /** where the step is performed; omit it and the checkbox is the action */
  href?: string;
}

export interface PreFlightChecklistProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** printed on the flight plan, e.g. "FLT 001" */
  flightNumber?: string;
  /** the activation event — the one real thing the user came to do */
  destination?: string;
  /** e.g. "About 5 minutes" — the sum of the steps, said plainly */
  estimatedTime?: string;
  steps?: PreFlightStep[];
  /** called with the step id and its new state, when the integrator wires up real completion */
  onStep?: (id: string, done: boolean) => void;
  footnote?: string;
  className?: string;
}

const DEFAULT_STEPS: PreFlightStep[] = [
  {
    id: "verify-email",
    title: "Verify your email",
    detail:
      "One click in the inbox. Proves the address is yours, so password resets and receipts reach a real person.",
    minutes: "30 seconds",
    required: true,
    done: true,
  },
  {
    id: "name-workspace",
    title: "Name your workspace",
    detail:
      "The name on every project, invoice, and invite. Pick the one your team already calls it.",
    minutes: "1 minute",
    required: true,
    done: true,
  },
  {
    id: "first-project",
    title: "Create your first project",
    detail:
      "The reason you signed up. One project, one real task inside it — that is the whole flight.",
    minutes: "2 minutes",
    required: true,
  },
  {
    id: "invite-teammate",
    title: "Invite one teammate",
    detail:
      "Optional. A second pair of eyes catches what one person misses — but the plane flies with one pilot.",
    minutes: "1 minute",
    required: false,
  },
  {
    id: "connect-integration",
    title: "Connect one integration",
    detail:
      "Optional. Pull in the tool you already live in. Skip it now and connect it later — nothing breaks.",
    minutes: "2 minutes",
    required: false,
  },
];

export function PreFlightChecklist({
  kicker = "Pre-flight · first flight",
  heading = "Before you fly, check the list.",
  standfirst = "Five checks, about five minutes, and one real project at the end of it. The list is honest about what is done and what is not — a checklist that lies about progress is worse than no checklist.",
  flightNumber = "FLT 001",
  destination = "First project shipped",
  estimatedTime = "About 5 minutes",
  steps = DEFAULT_STEPS,
  onStep,
  footnote,
  className,
}: PreFlightChecklistProps) {
  const [done, setDone] = React.useState<Record<string, boolean>>(() => {
    const start: Record<string, boolean> = {};
    for (const s of steps) start[s.id] = Boolean(s.done);
    return start;
  });

  const total = steps.length;
  const doneCount = steps.filter((s) => done[s.id]).length;
  const required = steps.filter((s) => s.required);
  const requiredDone = required.filter((s) => done[s.id]).length;
  const requiredLeft = required.length - requiredDone;
  const cleared = required.length > 0 && requiredDone === required.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const toggle = (id: string) => {
    const next = !done[id];
    setDone((prev) => ({ ...prev, [id]: next }));
    onStep?.(id, next);
  };

  return (
    <section
      className={cn(
        "bg-[#f4efe3] text-stone-900",
        className
      )}
      role="region"
      aria-label="Onboarding checklist"
    >
      <div className="mx-auto max-w-3xl border-2 border-stone-900 px-5 py-6 md:px-8 md:py-8">
        {/* Flight plan header */}
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-blue-800">
              {kicker}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-xl font-serif text-base italic leading-relaxed text-stone-600">
              {standfirst}
            </p>
          </div>
          {cleared && (
            <span
              aria-label="Cleared for takeoff: all required checks done"
              className="shrink-0 -rotate-6 border-[3px] border-double border-blue-800 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-blue-800"
            >
              Cleared for takeoff
            </span>
          )}
        </div>

        {/* Flight-plan strip */}
        <dl className="mt-6 grid grid-cols-2 gap-px border border-stone-900/40 bg-stone-900/40 md:grid-cols-4">
          <div className="min-w-0 bg-[#f4efe3] px-3 py-2">
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Flight
            </dt>
            <dd className="mt-0.5 break-words font-mono text-sm font-bold">
              {flightNumber}
            </dd>
          </div>
          <div className="min-w-0 bg-[#f4efe3] px-3 py-2">
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Destination
            </dt>
            <dd className="mt-0.5 break-words font-mono text-sm font-bold">
              {destination}
            </dd>
          </div>
          <div className="min-w-0 bg-[#f4efe3] px-3 py-2">
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Est. time
            </dt>
            <dd className="mt-0.5 break-words font-mono text-sm font-bold">
              {estimatedTime}
            </dd>
          </div>
          <div className="min-w-0 bg-[#f4efe3] px-3 py-2">
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Status
            </dt>
            <dd className="mt-0.5 break-words font-mono text-sm font-bold text-blue-800">
              {cleared
                ? "Cleared"
                : `${requiredLeft} required left`}
            </dd>
          </div>
        </dl>

        {/* Honest progress */}
        <div className="mt-6">
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
              {doneCount} of {total} checks complete
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">
              {requiredDone} of {required.length} required
            </p>
          </div>
          <div
            className="mt-2 h-1.5 w-full bg-stone-900/15"
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${doneCount} of ${total} checks complete`}
          >
            <div className="h-full bg-blue-800" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* The checks */}
        <ol className="mt-6 border-t-2 border-stone-900">
          {steps.map((s, i) => {
            const isDone = Boolean(done[s.id]);
            const num = `CHK-${String(i + 1).padStart(2, "0")}`;
            return (
              <li
                key={s.id}
                className="flex min-w-0 gap-3 border-b border-stone-900/20 py-4 md:gap-4"
              >
                <input
                  id={`preflight-${s.id}`}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(s.id)}
                  aria-label={`${s.title} — ${s.required ? "required" : "optional"}`}
                  className="mt-1 h-5 w-5 shrink-0 accent-blue-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue-800">
                      {num}
                    </span>
                    <label
                      htmlFor={`preflight-${s.id}`}
                      className="min-w-0 cursor-pointer break-words font-serif text-lg font-black leading-snug"
                    >
                      {s.title}
                    </label>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.15em]",
                        s.required ? "text-blue-800" : "text-stone-500"
                      )}
                    >
                      {s.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="mt-1 break-words font-serif text-sm leading-relaxed text-stone-600">
                    {s.detail}
                  </p>
                  <p className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500">
                    <span>About {s.minutes}</span>
                    <span aria-hidden="true">·</span>
                    <span>{isDone ? "Checked" : "Not yet checked"}</span>
                    {s.href && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={s.href}
                          className="font-bold text-blue-800 underline underline-offset-4 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
                        >
                          Do it →
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          Optional steps never block takeoff. The stamp appears when the
          required checks are done — not before, not because you asked
          nicely. This demo stores nothing; wire <code>onStep</code> to your
          real completion state.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-500">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
