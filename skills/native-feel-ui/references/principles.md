# Principles, writing, inclusion, branding

The judgment calls behind every pattern. When two patterns conflict, these
decide.

## Design principles

| Principle | What it means in practice |
|---|---|
| **Purpose** | Every screen and feature earns its place by solving a real problem. Cut what doesn't; do one thing well. |
| **Agency** | People stay in charge: the UI gets out of the way, lets them explore, and every mistake can be undone or recovered from. |
| **Responsibility** | Say plainly what the product does and why; protect people's data by default. |
| **Familiarity** | Use patterns people already know, keep visuals and interactions consistent, and answer every action with clear feedback. |
| **Flexibility** | Work for everyone: any screen size, input (touch, mouse, keyboard, voice, assistive tech), text size and language; never lose the person's place. |
| **Simplicity** | Only what's needed, said briefly, with a clear hierarchy of what matters most. |
| **Craft** | Details set the tone — alignment, timing, wording. Test, iterate, keep polishing after launch. |
| **Delight** | Pick the feeling you want and create a few memorable moments; delight comes from things working beautifully, not from decoration. |

## Writing

- **Voice:** decide once (e.g. friendly, calm, direct) and keep it; adjust
  the *tone* to the moment (celebration vs. error vs. account deletion).
- **Clear and short:** each screen has one job — the words serve that job.
  Lead with the most important information.
- **Action-oriented:** buttons are verbs that say what happens ("Save
  Draft", "Delete Account"), not "OK"/"Yes".
- **Consistent patterns:** the same thing is always called the same; pick a
  capitalization rule (Title Case or Sentence case for buttons/titles) and
  apply it everywhere.
- **Multi-step flows:** tell people where they are and what's next, with the
  same words on every step.
- **Empty screens** say what goes here and offer the next step.
- **Errors** say what happened, why if useful, and how to fix it — no
  codes, no blame ("That code has expired. Request a new one.").
- **Right channel:** inline message for field errors, toast for
  confirmations, alert only for decisions with consequences, notification
  only for things that matter when the app is closed.
- **Settings labels** describe the setting, not the mechanism; a footer
  explains consequences.
- **Hints in fields** show the expected format or an example — never the
  only label.
- Use "your" / "my" sparingly; avoid jargon or define it; replace idioms and
  slang with plain words (they don't translate); be careful with humor.

## Inclusion

- Design for the full range of people: age, gender identity, ethnicity,
  body, ability (permanent, temporary, situational), language and culture,
  religion, education, income, beliefs.
- **Language:** people-first wording; refer to people by what they choose
  (offer "prefer not to say" and free text for gender; don't require
  titles); avoid assumptions in examples and placeholder names.
- **Images and avatars:** varied, non-stereotypical; avoid gendered or
  culturally specific defaults; let people choose their own.
- **Security questions and onboarding** shouldn't assume a life story
  (school, car, family).
- **Approachable:** simple interface first, optional learning aids, no
  required knowledge.
- Disability is a spectrum and everyone experiences it at some point — see
  `accessibility.md`.

## Branding

- Express the brand through voice, one accent color used with restraint,
  and optionally one custom typeface — inside familiar components.
- Branding always defers to content; don't repeat the logo on every screen.
- No splash or loading screen used as a billboard; the first screen should
  look like the app (see "Launch" in foundations.md).
- Follow other companies' brand rules when you show their marks (e.g.
  sign-in buttons) and never use them to suggest endorsement.
