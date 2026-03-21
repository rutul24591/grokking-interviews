This is a runnable “Docs Quality Gate” demo:

- A small set of markdown docs stored in `docs/`.
- A server-side linter that enforces:
  - required sections (Overview, Runbook, Ownership)
  - freshness (lastUpdated in frontmatter)
  - presence of runnable commands
- A Node agent that runs the gate like CI and exits non-zero on failures.

Production mapping:
- Treat docs like code: schema, linting, and release gates.
- Keep runbooks and ownership explicit to improve on-call outcomes.

