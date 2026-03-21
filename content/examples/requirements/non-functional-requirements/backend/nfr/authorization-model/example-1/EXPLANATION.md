# Authorization model as a backend NFR

Authorization determines correctness and data safety. A production model typically combines:
- ABAC constraints (tenant/org boundary, classification),
- and RBAC rules (role capabilities),
- with explicit deny precedence and auditable policy changes.

This example returns a decision trace, which is essential for debugging “why was I denied?” issues.

