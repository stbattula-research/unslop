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

## Unslop Router — let the agent pick

Don't browse the catalog. Describe what you're building and the router finds the right component and installs it — the same idea as skill-finder tools, scoped to components with a point of view.

```bash
./unslop find "pricing section for a coffee brand"
# → Menu Pricing, with install commands for both stacks

./unslop add hero --stack html --dest ./site   # copy files into your project
./unslop add pricing --stack react --run       # run the shadcn install directly
./unslop list                                  # all 10 components
```

For AI coding agents there's a dedicated skill at [`skills/unslop-router/SKILL.md`](skills/unslop-router/SKILL.md): it takes a natural-language request, scores it against the intent tags in `registry.json`, asks when two components are close, and installs the winner without restyling it into slop.

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
