---
name: unslop-router
description: Pick and install the right Unslop website component for a build task. Use when the user wants a website section (hero, navbar, pricing, features, testimonials, FAQ, call-to-action, footer, contact form, button) that does not look AI-generated, or mentions Unslop, anti-slop, or human-grade design. Routes natural-language intent to the matching component and installs it.
---

# unslop-router — intent → component → installed

You route what the user is building to the correct Unslop component and install it. Unslop components are opinionated (editorial, print-inspired, no AI clichés) — your job is picking the right one, not redesigning it.

## 1. Understand the request

Extract two things from the user's message:

- **The section they need.** Map loosely: "landing top" → hero, "menu/nav" → navbar, "plans/tiers" → pricing, "reviews/quotes" → testimonials, "questions" → faq, "sign up block" → cta-banner, "bottom of page" → footer, "reach us" → contact-form, "list of perks" → features.
- **The stack.** React + Tailwind (shadcn) or plain HTML/CSS. If unclear, ask — the install path differs.

## 2. Find the match

**If you have the repo checked out locally**, run the router — it scores intent tags in `registry.json` and never guesses blind:

```bash
./unslop find "<the user's need in their own words>" --top 3
```

`find` also scores the skill index (`skills/index.json`) alongside components:

- A confident component match prints install commands, plus related skills when any score > 0.
- If the query looks like skill work ("critique my design", "which component should I use", "help me write a better brief"), `find` routes to skills first instead of guessing a component.
- If the query is too vague for any component (below the confidence floor), `find` refuses to guess and points at the **prompt-shaper** skill (`skills/prompt-shaper/SKILL.md`) — sharpen the ask, then re-run.

Dedicated skill search:

```bash
./unslop skill "critique my typography"   # search skills by intent
./unslop skill --list                     # list all skills with their paths
```

**Otherwise**, fetch the registry and match against `title`, `description`, `intents`, and `useCases` (never `notFor`):

```
https://raw.githubusercontent.com/stbattula-research/unslop/main/registry.json
```

Rules:

- If the top match clearly fits, proceed.
- If two components score close (e.g. `cta-banner` vs `button` for "sign up"), show both with one-line differences and let the user pick. Do not silently pick.
- If nothing fits, say so plainly and offer to build in the Unslop style from `DESIGN.md` — never substitute a generic AI-style section.

## 3. Install

**React + Tailwind** (shadcn registry item):

```bash
npx shadcn@latest add https://raw.githubusercontent.com/stbattula-research/unslop/main/r/<name>.json
```

Or locally: `./unslop add <name> --stack react [--run]`

Notes: components import a `cn()` helper — reuse the project's `@/lib/utils` if present, else copy `components/react/lib/utils.ts`. Keep `"use client"` on the FAQ in Next.js App Router.

**Plain HTML/CSS** (zero build step):

```bash
curl -O https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/<name>/<name>.html
curl -O https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/<name>/<name>.css
```

Or locally: `./unslop add <name> --stack html --dest <dir>`

Copy the component markup (not the demo chrome) into the page and link the stylesheet.

## 4. Non-negotiable design rules

The component's voice is the product. After installing:

1. Never "modernize" into AI clichés: no purple/blue gradients, no glassmorphism, no centered pill-badge heroes, no star ratings, no glowing tiers. Full list in `DESIGN.md`.
2. Change content freely; change the voice only toward a *stronger* point of view.
3. Don't center what was left-aligned on purpose. Don't round the hard shadows.
4. Microcopy stays human — specific, a little dry, no "revolutionize/unlock/seamless".

## Worked example

User: *"pricing section for a coffee brand, don't make it look AI"*
→ `./unslop find "pricing section for a coffee brand"` → **Menu Pricing** (bistro-menu pricing, serif prices, dotted leaders)
→ `./unslop add pricing --stack react` → fill in the three tiers with the brand's actual plans.
