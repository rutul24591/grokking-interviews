Conflicts are a UX problem, not just a data problem.

This example shows:
- optimistic edits against a versioned document,
- a `409 conflict` response that includes the latest server state,
- user-visible resolution paths: “use server”, “force overwrite”, and “merge + force”.

Production notes:
- Prefer merges for collaborative content.
- Add audit trails and per-field resolution when correctness matters.
- Avoid silent overwrites; always show the user what they’re overwriting.

