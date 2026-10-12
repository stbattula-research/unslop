# Attribution — impeccable

- **Upstream:** https://github.com/pbakaus/impeccable
- **Author:** Paul Bakaus (pbakaus)
- **License:** Apache-2.0 (see `LICENSE.txt`)
- **Fetched:** 2026-10-12
- **Status:** vendored verbatim, minus the live-browser bundle (see below).

A production-grade frontend design skill: 23 named commands (`craft`, `shape`,
`audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `animate`,
`colorize`…), 7 design pillars (typography, color, spatial design,
responsiveness, interactions, motion, UX writing), deterministic anti-pattern
detector rules, and project-context reading (`PRODUCT.md`/`DESIGN.md`). It sits
on Unslop's community shelf as reference material; Unslop's own design judgment
lives in `skills/design-intel/`.

## Note on the live-browser bundle

The upstream skill ships a ~1.6MB live-browser iteration bundle
(`scripts/live-browser*.js`, `modern-screenshot.umd.js`, `scripts/data/`).
It is intentionally not vendored here — it is tooling for the optional live
in-browser editing mode, not needed for the design guidance, commands, and
detector rules. The core `scripts/impeccable` CLI entry,
`command-metadata.json`, and `VERSION` are vendored. Fetch the full upstream
repo for the live-browser mode.
