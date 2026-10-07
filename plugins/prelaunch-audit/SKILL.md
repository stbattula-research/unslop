---
name: prelaunch-audit
description: Run a pre-launch website audit before shipping. Use when the user is about to deploy a website, asks for a launch checklist, wants a site review, or says "is this ready to launch". Runs the automated `audit` CLI and walks the manual checklist (SEO, social previews, links, forms, security, accessibility) fixing what it finds.
---

# prelaunch-audit — don't ship slop, don't ship broken

You audit a website the way a careful senior would the night before launch: run the automated checks, then work the manual checklist, fixing real problems instead of just listing them.

## 1. Run the automated audit first

The plugin ships a zero-dependency CLI at `plugins/prelaunch-audit/audit`:

```bash
# a local static site (build output dir, e.g. dist/ or out/)
./plugins/prelaunch-audit/audit ./dist

# a deployed site
./plugins/prelaunch-audit/audit https://example.com

# machine-readable, or filtered
./plugins/prelaunch-audit/audit ./dist --format json
./plugins/prelaunch-audit/audit ./dist --only seo,links,security
./plugins/prelaunch-audit/audit ./dist --skip perf
./plugins/prelaunch-audit/audit https://example.com --check-external
```

It exits 1 when any check fails, so it works as a CI gate (`--no-fail` disables that). It covers: page titles, meta descriptions, `lang`, single `<h1>`, Open Graph + Twitter cards, favicon, robots.txt, sitemap.xml, internal/external/anchor links, image alt text + sizes + dimensions, form labels + validation, custom 404, leaked secrets (`.env`, API keys, private keys), debug code, security headers + HTTPS redirect (live), and page weight. Zero dependencies — runs anywhere Python 3 exists.

## 2. Work the manual checklist

The CLI can't check everything. After it passes, walk `checklists/core.md` (launch readiness) and `checklists/security.md` (the security pass). For each item: **verify**, then **fix** — don't just report.

Rules of the fix pass:

1. **Fix in the user's voice, not yours.** Match the site's existing copy and design; don't "improve" the design while auditing.
2. **Smallest change that closes the gap.** A missing meta description gets a plain, specific description — not a rewrite of the page.
3. **Never invent content the user must approve.** Privacy policy, terms, cookie consent text, analytics IDs — draft them, flag them as drafts, let the user sign off.
4. **Secrets are stop-the-line.** A committed API key means: revoke the key first, then remove it from the repo and history, then continue the audit.
5. **Report in two buckets:** "fixed" (what you changed) and "needs you" (decisions, credentials, copy approval).

## 3. Re-run and confirm

Run the CLI again after fixes. The audit is done when it exits 0 and every manual checklist item is either verified or explicitly deferred by the user.
