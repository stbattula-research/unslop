import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Telegram — a newsletter signup staged as a telegram / wire dispatch.
 * The pitch is on the left: what the dispatch carries, its cadence, and
 * three recent issues with dates — the archive, not a promise, is the
 * evidence. The signup itself is a wire form on the right: TO / FROM /
 * MESSAGE lines, STOP-separated, a "SEND THE WIRE" button, and the
 * unsubscribe printed on the form itself. Submitting marks the wire
 * received in place — wiring the email to a real list is the integrator's
 * job, and the optional `onSubscribe` prop is where that hook lives.
 * No subscriber count, no "join 10,000+ readers" social proof, no fake
 * urgency: the cadence is printed, the issues are the integrator's real
 * archive entries, and the form says exactly what joining does. Flat
 * telegram paper, ink, wire red, static except for the form itself.
 */

export interface TelegramIssue {
  /** e.g. "Oct 31" */
  date: string;
  /** the issue's subject — a real archive entry, not a teaser */
  title: string;
}

export interface TelegramProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the newsletter's name, printed as the addressee of the wire */
  newsletterName?: string;
  /** printed cadence, e.g. "One dispatch, every Friday" */
  cadence?: string;
  /** recent issues — the archive that substantiates the promise */
  issues?: TelegramIssue[];
  /** called with the email on submit, when the integrator wires up a real list */
  onSubscribe?: (email: string) => void;
  footnote?: string;
  className?: string;
}

export function Telegram({
  kicker = "The wire · one dispatch a week",
  heading = "Send for the dispatch.",
  standfirst = "One telegram a week. What we found, what it costs, and what we'd do about it — no drip campaign, no sponsor slot, no reply-all.",
  newsletterName = "The Friday Dispatch",
  cadence = "One dispatch, every Friday",
  issues = [
    { date: "Oct 30", title: "Why every pricing page quietly raised its floor" },
    { date: "Oct 23", title: "The checkout field that costs shops 11% of carts" },
    { date: "Oct 16", title: "A polite case against the rotating hero" },
  ],
  onSubscribe,
  footnote,
  className,
}: TelegramProps) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubscribe?.(email.trim());
    setSent(true);
  };

  return (
    <section
      className={cn(
        "w-full bg-[#f4efe3] text-stone-900 dark:bg-stone-950 dark:text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="border-y border-stone-900/20 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.3em] dark:border-stone-100/20">
          {kicker}
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* The pitch: what the dispatch carries */}
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-500 dark:text-stone-400">
              {standfirst}
            </p>

            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-400">
              Recent dispatches — read before you subscribe
            </p>
            <ul className="mt-4 border-t-2 border-stone-900 dark:border-stone-100">
              {issues.map((issue) => (
                <li
                  key={issue.title}
                  className="flex min-w-0 gap-4 border-b border-stone-900/20 py-4 dark:border-stone-100/20"
                >
                  <span className="shrink-0 font-mono text-sm font-bold text-red-700 dark:text-red-400">
                    {issue.date}
                  </span>
                  <span className="min-w-0 break-words font-serif text-lg leading-snug">
                    {issue.title}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500 dark:text-stone-400">
              {cadence} · STOP
            </p>
          </div>

          {/* The wire form */}
          <div className="min-w-0">
            <div className="border-2 border-stone-900 bg-white dark:border-stone-100 dark:bg-stone-900">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-dashed border-stone-900/40 px-5 py-3 dark:border-stone-100/40">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                  Telegram · Wire form
                </span>
                <span className="bg-red-700 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Lines open
                </span>
              </div>

              <div className="px-5 py-6 md:px-6">
                <dl className="space-y-3 font-mono text-sm">
                  <div className="flex min-w-0 flex-wrap gap-x-3">
                    <dt className="shrink-0 font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                      To:
                    </dt>
                    <dd className="min-w-0 break-words font-bold">
                      {newsletterName}
                    </dd>
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-x-3">
                    <dt className="shrink-0 font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                      From:
                    </dt>
                    <dd className="min-w-0 break-words">
                      Your inbox, every Friday
                    </dd>
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-x-3">
                    <dt className="shrink-0 font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                      Message:
                    </dt>
                    <dd className="min-w-0 break-words">
                      One dispatch a week. Nothing else. STOP
                    </dd>
                  </div>
                </dl>

                {sent ? (
                  <p
                    role="status"
                    className="mt-6 border-l-2 border-red-700 pl-4 font-serif text-lg leading-relaxed"
                  >
                    Wire received. The first dispatch arrives Friday — and
                    replying STOP to any of them ends it, no questions asked.
                  </p>
                ) : (
                  <form onSubmit={submit} className="mt-6">
                    <label
                      htmlFor="telegram-email"
                      className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Your address, please
                    </label>
                    <input
                      id="telegram-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f4efe3] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700 dark:border-stone-100 dark:bg-stone-950 dark:text-stone-100"
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full bg-stone-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-red-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      Send the wire →
                    </button>
                  </form>
                )}

                <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500 dark:text-stone-400">
                  {cadence}. Reply STOP any time to end it. Your address is
                  never shared or sold. This form is a demo — wire{" "}
                  <code>onSubscribe</code> to your real list.
                </p>
              </div>
            </div>

            <p className="mt-4 font-serif text-sm italic text-stone-500 dark:text-stone-400">
              A signup form that prints its terms before asking for the address.
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
