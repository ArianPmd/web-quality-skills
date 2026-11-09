# Security checklist

`[M]` usually Must, `[S]` usually Should.

## Secrets & configuration
- `[M]` No secrets in git history (API keys, DB URLs with passwords, signing
  secrets, private keys, `.env` files). If one was ever committed: rotate it,
  then remove it.
- `[M]` Secrets only in the host's secret store / env vars; the frontend
  bundle contains only public values (check the built JS for anything that
  looks like a key).
- `[M]` Each environment (dev, staging, prod) has its own secrets.
- `[S]` A local "secrets" document kept outside any synced or shared folder.
- `[S]` Internal endpoints (cron triggers, webhooks) require a secret
  compared in constant time and answer 404 when misconfigured.

## Authentication & sessions
- `[M]` Passwords hashed with a slow algorithm (argon2id / bcrypt / scrypt).
- `[M]` Session/refresh tokens in `HttpOnly; Secure; SameSite` cookies (or an
  equally safe store) — not `localStorage` for long-lived tokens.
- `[M]` Refresh tokens rotate on use; reuse of an old token revokes the
  family. Allow a short grace window for concurrent tabs/requests so normal
  use doesn't sign people out.
- `[M]` Distinguish "server unreachable / 5xx" from "token invalid" — retry
  the first, sign out only on the second.
- `[M]` Account enumeration: sign-in and reset answer the same for existing
  and unknown e-mails.
- `[M]` Password reset / e-mail codes: short expiry, single use, attempt
  limits.
- `[S]` Log why a session couldn't be resumed (no cookie, expired, reuse) —
  without the token — so "I got logged out" reports can be traced.
- `[S]` 2FA for admin accounts at least.
- `[S]` OAuth: `state` and PKCE; exact redirect URIs.
- `[M]` New session ID after sign-in and privilege change (no session
  fixation); sign-out invalidates the session on the server, not only the
  cookie.
- `[M]` Changing e-mail or password, adding a sign-in method, or turning
  off 2FA requires the current password / re-authentication; a password
  change signs out other sessions; the old e-mail gets a notice.
- `[M]` Sign-in with a provider links to an existing account only if the
  provider says the e-mail is **verified** — otherwise an attacker can
  pre-register someone's address and take over the account.
- `[M]` Reset and verification links are built from a configured base URL,
  never from the request's `Host` header (host-header poisoning).
- `[M]` JWTs (if used): a fixed algorithm (never `none`, no algorithm
  switching), a long random secret or asymmetric keys, short `exp`,
  `aud`/`iss` checked, a way to revoke.
- `[S]` Credential stuffing: rate limits plus a check against known-breached
  passwords (k-anonymity range API) on sign-up and password change;
  minimum length over composition rules.
- `[S]` 2FA codes and magic links: short expiry, single use, attempt limits
  (a 6-digit code without limits is brute-forced in minutes).
- `[S]` SMS codes (if any): per-number and per-country limits to stop SMS
  pumping fraud that runs up your bill.
- `[S]` Passkeys offered as a sign-in method.

## Authorization
- `[M]` Every API route checks *who* and *whose* (object ownership), not only
  "is signed in". Test with two accounts.
- `[M]` Admin routes guarded server-side; hidden UI is not protection.
- `[M]` Signed links/tokens (e.g. "mark done" buttons in a notification) are
  single-purpose, scoped to one object and user, and expire.
- `[M]` **Mass assignment:** update endpoints accept only an allowlist of
  fields — a request body can't set `role`, `isAdmin`, `ownerId`, `credits`
  or `emailVerified`.
- `[M]` **Response filtering:** APIs return only the fields the caller may
  see (no password hashes, tokens, other users' e-mails, internal flags) —
  serialize with an explicit allowlist, not the whole database row.
- `[M]` Database-as-a-service with direct client access: row-level
  security on every table, the service/admin key only on the server.
- `[M]` **Business-logic abuse:** one-time things (redeem codes, coupons,
  free trials, rewards, votes, invites) can't be used twice through
  parallel requests — enforce with a unique constraint or an atomic
  conditional update, not a read-then-write check.
- `[S]` Sensitive flows (sign-up, checkout, sending invites, anything that
  costs money) have limits per account and per day, not only per request.

## Abuse protection
- `[M]` Rate limits on sign-in, sign-up, reset, code entry, and expensive
  endpoints; per IP and per account.
- `[S]` Bot protection (privacy-friendly challenge) on sign-up / contact
  forms; mention it in the privacy policy.
- `[S]` Unconfirmed sign-ups purged after a while.
- `[S]` Invite-only gate: validate the pass server-side (signature + expiry)
  and keep revocation checks in the app.

## Transport, headers, cookies
- `[M]` HTTPS everywhere; HSTS.
- `[S]` `Content-Security-Policy` (start with report-only). Keep
  `connect-src` to your own origin and the hosts the app really calls (API,
  push service, error reporting) — `connect-src https:` lets injected code
  send data anywhere. Same idea for `script-src` and `img-src`.
- `[S]` Put the CSP in the **production** response: as an HTTP header from
  the host (preferred — `frame-ancestors` and reporting only work there) or
  injected into the built HTML. A strict CSP in `index.html` also applies to
  the dev server, whose hot reload needs inline scripts — so developers end
  up loosening it for everyone.
- `[S]` `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` limiting unused
  features, `frame-ancestors` / `X-Frame-Options`.
- `[M]` CORS: explicit origins with credentials; never `*` with cookies,
  never reflect the request's `Origin` back unchecked, never allow `null`.
- `[M]` **CSRF:** state-changing requests can't be triggered from another
  site — `SameSite=Lax/Strict` cookies *plus* a CSRF token or an `Origin`
  check for cookie-authenticated APIs; no state changes on `GET`.
- `[S]` Cookie prefixes `__Host-` (no `Domain`, `Path=/`, `Secure`) for
  session cookies; short `Max-Age` for anything sensitive.
- `[S]` Cross-origin isolation headers where useful
  (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy`).
- `[S]` Third-party scripts: as few as possible, pinned versions with
  Subresource Integrity (`integrity=`), allowed explicitly in the CSP; no
  scripts loaded from a CDN you don't control without SRI.
- `[S]` TLS: modern versions only (1.2+), valid certificate with automatic
  renewal; a `CAA` DNS record naming your certificate authority.
- `[M]` **Behind a proxy/CDN:** trust `X-Forwarded-For` only from your own
  proxy (configure the framework's "trust proxy" to the exact hop count or
  addresses) — otherwise anyone can fake their IP and bypass rate limits
  and IP logs.
- `[S]` A `/.well-known/security.txt` with a contact for vulnerability
  reports.
- `[S]` `noindex` on private/staging sites.

## Input, output, files
- `[M]` Validate input server-side (schema); parameterized queries / ORM;
  no string-built SQL, NoSQL operators from user input (`$where`, `$ne`),
  or shell commands with user input.
- `[M]` **XSS:** no raw HTML from users rendered without sanitizing; audit
  every `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `eval`,
  `new Function`, `document.write`, and Markdown rendering; links from
  users only with `http(s):` (no `javascript:` URLs).
- `[M]` **SSRF:** any feature that fetches a URL people supply (link
  previews, image import, webhooks, PDF/screenshot generation) allows only
  `http(s)`, blocks private, loopback, link-local and cloud-metadata
  addresses (after DNS resolution and on every redirect), and has
  timeouts and size limits.
- `[M]` **Open redirects:** `?next=` / `returnTo` parameters accept only
  relative paths or an allowlist of hosts.
- `[M]` **Path traversal:** file names and paths from requests never reach
  the file system directly (normalize, allowlist, store by generated ID).
- `[M]` Uploads: type checked by content (not just extension), size limits,
  stored outside the web root or on a storage service, never executed,
  served with `Content-Disposition: attachment` or from a separate domain;
  SVG and HTML uploads sanitized or served as downloads (they can contain
  scripts); image metadata (location) stripped if images are shared.
- `[S]` **Prototype pollution:** don't deep-merge untrusted JSON into
  objects; reject `__proto__`, `constructor`, `prototype` keys.
- `[S]` **ReDoS:** no user input matched against complex, backtracking
  regular expressions without length limits.
- `[S]` XML parsing with external entities disabled (XXE); no unsafe
  deserialization of user data (YAML/pickle-style loaders).
- `[S]` **Exports:** CSV/spreadsheet exports escape cells starting with
  `= + - @` (formula injection).
- `[S]` **E-mail:** user input never placed in e-mail headers; HTML e-mails
  escape user content.
- `[S]` `postMessage` handlers check `event.origin`; WebSocket connections
  authenticate and check `Origin`.
- `[S]` Error responses don't leak stack traces, SQL, file paths or library
  versions; a generic message with a request ID instead.
- `[S]` Unexpected conditions fail closed: an exception in an auth or
  payment check denies access, never skips the check.

## Resource limits (denial of service, cost)
- `[M]` Request body size limits; pagination with a maximum page size;
  timeouts on outgoing calls and long queries.
- `[M]` Expensive operations (AI/LLM calls, e-mail and SMS sending, image
  processing, exports, search) limited per user and per time window — an
  attacker can otherwise run up your bill or exhaust free-tier quotas.
- `[S]` Spending caps and billing alerts on every paid API and cloud
  account.
- `[S]` GraphQL (if used): depth and complexity limits, introspection off in
  production, persisted queries for public clients.
- `[S]` Archive uploads (zip) checked for decompression bombs.

## Deployment & exposure
- `[M]` Nothing sensitive reachable over HTTP: `/.git/`, `.env`, backup
  files, database dumps, admin tools, debug endpoints, directory listings.
- `[S]` Source maps not public in production (or upload them only to your
  error tracker).
- `[M]` Databases, caches and admin panels not reachable from the public
  internet (or only with strong auth and IP allowlists); the app's database
  user has only the permissions it needs; connections use TLS.
- `[M]` Cloud storage buckets private by default; public files only in a
  dedicated public bucket; signed, expiring URLs for private files.
- `[M]` Preview / staging deployments don't use production data or
  production secrets, and aren't indexed or public by accident.
- `[S]` No default or example credentials anywhere; `X-Powered-By` and
  version banners off.
- `[S]` DNS: no dangling records pointing to deleted services (subdomain
  takeover); remove them when a service is shut down.

## Supply chain & CI
- `[M]` 2FA (preferably a security key or passkey) on every account that can
  change the product: code host, package registry, hosting, DNS/domain
  registrar, database, e-mail provider.
- `[M]` CI secrets are scoped to the jobs that need them; workflows run with
  least-privilege tokens (`permissions:` set explicitly); secrets never
  printed in logs.
- `[M]` No workflows that run untrusted pull-request code with secrets
  (e.g. `pull_request_target` that checks out the PR's code).
- `[S]` Third-party CI actions pinned to a commit hash, not a moving tag.
- `[S]` New dependencies vetted: typosquatting (a name one letter off),
  very new or abandoned packages, install scripts (`postinstall`). Prefer
  `npm ci` / frozen lockfiles in CI; consider disabling install scripts by
  default.
- `[S]` Private package names reserved or scoped so a public package can't
  shadow them (dependency confusion).
- `[S]` Branch protection on the main branch: reviews or checks before merge,
  no force pushes.

## Cryptography
- `[M]` Tokens, codes, IDs in links and secrets come from a cryptographically
  secure generator (`crypto.randomUUID`, `crypto.getRandomValues`,
  `randomBytes`) — never `Math.random`.
- `[M]` Secrets and tokens compared in constant time.
- `[S]` Sensitive fields (third-party tokens, personal documents) encrypted
  at rest with keys kept outside the database; a plan to rotate keys.
- `[S]` No home-made crypto; standard libraries and algorithms only.

## AI features (if the app calls a language model)
- `[M]` **Prompt injection:** treat everything the model reads (user input,
  web pages, documents, e-mails) as untrusted; the model never gets more
  permissions than the signed-in person; tool/function calls that change
  data or cost money need server-side authorization and, for important
  actions, the person's confirmation.
- `[M]` Model output is untrusted input: escape it before rendering as HTML,
  never execute it as code or SQL, validate structured output against a
  schema.
- `[M]` No secrets or other users' data in prompts or system instructions
  (assume they can be extracted).
- `[S]` Usage limits and cost caps per user; log prompts only with privacy
  in mind (they often contain personal data).

## Webhooks (incoming)
- `[M]` Verify the sender's signature on the raw body, reject old
  timestamps (replay), process each event ID once (idempotency).

## Process
- `[S]` A short threat model for the main flows (what could go wrong, who
  could abuse it) before building sensitive features.
- `[S]` An incident plan: how to rotate every secret quickly, revoke all
  sessions, restore from backup, and who to notify.
- `[S]` Re-run this checklist after major changes; consider an external
  penetration test before handling payments or sensitive data.

## Logging & monitoring
- `[S]` Security events logged (sign-ins, failures, resets, admin actions,
  blocked requests) with time and IP, with a retention period that the
  privacy policy states.
- `[S]` Crash reporting strips e-mails and tokens.
- `[S]` Someone gets alerted when error rates spike, and on security
  signals (many failed sign-ins, token-reuse detections, admin actions).
- `[M]` Logs never contain passwords, tokens, full card numbers, session
  cookies or reset links; personal data in logs kept to a minimum.
- `[S]` Logs protected from tampering and kept long enough to investigate
  (the retention you state in the privacy policy).

## Data lifecycle
- `[M]` Account deletion actually deletes (or anonymizes) the person's data
  after any stated grace period, including backups' retention.
- `[S]` Data export for the person (GDPR access/portability).

## Scheduled jobs on free / sleeping hosts
- `[S]` External pinger keeps jobs running; jobs are idempotent and have a
  catch-up window so a late run still does the work once.
- `[M]` When more than one runner can execute the same job (in-process
  timer + external pinger, several instances), each unit of work is
  **claimed atomically** before it runs (conditional update, unique
  constraint, or a lock) — otherwise people get duplicate e-mails,
  notifications or charges.

## Dependencies
- `[M]` No known critical or high vulnerabilities (`npm audit --omit=dev` /
  `pnpm audit --prod` / ecosystem equivalent) in production dependencies.
  Fix by updating the direct dependency first; if its maintainers haven't
  released a fix yet, pin the patched transitive version with
  `overrides` (npm) / `pnpm.overrides` / `resolutions` (yarn), then re-run
  the audit and the tests.
- `[S]` Vulnerabilities only in development tools (build, test, lint) don't
  ship to users — track and update them, but they don't block a launch.
- `[S]` Lockfile committed; automated update PRs.
