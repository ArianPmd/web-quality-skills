# Audit report template

```markdown
# Audit — <project> (<date>)

> Legal parts: general information, not legal advice (assumes <EU/GDPR …>).

**Scope:** code at <commit/branch>, scanners, <browser at 375px light/dark,
2nd language>, <URL headers if given>
**Not checked:** <what and why>
**Assumptions:** <users/regions, data, services>

## Summary
| | Must | Should |
|---|---|---|
| Security | <n> | <n> |
| Privacy & legal | <n> | <n> |
| UI/UX | <n> | <n> |
| Design | <n> | <n> |

Top 3 to do first: <1>, <2>, <3>

## Must fix before (re)launch

### Security
1. **<Title>** — `file:line` · effort S/M/L
   Risk: <what could happen, to whom>. Fix: <concrete step>. <unverified?>

### Privacy & legal
1. **<Title>** — <page or file> · effort
   Why: <…>. Fix: <…>.

### UI/UX
1. **<Title>** — `file:line` · effort
   What people see: <…>. Fix: <…>.

### Design
Overall: <one line>
1. **<Title>** — screen or `file:line` · effort
   Rule: <native-feel-ui file › section>. What people experience: <…>. Fix: <…>.

## Should fix
<same four groups, same item format>

## Data map
| Data | Source | Stored (server/device) | Shared with | Purpose | Legal basis | Retention |
|---|---|---|---|---|---|---|

## Looks good
- <checked and fine, one line each>
```

Close with: "Want me to fix the Must items? I'd do them as <n> small PRs:
<list>."
