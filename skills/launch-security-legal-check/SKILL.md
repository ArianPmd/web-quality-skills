---
name: launch-security-legal-check
description: Pre-launch audit of a web app's security and legal readiness that returns a prioritized to-do list (Must do before launch / Should do) — secrets in code and git history, vulnerable dependencies and supply chain, CI workflows, authentication and session handling, access control and mass assignment, CSRF, XSS, SSRF, injection, uploads, business-logic races, resource and cost limits, exposed files and infrastructure, cryptography, AI/LLM features, webhooks, rate limiting and bot protection, headers and cookies, logging, backups, privacy policy completeness under GDPR, consent, records of processing and processor agreements, breach plan, e-mail authentication, payments and consumer law, app store privacy forms, other regions, legal accessibility requirements, terms, imprint, and licenses of code, fonts, icons and assets. Use when the user asks for a security review, a pre-launch or go-live check, a GDPR / privacy / cookie / legal check, or whether anything copyrighted or paid is used. Gives general information, not legal advice.
---

# Launch security & legal check

A structured review before real people use the app. It produces a to-do
list; it does not replace a penetration test or a lawyer.

**Always say once, near the top of the report:** "General information, not
legal advice. For binding answers, ask a qualified lawyer in your
jurisdiction." The legal parts assume the EU/GDPR (with German specifics
where noted); say so, and flag that other regions differ.

## Workflow

1. **Ask or infer the context** (don't block on it — state assumptions):
   who the users are and where (EU?), what data is collected, which
   third-party services run the app (hosting, database, e-mail, analytics,
   sign-in providers, push), whether it is public or invite-only.
2. **Run the scanner** from the project root:
   `node <skill-dir>/scripts/scan.mjs` — secrets in tracked files and in the
   git history, `.env` files in git, known-vulnerable dependencies (runs the
   package manager's audit), risky dependency licenses, missing lockfile,
   weak randomness for secrets, HTML/code injection sinks, risky CI
   workflows (untrusted PR code with secrets, missing permissions, unpinned
   actions, echoed secrets). Optionally
   `node <skill-dir>/scripts/scan.mjs --url https://staging.example.com` to
   check response headers and cookies of a deployed URL **the user named**,
   plus whether `/.git/`, `/.env` are public and `security.txt` exists.
3. **Security review** with `references/security.md`: read the auth, session,
   API guard, rate-limit, upload, and notification code. Note each item as
   OK / problem / not applicable.
4. **Privacy & legal review** with `references/privacy-legal.md`: compare
   what the code actually collects, stores (server *and* device), and sends
   to third parties with what the privacy policy, cookie banner, terms and
   imprint say. Every mismatch is a finding.
5. **Licensing review** with `references/licensing.md`: dependencies, fonts,
   icons, images, sounds, copied snippets.
6. **Extras that apply** from `references/compliance-extras.md`: records of
   processing, processor agreements, breach plan, e-mail authentication,
   payments, app stores, other regions, accessibility law, backups. Mark
   the rest "not applicable" in one line.
7. **Report** with `references/report-template.md`. Must first. Each item:
   where, risk, fix. Offer to make the fixes or draft the missing text; don't
   change legal text without the user's approval.

## Severity

- **Must (before launch)** — exploitable security issue, secret exposure,
  data collected or shared without a legal basis or without telling people,
  missing mandatory legal pages, using something you have no license for.
- **Should** — hardening, defense in depth, clearer or more complete legal
  text, things that become Must as the app grows.

## Rules for the reviewer

- Never print a found secret in full — show the file, line and the first 4
  characters.
- Only probe URLs the user explicitly gave you; never test third-party
  services or production systems with load or attack traffic.
- Policy text must describe what the app really does — read the code, don't
  trust the existing policy.
- When the app changes what it collects, the policy changes in the same
  release, and people are told (date + what changed).

## References

- `references/security.md` — secrets, authentication and sessions,
  authorization and business logic, abuse protection, transport/headers/
  CSRF/CORS, input and output (XSS, SSRF, injection, uploads, redirects),
  resource and cost limits, deployment and exposure, supply chain and CI,
  cryptography, AI features, webhooks, process, logging, data lifecycle,
  scheduled jobs, dependencies. Built to cover the OWASP Top 10, the OWASP
  API Security Top 10 and the OWASP Top 10 for LLM applications.
- `references/privacy-legal.md` — data map, privacy policy contents,
  consent and device storage, terms, imprint, minors, changes.
- `references/compliance-extras.md` — records of processing, processor
  agreements, breach plan, e-mail authentication, payments and consumer
  law, app stores, other regions, accessibility law, backups.
- `references/licensing.md` — dependencies, fonts, icons, images, sounds,
  trademarks, paid-tier limits.
- `references/report-template.md` — the output format.
- `scripts/scan.mjs` — the automatic checks (Node 18+, no dependencies).
