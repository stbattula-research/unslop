# Community Shelf Playbook — my own synthesis

The shelf now holds 24 skills. This playbook maps common goals to the exact
skill combinations to reach for, in order. (Unslop's router also scores these
automatically via `skills/index.json` — this is the human-readable version.)

## "Make my landing page look premium"

1. `awwwards-ui` — sets the bar: layout ambition, motion, self-audit gate
2. `design-database` — pick a palette from `colors.csv`, pair from `typography.csv`
3. `ilm-aesthetics` — lock one aesthetic system so choices stay coherent
4. `impeccable` — run `polish` then `audit` passes before shipping

## "Add smooth animations"

1. `emilkowalski-motion` (`emil-design-eng`) — decide *whether* to animate first
2. `gsap-motion` (`gsap-scrolltrigger`) — scroll reveals, page transitions
3. `motion-dev` — spring-physics buttons, magnetic hovers (React)
4. `motion-design` (LottieFiles) — timing/easing judgment when it feels off
5. `emilkowalski-motion` (`review-animations`) — gate before merge

## "Glassmorphic / frosted UI"

1. `liquid-glass` — translucency hierarchy + accessible contrast reasoning
2. `glassmorphism` — the concrete frosted-surface recipes
3. `gradient` — atmospheric backgrounds behind the glass

## "Find a component instead of building one"

1. `component-discovery` — search 1,500+ across 30+ animated registries
2. `magic-ui` — the animated component authority (marquee, bento, blur-fade)
3. `taste` — sanity-check the pick doesn't read as generic

## "Design a logo / brand mark"

1. `logo-design` — brief → concepts → SVG → audit → export pipeline
2. `design-database` — palette shortlist for the mark

## "Explain my system to someone"

1. `annotated-illustrations` — hand-drawn maps of components and data flow

## "Mobile app screens"

1. `appllama-mobile` — native-quality patterns, simulator-verified bar
2. `liquid-glass` — iOS-style translucency done right

## Rules of thumb

- One aesthetic system per project (`ilm-aesthetics`). Mixing systems is how
  designs get loud.
- Motion answers "what changed?" — if it doesn't communicate state or
  hierarchy, cut it (`emil-design-eng`).
- Palettes and fonts come from `design-database` *before* writing CSS, not
  after.
- `taste` is the last-mile check against generic AI-looking output.
- Everything here is third-party reference (see each `ATTRIBUTION.md`);
  Unslop's own judgment lives in `skills/design-intel/`.
