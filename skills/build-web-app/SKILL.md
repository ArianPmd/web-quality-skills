---
name: build-web-app
description: Turn a website or web-app idea into a working project built to a high standard from the first commit — native-feel UI, accessibility, right-to-left and translation, PWA, security, privacy and legal pages baked in instead of fixed later. Use when the user describes an idea for a new site or app and wants it planned and built ("build me a site for…", "I have an idea for an app…", "start a new web project…"). Not for checking an existing project (use audit-web-app).
---

# Build a web app from an idea

Start right instead of fixing later. This skill plans and builds; the
standards come from the three sibling skills in this repository:

- `../native-feel-ui/` — how the interface looks and behaves: principles,
  foundations, component rules, UX patterns, inputs, accessibility.
- `../web-ui-pitfalls/references/pitfalls.md` — mistakes to avoid while
  building.
- `../launch-security-legal-check/references/` — security, privacy, legal
  and licensing requirements.

`<skills>` below is the folder that contains this skill and its siblings
(the parent of this SKILL.md's folder); run scripts from the project's root
with that full path. The sibling skills must be installed alongside — the
plugin installs all of them; if you copy folders, copy all five.

## 1. Understand the idea (one short round of questions)

Ask at most five questions, only the ones the idea doesn't already answer;
offer a default for each so the person can just say "ok":

1. **Who uses it and where?** (countries → legal rules; languages → i18n,
   right-to-left)
2. **Accounts?** (none / e-mail / sign in with a provider) and **what data**
   is stored about people.
3. **Money?** (free / one-time / subscription / ads)
4. **Installable app (PWA) and notifications?**
5. **Stack preference or hosting already chosen?** If none, propose one
   that fits the idea and explain the choice in two lines.

Then write it back as a one-page brief (`references/brief-template.md`) and
get a yes before building. The brief includes a **design direction**
derived from `../native-feel-ui/references/principles.md`: voice and tone,
one accent color, typeface (system stack unless the brand needs one), and
the feeling the product should give — propose them, the person can just
say "ok".

## 2. Plan

Produce, in the brief:

- **Screens** and the main flows (sign up → first use → core loop → settings).
- **Data model** (entities, who owns what, what is personal data).
- **Baseline** — the items from `references/baseline.md` that apply,
  marked as part of milestone 1, not "later".
- **Milestones**, each small enough for one review: 1 foundations,
  2 core feature, 3 secondary features, 4 polish, 5 launch readiness.

## 3. Build, milestone by milestone

For every milestone:

1. Build the smallest version that works end to end.
   **For every screen**, follow `../native-feel-ui/SKILL.md` (pick the
   pattern, use the tokens), and for **every component** you use, read its
   rules in `../native-feel-ui/references/components.md` before building
   it. Words follow the writing rules in `principles.md`.
2. Apply the baseline items that belong to it (see `references/baseline.md`).
3. Run the design checklist ("Checklist before you call a screen done" in
   `../native-feel-ui/SKILL.md`) on every screen built or changed in this
   milestone; fix the Must items before moving on.
4. Run the project's checks (typecheck, tests, build) and the quick scanners:
   `node <skills>/web-ui-pitfalls/scripts/check.mjs`,
   `node <skills>/launch-security-legal-check/scripts/scan.mjs`.
5. Look at it in a browser at phone width **and desktop**, light and dark
   (and the second language) and show screenshots. **Click through the
   main flow end to end** (e.g. browse → product → bag → checkout →
   confirmation) — a build and typecheck can pass while a navigation
   crashes the app. Submit each form empty and confirm in the page that
   focus really moved to the first invalid field (check
   `document.activeElement`), not only that the code calls `focus()`.
6. Summarize what was built, what was checked (including the design
   checklist), what is left. Commit (and open
   a PR if the person works with PRs).

Ask before: adding paid services, choosing a legal jurisdiction, publishing
anything, or writing final legal texts (draft them, mark them "draft —
review before publishing").

## Definition of done (every milestone)

A milestone is done only when all of these are true — say which ones you
verified and how:

- Typecheck, lint, unit tests and the production build pass.
- **An automated end-to-end smoke test** walks the main flow (e.g. home →
  item → add → checkout/submit → confirmation, and sign up / log in if
  there are accounts) and fails on any console error. Add it in milestone 1
  and extend it with each feature — it's the cheapest way to catch a crash
  that a build can't see.
- The flow was also clicked through by hand in a browser at phone and
  desktop width, and the console was clean.
- Every claim in the summary was checked in the page itself
  (`../web-ui-pitfalls/references/browser-test-plan.md` › Prove it).
- The scanners show no Must items.

## 4. Before launch

Run the `audit-web-app` skill on the finished project — it covers security,
privacy and legal, UI bugs and design quality — and fix every Must.

## Rules

- Never put secrets in code or commits; use environment variables and an
  `.env.example` with placeholders.
- No paid or copyrighted assets without a license; system fonts and own
  icons by default.
- Legal texts are drafts with "general information, not legal advice".
- Keep the person in the loop: one question at a time when something is
  genuinely theirs to decide; otherwise pick the sensible default and say so.
