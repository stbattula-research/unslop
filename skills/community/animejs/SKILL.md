---
name: animejs
description: Use this skill when a project needs real animation but has no React — plain HTML/CSS/JavaScript, or Unslop's own HTML stack — and the job is SVG work (line drawing, morphing, motion paths) or tweening numbers and objects. It covers Anime.js v4: when to reach for it, how to install and import it, and the Unslop restraint rules that override its defaults.
metadata:
  short-description: Anime.js for vanilla and SVG animation, with restraint
---

# Anime.js

Anime.js is a small vanilla-JavaScript animation engine. It animates CSS
properties, DOM attributes, SVG, and plain JavaScript objects through one
API, with timelines for sequencing. It is the engine to reach for when
there is no framework in the project — or when the thing being animated
is an SVG.

This skill is an original Unslop guide to the library, written in our
words. The library itself is not vendored here; install it into the
user's project. See `ATTRIBUTION.md` for upstream and license.

## When To Apply

Apply this skill when:

- The project is plain HTML/CSS/JavaScript — including Unslop's own
  HTML/CSS component stack — and a CSS transition is not enough.
- The animation is SVG work: line drawing, shape morphing, or an element
  travelling along a motion path. This is Anime.js's home turf.
- A number or object needs tweening — a value counting between states, a
  progress value eased over time — driven from vanilla JS.
- Several steps must play in a strict sequence and a hand-rolled chain of
  timeouts would be fragile; a timeline states the sequence once.

## When Not To Apply

- **The project is React and already uses Motion.** Do not stack two
  animation engines. Motion owns React motion; see the `motion-dev`
  skill on this shelf.
- **The job is a hover, focus, or toggle state.** That is a CSS
  transition — see the workhorse pattern in `MOTION.md`. No library.
- **The job is heavy scroll choreography in a framework app.** GSAP's
  ScrollTrigger (see `gsap-motion`) is the more practised tool there.
- **Nothing has earned animating yet.** Unslop components are static by
  default. Decide the one motion first; pick the engine second.

## Install And Import (v4)

```bash
npm i animejs
```

v4 is modular — import the pieces you use from the package root:

```js
import { animate, createTimeline, stagger } from 'animejs';
```

A minimal, restraint-compliant example — one element, moved by the
user's click, transform only:

```js
import { animate } from 'animejs';

button.addEventListener('click', () => {
  animate('.stamp', {
    translateX: 2,
    translateY: 2,
    duration: 160,
    ease: 'outQuint',
  });
});
```

For the lightest possible footprint, Anime.js also ships a variant built
on the native Web Animations API:

```js
import { waapi } from 'animejs';

waapi.animate('.stamp', { translate: '2px 2px', duration: 160 });
```

The WAAPI variant covers most basic animation with a much smaller
engine. Prefer it unless a feature you need is marked JS-only in the
upstream docs.

## The Unslop Restraint Layer

Anime.js's own examples lean playful: staggered everything, scroll
triggers, springy overshoot. **Unslop's `MOTION.md` overrides those
defaults.** When both speak, `MOTION.md` wins:

1. **No stagger as decoration.** `stagger()` exists and is easy — that
   is exactly why it is a tell (DESIGN.md tell #12). A stagger is
   allowed only when the sequence itself carries meaning, such as steps
   of a process completing in order. A list of cards rippling in is not
   meaning.
2. **No autoplay scroll fade-ups.** Anime.js has a scroll observer; do
   not use it to fade sections up as they enter view. Motion starts on
   interaction — hover, focus, click, toggle — or it does not start.
3. **One motion at a time.** One animated element per view. If three
   things move, it is noise, not choreography.
4. **Transform and opacity only.** Never animate width, height, margin,
   or padding. For size changes, scale an inner wrapper.
5. **Duration budget.** Hover and feedback: 120–200ms. Reveals:
   200–350ms. Nothing over 500ms — if an animation needs longer, the
   motion has become the content, and it should not be.
6. **Physical, not playful.** Decisive easing that lands hard
   (`outQuint` is the house curve). No bouncy overshoot on UI motion.
7. **`prefers-reduced-motion` is non-negotiable.** Gate every animation:

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  // run the animation; otherwise set the end state directly
}
```

## SVG Notes

- Line drawing works by animating the stroke's dash offset; set the dash
  pattern up first, then tween to the drawn state.
- Morphing needs the source and target paths to have the same number of
  points — simplify paths before blaming the engine.
- Motion paths move an element along an SVG path; keep the path in the
  DOM (it can be visually hidden) so the engine can read it.
- Even for SVG, rules 2–7 above apply. A logo that draws itself once on
  load is a reveal; keep it under the duration budget and skip it
  entirely under reduced motion.

## Troubleshooting

- **Nothing moves:** check the target selector actually matches, and
  that the property name is one Anime.js animates (v4 uses camelCase
  transform names like `translateX`).
- **v3 code will not run:** v4 changed the API shape — a single options
  object and named imports replace the old `anime({...})` global style.
  Rewrite to the v4 imports above rather than shimming.
- **Jank on scroll or resize:** something is animating a layout
  property. Move it to transform/opacity per rule 4.

## Reference Links

- Docs: `https://animejs.com/documentation/`
- Site: `https://animejs.com`
- Source: `https://github.com/juliangarnier/anime`
- Unslop motion rules: `MOTION.md` (repo root) — read before animating
