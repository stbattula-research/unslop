import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Classifieds — a careers/jobs board staged as a newspaper's
 * help-wanted classifieds. Every catalog jobs board is the same grid of
 * identical cards fed by an ATS embed; this one is a printed page: a
 * HELP WANTED masthead, one ruled ad per role with a mono reference
 * number, department filter tabs that work like section headings, and
 * the salary printed in the ad itself — because a job post that hides
 * the pay is a classified that forgot the price. No "urgent hiring!!",
 * no fake applicant counters, no countdown to an application deadline
 * that restarts on reload. The footnote says what the salaries are:
 * the range the role was posted with, not a promise and not a tactic.
 */

export interface ClassifiedJob {
  /** mono reference number, printed like a classified ad number */
  ref: string;
  /** the role, in serif display type */
  title: string;
  /** department — also the filter heading the ad files under */
  department: string;
  /** where the work happens, e.g. "Remote — US" or "Austin, TX" */
  location: string;
  /** employment type, e.g. "Full-time" or "Contract" */
  type: string;
  /** salary range as posted, e.g. "$140k–$175k" */
  salary: string;
  /** one honest line about the work itself */
  blurb: string;
  /** where applying goes; defaults to "#" */
  applyHref?: string;
}

export interface ClassifiedsProps {
  /** masthead kicker above the heading */
  kicker?: string;
  /** the heading itself */
  heading?: string;
  /** one line under the heading, setting the terms of the page */
  standfirst?: string;
  /** the ads on the page; defaults to four sample roles */
  jobs?: ClassifiedJob[];
  /** small print under the ads */
  footnote?: string;
  className?: string;
}

const DEFAULT_JOBS: ClassifiedJob[] = [
  {
    ref: "Nº 047",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote — US",
    type: "Full-time",
    salary: "$140k–$175k",
    blurb: "You will own the checkout, not attend meetings about the checkout.",
    applyHref: "#",
  },
  {
    ref: "Nº 048",
    title: "Product Designer",
    department: "Design",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$115k–$145k",
    blurb: "One designer per surface, end to end — research, type, and the shipped pixels.",
    applyHref: "#",
  },
  {
    ref: "Nº 049",
    title: "Support Engineer",
    department: "Support",
    location: "Remote — Worldwide",
    type: "Full-time",
    salary: "$80k–$100k",
    blurb: "You answer the ticket and you fix the bug behind it. Same person, same day.",
    applyHref: "#",
  },
  {
    ref: "Nº 050",
    title: "Engineering Manager",
    department: "Engineering",
    location: "Remote — US",
    type: "Full-time",
    salary: "$165k–$200k",
    blurb: "Six engineers, one roadmap, and a calendar you are allowed to defend.",
    applyHref: "#",
  },
];

export function Classifieds({
  kicker = "Classifieds · Help wanted",
  heading = "Help wanted.",
  standfirst = "Four open roles, printed plainly. The pay is in the ad — a listing that hides it has forgotten the price.",
  jobs = DEFAULT_JOBS,
  footnote = "Salaries are the range each role was posted with — not a promise, not a negotiation tactic. Every role lists its real location and type; nothing here is 'fast-growing' or 'urgent'.",
  className,
}: ClassifiedsProps) {
  const departments = React.useMemo(() => {
    const seen: string[] = [];
    for (const job of jobs) {
      if (!seen.includes(job.department)) seen.push(job.department);
    }
    return seen;
  }, [jobs]);
  const [filter, setFilter] = React.useState<string>("All");
  const visible = filter === "All" ? jobs : jobs.filter((j) => j.department === filter);

  return (
    <section
      aria-label="Open roles"
      className={cn(
        "w-full bg-[#f6f1e7] text-stone-900 dark:bg-stone-900 dark:text-stone-100",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-400">
          {kicker}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-black leading-none tracking-tight sm:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-base italic leading-relaxed text-stone-600 dark:text-stone-400">
          {standfirst}
        </p>

        <div className="mt-8 border-y-2 border-stone-900 py-3 dark:border-stone-100">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by department">
            {["All", ...departments].map((dept) => (
              <button
                key={dept}
                type="button"
                aria-pressed={filter === dept}
                onClick={() => setFilter(dept)}
                className={cn(
                  "shrink-0 border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em]",
                  filter === dept
                    ? "border-stone-900 bg-stone-900 text-[#f6f1e7] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                    : "border-stone-900/40 text-stone-700 hover:border-stone-900 dark:border-stone-100/40 dark:text-stone-300 dark:hover:border-stone-100"
                )}
              >
                {dept}
              </button>
            ))}
            <span className="ml-auto shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              {visible.length} notice{visible.length === 1 ? "" : "s"} under this heading
            </span>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="border-b border-stone-900/20 py-10 font-serif text-lg italic text-stone-600 dark:border-stone-100/20 dark:text-stone-400">
            No notices under that heading — yet. Check back; the page is reprinted when a role opens, not on a schedule.
          </p>
        ) : (
          <ul className="list-none p-0 m-0">
            {visible.map((job) => (
              <li
                key={job.ref}
                className="border-b border-stone-900/20 py-6 dark:border-stone-100/20 sm:py-7"
              >
                <article className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <p className="w-16 shrink-0 font-mono text-xs font-bold tracking-[0.1em] text-red-700 dark:text-red-400">
                    {job.ref}
                  </p>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]">
                      {job.title}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                      {job.department} · {job.location} · {job.type}
                    </p>
                    <p className="mt-2 max-w-2xl break-words text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {job.blurb}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <p className="font-serif text-xl font-black tracking-tight">{job.salary}</p>
                    <a
                      href={job.applyHref ?? "#"}
                      className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-red-700 underline decoration-red-700/50 underline-offset-4 hover:text-red-800 dark:text-red-400 dark:decoration-red-400/50 dark:hover:text-red-300"
                    >
                      Apply →
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-[0.05em] text-stone-500 dark:text-stone-400">
          {footnote}
        </p>
      </div>
    </section>
  );
}
