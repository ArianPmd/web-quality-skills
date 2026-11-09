# Baseline: what goes in from the first milestone

Cheap on day one, expensive to retrofit. Mark each item that applies in the
brief; skip the ones that don't (say why in one line).

## Milestone 1 — foundations

**Project**
- [ ] Repository with lockfile, `.gitignore` (incl. `.env*` except
      `.env.example`), formatter, linter, typecheck, a test runner, CI that
      runs them.
- [ ] Environment variables for every secret and URL; `.env.example` with
      placeholders; separate values per environment.
- [ ] Error tracking / logging that strips e-mails and tokens.
- [ ] If an edge/middleware proxy forwards `/api`: it removes
      `content-encoding` and `content-length` from forwarded responses
      (fetch already decompressed them), forwards every `Set-Cookie`, and
      has a test for both; the API client never turns a failed response
      into `null`.

**UI foundations** (`../native-feel-ui/`)
- [ ] Design tokens for color (light + dark), radius, spacing; type scale.
- [ ] Theme: Light / Dark / Automatic (default Automatic).
- [ ] `lang` and `dir` on `<html>`; logical CSS properties; every string
      through the translation function from the first screen; a glossary
      for the core terms in each language.
- [ ] Base components: settings list, segmented control, sheet, alert,
      toast, empty state, form field (≥16px, labels, errors), and an
      **option picker** (`../native-feel-ui/references/patterns.md` › 16)
      used instead of every native `<select>` (sort, country, …).
- [ ] Smart back (history back with a fallback route).
- [ ] A top-level error boundary (and per-route error elements) showing a
      friendly message with Reload / Go home — never a blank page.
- [ ] A catch-all route with a not-found page designed for this product
      (`../native-feel-ui/references/patterns.md` › 18).
- [ ] An end-to-end smoke test of the main flow that fails on console
      errors, running in CI.
- [ ] Design direction from the brief applied: accent color, voice in all
      copy, typeface; each base component checked against its rules in
      `../native-feel-ui/references/components.md`.
- [ ] Viewport with `viewport-fit=cover`, safe-area padding, `100dvh`.

**Security** (`../launch-security-legal-check/references/security.md`)
- [ ] Security headers incl. a strict CSP (`connect-src` limited to the
      hosts you call), HSTS, `nosniff`, `frame-ancestors`.
- [ ] Input validation with a schema on the server; ORM / parameterized
      queries.
- [ ] If accounts: screens built with
      `../native-feel-ui/references/auth-flow.md`; slow password hashing, `HttpOnly; Secure; SameSite`
      cookies, refresh-token rotation with reuse detection and a short
      grace window, generic sign-in/reset answers, rate limits on auth
      routes, e-mail codes that expire.
- [ ] Authorization checks per object (ownership) in every route.
- [ ] Dependency audit in CI.

**Privacy & legal** (`../launch-security-legal-check/references/privacy-legal.md`)
- [ ] Data map started (what, why, where stored — server and device, who
      receives it, how long).
- [ ] Footer links: Privacy Policy, Terms, Imprint (if needed) — drafts.
- [ ] Only strictly necessary storage until consent exists for anything
      else; no third-party scripts that load before consent.

## Milestone 2–3 — features

- [ ] Every list has an empty state with the first action.
- [ ] Every form: each schema field and cross-field rule has its own
      visible, translated error; empty inputs validate as `undefined`;
      validation happens before the request, and the shared error helper
      understands validation errors; submitting an empty and a half-filled
      form both show what to fix — the first invalid field is revealed
      (hidden sections opened), scrolled to, focused and outlined in red;
      server errors land on their field too.
- [ ] Destructive actions: confirm or Undo; soft delete where it helps.
- [ ] Loading skeletons, offline and error states with Try Again, plain
      error messages in the person's language.
- [ ] Jobs that send e-mail/notifications are idempotent and claim work
      atomically; a catch-up window for late runs.
- [ ] Notifications (if any): pre-prompt before the system permission,
      status card when off/blocked, sent at the chosen time, one per item,
      in the person's language.
- [ ] Data export and account deletion (with the grace period you state).

## Milestone 4 — polish

- [ ] Landing page (if the product has one) built with
      `../native-feel-ui/references/landing-page.md`: real numbers, hero
      object, reduced-motion fallback, single h1, RTL, no horizontal scroll.

- [ ] Design review (`../audit-web-app/references/design-review.md`) of the
      main screens; fix Must items, then the Should items that are quick.

- [ ] Browser test plan (`../web-ui-pitfalls/references/browser-test-plan.md`)
      at phone width, both themes, second language, installed PWA, offline.
- [ ] Onboarding tips (replayable from Settings), reduced motion, sounds
      optional.
- [ ] Performance: image sizes, layout shift, bundle split by route.
- [ ] PWA: manifest (`id`, `start_url` = app home, maskable icon), service
      worker with an update prompt, HTML/API not cache-first.

## Milestone 5 — launch readiness

- [ ] Run `audit-web-app`; fix every Must.
- [ ] Privacy policy matches the data map; processor agreements accepted;
      records of processing; breach plan (`compliance-extras.md`).
- [ ] Backups on, and one restore tested.
- [ ] E-mail domain authenticated (SPF, DKIM, DMARC) if the app sends mail.
- [ ] Licenses of every dependency, font, icon, image and sound recorded.
