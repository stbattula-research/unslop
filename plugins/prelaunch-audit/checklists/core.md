# Pre-launch checklist (core)

Work top to bottom. Each item: **verify** it, then **fix** it. The `audit` CLI automates the items marked `[auto]`; the rest need a human (or an agent with judgment).

## Content & SEO

- [ ] `[auto]` Every page has a unique, descriptive `<title>` (50–60 chars)
- [ ] `[auto]` Every page has a meta description (120–155 chars, no keyword stuffing)
- [ ] `[auto]` `<html>` carries the right `lang` attribute
- [ ] `[auto]` Exactly one `<h1>` per page, describing the page
- [ ] Canonical URLs set; staging/noindex pages excluded from the sitemap
- [ ] Copy proofread — no lorem ipsum, no placeholder text, no TODOs in copy

## Social & branding

- [ ] `[auto]` Open Graph tags present (`og:title`, `og:description`, `og:image`)
- [ ] `[auto]` `twitter:card` set (usually `summary_large_image`)
- [ ] `[auto]` Favicon linked **and the file ships**; test at 16×16 and in dark mode
- [ ] `og:image` is 1200×630, under ~300 KB, and actually loads; validate with a card validator
- [ ] Touch icon / Apple touch icon for mobile bookmarks

## Discoverability

- [ ] `[auto]` `robots.txt` at the root (don't accidentally `Disallow: /` on launch)
- [ ] `[auto]` `sitemap.xml` at the root, listing every public page
- [ ] Analytics wired to the production property (not the staging one)

## Links & navigation

- [ ] `[auto]` No broken internal links; `[auto]` no dead `#anchor` links
- [ ] External links spot-checked (`audit --check-external`, or click the important ones)
- [ ] Every button, link, and form actually does something — click through the whole site
- [ ] `[auto]` Custom 404 page exists, returns a real 404 status, links back into the site

## Media & performance

- [ ] `[auto]` Every content image has alt text (`alt=""` only for decorative)
- [ ] `[auto]` No image over ~500 KB; hero images compressed (WebP/AVIF where sensible)
- [ ] `[auto]` Images carry width/height (no layout shift)
- [ ] Page weight sane on a slow connection — test on throttled 4G, not just fiber
- [ ] No render-blocking surprises: fonts with `display=swap`, deferred non-critical JS

## Forms

- [ ] `[auto]` Every input has a label (visible `<label>`, `aria-label`, or clear hint)
- [ ] `[auto]` Mandatory fields marked `required`; validation on the client **and** the server
- [ ] Submit the form for real: success state, error state, and what happens offline
- [ ] No sensitive data in URLs or logs from form submissions

## Mobile & accessibility

- [ ] Viewport meta tag present; layout tested at 360px wide
- [ ] Tap targets ≥ 44px; no hover-only interactions
- [ ] Keyboard navigable: tab order sane, focus visible, modals trap focus
- [ ] Color contrast meets WCAG AA for body text
- [ ] `prefers-reduced-motion` respected if the site animates

## Legal & trust

- [ ] Privacy policy page exists and matches what the site actually collects
- [ ] Terms page exists (draft it, flag it for the user to approve)
- [ ] Cookie consent shown where required (GDPR/CCPA); no tracking before consent
- [ ] Contact info real; copyright year current

## Hygiene

- [ ] `[auto]` No `console.log` / `debugger` / debug flags in shipped code
- [ ] `[auto]` No secrets, `.env` files, or private keys in the repo or bundle
- [ ] Error tracking wired (so you hear about breakage before users tell you)
- [ ] Uptime check + a rollback plan for launch day
