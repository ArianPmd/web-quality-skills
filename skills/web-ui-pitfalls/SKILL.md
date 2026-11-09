---
name: web-ui-pitfalls
description: Audit a web app or PWA's front end for common, easy-to-miss UI/UX bugs and return a prioritized to-do list (Must fix / Should fix) with file locations and fixes — CSS that breaks after build, PWA install, start page and update problems, iOS Safari quirks, performance, offline and error states, sign-in sessions that drop, back navigation, dark-mode icon colors, overlays covering content, onboarding that scrolls headers away, translation and RTL inconsistencies, permission prompts, demo modes, merge-conflict leftovers. Use when the user asks to review, audit, QA or "check for problems" in a front end, before a release, or after a large UI change or merge.
---

# Web UI pitfalls audit

Find the problems that pass code review and typechecks but break for real
people. Output a to-do list, not an essay.

## Workflow

1. **Map the project** (2 minutes): framework, build tool, CSS approach,
   whether it is a PWA (manifest, service worker), supported languages,
   theme support. Note the entry HTML, the global stylesheet, the router.
2. **Run the quick scanner** from the project root:
   `node <skill-dir>/scripts/check.mjs [build-output-dir]`
   (build first if a `dist/`/`build/` exists or can be produced). It finds
   mechanical problems: conflict markers, unbalanced CSS braces, dropped
   `backdrop-filter`, manifest gaps, missing `lang`/viewport, translation
   files with missing keys, text that skips the translation function, form
   fields under 16px, `100vh`, hard-coded colors, a service worker without
   an update path, heavy images. Treat its output as leads to confirm.
3. **Walk the catalog** in `references/pitfalls.md`. For each item that
   applies to this stack, look for it in the code (grep, read the relevant
   component). Skip items that cannot apply and say so briefly.
4. **Verify in a browser when you can**, following
   `references/browser-test-plan.md` (phone width, light + dark, a second
   language, an installed/standalone window if it is a PWA, offline). A
   screenshot beats a guess.
5. **Report** with `references/report-template.md`: Must fix first, then
   Should fix, each with location, why it matters for people, and the fix.
   Do not fix anything unless the user asks; offer to.

## Severity

- **Must fix** — someone is blocked, loses data, sees broken UI, or the app
  misbehaves on a common platform (iOS Safari, installed PWA, dark mode,
  RTL language).
- **Should fix** — friction, inconsistency, polish, or a risk that only
  shows up in less common conditions.

Be honest about confidence: mark items you inferred from code but did not see
happen as "unverified".

## References

- `references/pitfalls.md` — the catalog, grouped by area (build & CSS,
  PWA, service worker updates, iOS Safari, performance, offline & errors,
  sign-in sessions, navigation, theme, overlays, forms, translation,
  permissions, demo mode, sound & motion), each with how to detect and fix.
- `references/browser-test-plan.md` — what to check in a browser and which
  flows to walk through.
- `references/report-template.md` — the output format.
- `scripts/check.mjs` — the quick scanner (Node 18+, no dependencies).
