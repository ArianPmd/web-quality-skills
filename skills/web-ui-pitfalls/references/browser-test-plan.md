# Browser test plan

Run this after a UI change, and in full before a release. Use real devices
when you can; otherwise a browser with device emulation.

## Matrix (minimum)

| | Light | Dark |
|---|---|---|
| Phone width (375×812) | ✓ | ✓ |
| Tablet / desktop (≥ 1024px) | ✓ | — |
| Second language (and an RTL language if supported) | ✓ | — |
| Installed / standalone window (if PWA) | ✓ | — |

Plus once each: keyboard only, 200% text zoom, reduced motion, a slow 3G
network, offline.

## Per screen

1. Loads without console errors; no layout shift once loaded.
2. Nothing cut off at 375px; no horizontal scroll.
3. All text readable in both themes; icons visible.
4. Every button does something visible; disabled buttons explain why.
5. Back / Close / Cancel go where expected (open the screen fresh from a
   link too — no history).
6. Dialogs: focus trapped, Escape closes, focus returns.
7. Tab order follows the visual order.
8. Translations: no untranslated text, nothing overflowing, numbers and
   dates in the local format.

## After every deploy

- Open the deployed site (not only localhost): sign up, sign in, the demo,
  and one screen that loads data — compressed responses through a proxy
  only break there.
- In dev tools › Network, an API response has a body and its headers make
  sense (no `Content-Encoding` on an already-decoded body).

## Flows

- Sign up → verify → first use → sign out → sign in again.
- Close and reopen the app (and the installed app): still signed in, lands
  in the app.
- Create, edit, delete (with Undo) the main object.
- Every form: submit it empty, then with each required field missing in
  turn — each time a specific message must appear at the right field
  (never "nothing happens" or a generic error), the field turns red, the
  page (or sheet) scrolls to it — opening any collapsed section or tab it's
  in — and focus lands on it, not hidden under the top bar.
- Permission prompts: allow, deny, then re-enable from settings.
- Every picker/sheet: opens with the top bar and tab bar still visible;
  its search stays fixed while the list scrolls; tapping a tab closes it
  and navigates; Escape closes it and focus returns; no console errors.
- Update: deploy a new version with the app open — does it pick it up?
- Offline in the middle of an edit.

## Prove it, don't assume it

A build, a typecheck and code that *calls* the right function don't prove
the behaviour. For every claim in a report, check the page itself:

- "Focus moves to the first error" → read `document.activeElement` after
  submitting.
- "The dialog opens" → check it's in the DOM, visible
  (`getComputedStyle(el).opacity`, its bounding box) and focused.
- "No errors" → read the browser console after the flow.
- "It works on desktop" → actually load it at desktop width.
- Animations may be paused in headless or hidden browser panes: wait for
  them, or read the final computed values, before concluding something is
  broken — and say when you couldn't verify.
- Open an unknown URL and a deleted item's URL: the custom 404 shows.

## Evidence

Screenshot each changed screen in each state you touched; keep them with
the report or PR.
