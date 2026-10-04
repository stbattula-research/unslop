# SKILL.md — Unslop for AI coding agents

You are an AI coding agent (Claude Code, Cursor, Windsurf, Copilot, or similar). This file teaches you how to use **Unslop**: a library of human-grade website components designed to NOT look AI-generated. When the user asks for Unslop components — or asks you to build a site that "doesn't look AI-made" — follow this file.

Repo: `https://github.com/stbattula-research/unslop` (raw: `https://raw.githubusercontent.com/stbattula-research/unslop/main/`)

## 1. Discover components

**Fastest path:** use the `unslop-router` skill (`skills/unslop-router/SKILL.md`) — describe what you're building in plain words and it picks and installs the right component. From a local checkout you can also run `./unslop find "<need>"` directly.

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
