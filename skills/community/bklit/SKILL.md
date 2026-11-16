---
name: bklit
description: Use this skill whenever a React/Next.js page needs a chart or data visualization — dashboards, analytics, KPIs, financial data. It covers Bklit UI, a shadcn registry of composable chart components (line, area, bar, candlestick, pie, radar, sankey, maps, sparklines): picking the chart by the story the data tells, installing via the @bklit namespace, composing charts from primitives, and theming them to a restrained palette.
metadata:
  short-description: Bklit charts — data visualization via the shadcn registry
---

# Bklit UI

Bklit UI is a shadcn-compatible registry that does one thing: charts.
Where shadcn/ui stops at primitives and Unslop's own catalog has no
data visualization at all, Bklit provides composable chart components —
you assemble a chart from a root, a grid, series, axes, and a tooltip
rather than accepting one fixed widget. Charts install as source into
the user's project through the shadcn CLI.

This skill is an original Unslop guide. No chart code is vendored
here; see `ATTRIBUTION.md` and the license note below.

**License note:** the chart components are MIT
(`github.com/bklit/bklit-ui`). **Bklit Studio — the hosted chart
playground — is proprietary.** Link to Studio for interactive
exploration if useful, but never reproduce, scrape, or vendor Studio
code.

## When To Apply

Apply this skill when:

- A dashboard, analytics page, report, or admin surface needs a chart
  of any kind.
- A KPI row needs a sparkline, gauge, or ring instead of a bare number.
- Financial data needs a candlestick chart, or a live feed needs a
  streaming line chart.
- The alternative being considered is hand-rolled SVG or a heavyweight
  charting package for a chart Bklit already composes well.

## When Not To Apply

- **No data, no chart.** A chart that decorates rather than informs is
  a tell. If the numbers do not change a decision, use type instead.
- **Plain HTML/CSS projects.** Bklit is React. For a one-off static
  graphic, a hand-set SVG figure in the page's genre may serve better.
- **One fixed, simple bar comparison in a marketing section.** An
  Unslop genre treatment (a ledger, a fare table) often says it better
  than a chart widget.

## Pick The Chart By The Story

| The data's story | Chart | Registry slug |
|---|---|---|
| Trend over time | Line chart | `line-chart` |
| Trend with volume under it | Area chart | `area-chart` |
| Categories compared | Bar chart | `bar-chart` |
| Part-to-whole | Pie / donut chart | `pie-chart` |
| KPI progress at a glance | Ring chart | `ring-chart` |
| Flow between nodes | Sankey chart | `sankey-chart` |
| Data across regions | Choropleth map | `choropleth-chart` |
| Tiny trend in a table or KPI card | Sparkline | `sparkline` |
| Single value against a scale | Gauge chart | `gauge-chart` |
| Prices (OHLC) | Candlestick chart | `candlestick-chart` |
| Real-time / streaming data | Live line chart | `live-line-chart` |
| Several dimensions compared | Radar chart | `radar-chart` |
| Mixed marks on one time axis | Composed chart | `composed-chart` |
| Density over two axes (e.g. a calendar) | Heatmap chart | `heatmap-chart` |

One story per chart. If a chart needs a paragraph to explain, it is
two charts — or zero.

## Install

The project needs shadcn initialized first:

```bash
npx shadcn@latest init
```

Add the Bklit namespace to `components.json`:

```json
{
  "registries": {
    "@bklit": "https://ui.bklit.com/r/{name}.json"
  }
}
```

Then install the chart by slug:

```bash
npx shadcn@latest add @bklit/line-chart
```

## Compose, Don't Configure

Bklit charts are built from primitives. Import from the charts entry
point and assemble only what the story needs:

```tsx
import { LineChart, Line, Grid, XAxis, ChartTooltip } from "@bklitui/ui/charts";

<LineChart data={data} xDataKey="date">
  <Grid />
  <Line dataKey="revenue" />
  <XAxis />
  <ChartTooltip />
</LineChart>
```

Composition rules:

- Start from the root + one series. Add the grid, axes, and tooltip
  only when the reader needs them — a sparkline needs none of them.
- Tooltips and legends are parts, not defaults; include them when
  values must be read precisely, omit them when shape is the message.
- Note the naming wrinkle: bar charts use `BarXAxis` where line and
  area charts use `XAxis`. Check the chart's doc page before guessing
  props — each chart documents its own data shape and examples.

## Theming — One Accent, Extended Honestly

Bklit themes through CSS variables, `--chart-1` through `--chart-5`
for series colors. Unslop's discipline is ink, paper, one accent —
map the variables accordingly:

- `--chart-1` = the project's one accent. The primary series is always
  the accent.
- `--chart-2` and beyond = ink at descending strengths (full ink, then
  muted ink tones) before any new hue is introduced.
- A second true hue is earned only when series must be distinguished
  at a glance (e.g. profit vs loss) — and then it is a deliberate
  semantic color, not a rainbow.
- Grid, axis labels, and tooltip chrome take the project's border and
  muted-foreground tokens, so the chart sits on the same paper as the
  rest of the page.

Never ship the default multi-hue palette untouched; a five-color chart
on an ink-and-accent page reads as pasted-in.

## Quality Checks

- **Label honestly.** Axes carry units; truncated axes are stated, not
  smuggled. A chart that exaggerates is worse than no chart.
- **Reduced motion.** Chart enter animations are reveals — keep them
  within `MOTION.md`'s budget and off under `prefers-reduced-motion`.
- **Text alternative.** Every chart gets a caption or adjacent summary
  of what it shows; the data's story must survive without the graphic.
- **Check the data shape** against the chart's docs before debugging
  rendering — most failures are a wrong key, not a broken component.

## Troubleshooting

- **Namespace errors:** shadcn not initialized, or the `@bklit`
  registry entry missing from `components.json` — add it as above.
- **Import errors:** chart primitives import from
  `@bklitui/ui/charts`, not from per-chart paths.
- **Axis component not found:** bar charts use `BarXAxis`; line/area
  use `XAxis` (see Compose above).

## Reference Links

- Docs: `https://bklit.com/docs/components`
- Site: `https://bklit.com`
- Source (MIT, chart components): `https://github.com/bklit/bklit-ui`
- Unslop rules: `DESIGN.md` and `MOTION.md` (repo root)
