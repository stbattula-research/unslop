import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Playbill — a team section staged as a theatre playbill. The team
 * is the cast, in order of appearance: each person gets a cast number,
 * a typographic monogram (initials in a bordered square — a portrait
 * made of type, not a stock photograph), their name in oversized serif,
 * their role in mono caps, the year they joined, and one line in their
 * own words. Open roles are printed as parts still to cast — a vacancy,
 * not a fake cast member. Flat paper/ink/stage-red, static. A playbill
 * is printed, so it stays on paper in both modes, by genre.
 */

export interface CastMember {
  /** e.g. "ada-lovelace" */
  id: string;
  /** the person's name, e.g. "Ada Lovelace" */
  name: string;
  /** initials for the typographic portrait, e.g. "AL" */
  initials: string;
  /** the role, plainly stated, e.g. "Founder, engineering" */
  role: string;
  /** the year they joined — a fact, e.g. "2021" */
  since: string;
  /** one line in the person's own words — replace the sample, don't keep it */
  line: string;
}

export interface OpenPart {
  /** the role to be cast, e.g. "Support engineer" */
  title: string;
  /** where to apply — usually the jobs board */
  href: string;
}

export interface PlaybillProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the production this cast belongs to, e.g. "Acme, Inc." */
  company?: string;
  members?: CastMember[];
  /** vacancies, printed as parts still to cast */
  openParts?: OpenPart[];
  footnote?: string;
  className?: string;
}

const DEFAULT_MEMBERS: CastMember[] = [
  {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    initials: "AL",
    role: "Founder, engineering",
    since: "2021",
    line: "I write the code I wish I could have read when I started.",
  },
  {
    id: "grace-hopper",
    name: "Grace Hopper",
    initials: "GH",
    role: "Design lead",
    since: "2022",
    line: "A page should read like a person made it, on purpose.",
  },
  {
    id: "alan-turing",
    name: "Alan Turing",
    initials: "AT",
    role: "Infrastructure",
    since: "2023",
    line: "If it falls over at 3 a.m., it was my pager. It rarely falls over.",
  },
  {
    id: "katherine-johnson",
    name: "Katherine Johnson",
    initials: "KJ",
    role: "Customer support",
    since: "2024",
    line: "Most tickets are a question the page should have answered.",
  },
];

const DEFAULT_OPEN_PARTS: OpenPart[] = [
  { title: "Support engineer", href: "#jobs" },
  { title: "Technical writer", href: "#jobs" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Playbill({
  kicker = "The company · in order of appearance",
  heading = "The people behind the product.",
  standfirst = "No stock photographs of strangers pointing at laptops. These are the people who actually answer the email, ship the fix, and pick up the phone — in the order they joined, with one line each in their own words.",
  company = "Acme, Inc.",
  members = DEFAULT_MEMBERS,
  openParts = DEFAULT_OPEN_PARTS,
  footnote,
  className,
}: PlaybillProps) {
  return (
    <section
      className={cn("bg-[#f6f1e7] text-stone-950", className)}
      role="region"
      aria-label="Meet the team"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        {/* Playbill header */}
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
              {kicker}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-xl font-serif text-base italic leading-relaxed text-stone-700">
              {standfirst}
            </p>
          </div>
          <span
            aria-label={`Playbill for ${company}`}
            className="shrink-0 -rotate-3 border-[3px] border-double border-red-800 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-red-800"
          >
            {company}
          </span>
        </div>

        {/* The cast, in order of appearance */}
        <ol className="mt-6 border-t-2 border-stone-950">
          {members.map((m, i) => (
            <li
              key={m.id}
              className="flex min-w-0 flex-wrap items-start gap-x-5 gap-y-3 border-b border-stone-950/15 py-5"
            >
              <span className="shrink-0 pt-1 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">
                {pad(i + 1)}
              </span>
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-stone-950 bg-[#efe7d3] font-serif text-xl font-black tracking-tight"
              >
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="break-words font-serif text-2xl font-black leading-tight">
                  {m.name}
                </p>
                <p className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-3 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-[0.15em] text-red-800">
                  <span className="break-words">{m.role}</span>
                  <span className="shrink-0 text-stone-500">
                    Since {m.since}
                  </span>
                </p>
                <p className="mt-1 break-words font-serif text-base italic leading-relaxed text-stone-700">
                  “{m.line}”
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Parts still to cast */}
        {openParts.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
              Parts still to cast
            </p>
            <ul className="mt-2">
              {openParts.map((part) => (
                <li
                  key={part.title}
                  className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-dashed border-stone-950/15 py-2"
                >
                  <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-stone-500">
                    Vacant
                  </span>
                  <a
                    href={part.href}
                    className="min-w-0 flex-1 break-words font-serif text-base font-bold underline decoration-red-800 decoration-2 underline-offset-4"
                  >
                    {part.title}
                  </a>
                  <span className="shrink-0 font-mono text-xs text-stone-500">
                    Apply →
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          Portraits are initials, not photographs — swap in a real photo of
          the real person, or keep the initials. The line under each name
          is that person&apos;s own words; the samples here are placeholders
          to be replaced, not quotes to keep. A vacancy is printed as a
          vacancy, never as a person who does not exist.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-700">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
