This is a runnable “A11y Audit Console” demo that models how accessibility automation is done in production:

- A **catalog of UI variants** (some intentionally broken) represents real regressions.
- A server-side audit endpoint runs **axe** against the rendered HTML using **jsdom**, producing a structured report.
- A baseline (“known issues”) can be captured, then later runs can enforce a **no-regression budget**.
- A Node **agent** simulates a CI job: audits all variants and exits non-zero if the budget is exceeded.

Key production ideas:
1) **Automation, not one-off fixes**: treat accessibility as a measurable, testable contract.
2) **Budgets and baselines**: allow existing debt, but prevent it from growing (common in large legacy UIs).
3) **Actionable output**: report includes rule IDs and failure details that can be wired to SARIF/PR annotations.

