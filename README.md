# Unslop — human-grade UI components for the AI era

<!-- demo.gif coming soon -->

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Components](https://img.shields.io/badge/components-10%20%C3%97%202-blue.svg)](#component-catalog)

AI tools build websites fast. They also build websites that all look the same: the purple gradient, the centered pill-badge hero, the glassmorphism cards, the "revolutionize your workflow" copy. You can spot one in two seconds.

**Unslop is a shelf of website components with a point of view.** Every component looks like a human designer stayed up late on purpose — editorial typography, restrained confident color, asymmetric layouts, copy that sounds like a person. Build with AI, ship without the tell.

Each component ships in **two dialects**:

| Stack | Location | Install |
|---|---|---|
| React + Tailwind (shadcn-compatible) | `components/react/<name>/` | `npx shadcn@latest add https://raw.githubusercontent.com/stbattula-research/unslop/main/r/<name>.json` |
| Framework-free HTML/CSS | `components/html/<name>/` | Copy `components/html/<name>/<name>.html` + `<name>.css`, or open the `.html` file directly — no build step |

Point your AI coding agent at [`SKILL.md`](SKILL.md) and it can discover, fetch, and install components on its own.

## Unslop Router — describe what you need, get the component installed

Don't browse the catalog. Tell the router what you're building in plain words — it finds the best-matching component and installs it for you.

### Setup

You need **Python 3** (nothing else — no packages to install) and a clone of this repo:

```bash
git clone https://github.com/stbattula-research/unslop.git
cd unslop
chmod +x unslop   # one time: makes the script executable
```

### Find a component

```bash
./unslop find "pricing section for a coffee brand"
```

The router scores your description against every component and prints the top matches with install commands for both stacks:

```
1. Menu Pricing  (pricing)
   Pricing laid out like a bistro menu: serif prices, dotted leaders...
   react: npx shadcn@latest add https://raw.githubusercontent.com/.../r/pricing.json
   html:  curl -O https://raw.githubusercontent.com/.../components/html/pricing/pricing.html + pricing.css
```

Other useful forms:

```bash
./unslop find "hero for my landing page" --top 2   # show only the top 2 matches
./unslop list                                      # list all 10 components
./unslop skill "critique my design"                # search the skill index
./unslop skill --list                              # list router, design-intel, prompt-shaper
```

Too-vague queries don't get a guess: `find` refuses below its confidence floor and points at the prompt-shaper skill to sharpen the ask first.

### Install a component

Pick a component by its short name (the part in parentheses, e.g. `pricing`, `hero`, `navbar`):

**React + Tailwind project** — prints the shadcn install command; add `--run` to execute it right there:

```bash
./unslop add pricing --stack react          # prints the npx shadcn command
./unslop add pricing --stack react --run     # runs it in your project directory
```

**Plain HTML/CSS** — pass `--dest` to copy the files straight into your project, or leave it out to get the `curl` commands:

```bash
./unslop add hero --stack html --dest ./site   # copies hero.html + hero.css into ./site/
./unslop add hero --stack html                 # prints curl commands instead
```

After copying HTML/CSS files, link the stylesheet in your page:

```html
<link rel="stylesheet" href="hero.css">
```

### For AI coding agents

Point your agent at [`skills/unslop-router/SKILL.md`](skills/unslop-router/SKILL.md). It takes a natural-language request, scores it against the intent tags in `registry.json`, asks you when two components are close, and installs the winner — without restyling it into slop. (The general agent guide is [`SKILL.md`](SKILL.md).)

## The one-roof kit

Unslop is one kit for AI-built websites that don't look AI-built — components, discovery, design judgment, brief-sharpening, motion, and launch checks:

| Piece | What it does | Start here |
|---|---|---|
| **Components** | 10 human-grade components × 2 stacks (React+Tailwind, HTML/CSS) | [catalog](#component-catalog) |
| **Router** | `./unslop find "<need>"` scores intent → component, installs it; also routes to skills; suggests prompt-shaper when a query is too vague | [`skills/unslop-router/SKILL.md`](skills/unslop-router/SKILL.md) |
| **MCP server** | `search_components` / `get_component` / `install_component` as native tool calls (stdio) — the registry made token-cheap, same scoring as the router | [`servers/unslop-mcp/`](servers/unslop-mcp/) |
| **Design Intel** | Senior-designer judgment as rules: type scale, spacing rhythm, ink/paper/accent discipline, genre-picked layouts, copy voice + a 15-question self-critique review | [`skills/design-intel/SKILL.md`](skills/design-intel/SKILL.md) |
| **Prompt Shaper** | Vague request in → sharp Unslop-aware build brief out (components matched, DESIGN.md baked in, stop conditions set) | [`skills/prompt-shaper/SKILL.md`](skills/prompt-shaper/SKILL.md) |
| **Motion** | Animation playbook: animate one thing on interaction or nothing — spring configs, easing, duration budgets, the cliché list | [`MOTION.md`](MOTION.md) |
| **Audit** | Pre-launch checks: 22 automated CLI checks + launch/security checklists | [`plugins/prelaunch-audit/`](plugins/prelaunch-audit/) |
| **Community shelf** | Third-party design skills, vendored or linked with attribution: Anthropic's `frontend-design`, `ui-ux-pro-max` (7 skills), `web-design-guidelines`, plus linked `shadcn` and Garry Tan's `gstack` | [`skills/community/`](skills/community/) |

Agent entry point: [`SKILL.md`](SKILL.md) — discovery, install, restyle rules, and pointers to every skill above.

## Component catalog

| # | Component | Character | React | HTML |
|---|---|---|---|---|
| 01 | Honest Button | Workwear-inspired: chunky ink border, hard offset shadow, uppercase grotesk label | [`r/button.json`](r/button.json) | [`components/html/button/`](components/html/button/) |
| 02 | Masthead Navbar | Print-editorial masthead: serif wordmark between thin rules, issue-date line | [`r/navbar.json`](r/navbar.json) | [`components/html/navbar/`](components/html/navbar/) |
| 03 | Manifesto Hero | Asymmetric editorial hero: oversized serif display type, left-aligned, warm paper with dotted texture | [`r/hero.json`](r/hero.json) | [`components/html/hero/`](components/html/hero/) |
| 04 | Ledger Features | Features as an archival index: numbered rows, hairline dividers, mono index numbers | [`r/features.json`](r/features.json) | [`components/html/features/`](components/html/features/) |
| 05 | Menu Pricing | Pricing as a bistro menu: serif prices, dotted leaders, one "chef's pick" tier in ink | [`r/pricing.json`](r/pricing.json) | [`components/html/pricing/`](components/html/pricing/) |
| 06 | Margin Notes Testimonials | Testimonials as literary pull-quotes with marginalia-style attribution — no star ratings | [`r/testimonials.json`](r/testimonials.json) | [`components/html/testimonials/`](components/html/testimonials/) |
| 07 | Footnotes FAQ | Accordion styled like scholarly footnotes: numbered, ruled, serif (HTML version needs no JS) | [`r/faq.json`](r/faq.json) | [`components/html/faq/`](components/html/faq/) |
| 08 | Poster CTA | Swiss-poster call to action: flat red, oversized grotesk type, rubber-stamp badge | [`r/cta-banner.json`](r/cta-banner.json) | [`components/html/cta-banner/`](components/html/cta-banner/) |
| 09 | Colophon Footer | Footer set like a book colophon: small caps, credits, set-in-type details | [`r/footer.json`](r/footer.json) | [`components/html/footer/`](components/html/footer/) |
| 10 | Letter Contact Form | A contact form written as a letter: salutation, ruled lines, sign-off submit | [`r/contact-form.json`](r/contact-form.json) | [`components/html/contact-form/`](components/html/contact-form/) |

Preview every HTML component with no build step: open [`components/html/index.html`](components/html/index.html) in a browser.

## Plugins — pre-launch audit

Components get you a site that doesn't *look* AI-made. The audit plugin makes sure it isn't *shipped* half-ready: missing meta descriptions, no favicon, broken links, `console.log` left in, an API key committed next to the hero image.

```bash
# audit a local build, or a deployed site
./plugins/prelaunch-audit/audit ./dist
./plugins/prelaunch-audit/audit https://example.com
```

22 checks, zero dependencies (Python 3 stdlib only), exits 1 on failure so it works as a CI gate. Ships with an [agent skill](plugins/prelaunch-audit/SKILL.md) — the agent runs the CLI, walks the [launch checklist](plugins/prelaunch-audit/checklists/core.md) and [security checklist](plugins/prelaunch-audit/checklists/security.md), fixes what it finds, and flags what needs a human. Details in [`plugins/prelaunch-audit/README.md`](plugins/prelaunch-audit/README.md).

## Install — React + Tailwind

Each component is a [shadcn registry](https://ui.shadcn.com/docs/registry) item:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/stbattula-research/unslop/main/r/button.json
```

Browse all items in [`registry.json`](registry.json). Components use Tailwind utilities and system font stacks only — no extra dependencies, no config changes. A tiny `cn()` helper lives at `components/react/lib/utils.ts` (dependency-free).

> Fonts: React components use Tailwind's `font-serif` / `font-sans` / `font-mono` (system stacks). For the full editorial look, add [Fraunces](https://fonts.google.com/specimen/Fraunces) as your serif in `tailwind.config` — optional.

## Install — HTML/CSS

```bash
# grab one component (needs nothing but a browser)
curl -O https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/hero/hero.html
curl -O https://raw.githubusercontent.com/stbattula-research/unslop/main/components/html/hero/hero.css
```

Or clone the repo and open any `components/html/<name>/<name>.html` directly. Google Fonts (Fraunces) loads via `<link>`; everything else is local.

## Design principles

Unslop components follow the anti-slop rules in [`DESIGN.md`](DESIGN.md) — the numbered "tells" of AI-generated websites and what each component does instead. The one hard rule for contributors: **restyle toward a stronger point of view, never toward the defaults.**

## Contributing

Both stacks are required for every new component, and every component must clear the design bar. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Sai Teja Battula
