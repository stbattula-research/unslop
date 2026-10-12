# Community shelf

> **New here?** Start with [PLAYBOOK.md](PLAYBOOK.md) — goal-to-skill recipes for the whole shelf.

Third-party design skills curated from the community — a reference shelf, not
Unslop's own work. Unslop's components, design-intel, and prompt-shaper are
hand-built to the bar in `DESIGN.md`; everything under `skills/community/` is
someone else's skill, vendored or linked here so agents working with Unslop can
reach for it. Read the `ATTRIBUTION.md` in each folder before reusing.

## Vendored (license permits redistribution)

| Skill | Upstream | Author | License |
|---|---|---|---|
| `frontend-design/` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Anthropic | Apache-2.0 |
| `ui-ux-pro-max/` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) via [JaimeJunr/claude-code-frontend-skills](https://github.com/JaimeJunr/claude-code-frontend-skills) | Next Level Builder | MIT |
| `web-design-guidelines/` | [djd933/claude-design-plugins](https://github.com/djd933/claude-design-plugins/tree/main/plugins/web-design-guidelines) | djd933 | MIT |
| `logo-design/` | [kaankiziltug/logo-design-skill](https://github.com/kaankiziltug/logo-design-skill) | Kaan Kiziltug | MIT |
| `annotated-illustrations/` | [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) | Ian (helloianneo) | MIT |
| `emilkowalski-motion/` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | Emil Kowalski | MIT |
| `impeccable/` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus | Apache-2.0 |
| `taste/` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Leonxlnx | MIT |
| `gsap-motion/` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | GreenSock | MIT |
| `motion-design/` | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | LottieFiles | MIT |
| `motion-dev/` | [199-biotechnologies/motion-dev-animations-skill](https://github.com/199-biotechnologies/motion-dev-animations-skill) | 199-biotechnologies | MIT |
| `awwwards-ui/` | [Nyx-abu/awwwards-ui-skill](https://github.com/Nyx-abu/awwwards-ui-skill) | Nyx-abu | MIT |
| `ilm-aesthetics/` | [Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design) | Ilm-Alan | MIT |
| `liquid-glass/` | [Armitanemati/liquid-glass-claude-skill](https://github.com/Armitanemati/liquid-glass-claude-skill) | Armitanemati | MIT |
| `ckw-design/` | [connerkward/ckw-design-skill](https://github.com/connerkward/ckw-design-skill) | connerkward | MIT |
| `magic-ui/` | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | Magic UI | MIT |
| `component-discovery/` | [mattbx/shadcn-skills](https://github.com/mattbx/shadcn-skills) | mattbx | MIT |
| `appllama-mobile/` | [Appllama/appllama-skills](https://github.com/Appllama/appllama-skills) | Appllama | MIT |
| `design-database/` | [nicohodt/claude-code-ui-ux-skill](https://github.com/nicohodt/claude-code-ui-ux-skill) | nicohodt | MIT |
| `glassmorphism/` | [bergside/awesome-design-skills](https://github.com/bergside/awesome-design-skills) | bergside | MIT |
| `bento/` | [bergside/awesome-design-skills](https://github.com/bergside/awesome-design-skills) | bergside | MIT |
| `gradient/` | [bergside/awesome-design-skills](https://github.com/bergside/awesome-design-skills) | bergside | MIT |

## Linked (not vendored)

| Skill | Why linked, not vendored |
|---|---|
| `shadcn` | [hot-buro/hot-designer](https://github.com/hot-buro/hot-designer/tree/main/skills/shadcn) ships no license file — linked, not copied. Covers shadcn CLI usage, customization, MCP, and registry rules. |
| `gstack` | [garrytan/gstack](https://github.com/garrytan/gstack) is a full 23-tool Claude Code setup (135k+ stars), not a single skill — linked with a summary in `gstack.md`. |
| `animate-skill` | [delphi-ai/animate-skill](https://github.com/delphi-ai/animate-skill) ships no license file — linked, not copied. Emil Kowalski–inspired React animation patterns with 8 working examples. |
| `animejs` | [BowTiedSwan/animejs-skills](https://github.com/BowTiedSwan/animejs-skills) ships no license file — linked, not copied. Anime.js v4 docs + examples for Claude Code. |

Fetched 2026-10-10 from a community reel listing these as essential Claude Code
design plugins. The reel's `@claude-plugins-official` scope was only accurate
for `frontend-design`; the true upstreams above were verified before vendoring.

`logo-design/` added 2026-10-12 from an Instagram reel about Claude logo-design
skills; upstream verified as kaankiziltug/logo-design-skill (MIT). The 1,400+
trademarked logo reference gallery is intentionally not vendored — see
`logo-design/ATTRIBUTION.md`.

`annotated-illustrations/` added 2026-10-12 from an Instagram reel ("Skill of
the Week: Annotated Illustrations by Ian"); upstream verified as
helloianneo/ian-xiaohei-illustrations (MIT, 12.5k stars). The ~13MB example
illustrations are intentionally not vendored — see
`annotated-illustrations/ATTRIBUTION.md`.

`emilkowalski-motion/`, `impeccable/`, `taste/` added 2026-10-12 from an
Instagram reel ("Agencies charge $10K for a website…": Emil Kowalski's motion
skill + Impeccable + Taste). Upstreams verified: emilkowalski/skills (MIT,
45k stars, vendored whole — 15 skills), pbakaus/impeccable (Apache-2.0, 80k
stars; live-browser bundle omitted, see `impeccable/ATTRIBUTION.md`),
Leonxlnx/taste-skill (MIT, 95k stars; main taste skill only, siblings upstream,
see `taste/ATTRIBUTION.md`).

Big scout sweep 2026-10-12 (Sai: "best UI skills — animations, transparent
components, smooth sliding, aesthetics, fonts, palettes"): three research scouts
ranked candidates by license + quality. Vendored: `gsap-motion/` (official GSAP
skills, MIT, 16.2k stars), `motion-design/` (LottieFiles, MIT),
`motion-dev/` (Motion.dev recipes, MIT), `awwwards-ui/` (MIT),
`ilm-aesthetics/` (8 locked aesthetic systems, MIT), `liquid-glass/`
(glassmorphism reasoning, MIT), `ckw-design/` (5 composable skills, MIT),
`magic-ui/` (official skill only, MIT), `component-discovery/` (1,500+
components across 30 registries, MIT), `appllama-mobile/` (MIT),
`design-database/` (192 palettes + 74 font pairings + 84 styles as CSVs, MIT),
`glassmorphism/` + `bento/` + `gradient/` (cherry-picked from bergside's
registry, MIT). Link-only: `animate-skill.md`, `animejs.md` (no license files).
Skipped: AnayDhawan/Components (overlaps discovery), Owl-Listener
(design-ops, not components), qiaomu-design (Chinese-first, 19MB),
xntj-ai/ppvi (license unverifiable).
