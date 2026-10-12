# Attribution — annotated-illustrations

- **Upstream:** https://github.com/helloianneo/ian-xiaohei-illustrations
- **Author:** Ian / helloianneo
- **License:** MIT (see `LICENSE.txt`)
- **Fetched:** 2026-10-12
- **Status:** vendored verbatim; no modifications.

A Claude Code / Codex skill that generates sparse hand-drawn 16:9 illustrations
with short handwritten annotations — ideal for mapping system components, data
flow, and breaking points so complex builds stay explainable (including to
non-technical teammates). The skill crafts image-generation prompts in the
distinctive "Xiaohei" visual language; it needs an image model backend
(GPT Image, Nano Banana, etc.) to render. It sits on Unslop's community shelf
as reference material.

## Note on assets

The upstream `assets/` folder (~13MB of example illustrations) is intentionally
not vendored — they are sample outputs, not needed to use the skill. Everything
else — `SKILL.md`, `references/`, `agents/` — is vendored verbatim.
