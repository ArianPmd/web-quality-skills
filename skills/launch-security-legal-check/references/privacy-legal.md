# Privacy & legal checklist (EU / GDPR focus)

General information, not legal advice. Other regions (UK, US states, Brazil,
…) have their own rules — flag them if the app targets those users.

## Map the data first

Make a table before reading the policy:

| Data | Where it comes from | Where it is stored (server / device) | Who else receives it | Why (purpose) | Legal basis | How long |
|---|---|---|---|---|---|---|

Include things people forget: IP addresses (every request; logs; geolocation
to pick a language), device info attached to feedback/bug reports, push
subscription endpoints, bot-protection challenges, sign-in provider profile
data, crash reports, analytics, and **everything kept on the device**
(local/session storage, IndexedDB, Cache API, cookies).

## Privacy policy — must contain
- `[M]` Who is responsible (controller) and how to contact them.
- `[M]` Each category of data, the purpose, and the legal basis (Art. 6(1)
  (a) consent, (b) contract, (f) legitimate interest — say which interest).
- `[M]` Every processor / recipient (hosting, database, e-mail, push
  services, sign-in providers, bot protection, analytics) and **transfers
  outside the EU** with their safeguard (adequacy decision / Data Privacy
  Framework, standard contractual clauses).
- `[M]` Retention periods (or the criteria).
- `[M]` The person's rights (access, rectification, erasure, restriction,
  portability, objection, withdraw consent) and the right to complain to a
  supervisory authority.
- `[M]` What is stored on the device and why — matching the real list.
- `[M]` Whether there is automated decision-making / profiling (usually: no).
- `[S]` Last-updated date; visible marking of what changed; telling signed-in
  people when it changes.
- `[S]` Written in plain language, in every language the app offers.

## Consent & device storage (ePrivacy; in Germany § 25 TDDDG, formerly TTDSG)
- `[M]` Storage/cookies that are *strictly necessary* for a service the
  person asked for (session, chosen settings, security) need no consent but
  must be disclosed.
- `[M]` Anything else (analytics, ads, third-party embeds that set cookies or
  receive data on load, e.g. a social sign-in button that loads a script)
  needs prior opt-in consent: equal "Accept" and "Reject", no pre-ticked
  boxes, withdrawable as easily as given ("Cookie settings" link).
- `[M]` Optional features based on consent (push reminders, sending device
  info with feedback) have a clear switch, off/explained by default, and are
  described in the policy.
- `[S]` Permission pre-prompts explain the purpose before the browser asks.

## Terms of service — usually needed
- `[M]` What the service is, who may use it (minimum age), account rules,
  acceptable use, termination.
- `[S]` Virtual items/points: no monetary value, can be adjusted.
- `[S]` User content: ownership stays with the user; limited license to
  host/display it.
- `[S]` Liability limits as far as the applicable law allows; governing law.

## Imprint (Germany: Impressum, § 5 DDG)
- `[M]` For commercial or business-like sites aimed at Germany: name and
  postal address (no P.O. box), e-mail, and fast second contact channel;
  registration numbers / VAT ID where they exist. Reachable in two clicks
  from every page.
- `[S]` Personal projects may be exempt — but "business-like" is interpreted
  broadly; when unsure, publish one.

## Minors
- `[M]` If under-16s may use it (age varies by EU country), consent rules for
  children apply — or set a minimum age in the terms.

## Security of processing & breaches
- `[M]` Appropriate technical measures (see security.md) and a plan for
  breaches (72-hour notification to the authority when there is risk).
- `[S]` Data processing agreements (DPAs) signed / accepted with each
  processor.

## Location-based behavior
- `[S]` Using the IP's country (e.g. to pick a language) is processing —
  state it, the basis (legitimate interest), and that nothing is stored if
  that's the case.

## Changing the rules
- `[M]` When behavior changes what is collected or shared, update the policy
  in the same release.
- `[S]` Announce changes (date, short summary of what changed) in the app.
