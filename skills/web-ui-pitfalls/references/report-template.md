# Report template

Use this shape. Keep each item to 2–4 lines. Group Must before Should;
inside each, most severe first.

```markdown
# UI audit — <project> (<date>)

Scope: <what was checked: code / build output / browser at 375px light+dark / languages>
Not checked: <what you couldn't, and why>

## Must fix (<n>)

1. **<Short problem name>** — `path/to/file.ext:line`
   What happens: <effect on people, on which platform/theme/language>.
   Fix: <concrete change>. <"unverified" if inferred, not observed>

## Should fix (<n>)

1. **<Short problem name>** — `path/to/file.ext:line`
   Why: <…>. Fix: <…>.

## Looks good
- <items from the catalog that were checked and are fine, one line each>
```

End by offering to fix the Must items (don't fix without being asked).
