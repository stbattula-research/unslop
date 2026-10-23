import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Switchboard — a command palette staged as an old telephone
 * exchange. Every command is a line the operator can connect you to:
 * call numbers (OP-01), dotted switchboard rules, a "LINES OPEN" lamp,
 * and footer etiquette ("↑ ↓ switch lines — ⏎ connect — esc hang up").
 * Fuzzy subsequence filtering, full keyboard navigation, and a
 * connected-line stamp when you pick one. Flat cream paper and ink
 * with one signal-red accent — no glass, no blur, no gradient.
 */

export interface SwitchboardLine {
  /** e.g. "OP-01" — the call number printed on the jack */
  number: string;
  /** e.g. "Billing settings" — the command name */
  name: string;
  /** e.g. "Where the invoices live" — operator's whispered hint */
  hint?: string;
  /** e.g. "g b" or "⌘ ," — printed on the shortcut plate */
  shortcut?: string;
  /** rows are grouped under these; defaults to "Lines" */
  group?: string;
  /** e.g. () => router.push("/billing") — what "connecting" does */
  run?: () => void;
}

export interface SwitchboardProps {
  lines?: SwitchboardLine[];
  /** printed on the exchange header strip */
  kicker?: string;
  /** placeholder in the operator's mouthpiece */
  placeholder?: string;
  className?: string;
}

/** Fuzzy subsequence match: "blst" finds "Billing settings". */
export function lineMatches(query: string, line: SwitchboardLine): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = `${line.name} ${line.hint ?? ""}`.toLowerCase();
  let i = 0;
  for (const ch of text) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

export function Switchboard({
  lines = [
    { number: "OP-01", name: "Billing settings", hint: "Where the invoices live", shortcut: "g b", group: "Lines" },
    { number: "OP-02", name: "New invoice", hint: "Bill someone, politely", shortcut: "c i", group: "Lines" },
    { number: "OP-03", name: "Search customers", hint: "Everybody you've ever sold to", shortcut: "g c", group: "Lines" },
    { number: "OP-04", name: "Invite teammate", hint: "One more pair of hands", shortcut: "⌘ ⇧ i", group: "Operator's desk" },
    { number: "OP-05", name: "Toggle dark mode", hint: "The exchange has no windows", shortcut: "⌘ d", group: "Operator's desk" },
    { number: "OP-06", name: "Sign out", hint: "Hang up for the day", shortcut: "⌘ ⇧ q", group: "Operator's desk" },
  ],
  kicker = "The exchange · est. ⌘K",
  placeholder = "Operator — state your call…",
  className,
}: SwitchboardProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [connected, setConnected] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const shown = React.useMemo(() => lines.filter((l) => lineMatches(query, l)), [lines, query]);
  const safeActive = shown.length ? Math.min(active, shown.length - 1) : 0;

  React.useEffect(() => setActive(0), [query]);

  const connect = (line: SwitchboardLine) => {
    setConnected(line.name);
    line.run?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (shown.length ? (a + 1) % shown.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (shown.length ? (a - 1 + shown.length) % shown.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[safeActive]) connect(shown[safeActive]);
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else inputRef.current?.blur();
    }
  };

  // Group the filtered lines, keeping declaration order.
  const groups: Array<{ name: string; lines: SwitchboardLine[] }> = [];
  for (const line of shown) {
    const g = line.group ?? "Lines";
    let entry = groups.find((x) => x.name === g);
    if (!entry) {
      entry = { name: g, lines: [] };
      groups.push(entry);
    }
    entry.lines.push(line);
  }
  let rowCursor = 0;

  return (
    <section className={cn("w-full bg-[#faf3e8] text-stone-900 dark:bg-stone-950 dark:text-stone-50", className)}>
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
          {kicker}
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-black tracking-tight md:text-5xl">
          Every command, one call away.
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg italic text-stone-600 dark:text-stone-400">
          No menus to dive through. The operator connects you the moment you speak.
        </p>

        {/* The exchange panel */}
        <div className="mt-14 border-2 border-stone-900 dark:border-stone-50">
          {/* Header strip */}
          <div className="flex items-center justify-between border-b-2 border-stone-900 bg-stone-900 px-5 py-3 text-stone-100 dark:border-stone-50 dark:bg-stone-50 dark:text-stone-900">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]">
              The Switchboard
            </p>
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
              <span className="inline-block h-2 w-2 rounded-full bg-red-600 dark:bg-red-700" aria-hidden="true" />
              Lines open
            </p>
          </div>

          {/* Operator's mouthpiece */}
          <div className="border-b-2 border-stone-900 dark:border-stone-50">
            <label className="sr-only" htmlFor="switchboard-call">State your call</label>
            <div className="flex items-center gap-3 px-5 py-4">
              <span aria-hidden="true" className="font-serif text-xl font-black text-red-700 dark:text-red-400">✆</span>
              <input
                ref={inputRef}
                id="switchboard-call"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full bg-transparent font-mono text-base text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-50 dark:placeholder:text-stone-500"
              />
              <kbd className="shrink-0 border border-stone-900/40 px-2 py-0.5 font-mono text-[11px] font-bold text-stone-600 dark:border-stone-50/40 dark:text-stone-300">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* The jacks */}
          <div role="listbox" aria-label="Available lines" className="max-h-96 overflow-y-auto">
            {shown.length === 0 && (
              <p className="px-5 py-10 text-center font-serif text-base italic text-stone-500 dark:text-stone-400">
                No lines by that name. Operators love brevity — try a shorter number.
              </p>
            )}
            {groups.map((group) => (
              <div key={group.name}>
                <p className="flex items-center gap-3 px-5 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                  {group.name}
                  <span aria-hidden="true" className="h-px flex-1 border-t border-dotted border-stone-400 dark:border-stone-600" />
                </p>
                <ul className="py-2">
                  {group.lines.map((line) => {
                    const rowIndex = rowCursor++;
                    const isActive = rowIndex === safeActive;
                    return (
                      <li
                        key={line.number}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(rowIndex)}
                        onClick={() => connect(line)}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 px-5 py-3",
                          isActive && "bg-red-700/[0.07] dark:bg-red-400/10"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[10px] font-black",
                            isActive
                              ? "bg-red-700 text-[#faf3e8] dark:bg-red-400 dark:text-stone-950"
                              : "border border-stone-900/30 text-stone-500 dark:border-stone-50/30 dark:text-stone-400"
                          )}
                        >
                          {isActive ? "◉" : "○"}
                        </span>
                        <span className="w-14 shrink-0 font-mono text-[11px] font-bold tracking-widest text-stone-500 dark:text-stone-400">
                          {line.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-lg font-bold leading-tight">
                            {line.name}
                          </span>
                          {line.hint && (
                            <span className="block truncate text-sm italic text-stone-500 dark:text-stone-400">
                              {line.hint}
                            </span>
                          )}
                        </span>
                        {line.shortcut && (
                          <kbd className="shrink-0 border border-stone-900/40 px-2 py-0.5 font-mono text-[11px] font-bold text-stone-600 dark:border-stone-50/40 dark:text-stone-300">
                            {line.shortcut}
                          </kbd>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Telephone etiquette */}
          <div className="border-t-2 border-stone-900 px-5 py-3 dark:border-stone-50">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              ↑ ↓ switch lines&ensp;·&ensp;⏎ connect&ensp;·&ensp;esc hang up
            </p>
          </div>
        </div>

        {connected && (
          <p className="mx-auto mt-8 max-w-xl -rotate-1 text-center font-serif text-base italic text-stone-600 dark:text-stone-400">
            <span className="font-mono text-[10px] font-bold uppercase not-italic tracking-[0.25em] text-red-700 dark:text-red-400">
              Connected —{" "}
            </span>
            {connected}. The operator thanks you.
          </p>
        )}
      </div>
    </section>
  );
}
