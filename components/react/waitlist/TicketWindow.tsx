import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Ticket Window — a waitlist signup staged as a box-office ticket window.
 * The pitch is the poster on the left ("now showing": what joining gets you).
 * The signup itself is a ticket stub on the right: perforated edge, punched
 * notches, a big mono ticket number, and one honest line of small print.
 * Submitting the form marks the ticket claimed in place — wiring the email
 * to a real list is the integrator's job, and the optional `onJoin` prop is
 * where that hook lives. No fake live counter, no "only 3 spots left"
 * pressure copy: the number on the stub is the demo's starting ticket,
 * not a claim about a real queue. Flat paper, ink, ticket red, static
 * except for the form itself.
 */

export interface TicketWindowProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** "Now showing" — what a ticket actually gets the joiner */
  perks?: string[];
  /** the number printed on the stub; a demo starting point, not a live count */
  startingTicket?: number;
  /** called with the email on submit, when the integrator wires up a real list */
  onJoin?: (email: string) => void;
  footnote?: string;
  className?: string;
}

export function TicketWindow({
  kicker = "The ticket window · now booking",
  heading = "Take a number.",
  standfirst = "The doors aren't open yet. Leave an email at the window and we'll call your number when they are — one email, no newsletter drip.",
  perks = [
    "First through the door when we open",
    "The launch price, held for ticket holders",
    "One email when your number is called — then silence",
  ],
  startingTicket = 214,
  onJoin,
  footnote,
  className,
}: TicketWindowProps) {
  const [email, setEmail] = React.useState("");
  const [joined, setJoined] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onJoin?.(email.trim());
    setJoined(true);
  };

  return (
    <section
      className={cn(
        "w-full bg-[#f6f1e7] text-stone-900 dark:bg-stone-950 dark:text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="border-y border-stone-900/20 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.3em] dark:border-stone-100/20">
          {kicker}
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* The poster: what the ticket gets you */}
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-500 dark:text-stone-400">
              {standfirst}
            </p>

            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-400">
              Now showing — for ticket holders
            </p>
            <ul className="mt-4 border-t-2 border-stone-900 dark:border-stone-100">
              {perks.map((perk, i) => (
                <li
                  key={perk}
                  className="flex min-w-0 gap-4 border-b border-stone-900/20 py-4 dark:border-stone-100/20"
                >
                  <span className="font-mono text-sm font-bold text-red-700 dark:text-red-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words font-serif text-lg leading-snug">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The ticket stub */}
          <div className="min-w-0">
            <div className="border-2 border-stone-900 bg-white dark:border-stone-100 dark:bg-stone-900">
              <div className="flex items-center justify-between gap-4 border-b border-dashed border-stone-900/40 px-5 py-3 dark:border-stone-100/40">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                  Admit one · Waitlist
                </span>
                <span className="bg-red-700 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Window open
                </span>
              </div>

              <div className="px-5 py-6 md:px-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                  Your number in line
                </p>
                <p className="mt-1 font-mono text-6xl font-black tabular-nums tracking-tight md:text-7xl">
                  Nº {String(startingTicket).padStart(3, "0")}
                </p>

                {joined ? (
                  <p
                    role="status"
                    className="mt-6 border-l-2 border-red-700 pl-4 font-serif text-lg leading-relaxed"
                  >
                    Ticket Nº {String(startingTicket).padStart(3, "0")} is
                    yours. We&apos;ll call your number when the doors open —
                    and not before.
                  </p>
                ) : (
                  <form onSubmit={submit} className="mt-6">
                    <label
                      htmlFor="ticket-window-email"
                      className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Email, please
                    </label>
                    <input
                      id="ticket-window-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700 dark:border-stone-100 dark:bg-stone-950 dark:text-stone-100"
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full bg-stone-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-red-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      Take a number →
                    </button>
                  </form>
                )}

                <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500 dark:text-stone-400">
                  One email when your number is called. No drip campaign, no
                  sharing your address. This stub is a demo — wire{" "}
                  <code>onJoin</code> to your real list.
                </p>
              </div>
            </div>

            <p className="mt-4 font-serif text-sm italic text-stone-500 dark:text-stone-400">
              A waitlist that says what it will do, and what it won&apos;t.
            </p>
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
