# Compliance extras

General information, not legal advice. Check what applies before launch;
mark the rest "not applicable" in the report.

## Documents to keep (GDPR accountability)

- `[M]` **Record of processing activities (ROPA, Art. 30):** a table of
  each processing purpose — data categories, people affected, recipients,
  transfers outside the EU, retention, security measures. Small
  organisations are partly exempt, but regular processing of user data
  usually is not; keeping one is cheap and it is the first thing an
  authority asks for. The data map from privacy-legal.md is a good start.
- `[M]` **Data processing agreement (DPA, Art. 28)** with every processor
  (hosting, database, e-mail, analytics, error tracking, push). Most
  providers offer one to accept in their dashboard — accept it and file a
  copy.
- `[M]` **Breach response plan:** who decides, how to assess risk, the
  72-hour notification to the supervisory authority, when to tell affected
  people, and a breach log (kept even for breaches you don't report).
- `[S]` **Data protection impact assessment (DPIA)** if the processing is
  high-risk (health data, large-scale monitoring, profiling with effects).
- `[S]` A data protection officer is required only in specific cases
  (core activity is large-scale monitoring or special-category data) —
  note why you don't need one.

## E-mail sending

- `[M]` **Domain authentication:** SPF, DKIM and a DMARC record (start with
  `p=none` plus reporting, then tighten). Without them mail lands in spam,
  and large mailbox providers reject bulk mail.
- `[M]` Transactional mail (sign-up codes, password resets) only to the
  account's own address; no marketing inside it without consent.
- `[M]` Marketing / newsletters: opt-in (double opt-in recommended in the
  EU), an unsubscribe link in every message, and one-click unsubscribe
  headers (`List-Unsubscribe`, `List-Unsubscribe-Post`) for bulk senders.
- `[S]` A real reply-to or a clear "no-reply" with another contact path;
  sender name = the product.
- `[S]` Bounce and complaint handling; stop sending to hard-bounced
  addresses.
- `[S]` The e-mail provider is listed as a processor in the privacy policy.

## Payments, subscriptions, consumer law (EU)

- `[M]` **Price display:** total price including VAT for consumers; what
  recurs and how often.
- `[M]` **Right of withdrawal (14 days)** for online consumer contracts.
  For digital content/services delivered immediately, the person must
  expressly agree to start right away and acknowledge losing the right —
  otherwise they can withdraw.
- `[M]` **Cancellation as easy as sign-up:** in Germany a visible
  "cancel contract" button (Kündigungsbutton) for online subscriptions.
- `[M]` Order button labelled clearly (e.g. "Buy now" / "Order with
  obligation to pay").
- `[M]` Invoices with the legally required details; VAT rules for digital
  services to consumers in other EU countries (One-Stop Shop) — or use a
  merchant-of-record provider that handles this.
- `[S]` Never handle card numbers yourself — use the payment provider's
  hosted fields/checkout (keeps you out of most PCI DSS scope).
- `[S]` Terms cover refunds, subscription renewal and price changes.

## App stores (if the web app is also published as a store app)

- `[M]` **Apple App Store:** the privacy "nutrition label" (App Privacy
  details) must match the policy; account deletion must be possible inside
  the app; Sign in with Apple required if you offer other third-party
  sign-ins (with exceptions); digital goods sold in-app go through Apple's
  in-app purchase in most regions.
- `[M]` **Google Play:** the Data safety form must match the policy; an
  account-deletion web link; target API level requirements; Play Billing
  for digital goods in most regions.
- `[S]` A support URL and privacy policy URL that stay reachable.
- `[S]` Store age rating questionnaire answered honestly.

## Other regions (flag if you have users there)

- **UK:** UK GDPR + PECR — very close to the EU rules; separate
  representative may be needed if you have no UK establishment.
- **California (CCPA/CPRA):** notice at collection, right to know/delete/
  correct, "Do Not Sell or Share My Personal Information" if you sell or
  share data for cross-context advertising; honor Global Privacy Control.
  Applies above revenue/volume thresholds, but the notice is good practice.
- **Other US states** (Virginia, Colorado, Connecticut, Texas, …): similar
  rights with their own thresholds.
- **Brazil (LGPD), Canada (PIPEDA / Quebec Law 25), Switzerland (revDSG),
  Turkey (KVKK), …:** similar principles, local details differ.
- **Children:** US COPPA (under 13) — avoid collecting data from children
  or get verifiable parental consent.

## Accessibility as a legal requirement

- `[M]` **European Accessibility Act (EAA):** since 28 June 2025, many
  consumer-facing digital services in the EU (e-commerce, banking,
  e-books, transport, communications) must meet accessibility
  requirements (in practice WCAG 2.1 AA / EN 301 549) and publish an
  accessibility statement. Micro-enterprises (<10 staff and ≤ €2M
  turnover/balance) are exempt for services. Check whether the product is
  in scope.
- `[S]` Even when not in scope: an accessibility statement and a way to
  report barriers are good practice; public-sector sites have their own,
  stricter rules.

## Backups & recovery

- `[M]` Automatic database backups, kept for a stated period, stored
  separately from the main database (another region/provider).
- `[M]` **A restore has been tested** — a backup nobody has restored is a
  hope, not a backup. Note how long a restore takes (RTO) and how much
  data could be lost (RPO).
- `[M]` Free database tiers often have no backups or pause inactive
  projects — check the plan's limits.
- `[S]` Deleted accounts: backups age out within a stated time, and a
  restore doesn't resurrect deleted people (re-apply deletions).
- `[S]` Secrets, environment config and DNS records documented so the app
  can be rebuilt elsewhere.
