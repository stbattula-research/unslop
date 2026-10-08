# MOTION.md — animation that earns its place

DESIGN.md principle: **stillness is a design choice.** Unslop components are static by default. When you animate, you are spending the user's attention — spend it once, on purpose, on one thing.

## The rules

**1. One motion.** One page, one animated element at a time. A card hover that moves exactly one thing. A page load that reveals exactly one thing. Never stagger — stagger is how every generated site "performs enthusiasm." If three things move at once, you don't have choreography, you have noise.

**2. Interaction-triggered only.** Motion responds to the user: hover, focus, click, toggle. Nothing plays on scroll into view by default. Nothing autoplays. Scroll-triggered fade-ups are tell #12 — the single most overused pattern in AI-built sites. The user's action is the only honest reason for motion to start.

**3. Physical, not playful.** Motion should feel like paper, rubber, and hinges — decisive and slightly heavy — never like a cartoon. See the spring configs below.

**4. Duration budget.** Hover: 120–200ms. Reveal: 200–350ms. Page transition: 250–400ms, and only when the route genuinely changes context. Nothing takes longer than half a second. If an animation needs 800ms, the motion is the content — and it shouldn't be.

**5. Animate properties, not layouts.** Transform and opacity only. Animating width, height, margin, or padding triggers layout work and reads as janky even when it isn't. Want a size change? `transform: scale()` on an inner wrapper.

**6. `prefers-reduced-motion` is non-negotiable.** Wrap every animation:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

With Framer Motion, respect it explicitly: `const reduce = useReducedMotion()` and set `transition={{ duration: reduce ? 0 : 0.25 }}`.

## Spring configs that feel human

Default Framer Motion springs bounce like a screensaver. These read as intentional — a decisive settle, not a wobble:

```tsx
// Cards, buttons: a confident snap into place
const snappy = { type: "spring", stiffness: 400, damping: 34 };
// ^ stiffness: high (fast), damping: high (no overshoot). Physical like a hinge.

// Panels, drawers: weightier, slightly slower
const weighty = { type: "spring", stiffness: 260, damping: 30 };

// Hover feedback: tween, not spring — springs overshoot on quick mouse moves
const hover = { duration: 0.16, ease: [0.22, 1, 0.36, 1] }; // easeOutQuint
```

Why `easeOutQuint` (`[0.22, 1, 0.36, 1]`): it decelerates hard and lands. Linear eases (`easeOut` default cubic) feel floaty because they coast. For entrances, `easeOutQuint` is the closest curve to "decisive."

**Rule of thumb:** springs for layout-level movement (things arriving at rest), tweens for feedback (things responding to the pointer). Never use `damping < 25` on UI motion — that bouncy-screensaver feel is the motion equivalent of the purple gradient.

## CSS transition patterns

The workhorse — hover and focus, no library needed:

```css
.btn {
  /* transition only the properties you change */
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.btn:hover {
  /* the Unslop move: press INTO the page, not up */
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ink);
}
```

Hard-shadow buttons get *smaller* shadows on hover (a press), not larger ones (a float). Lifting reads as "look at me"; pressing reads as physical. Focus-visible gets the same treatment plus an outline offset — keyboard users deserve the motion too.

## Page transitions: restraint

Most SPAs don't need them. If the route changes context (docs → dashboard), fade the *content* at 250ms, never the chrome. Keep the header and nav static — moving the frame with the content is disorienting and adds nothing. No slide-in-from-right. No curtain wipes. This is a website, not a keynote.

## Never do this — the motion clichés list

1. **Fade-up-on-scroll stagger.** Everything rising in sequence as you scroll. Instant tell. Default to nothing; animate on interaction.
2. **Hero text typing effects.** The blinking cursor is 2014 cosplay.
3. **Count-up numbers.** "Watch our stats inflate" — the data should be interesting on its own.
4. **Parallax backgrounds.** Motion sickness as a feature. Also murder on performance.
5. **Loading skeletons that shimmer.** If it loads fast, skip the skeleton. If it loads slow, fix the load.
6. **Magnetic buttons** that follow the cursor. Party trick, zero usability.
7. **Scroll-jacking.** Hijacking the scroll wheel to play your timeline. Never.
8. **Hover everything.** If ten cards all lift on hover, none of them is special. One hover moment per viewport.
9. **Entrance animations on every element.** The site should arrive like a printed page — present — not perform itself.
10. **Infinite marquee tickers** at the top of a landing page. Unless the genre genuinely is a ticker tape, it's filler motion.

## Examples

Worked motion examples live in `components/react/motion/` — guidance, not catalog components (they stay out of `registry.json`). Start with the [reveal card](components/react/motion/reveal-card/) — one card, one animated element, hover-triggered, spring-settled.
