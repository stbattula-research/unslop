# Contributing to Unslop

Thanks for helping de-slop the web. Here's how to add a component.

## The bar

Every Unslop component must:

1. **Ship in both stacks.** A React + Tailwind version in `components/react/<name>/<Name>.tsx` AND a framework-free version in `components/html/<name>/<name>.html` + `<name>.css`. One without the other doesn't merge.
2. **Clear the design bar in [DESIGN.md](DESIGN.md).** Break at least three of the twelve tells on purpose. If it could be mistaken for a template, it doesn't ship.
3. **Have a point of view.** Each component picks a genre — masthead, ledger, menu, letter, poster, colophon, timetable, field guide… Name it in the component's doc comment.

## Adding a component — checklist

- [ ] React: `components/react/<name>/<Name>.tsx`
  - Tailwind utilities + system font stacks only. No new npm dependencies.
  - Import `cn` from `../lib/utils` (copy it if your setup lacks it).
  - Props with sensible defaults; include a doc comment naming the component's character.
- [ ] HTML: `components/html/<name>/<name>.html` + `components/html/<name>/<name>.css`
  - Must work by opening the `.html` file — no build step. Google Fonts via `<link>` is fine.
  - Keep the `← Unslop catalog` demo-note line so previews stay navigable.
- [ ] Registry: add `r/<name>.json` (valid shadcn registry-item schema) with the full `.tsx` source inlined as `files[0].content`, and add the item to `registry.json` (name, title, description, raw URL).
- [ ] Catalogs: add a row to the README table and a row to `components/html/index.html`.
- [ ] Dark mode: support `prefers-color-scheme` (HTML) / `dark:` variants (React) where the genre allows it.

## Style rules

- Flat color with conviction. One ink, one paper, one accent per component.
- Typography is the ornament: serif display (Fraunces via Google Fonts in HTML; `font-serif` in React), grotesk body, mono labels.
- Microcopy sounds human. No "revolutionize", "unlock the power of", "seamless".
- Static by default. Animate one thing on interaction, or nothing.

## Pull requests

Fork, branch, PR against `main`. Include a screenshot or GIF of the component in the PR description. Small, focused PRs (one component) get reviewed fastest.
