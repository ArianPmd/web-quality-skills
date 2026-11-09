# Sign-in, sign-up and password reset

Build the account flow so it feels like a polished native app (clean, calm,
one clear action per screen), is secure by default, and never leaves people
guessing what went wrong.

## Fill in first (from the codebase or the brief; ask only what's missing)

- Product name and what a new account gets (a profile, a mascot, a
  workspace…).
- Personal touches to pick during sign-up, if any (avatar, display name,
  a pet/theme…).
- Sign-in methods: e-mail + password, and which social logins.
- Languages (incl. right-to-left), brand colors, light/dark.
- Whether a demo / "try without an account" path exists.

## Screens

1. **Log in** — e-mail, password (show/hide), "Forgot password?", primary
   "Log in", a divider, "Continue with <provider>", then "No account? Sign
   up". If the e-mail isn't confirmed yet, the server sends a code and the
   same screen asks for it in place (no dead end).
2. **Sign up as a short, friendly sequence — fun first, credentials last**
   - Step A: pick the personal touches — a big live preview on top,
     choices as a grid, one option always preselected so Continue works at
     once, a quiet "Skip for now".
   - Step B: the next choice, same pattern (e.g. a segmented control plus
     captioned tiles).
   - Last step: e-mail, password, confirm password and the Terms/Privacy
     checkbox together on one screen. Continue stays disabled until
     everything is valid **and** the box is ticked — with the reason shown;
     "Continue with <provider>" is also blocked until the terms are
     accepted, and carries the choices from the earlier steps.
   - Check "this e-mail is already registered" on this step, before the
     account is created, not after.
   - Then confirm the e-mail with a 6-digit code.
   - A progress indicator and a Back button on every step; going back keeps
     what was entered.
3. **Forgot password (3 steps)** — e-mail, then the 6-digit code, then a new
   password + confirm. Never ask to retype the e-mail; keep the code in
   state and send it again with the new password (the server checks it
   again). When the resend limit is reached, disable "Resend" and say when
   it can be used again instead of showing a raw error.

## Look and feel

- A centered card (full width on phones), large title, grouped fields, one
  full-width primary button, secondary actions as quiet text links.
- The app's own tokens (CSS custom properties), full dark theme, RTL
  mirroring.
- **6-digit code input:** separate boxes, auto-advance, paste the whole
  code into any box, Backspace goes to the previous box,
  `inputmode="numeric"`, `autocomplete="one-time-code"`; one accessible
  label for the group.
- Buttons show a loading state (spinner + disabled) so nothing is
  submitted twice.

## Forms and errors (very important)

- Validate with a schema. Every field that can fail shows its own message
  right under it (`role="alert"`, `aria-invalid`), and the page scrolls to
  and focuses the first invalid field. No silent failures: every schema
  path has a visible place on the page (`patterns.md` › 13 and 17).
- Empty values become `undefined` before validating, so the specific,
  friendly message applies instead of a generic one.
- A field's error clears as soon as it's fixed. A confirm-password mismatch
  only shows after both fields have been typed in.
- Server errors map to plain messages — wrong e-mail or password, too many
  attempts (with when to try again), e-mail already used, code expired —
  never a raw status code or "Something went wrong" when the reason is
  known.
- Correct `autocomplete` (`email`, `current-password`, `new-password`) so
  password managers work; `type="email"`; no autocorrect or capitalization
  on e-mail.
- All text goes through the translation system.

## Security (server and client)

- Passwords hashed with a slow hash (argon2id or bcrypt). Login takes the
  same time for an unknown e-mail (compare against a dummy hash) and
  returns the same message for "no such user" and "wrong password".
- Rate limits on login, sign-up, code verification and password reset (per
  IP and per account), plus bot protection on sign-up and login. A
  bot-check token is single-use: reset the widget after a failed attempt.
- E-mail codes: short-lived, single-use, limited attempts, compared in
  constant time.
- Sessions: `HttpOnly; Secure; SameSite` cookies (or a short-lived access
  token plus a rotating refresh token), CSRF protection when cookies are
  used, and every session revoked after a password reset.
- Social login: verify the provider's token on the server; link to an
  existing account by e-mail only when the provider says the e-mail is
  verified. Accounts created by social login have no password — let them
  set one later without asking for a "current password".
- Never put an e-mail, token or code in a URL query string, and never log
  them. (Full list: `../../launch-security-legal-check/references/security.md`
  › Authentication & sessions.)

## Accessibility

One `h1` per screen, a visible label on every input (not just a
placeholder), visible focus, logical tab order, Enter submits, contrast at
least AA in both themes, everything works at 200% zoom and 320px width.

## Deliverable and verification

- A component per screen, shared form-field and code-input components, the
  API endpoints with tests — including rate limits and the unknown-e-mail
  timing.
- Check in a browser at phone and desktop width, light and dark, LTR and
  RTL; submit every form empty and half-filled (each error lands on its
  field); paste a code; hit the resend limit; screenshots of each screen.
