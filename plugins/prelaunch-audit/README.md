# prelaunch-audit — the "wait, is this ready to ship?" plugin for Unslop

A pre-launch audit kit for AI-built websites: a **skill** that teaches your coding agent to audit like a careful senior, an **automated CLI** that catches the mechanical failures, and two **checklists** (core + security) for everything that needs judgment.

## The problem

AI tools build websites fast — and ship them half-ready: no meta description, no favicon, broken links, `console.log` still in, an API key committed next to the hero image. This plugin makes "audit before launch" a one-command habit instead of a forgotten intention.

## What's inside

| File | What it is |
|---|---|
| [`audit`](./audit) | Zero-dependency Python CLI. Point it at a build dir or a live URL. |
| [`SKILL.md`](./SKILL.md) | Agent skill: run the CLI, work the checklists, fix (don't just list). |
| [`checklists/core.md`](./checklists/core.md) | Launch-readiness checklist: SEO, social, links, media, forms, mobile/a11y, legal, hygiene. |
| [`checklists/security.md`](./checklists/security.md) | Security pass: secrets, headers, auth, input handling, deps, final review. |
| [`tests/`](./tests) | 9 tests + good/bad fixture sites. |

## Quick start

```bash
chmod +x audit   # one time: makes the script executable

# audit a local build
./audit ./dist

# audit a deployed site
./audit https://example.com

# use it as a CI gate (exits 1 on any failure)
./audit ./dist --format json
./audit ./dist --only seo,links,security
./audit ./dist --skip perf
./audit https://example.com --check-external
```

Needs only Python 3 — no packages, no network for local audits.

## What the CLI checks (22 checks)

SEO: unique `<title>`, meta description length, `lang`, single `<h1>` · Social: Open Graph tags, Twitter card · Branding: favicon linked and shipped · Discoverability: `robots.txt`, `sitemap.xml` · Links: internal, external (opt-in), anchors · Images: alt text, file presence, sizes, dimensions · Forms: labels, validation · Errors: custom 404 (file or live status) · Security: leaked secrets/`.env` in source, live security headers, HTTP→HTTPS redirect · Quality: debug code · Performance: page weight.

Sample output:

```
audit: ./dist (14 pages)
============================================================
FAIL seo.meta-description         Meta description
      [FAIL] pricing.html
            missing meta description
            fix: add <meta name="description" content="..."> (~150 chars)
...
============================================================
22 checks: 19 passed, 2 failed, 4 warnings
```

Every finding ships with a concrete fix, in `--format text` (default), `json`, or `markdown`.

## With an agent

Point your coding agent at [`SKILL.md`](./SKILL.md). It runs the CLI, walks the two checklists, **fixes** what it finds, and reports in two buckets: *fixed* vs *needs you* (decisions, credentials, copy approval). Secrets are stop-the-line: revoke first, clean second.

## Tests

```bash
python3 -m pytest tests/ -q
```

## License

[MIT](../../LICENSE) © 2026 Sai Teja Battula
