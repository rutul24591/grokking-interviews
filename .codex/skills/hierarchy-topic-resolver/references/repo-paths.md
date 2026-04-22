# Repo Path Notes

Use these rules when resolving article locations in this repository.

## Sources of truth

- `concepts/hierarchy-data.txt` determines which topics belong to which sub-category.
- `AGENTS.md` defines the article workflow and constraints.
- Existing article files under `content/` show the current path and slug conventions.

## Resolution steps

1. Find the requested sub-category in `concepts/hierarchy-data.txt`.
2. Confirm the topic exists under that sub-category.
3. Search `content/` for an existing TSX article for that topic.
4. If none exists, return the most likely target path based on sibling files in the same sub-category.

## Search hints

- Prefer `rg --files content`
- Prefer `rg -n "<topic text>|<slug text>" content`
- Compare against sibling article names before proposing a new slug

## Expected handoff shape

Use a consistent summary that downstream work can reuse:

```text
Domain:
Category:
Sub-category:
Topic:
Existing article:
Expected article path:
Sibling references:
Ambiguities:
```
