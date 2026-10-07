# Pre-launch checklist (security)

The security pass. Items marked `[auto]` are covered by the `audit` CLI (dir mode scans source, URL mode checks live headers). Everything else is verify-and-fix by hand. **A committed secret is stop-the-line: revoke first, clean second, continue the audit third.**

## Secrets & config

- [ ] `[auto]` No `.env` files committed; `.env*` in `.gitignore`
- [ ] `[auto]` No API keys, tokens, or private keys in source (patterns: `sk-`, `AKIA`, `ghp_`, `xox-`, `AIza`, `-----BEGIN PRIVATE KEY-----`, hardcoded `password`/`secret`)
- [ ] `git log` scanned for previously committed secrets (they don't disappear when you delete the file)
- [ ] Environment variables documented; staging and production configs separated
- [ ] Debug mode / verbose errors OFF in production

## Transport & headers (`[auto]` in URL mode)

- [ ] `[auto]` `http://` 301-redirects to `https://` everywhere
- [ ] `[auto]` `Content-Security-Policy` header set (start strict, loosen deliberately)
- [ ] `[auto]` `Strict-Transport-Security` on HTTPS
- [ ] `[auto]` `X-Frame-Options` (or `frame-ancestors` in CSP), `X-Content-Type-Options: nosniff`, `Referrer-Policy`

## Auth & access

- [ ] Admin routes behind real authentication, not obscurity
- [ ] Authorization checked server-side on every privileged action (not just hidden buttons)
- [ ] Passwords hashed with bcrypt/argon2/scrypt — never plain, never MD5/SHA1
- [ ] Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax` (or stricter)

## Input & APIs

- [ ] All forms sanitize/validate input server-side; reflected input is escaped (XSS)
- [ ] API endpoints authenticated where they should be; no excessive data exposure
- [ ] Rate limiting on login, signup, and expensive endpoints
- [ ] CORS locked to the site's own origins — no `Access-Control-Allow-Origin: *` with credentials
- [ ] File uploads: type/size checked, stored outside the web root, never executed

## Dependencies & surface

- [ ] Dependencies up to date; known-vulnerable packages patched (`npm audit` / `pip audit` clean)
- [ ] Unused packages removed (smaller surface, smaller bundle)
- [ ] No exposed backup/config files (`.git/`, `.env`, `*.bak`, `*.sql`) on the server
- [ ] Database not directly reachable from the internet; backups exist and restore tested

## Final pass

- [ ] One full read-through of this list against the deployed URL, not localhost
- [ ] Findings fixed or explicitly accepted as risk by the site owner — in writing
