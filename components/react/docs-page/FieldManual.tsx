import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Field Manual — a documentation page staged as a printed field
 * manual. The contents are the chapters: numbered sections with an
 * honest reading time each, a "you are here" mark on the section you
 * are reading, and DRAFT printed on any section that is not written
 * yet instead of a page that pretends to be finished. Code blocks
 * carry a copy button and a label for what they are; field notes sit
 * in the margin as asides, not as popups; the page ends with a real
 * next step, not a dead end. Flat field-manual paper/ink/olive,
 * static. A manual is printed, so it stays on paper in both modes,
 * by genre.
 */

export interface ManualSection {
  /** e.g. "1.1" — the section's number in the manual */
  number: string;
  /** e.g. "Install it" */
  title: string;
  /** honest reading time in minutes, counted from the text itself */
  minutes: number;
  /** the section's paragraphs, in order */
  body: string[];
  /** a code block, with a label saying what it is */
  code?: { label: string; lines: string };
  /** a field note — an aside in the margin, not a popup */
  note?: string;
  /** true when the section is not written yet — printed as DRAFT */
  draft?: boolean;
}

export interface ManualChapter {
  /** e.g. "1" */
  number: string;
  /** e.g. "First, the map" */
  title: string;
  sections: ManualSection[];
}

export interface FieldManualProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** e.g. "The Unslop Field Manual" */
  manualName?: string;
  /** e.g. "Second edition" */
  edition?: string;
  /** e.g. "v2.4.1" — the version this manual describes */
  version?: string;
  /** e.g. "November 25, 2026" — when the manual was last revised */
  updated?: string;
  chapters?: ManualChapter[];
  /** where the reader goes next, e.g. { title: "The Router", href: "/docs/router" } */
  nextPage?: { title: string; href: string };
  footnote?: string;
  className?: string;
}

const DEFAULT_CHAPTERS: ManualChapter[] = [
  {
    number: "1",
    title: "First, the map",
    sections: [
      {
        number: "1.1",
        title: "What this manual covers",
        minutes: 2,
        body: [
          "This manual covers the router: the one command that reads a plain-language request and points at the component or skill that answers it. It does not cover the components themselves — each of those has its own page, filed under its own number.",
          "If you are here because something broke, start at section 2.2. If you are here because you are new, read this chapter in order. It takes five minutes, and the rest of the manual assumes you have.",
        ],
      },
      {
        number: "1.2",
        title: "Install it",
        minutes: 3,
        body: [
          "The router is one file. Copy it into your project and run it — there is nothing to configure before the first search, and no account to make.",
        ],
        code: {
          label: "Terminal — install and first search",
          lines: "curl -O https://unslop.dev/unslop\nchmod +x unslop\n./unslop find \"hero for my landing page\"",
        },
        note: "Field note: if the first search returns nothing above the confidence floor, the router says so instead of guessing. That is the feature, not a failure.",
      },
    ],
  },
  {
    number: "2",
    title: "Asking the router",
    sections: [
      {
        number: "2.1",
        title: "Ask it a question",
        minutes: 4,
        body: [
          "Ask in the words you would use to describe the section to a colleague: what it is for, who reads it, what it should do. The router scores your words against the intent tags in the registry and returns the best match with its score attached, so you can see how sure it is.",
          "A question that names the job beats a question that names the component. \"Checkout form to pay for my order\" finds The Till; \"checkout component\" might not.",
        ],
      },
      {
        number: "2.2",
        title: "When it says it doesn't know",
        minutes: 3,
        body: [
          "Below the confidence floor, the router stops and offers the prompt shaper instead of serving its best guess. A vague ask gets a sharper brief; a sharper brief gets a better component.",
          "Do not work around this by rewording the same vague ask until something matches. The floor is the part of the router that keeps it honest.",
        ],
        note: "Field note: the floor is a number in the registry, not a mood. It is 3. Asks scoring below it are not answered, they are reshaped.",
      },
      {
        number: "2.3",
        title: "The confidence floor",
        minutes: 2,
        body: [
          "Every match carries a score, and the floor is the line below which the router refuses to pretend. The score is printed next to the result, so a weak match reads as a weak match.",
        ],
        code: {
          label: "Terminal — a scored result",
          lines: "./unslop find \"pricing section for a coffee brand\"\n# 1. Menu Pricing — 65\n# 2. The Till — 11",
        },
      },
    ],
  },
  {
    number: "3",
    title: "Making it yours",
    sections: [
      {
        number: "3.1",
        title: "Writing your own intents",
        minutes: 5,
        body: [
          "This section is not written yet. The intents live in registry.json, one entry per component, and the rules for writing them are the same rules as the rest of this manual — but the worked example is still being written, and this page says so instead of shipping a placeholder that reads like advice.",
        ],
        draft: true,
      },
      {
        number: "3.2",
        title: "Shipping the change",
        minutes: 3,
        body: [
          "Add the component, add its intents, add one routing test that asks for it in plain words and expects it first. Run the suite. If the new intents push a vague ask over the floor, the intents are too broad — narrow them, do not lower the floor.",
        ],
      },
    ],
  },
];

function CodeBlock({ label, lines }: { label: string; lines: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure className="mt-4 min-w-0 border-2 border-stone-950 bg-stone-950 text-[#f2ecdd]">
      <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[#f2ecdd]/25 px-3 py-2">
        <span className="min-w-0 break-words font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2ecdd]/80">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 border border-[#f2ecdd]/60 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#f2ecdd] hover:bg-[#f2ecdd] hover:text-stone-950"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[13px] leading-relaxed">
        <code>{lines}</code>
      </pre>
    </figure>
  );
}

export function FieldManual({
  kicker = "Field manual · read it before you build",
  heading = "The manual, in the order it should be read.",
  standfirst = "Numbered chapters, honest reading times, and a contents page that says where you are. Sections still being written are marked DRAFT — a manual that hides its gaps is not a manual, it is a brochure.",
  manualName = "The Unslop Field Manual",
  edition = "Second edition",
  version = "v2.4.1",
  updated = "November 25, 2026",
  chapters = DEFAULT_CHAPTERS,
  nextPage = { title: "The Router", href: "/docs/router" },
  footnote,
  className,
}: FieldManualProps) {
  const allSections = React.useMemo(
    () => chapters.flatMap((c) => c.sections),
    [chapters],
  );
  const totalMinutes = allSections.reduce((sum, s) => sum + s.minutes, 0);
  const [current, setCurrent] = React.useState<string>(allSections[0]?.number ?? "");
  const [filter, setFilter] = React.useState("");

  const query = filter.trim().toLowerCase();
  const visibleChapters = chapters
    .map((chapter) => ({
      ...chapter,
      sections: chapter.sections.filter(
        (s) =>
          query === "" ||
          s.title.toLowerCase().includes(query) ||
          s.number.includes(query) ||
          chapter.title.toLowerCase().includes(query),
      ),
    }))
    .filter((chapter) => chapter.sections.length > 0);
  const visibleCount = visibleChapters.reduce((n, c) => n + c.sections.length, 0);

  return (
    <section
      className={cn("bg-[#f2ecdd] text-stone-950", className)}
      role="region"
      aria-label="Documentation page"
    >
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
        {/* Manual cover line */}
        <div className="min-w-0 border-b-4 border-double border-stone-950 pb-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#4d5c2a]">
            {kicker}
          </p>
          <h2 className="mt-2 break-words font-serif text-3xl font-black tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl break-words font-serif text-base italic leading-relaxed text-stone-700">
            {standfirst}
          </p>
          <p className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
            <span>{manualName}</span>
            <span>{edition}</span>
            <span>{version}</span>
            <span>Revised {updated}</span>
            <span>{allSections.length} sections · {totalMinutes} min to read</span>
          </p>
        </div>

        <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-[16rem_minmax(0,1fr)]">
          {/* The contents */}
          <nav className="min-w-0" aria-label="Contents">
            <div className="md:sticky md:top-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                Contents
              </p>
              <label className="mt-2 block">
                <span className="sr-only">Filter the contents</span>
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Find a section…"
                  className="w-full min-w-0 border-2 border-stone-950 bg-[#fbf7ea] px-3 py-2 font-mono text-sm text-stone-950 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#4d5c2a]"
                />
              </label>
              <p className="mt-2 font-mono text-xs text-stone-700" aria-live="polite">
                {query === ""
                  ? `${allSections.length} sections, ${totalMinutes} minutes`
                  : `${visibleCount} of ${allSections.length} sections match “${filter.trim()}”`}
              </p>

              {visibleChapters.length === 0 ? (
                <p className="mt-4 break-words border border-dashed border-stone-950/40 px-3 py-4 font-serif text-sm italic leading-relaxed text-stone-700">
                  No section by that name. The contents list what exists —
                  try a shorter word, or read the chapter headings.
                </p>
              ) : (
                <ol className="mt-4 border-t-2 border-stone-950">
                  {visibleChapters.map((chapter) => (
                    <li key={chapter.number} className="border-b border-stone-950/15 py-3">
                      <p className="flex min-w-0 items-baseline gap-2">
                        <span className="shrink-0 font-serif text-lg font-black text-[#4d5c2a]">
                          {chapter.number}
                        </span>
                        <span className="min-w-0 break-words font-serif text-base font-black leading-snug">
                          {chapter.title}
                        </span>
                      </p>
                      <ul className="mt-2">
                        {chapter.sections.map((section) => {
                          const isCurrent = current === section.number;
                          return (
                            <li key={section.number}>
                              <a
                                href={`#section-${section.number.replace(".", "-")}`}
                                onClick={() => setCurrent(section.number)}
                                aria-current={isCurrent ? "true" : undefined}
                                className={cn(
                                  "flex min-w-0 items-baseline gap-2 px-2 py-1.5 font-mono text-[13px] leading-snug",
                                  isCurrent
                                    ? "bg-stone-950 font-bold text-[#f2ecdd]"
                                    : "text-stone-800 hover:bg-stone-950/10",
                                )}
                              >
                                <span className="shrink-0 font-bold">
                                  {isCurrent ? "▶ " : ""}
                                  {section.number}
                                </span>
                                <span className="min-w-0 flex-1 break-words">
                                  {section.title}
                                </span>
                                {section.draft ? (
                                  <span className="shrink-0 border border-red-900 px-1.5 py-0 font-mono text-[10px] font-black uppercase tracking-[0.15em] text-red-900">
                                    Draft
                                  </span>
                                ) : (
                                  <span className="shrink-0 text-stone-500">
                                    {section.minutes} min
                                  </span>
                                )}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}

              <p className="mt-4 rotate-[-2deg] inline-block border-2 border-red-900 px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-red-900">
                Read me first
              </p>
            </div>
          </nav>

          {/* The page */}
          <div className="min-w-0">
            {chapters.map((chapter) => (
              <div key={chapter.number} className="mt-8 first:mt-0">
                <p className="flex min-w-0 items-baseline gap-3 border-b-2 border-stone-950 pb-2">
                  <span className="shrink-0 font-serif text-4xl font-black text-[#4d5c2a]">
                    {chapter.number}
                  </span>
                  <span className="min-w-0 break-words font-serif text-2xl font-black leading-tight">
                    {chapter.title}
                  </span>
                </p>
                {chapter.sections.map((section) => (
                  <article
                    key={section.number}
                    id={`section-${section.number.replace(".", "-")}`}
                    className="mt-6 scroll-mt-4"
                  >
                    <h3 className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="shrink-0 font-mono text-sm font-black text-[#4d5c2a]">
                        §{section.number}
                      </span>
                      <span className="min-w-0 flex-1 break-words font-serif text-xl font-black leading-snug">
                        {section.title}
                      </span>
                      {section.draft ? (
                        <span className="shrink-0 border-2 border-red-900 px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-red-900">
                          Draft — not written yet
                        </span>
                      ) : (
                        <span className="shrink-0 font-mono text-xs text-stone-500">
                          {section.minutes} min read
                        </span>
                      )}
                    </h3>
                    {section.body.map((paragraph, i) => (
                      <p
                        key={i}
                        className="mt-3 break-words font-serif text-base leading-relaxed text-stone-800"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.code && (
                      <CodeBlock label={section.code.label} lines={section.code.lines} />
                    )}
                    {section.note && (
                      <aside className="mt-4 min-w-0 border-l-4 border-[#4d5c2a] bg-[#fbf7ea] px-4 py-3">
                        <p className="break-words font-serif text-sm italic leading-relaxed text-stone-800">
                          {section.note}
                        </p>
                      </aside>
                    )}
                  </article>
                ))}
              </div>
            ))}

            {/* Read next — a page never ends in a dead end */}
            <div className="mt-10 border-t-4 border-double border-stone-950 pt-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                Read next
              </p>
              <p className="mt-2 break-words font-serif text-xl font-black leading-snug">
                <a
                  href={nextPage.href}
                  className="underline decoration-[#4d5c2a] decoration-2 underline-offset-4"
                >
                  {nextPage.title} →
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          Reading times are counted from the words on the page, not from the
          headline. A section marked DRAFT is not written yet — it says so
          here, in the contents, and on the page itself. The version and
          revision date above are the version this manual describes; if
          yours is newer, this manual is out of date, and it says when it
          was last revised so you can tell. The sample sections above are
          placeholders — replace them with your own manual; a section with
          no body should say so, not invent one.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-700">{footnote}</p>
        )}
      </div>
    </section>
  );
}
