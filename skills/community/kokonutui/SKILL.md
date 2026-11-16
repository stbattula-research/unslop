---
name: kokonutui
description: Use this skill when building AI-product interface in React/Next.js — chat composers, tool-call and tool-approval cards, model selectors, diff review, AI chat inputs — or when a marketing page needs one animated button, card, or text effect. It covers Kokonut UI's free shadcn registry: selection, installation via the @kokonutui namespace or the shadcn MCP server, and the curation and license rules that apply before anything is installed.
metadata:
  short-description: Kokonut UI registry routing for AI-product UI
---

# Kokonut UI

Kokonut UI is a shadcn-compatible registry of animated React components,
built with Tailwind CSS and Motion. Its distinctive strength is
AI-product interface: the chat, tool-call, and approval surfaces that a
general component set does not have. Components install as source into
the user's project through the shadcn CLI — the code lands in their
repo and is theirs to edit.

This skill is an original Unslop guide. Nothing from the registry is
vendored here; see `ATTRIBUTION.md`, and read the license boundary
below before installing anything.

## License Boundary — Read First

- **The free set is MIT.** Source: `github.com/kokonut-labs/kokonutui`.
  Free components may be installed via the registry and modified.
- **Kokonut UI Pro is NOT MIT.** Pro (kokonutui.pro, $119 one-time) is a
  separate commercial product under its own terms. **Never fetch,
  install, reproduce, or vendor Pro components, blocks, or templates.**
  Pro installs require the user's own purchase and API token — only
  proceed with Pro if the user provides their token and asks for a
  specific Pro component by name. When in doubt, use the free set.

## When To Apply

Apply this skill when the user is building:

- **AI-product UI:** a chat composer or AI chat input, tool-call
  displays, a tool-approval card (approve/deny a pending agent action),
  a model selector, inline citations, a diff-review surface, an AI
  checkout card.
- **One animated moment on a marketing page:** a button with real
  feedback, a card interaction, a text effect — one, chosen on purpose.
- A React/Next.js + Tailwind project where shadcn is already (or can
  be) initialized.

## When Not To Apply

- **Plain HTML/CSS projects.** Kokonut is React-only. For vanilla
  motion, see the `animejs` skill on this shelf.
- **Charts or data visualization.** That is Bklit's shelf entry, not
  this one.
- **Forms, tables, and data grids.** Kokonut has no real coverage
  there — use shadcn/ui's own primitives.
- **A whole page of effects.** If the ask is "make it animated,"
  the answer is curation (below), not volume.

## Install

The project needs shadcn initialized first:

```bash
npx shadcn@latest init
```

Add the Kokonut namespace to `components.json`:

```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json"
  }
}
```

Then install by name:

```bash
npx shadcn@latest add @kokonutui/<name>
```

The CLI writes the source to `components/kokonutui/` and installs the
dependencies the component declares (commonly `motion` and
`lucide-react`).

**Agent route:** with the shadcn MCP server configured, Claude Code,
Cursor, VS Code, and Codex can search and install Kokonut components
directly from a plain-language ask. The registry namespace above is
what makes that work — configure it once, then ask.

## Curation — The Unslop Part

Kokonut's defaults lean playful: particle bursts, gradients, glows,
bouncy text. Installed raw, they read as AI-built — the exact thing
Unslop exists to prevent. So:

1. **Shortlist, don't sweep.** Pick the one component the page needs.
   One animated moment per viewport; never a page where everything
   moves.
2. **Restyle to house tokens before shipping.** Replace the component's
   colors with the project's ink / paper / one-accent palette. Flat
   color with conviction; the gradient comes out.
3. **Skip anything on DESIGN.md's tells list.** Particle buttons, glow
   borders, gradient text, glassmorphism panels, star-rating
   testimonials — if the component's demo shows one, either restyle it
   past recognition or pick a different component.
4. **Calm the motion.** Kokonut components are client components built
   on Motion; apply `MOTION.md` — interaction-triggered, transform and
   opacity, 120–350ms, no overshoot, `prefers-reduced-motion` honored.
   Keep animated components out of hot server-rendered paths.
5. **Keep the API, change the costume.** Prefer prop and className
   changes over rewriting component internals, so upstream fixes stay
   easy to re-install.

A good outcome: a tool-approval card that looks like it belongs to the
product's own design system and happens to animate well. A bad outcome:
a page a visitor can identify as "Kokonut defaults" at a glance.

## Troubleshooting

- **`components.json` or namespace errors:** shadcn is not initialized,
  or the `@kokonutui` registry entry is missing — add it as above.
- **Import path mismatch:** components land in `components/kokonutui/`;
  import from there (or the project's `@/` alias equivalent).
- **Bundle grows unexpectedly:** nearly every component pulls in Motion
  and is a client component. Install fewer components; do not import a
  whole category for one button.
- **A component turns out to be Pro:** stop. See the license boundary —
  Pro needs the user's own purchase and token.

## Reference Links

- Free docs and components: `https://kokonutui.com`
- Free source (MIT): `https://github.com/kokonut-labs/kokonutui`
- Pro (commercial, separate terms): `https://kokonutui.pro`
- Unslop rules: `DESIGN.md` and `MOTION.md` (repo root)
