# UX patterns: flows and behaviors

How the app behaves over time — accounts, data entry, feedback, loading,
onboarding, help, search, settings, undo, sharing, media, AI features. For
the visual building blocks see `patterns.md` and `components.md`.

## Accounts

- Explain what an account gives people before asking for one; let them try
  the app first and **delay sign-in** until it's really needed (save, sync,
  share).
- Prefer passkeys (WebAuthn) and "sign in with" providers over passwords;
  always say which method you're offering; mention only methods available
  on this device.
- Don't add an app-specific "use biometrics" setting — passkeys already use
  the device's own unlock.
- **Account deletion:** easy to find in the app, the same experience on
  web and in-app, optionally scheduled, with a clear date when it completes
  and a confirmation when it's done. If there's a paid subscription,
  explain that deleting the account doesn't cancel billing (and how to
  cancel).

## Entering data

- Get what you can automatically (location with permission, autofill,
  defaults from earlier answers) instead of asking.
- Say exactly what's needed and why; mark what's required before people
  hit Continue.
- Offer choices instead of free text where possible; accept paste and drag
  and drop.
- Validate as people go (after they leave a field, then live while they fix
  it); never prefill password fields; secure fields for secrets.

## Feedback

- Every action gets a visible response: status inline where possible,
  confirmation for significant completions, an explanation when something
  can't be done and why.
- Alerts only for critical, ideally actionable information; warn *before*
  an action that loses data unexpectedly and irreversibly.
- All feedback is accessible: announced to screen readers (`role="status"`
  / `alert`), never only color or sound.

## Loading

- Show something immediately (skeleton, cached data), never a blank page;
  let people keep using the rest of the app while something loads.
- Long waits: say what's loading and roughly how long; real progress when
  measurable; something useful to look at.
- Download big assets in the background after first use, not before it.

## Modality and interruptions

- Interrupt only for what can't wait. Don't show alerts, rating requests or
  promotions while someone is in the middle of a task.

## Notifications (managing them)

- Represent urgency honestly: most notifications are passive information;
  "urgent" styling only for things that really need attention now.
- Promotional/marketing notifications need separate, explicit opt-in;
  never send them as reminders or urgent alerts.
- Let people manage notification types in the app's settings.
- Content and timing: see the notification pattern in `patterns.md`.

## Onboarding and help

- Teach by doing: let people use the real interface with a hint, rather than
  reading screens.
- Prefer small context tips at the moment a feature is relevant over a long
  upfront tour; any tour is short, optional and skippable.
- Keep onboarding about the experience — no license text, no account setup
  that could wait, no large downloads.
- Ask for permissions inside onboarding only if the app can't work without
  them; ask for ratings or purchases only after people got value.
- Tips: short, actionable, shown to the right people once; a button can
  lead to more detail or the relevant setting.
- Tooltips (desktop): describe what the control does, briefly, without
  repeating its name; sentence case.
- Help content: in the app's own words and visuals, task-oriented; don't
  explain standard controls.

## Search

- If search matters, give it a primary position; one place that searches
  all the content; show the current scope clearly.
- Suggestions and recent searches speed things up — respect privacy (clear
  history, no sensitive suggestions on shared screens).
- No results: suggest alternatives (spelling, broader scope), never a dead
  end.

## Settings

- Great defaults for most people; as few settings as possible.
- Don't duplicate device-wide settings (theme can follow the system; text
  size, reduced motion, language from the browser).
- Task options live next to the task (sort, view mode), not in Settings.
- Don't use Settings to collect setup information you could get otherwise.
- Settings apply immediately; group rarely changed ones; restore the last
  viewed section.

## Undo and redo

- Prefer undo over confirmation for reversible actions (toast with Undo).
- Make the result predictable and visible; describe what will be undone
  ("Undo Delete").
- Multiple steps of undo where editing is involved; `Ctrl/Cmd+Z` and
  `Shift+Ctrl/Cmd+Z` in editors; a "revert all changes" option for long
  edits.

## Drag and drop

- Support it where people expect it (reorder, upload, move between lists)
  and always offer another way (buttons, menus, keyboard).
- Clear move vs. copy semantics; multi-item where useful; undoable.
- Feedback: a drag preview right away, highlight valid drop targets, show
  when a target refuses, auto-scroll near edges, progress for slow
  transfers; keep the selection after the drop.
- Accept files and text pasted or dropped onto inputs.

## Saving and files

- People should never wonder whether work is saved: autosave with a visible
  status ("Saved"), or clear unsaved-changes indicators and a prompt before
  leaving.
- Hide technical details (file extensions, IDs) unless asked; preview files
  even when you can't edit them; let people pick names and destinations
  when exporting.

## Sharing and collaboration

- A Share button in a consistent place; short plain-language summaries of
  who can see or edit; simple defaults (link, view-only/edit) with
  advanced options tucked away; show collaborators and presence once
  collaboration starts.

## Ratings and reviews

- Ask only after real engagement, never during a task, rarely (once per
  version at most), and accept "no" without nagging.

## Audio and video

- Never autoplay with sound; respect mute; don't change the device volume.
- Standard player controls (`<video controls>` or equivalent with keyboard
  support), original aspect ratio, captions/subtitles, and transcripts for
  long audio.
- Resume where people stopped; pause when interrupted (another tab plays,
  call), and don't auto-resume unless it's expected.
- Short sounds and vibration: see `motion-sound.md`.

## Printing

- Offer printing where people expect it (receipts, documents); a
  `@media print` stylesheet that hides navigation and prints content
  cleanly.

## AI-powered features

- Say where AI is used and what it can and can't do; set expectations
  before the first use.
- The feature should help, not take over: people stay in control, can
  refine, undo or regenerate, and the app still works without it.
- Ask before using personal data, explain how it's used and stored, prefer
  models and providers that protect privacy.
- Guide inputs (examples, placeholders); warn that answers can be wrong;
  ask for confirmation before irreversible actions.
- Show progress during generation, offer alternatives, let people give
  feedback; test for harmful outputs and avoid reproducing copyrighted
  content.
- Personalization/suggestions: request explicit feedback rarely and make
  it optional; act on it immediately; let people see and remove what was
  learned; don't trap people in a filter bubble; avoid showing sensitive
  suggestions; when wrong, make correction easy and immediately useful;
  present confidence in plain terms, and hide low-confidence results.
