# SKILL.md — Unslop for AI coding agents

You are an AI coding agent (Claude Code, Cursor, Windsurf, Copilot, or similar). This file teaches you how to use **Unslop**: a library of human-grade website components designed to NOT look AI-generated. When the user asks for Unslop components — or asks you to build a site that "doesn't look AI-made" — follow this file.

Repo: `https://github.com/stbattula-research/unslop` (raw: `https://raw.githubusercontent.com/stbattula-research/unslop/main/`)

## 1. Discover components

**Fastest path:** use the `unslop-router` skill (`skills/unslop-router/SKILL.md`) — describe what you're building in plain words and it picks and installs the right component. From a local checkout you can also run `./unslop find "<need>"` directly. If your host exposes an MCP client, prefer the native route: [`servers/unslop-mcp/`](servers/unslop-mcp/) — `search_components`, `get_component`, `install_component` as tool calls, same scoring as the router, no registry files to read.

Manual path — fetch the registry index and read it:

```
https://raw.githubusercontent.com/stbattula-research/unslop/main/registry.json
```

Each item has `name`, `title`, `description`, and `url` (the raw `r/<name>.json`). Pick components by matching the user's need against titles/descriptions. When unsure, list the options to the user instead of guessing.

## 2. Install — React + Tailwind projects

Each item is a shadcn registry item. Prefer the registry command so files land in the right place:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/stbattula-research/unslop/main/r/<name>.json
```

Notes:
- Components use Tailwind utilities + system font stacks only. No extra npm dependencies.
- They import a `cn()` helper. If the project already has `@/lib/utils` with `cn`, reuse it and drop the import path difference; otherwise copy `components/react/lib/utils.ts` from this repo.
- The FAQ component uses React state and includes `"use client";` — keep the directive in Next.js App Router projects, remove it elsewhere.
- Optional: for the full editorial look, set the serif stack to [Fraunces](https://fonts.google.com/specimen/Fraunces) in the Tailwind config. Not required.

## 3. Install — plain HTML/CSS projects (or "just show me the code")

Fetch the two files per component — they work with zero build step:

```
https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/<name>/<name>.html
https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/<name>/<name>.css
```

Copy the component markup (not the demo chrome) into the user's page and link the stylesheet. Google Fonts (Fraunces) is loaded via `<link>` in the demo file — keep that link if the user wants the intended type.

## 4. Rules — read before restyling

These are non-negotiable. They are the entire point of the library:

1. **Do not "modernize" components into AI clichés.** Never add purple/blue gradients, glassmorphism/blur panels, centered pill-badge heroes, star-rating testimonials, or glowing pricing tiers. See `DESIGN.md` for the full list of tells.
2. **Keep the design tokens.** Each component's ink/paper/accent, type pairing, and genre (masthead, ledger, menu, letter, poster, colophon) are deliberate. Change content freely; change the voice only toward a *stronger* point of view.
3. **Don't center what was left-aligned on purpose.** Asymmetric layouts are intentional.
4. **Don't round the sharp corners** unless the genre calls for it. The hard offset shadows are load-bearing.
5. **Microcopy stays human.** If you rewrite copy, match the existing voice — specific, a little dry, no "revolutionize"/"unlock"/"seamless".

## 5. When the user wants something not in the catalog

Check `registry.json` first. If no component fits, say so plainly and offer to build in the Unslop style using `DESIGN.md` principles — do not silently substitute a generic AI-style component.

## 6. Before launch — run the pre-launch audit

When the site is built and the user is close to shipping, audit it with the `prelaunch-audit` plugin (`plugins/prelaunch-audit/`):

```bash
./plugins/prelaunch-audit/audit ./dist          # local build
./plugins/prelaunch-audit/audit https://example.com   # deployed site
```

22 automated checks (SEO, social previews, links, images, forms, 404, leaked secrets, security headers, page weight), zero dependencies, exits 1 on failure. Then work the checklists in `plugins/prelaunch-audit/checklists/` — fix what you find, and report in two buckets: *fixed* vs *needs you*. The full agent workflow is in `plugins/prelaunch-audit/SKILL.md`.

## 7. Design like you mean it — the design-intel skill

Before making visual decisions, read `skills/design-intel/SKILL.md`. It's senior-designer judgment as executable rules: type scale discipline and pairing (one serif display, one grotesk body, one mono label — never more), spacing rhythm (one ladder, whitespace as the primary tool), ink/paper/one-accent color discipline, genre-picked layouts, and copy that sounds like a person. Run its 15-question self-critique review on your own output before shipping — one "no" means fix it before committing.

## 8. Animate with restraint — the motion playbook

`MOTION.md` is the animation guide: stillness is a design choice — animate one thing, on interaction, or animate nothing. Interaction-triggered motion only (never fade-up-on-scroll stagger), spring configs that land like a stamp instead of bouncing (`stiffness: 400+, damping: 30+`), `easeOutQuint` for tweens, duration budgets (hover 120–200ms, nothing over 500ms), `prefers-reduced-motion` handling, and the never-do-this list (typing effects, count-ups, parallax, magnetic buttons, scroll-jacking). Worked example in `components/react/motion/reveal-card/` (needs `framer-motion` — the only dependency Unslop examples ever take). Motion examples are guidance, not catalog components — they stay out of `registry.json`.

## 9. Turn vague asks into build briefs — the prompt-shaper skill

When the user's request is a handwave ("build me a landing page"), reach for `skills/prompt-shaper/SKILL.md` before writing code. It detects the target tool, extracts eight intent dimensions (task, inputs, outputs, constraints, context, audience, success criteria, stop conditions), asks at most 3 clarifying questions with defaults, matches `registry.json` for components (and says so when nothing fits), bakes DESIGN.md constraints into the brief, and emits a one-page brief template with an acceptance checklist, stop conditions, and anti-slop prohibitions. The CLI helps: `./unslop find "<vague ask>"` refuses to guess below the confidence floor and points at prompt-shaper instead.
