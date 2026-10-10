# Community shelf

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

## Linked (not vendored)

| Skill | Why linked, not vendored |
|---|---|
| `shadcn` | [hot-buro/hot-designer](https://github.com/hot-buro/hot-designer/tree/main/skills/shadcn) ships no license file — linked, not copied. Covers shadcn CLI usage, customization, MCP, and registry rules. |
| `gstack` | [garrytan/gstack](https://github.com/garrytan/gstack) is a full 23-tool Claude Code setup (135k+ stars), not a single skill — linked with a summary in `gstack.md`. |

Fetched 2026-10-10 from a community reel listing these as essential Claude Code
design plugins. The reel's `@claude-plugins-official` scope was only accurate
for `frontend-design`; the true upstreams above were verified before vendoring.
