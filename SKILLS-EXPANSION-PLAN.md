# Unslop skills expansion — the 5 sites from the Nov 16 reel

Source reel: Facebook, Vallabhaneni Lakshmi Suresh Chandra, Aug 4 2026 —
"5 great websites to use with AI" (#ai #telugu #website #uiux #code)
https://facebook.com/reel/2349031258836756/

Checked Nov 16, 2026 against official sites / repos. NOT pushed anywhere.
Push needs Sai's approval per standing GitHub rule.

## The 5, honestly

| # | Site | What it actually is | License | Already in Unslop? |
|---|------|---------------------|---------|--------------------|
| 1 | Anime.js — animejs.com | Vanilla-JS animation engine: timelines, staggering, SVG, scroll observer, springs/draggable. ~24.5 KB. Best when there is NO React, or for SVG work. | MIT | **NO — real gap** |
| 2 | Motion — motion.dev | Former Framer Motion. Production animation for React / JS / Vue: layout, scroll, gestures. 450+ examples, free MCP server at mcp.motion.dev. Motion+ is paid. | Core MIT; Motion+ paid | **YES** — `community-motion-dev` skill + MOTION.md springs already cover it |
| 3 | Kokonut UI — kokonutui.com | shadcn registry of 100+ animated React components, strong on AI-product UI (tool calls, tool approval, model selector, AI chat inputs). Install: `npx shadcn@latest add @kokonutui/<name>` | Free set MIT; **Pro ($119 one-time, kokonutui.pro) is NOT MIT — never fetch/vendor Pro** | **NO — real gap** |
| 4 | Bklit UI — bklit.com / ui.bklit.com | shadcn registry ONLY for charts/data-viz: line, area, bar, candlestick, pie/donut, radar, sankey, heatmap, choropleth, sparklines, live line. Composable primitives (Grid, XAxis, ChartTooltip). Install: `npx shadcn@latest add @bklit/<chart>` | Chart components MIT; **Studio is proprietary — exclude** | **NO — biggest gap: Unslop has zero chart components** |
| 5 | shadcn/ui — ui.shadcn.com | The base system itself: 50+ accessible Radix/Base primitives copied as source via the shadcn CLI. Unslop's own registry already IS a shadcn registry. | MIT | **YES, linked only** — `community-shadcn` in skills/index.json |

## What "add skills" should mean (and not mean)

**Should:** add *agent skills* on the community shelf — a SKILL.md per library
that teaches an AI coding agent when to reach for it, how to install it via
its registry, how to theme it with Unslop's ink/paper/one-accent tokens, and
what NOT to do. Plus entries in `skills/index.json` so `./unslop find` and
the MCP server route to them, plus router tests.

**Should NOT:** copy their components into Unslop's own `registry.json`.
Reasons: (a) Unslop's catalog is an editorial genre system — importing
100+ foreign components dilutes it; (b) Kokonut Pro and Bklit Studio are
paid/proprietary; (c) shadcn is the base layer, not a component genre;
(d) registry-to-registry routing is how the shadcn ecosystem is designed
to compose — Kokonut and Bklit both publish `@namespace` registries and
llms.txt / MCP channels precisely for this.

## The 3 new skills to build

### 1. `community-animejs` — Anime.js for vanilla / SVG motion
- When: no-React projects, Unslop's own HTML/CSS stack, SVG line-draw /
  morph / motion-path, number/object tweens.
- When NOT: React app already on Motion (don't stack two engines);
  simple hover (CSS transition per MOTION.md is enough).
- Unslop restraint layer (the value-add): MOTION.md rules override
  Anime's defaults — no stagger-as-decoration, no autoplay scroll
  fade-ups, interaction-triggered first, transform/opacity only,
  duration budget, `prefers-reduced-motion`.
- Install/usage: `npm i animejs`, `import { animate, createTimeline, stagger } from 'animejs'`, WAAPI lightweight variant.

### 2. `community-kokonutui` — Kokonut UI registry routing
- When: AI-product UI (chat/composer, tool-call + approval cards, model
  selector, diff review), animated buttons/cards/text effects for a
  marketing page.
- Install: add `"@kokonutui": "https://kokonutui.com/r/{name}.json"` to
  components.json, then `npx shadcn@latest add @kokonutui/<name>`;
  or via shadcn MCP in Claude Code / Cursor / VS Code / Codex.
- Curation rule: Kokonut defaults lean playful/gradient/particle —
  a curated shortlist only, restyled to Unslop tokens; skip anything on
  DESIGN.md's tells list. Pro: mention it exists ($119), never install
  or vendor it without Sai buying it and providing the token.

### 3. `community-bklit` — Bklit charts (fills the data-viz gap)
- When: any chart in a dashboard / Ledger-style / EB1A-dashboard-style
  page. Pick chart by story: trend=line/area, categories=bar,
  part-to-whole=pie/ring, flow=sankey, geo=choropleth, KPI=sparkline/gauge,
  financial=candlestick, streaming=live-line.
- Install: add `"@bklit": "https://ui.bklit.com/r/{name}.json"`, then
  `npx shadcn@latest add @bklit/<chart>`. Compose root → Grid → series →
  axes → ChartTooltip; import from `@bklitui/ui/charts`.
- Theming: map `--chart-1..5` onto Unslop's one-accent discipline
  (accent + ink shades first, extra hues only when series demand it).
- A working third-party `bklit-ui` SKILL.md already exists in the wild
  (frontend-kit) — adapt structure, write our own wording, attribute.

## Refresh, don't duplicate (the other 2)
- **Motion:** extend `community-motion-dev` with two lines — Motion's
  own free MCP server (mcp.motion.dev) and the `motion/react` import
  rename from framer-motion. No new skill.
- **shadcn:** keep the linked `community-shadcn` entry; optionally note
  the official registry-directory route for finding community registries
  (which is how Kokonut/Bklit are discovered). No new skill.

## Build checklist (when Sai says go)
- [x] `skills/community/animejs/SKILL.md` + ATTRIBUTION.md
- [x] `skills/community/kokonutui/SKILL.md` + ATTRIBUTION.md (free/MIT scope stated, Pro excluded)
- [x] `skills/community/bklit/SKILL.md` + ATTRIBUTION.md (MIT charts scope stated, Studio excluded)
- [x] Two-line refresh of `skills/community/motion-dev/SKILL.md`
- [x] 3 new entries in `skills/index.json` with intents/useCases/notFor
- [x] Router tests: "animate SVG in plain HTML" → animejs;
      "AI chat tool-approval card" → kokonutui;
      "dashboard line chart / candlestick chart" → bklit
- [x] Full test suite green; README skills count updated
- [x] Present diff to Sai → push only on his approval (approved by Sai Nov 16, 2026; pushed in this commit)

## Effort / risk
- Effort: one daily-GitHub-sized session per skill, or all 3 in one
  longer session. No new dependencies in Unslop itself (skills are docs
  + routing; the libraries install into the *user's* project only).
- Risk: low. Main risk is taste dilution if routing sends people to
  gradient/particle defaults — mitigated by the curation + restraint
  layers above, which are the actual Unslop value-add.
