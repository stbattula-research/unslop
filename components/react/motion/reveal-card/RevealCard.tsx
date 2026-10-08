import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Reveal Card — the one-motion rule, demonstrated.
 *
 * Exactly ONE element animates, and only on hover: the mono index arrow
 * stamps in from the left with a snappy spring and settles. Everything else
 * — the serif title, the ruled body, the hard shadow — stays dead still.
 *
 * Uses framer-motion (not part of the base component deps):
 *   npm install framer-motion
 *
 * The spring avoids the bouncy-screensaver cliché: high stiffness, high
 * damping, no overshoot. It lands like a rubber stamp, not a trampoline.
 */

export interface RevealCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  index: string; // mono index label, e.g. "01"
  title: string;
  body: string;
  href?: string; // optional — whole card becomes a link
}

const SNAP = { type: "spring" as const, stiffness: 420, damping: 34 };

const arrow = {
  rest: { x: -16, opacity: 0 },
  hover: { x: 0, opacity: 1 },
};

export function RevealCard({
  index,
  title,
  body,
  href,
  className,
  ...props
}: RevealCardProps) {
  const reduce = useReducedMotion();

  const card = (
    <motion.div
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      className={cn(
        "group relative border-2 border-stone-950 bg-stone-50 p-6",
        "shadow-[6px_6px_0_0_#1c1917]",
        href && "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* the ONLY animated element, driven by the card's hover state */}
      <motion.span
        aria-hidden
        variants={reduce ? undefined : arrow}
        transition={reduce ? { duration: 0 } : SNAP}
        className="absolute top-5 left-4 inline-block font-mono text-sm font-bold text-red-700"
      >
        →
      </motion.span>

      <p className="pl-8 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
        {index}
      </p>
      <h3 className="mt-2 pl-8 font-serif text-2xl leading-tight text-stone-950">
        {title}
      </h3>
      <p className="mt-3 border-t border-stone-300 pt-3 text-sm leading-relaxed text-stone-700">
        {body}
      </p>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {card}
      </a>
    );
  }
  return card;
}
