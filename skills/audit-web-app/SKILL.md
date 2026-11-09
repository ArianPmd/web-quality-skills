---
name: audit-web-app
description: Check an existing website or web app and return one prioritized checklist of what must and should be fixed — security first, then privacy and legal, then UI/UX bugs, then design quality — without changing anything. Combines the launch-security-legal-check, web-ui-pitfalls and native-feel-ui guidance and their scanners into a single report. Use when the user asks to check, audit, review or "find problems in" their current site or app, before a launch, or for a security / GDPR / quality check of the whole project.
---

# Audit an existing web app

Read-only by default: find, prioritize, explain. Fix only what the person
asks for afterwards.

Uses the sibling skills in this repository:
- `../launch-security-legal-check/` — security, privacy, legal, licensing.
- `../web-ui-pitfalls/` — front-end and UX bugs.
- `../native-feel-ui/` — design quality: principles, foundations, component
  rules, writing, accessibility.

`<skills>` below is the folder that contains this skill and its siblings
(the parent of this SKILL.md's folder); run scripts from the project's root
with that full path. The sibling skills must be installed alongside — the
plugin installs all of them; if you copy folders, copy all five.

## Workflow

1. **Map the project** (a few minutes): stack, how it's deployed, accounts
   and data, third-party services, languages, PWA or not. State assumptions
   instead of blocking on questions; ask only what changes the result
   (e.g. "do you have users in the EU?").
2. **Run the scanners** from the project root (build first if possible):
   - `node <skills>/launch-security-legal-check/scripts/scan.mjs`
     (secrets in files and git history, dependency audit, licenses)
   - `node <skills>/web-ui-pitfalls/scripts/check.mjs [build-dir]`
   - Only if the person gives a URL they own:
     `node <skills>/launch-security-legal-check/scripts/scan.mjs --url <url>`
   Treat output as leads; confirm each in the code.
3. **Security review** — `../launch-security-legal-check/references/security.md`.
   Read auth, sessions, route guards, rate limits, uploads, scheduled jobs,
   headers. This section gets the most attention.
4. **Privacy & legal review** — `privacy-legal.md`, `compliance-extras.md`,
   `licensing.md` in the same folder. Build the data map from the code,
   compare it with the published policy and banner.
5. **UI/UX review** — `../web-ui-pitfalls/references/pitfalls.md`, and the
   browser test plan when a browser is available (screenshots). **Click
   through the main flow end to end** (e.g. browse → item → add → checkout
   → confirmation; sign up / log in) at phone and desktop width with the
   console open — crashes on navigation only show up this way. Also open an
   unknown URL (custom 404?) and trigger an error state if you can (error
   boundary or blank page?). Read the page to prove each finding
   (`browser-test-plan.md` › Prove it).
6. **Design review** — with `references/design-review.md`: the main screens
   against the design principles, foundations, the rules of each component
   the app uses, writing and accessibility from `../native-feel-ui/`.
   Judge what people experience, not personal taste; every finding names
   the rule it breaks.
7. **Report** with `references/report-template.md`: one list, Must before
   Should, security first inside each level. Every item: where, risk for
   people, fix, effort (S/M/L). Mark inferred-but-unseen items "unverified".
8. **Offer next steps**: fix the Musts (in small PRs), draft missing legal
   text for review, re-run the audit after fixes.

## Rules

- Change nothing during the audit (no fixes, no dependency updates, no
  commits) unless asked.
- Never print a secret in full (file, line, first 4 characters).
- Only scan URLs the person names and owns; no load or attack traffic.
- Legal parts: "General information, not legal advice", once at the top.
- Be concrete and short; a long report nobody acts on helps nobody.
