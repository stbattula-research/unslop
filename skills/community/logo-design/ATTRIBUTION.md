# Attribution — logo-design

- **Upstream:** https://github.com/kaankiziltug/logo-design-skill
- **Author:** Kaan Kiziltug
- **License:** MIT (see `LICENSE.txt`)
- **Fetched:** 2026-10-12
- **Status:** vendored verbatim; no modifications.

A comprehensive logo-design skill that turns Claude (or any Agent Skills
agent — Gemini CLI, Codex, Cursor, Copilot) into a disciplined identity
designer: brand briefs, concepting, hand-coded SVG construction, optical
corrections, testing (16px pixel test, one-colour, reversed, squint, mirror,
competitor shelf), presentation boards, and favicon/app-icon export via
dependency-free Python tools. It sits on Unslop's community shelf as reference
material; Unslop's own design judgment lives in `skills/design-intel/`.

## Note on the reference library

The upstream skill ships a 1,400+ real-world SVG logo reference library under
`skills/logo-design/assets/` (~10MB). It is intentionally NOT vendored here:
those marks are trademarks of their owners (the skill itself says "study them,
never copy them"), and the bulk doesn't belong in Unslop's repo. Everything
else — `SKILL.md`, all `references/`, all `scripts/`, `templates/` — is
vendored verbatim and fully functional. To use the library search
(`scripts/search_library.py`), fetch the full upstream repo:

```
git clone https://github.com/kaankiziltug/logo-design-skill.git
cp -r logo-design-skill/skills/logo-design/assets <this folder>/
python3 scripts/build_catalog.py
```
