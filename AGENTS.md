# Instructions for AI coding assistants

This repository holds five skills: two entry points (build, audit) and three topic skills they use. Each is a folder under `skills/` with a
`SKILL.md` (when to use it and the workflow) and `references/` (checklists).
Some have `scripts/` (Node 18+, no dependencies).

When the user's request matches one, read its `SKILL.md` first and follow it:

| Request | Skill |
|---|---|
| An idea for a new site/app, "build me…" | `skills/build-web-app/SKILL.md` |
| Check / audit an existing site or app (everything, security first) | `skills/audit-web-app/SKILL.md` |
| Design or restyle UI, a clean "native app" look | `skills/native-feel-ui/SKILL.md` |
| Review / audit / QA a front end for UI problems | `skills/web-ui-pitfalls/SKILL.md` |
| Security review, pre-launch check, GDPR / privacy / cookies / licenses | `skills/launch-security-legal-check/SKILL.md` |

Audits produce a to-do list split into **Must** and **Should**, with file
locations and fixes. Don't change code or legal text unless asked.
