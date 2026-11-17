import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Card Catalog — a blog index staged as a library card catalog.
 * Every article is a catalog card: a call number, a title, an author,
 * a date, and an honest reading time — filed under its topic drawer.
 * There are no thumbnails pretending to be the article and no
 * "trending" counts nobody can check: the card is the finding aid,
 * not the article. The drawer tabs filter by topic and the count line
 * says exactly how many cards are in the drawer you opened. Flat
 * card-stock paper/ink, static. A catalog is printed on cards, so it
 * stays on paper in both modes, by genre.
 */

export interface Article {
  /** the call number, e.g. "741.6 DES" — the card's address in the catalog */
  callNumber: string;
  /** e.g. "Why your hero section is lying to you" */
  title: string;
  /** e.g. "Sai Teja Battula" */
  author: string;
  /** e.g. "2026-11-10" */
  date: string;
  /** honest reading time in minutes, e.g. 6 */
  minutes: number;
  /** the drawer this card is filed under, e.g. "Design" */
  topic: string;
  /** one plain sentence saying what the piece actually covers */
  summary: string;
  /** where the article lives, e.g. "/blog/hero-lying" */
  href: string;
  /** the newest arrival — filed first and set a little larger */
  featured?: boolean;
}

export interface CardCatalogProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the library's name, e.g. "The Unslop Library" */
  library?: string;
  articles?: Article[];
  footnote?: string;
  className?: string;
}

const DEFAULT_ARTICLES: Article[] = [
  {
    callNumber: "741.6 DES",
    title: "Why your hero section is lying to you",
    author: "Sai Teja Battula",
    date: "2026-11-10",
    minutes: 6,
    topic: "Design",
    summary:
      "A centered pill badge, a gradient wash, and three identical cards is not a hero — it is a confession. What to put there instead.",
    href: "/blog/hero-lying",
    featured: true,
  },
  {
    callNumber: "005.1 ENG",
    title: "The router that reads minds (badly)",
    author: "Sai Teja Battula",
    date: "2026-11-03",
    minutes: 8,
    topic: "Engineering",
    summary:
      "Intent scoring over a component registry, the confidence floor that keeps vague asks honest, and the one bug that matched the word 'me'.",
    href: "/blog/router-minds",
  },
  {
    callNumber: "741.6 DES",
    title: "A pricing page is a menu, not a table",
    author: "Sai Teja Battula",
    date: "2026-10-27",
    minutes: 5,
    topic: "Design",
    summary:
      "The glowing middle tier is a trick everyone has seen. Set the prices like a bistro sets its menu — and stamp the house special.",
    href: "/blog/pricing-menu",
  },
  {
    callNumber: "001.4 NOT",
    title: "Notes from the dead-letter office",
    author: "Sai Teja Battula",
    date: "2026-10-19",
    minutes: 4,
    topic: "Notes",
    summary:
      "Every 404 we shipped this year, what each one got wrong, and why the honest answer is 'we don't know where it went'.",
    href: "/blog/dead-letter-notes",
  },
  {
    callNumber: "005.1 ENG",
    title: "Static by default, animated on purpose",
    author: "Sai Teja Battula",
    date: "2026-10-12",
    minutes: 7,
    topic: "Engineering",
    summary:
      "Everything fading up on scroll is a site performing enthusiasm it doesn't feel. One interaction, one motion — or none at all.",
    href: "/blog/static-by-default",
  },
];

export function CardCatalog({
  kicker = "The library · open to readers",
  heading = "Every article, filed where you can find it.",
  standfirst = "No thumbnails pretending to be the article, no 'trending' counts nobody can check. Each card says what the piece is, who wrote it, when, and how long it takes to read — then gets out of the way.",
  library = "The Unslop Library",
  articles = DEFAULT_ARTICLES,
  footnote,
  className,
}: CardCatalogProps) {
  const [drawer, setDrawer] = React.useState<string>("All");
  const topics = React.useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.topic)))],
    [articles],
  );
  const visible =
    drawer === "All" ? articles : articles.filter((a) => a.topic === drawer);
  const featured = visible.find((a) => a.featured);
  const rest = featured ? visible.filter((a) => a !== featured) : visible;

  return (
    <section
      className={cn("bg-[#f4eddc] text-stone-950", className)}
      role="region"
      aria-label="Article index"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        {/* Catalog header */}
        <div className="min-w-0 border-b-4 border-double border-stone-950 pb-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-900">
            {kicker}
          </p>
          <h2 className="mt-2 break-words font-serif text-3xl font-black tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl break-words font-serif text-base italic leading-relaxed text-stone-700">
            {standfirst}
          </p>
          <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
            {library} · {articles.length} cards on file
          </p>
        </div>

        {/* The drawers */}
        <div className="mt-5" role="group" aria-label="Filter by topic">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
            Open a drawer
          </p>
          <div className="mt-2 flex min-w-0 flex-wrap gap-2">
            {topics.map((topic) => {
              const count =
                topic === "All"
                  ? articles.length
                  : articles.filter((a) => a.topic === topic).length;
              const active = drawer === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setDrawer(topic)}
                  aria-pressed={active}
                  className={cn(
                    "min-w-0 shrink-0 border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.15em]",
                    active
                      ? "border-stone-950 bg-stone-950 text-[#f4eddc]"
                      : "border-stone-950/40 bg-transparent text-stone-800 hover:border-stone-950",
                  )}
                >
                  {topic} · {count}
                </button>
              );
            })}
          </div>
          <p className="mt-2 font-mono text-xs text-stone-700" aria-live="polite">
            {visible.length} of {articles.length} cards in this drawer
            {drawer !== "All" ? ` — filed under ${drawer}` : ""}
          </p>
        </div>

        {/* The cards */}
        {visible.length === 0 ? (
          <p className="mt-6 break-words border border-dashed border-stone-950/40 px-4 py-6 font-serif text-base italic leading-relaxed text-stone-700">
            No cards in this drawer yet. The drawer is empty, not broken —
            file the first article here and it will show up.
          </p>
        ) : (
          <div className="mt-6">
            {featured && (
              <article className="border-2 border-stone-950 bg-[#fbf7ea] px-5 py-5 shadow-[6px_6px_0_0_#1c1917]">
                <p className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-red-900">
                    New arrival
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
                    Call no. {featured.callNumber}
                  </span>
                </p>
                <h3 className="mt-3 break-words font-serif text-2xl font-black leading-tight md:text-3xl">
                  <a href={featured.href} className="underline decoration-red-900 decoration-2 underline-offset-4">
                    {featured.title}
                  </a>
                </h3>
                <p className="mt-2 break-words font-serif text-base leading-relaxed text-stone-700">
                  {featured.summary}
                </p>
                <p className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-stone-700">
                  <span>
                    By <strong className="text-stone-950">{featured.author}</strong>
                  </span>
                  <span>{featured.date}</span>
                  <span>{featured.minutes} min read</span>
                  <span className="font-bold uppercase tracking-[0.15em] text-red-900">
                    Filed under {featured.topic}
                  </span>
                </p>
              </article>
            )}

            <ul className="mt-4 border-t-2 border-stone-950">
              {rest.map((article) => (
                <li key={article.callNumber + article.title} className="border-b border-stone-950/15 py-5">
                  <p className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">
                      {article.callNumber}
                    </span>
                    <span className="min-w-0 flex-1 break-words font-serif text-xl font-black leading-snug">
                      <a href={article.href} className="underline decoration-stone-950/30 underline-offset-4 hover:decoration-red-900">
                        {article.title}
                      </a>
                    </span>
                    <span className="shrink-0 border border-red-900 px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.15em] text-red-900">
                      {article.topic}
                    </span>
                  </p>
                  <p className="mt-2 break-words font-serif text-base leading-relaxed text-stone-700">
                    {article.summary}
                  </p>
                  <p className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-stone-700">
                    <span>
                      By <strong className="text-stone-950">{article.author}</strong>
                    </span>
                    <span>{article.date}</span>
                    <span>{article.minutes} min read</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          Reading times are counted from the article itself, not estimated
          from the headline. Dates are the day the piece was filed, not the
          day it was last polished. The sample cards above are placeholders
          — replace them with your own articles; a card with no summary
          should say so, not invent one.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-700">{footnote}</p>
        )}
      </div>
    </section>
  );
}
