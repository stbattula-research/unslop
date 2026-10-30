import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Town Crier — an announcement bar staged as a town crier's
 * proclamation. One message, printed once, standing still: no rotating
 * messages, no countdown that restarts on every visit, no fake urgency.
 * A mono "HEAR YE" call with an edition number on the left, the
 * proclamation itself in serif, one link on the right, and a real dismiss
 * button (labeled, keyboard-usable) when `dismissible` is set. The strip
 * stays ink-dark in both modes — a notice board is dark by trade, the
 * way a scoreboard never goes light. Dismissing only hides the bar for
 * this render; persistence is the integrator's job, via `onDismiss`.
 */

export interface TownCrierProps {
  /** the proclamation itself — one message, kept short enough for a phone */
  message?: string;
  /** edition label, printed like a broadsheet number */
  edition?: string;
  /** optional single link text; omit for a link-free notice */
  linkText?: string;
  /** where the link goes; required when linkText is set */
  linkHref?: string;
  /** show the dismiss button (default true) */
  dismissible?: boolean;
  /** called when the reader dismisses the bar */
  onDismiss?: () => void;
  className?: string;
}

export function TownCrier({
  message = "The autumn sale ends Sunday at midnight — real midnight, not a timer that restarts when you reload.",
  edition = "Proclamation Nº 04",
  linkText = "Read the notice",
  linkHref = "#",
  dismissible = true,
  onDismiss,
  className,
}: TownCrierProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const dismiss = () => {
    onDismiss?.();
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={cn(
        "w-full bg-stone-900 text-stone-100",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 sm:px-6">
        <p className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
          Hear ye · {edition}
        </p>

        <p className="min-w-0 flex-1 break-words font-serif text-sm leading-snug sm:text-[15px]">
          {message}
        </p>

        {linkText && (
          <a
            href={linkHref}
            className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-400 underline decoration-amber-400/50 underline-offset-4 hover:text-amber-300"
          >
            {linkText} →
          </a>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="shrink-0 border border-stone-100/30 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-stone-300 hover:border-stone-100 hover:text-white"
          >
            Dismiss ✕
          </button>
        )}
      </div>
      <div className="border-t border-dashed border-stone-100/20" aria-hidden="true" />
    </div>
  );
}
