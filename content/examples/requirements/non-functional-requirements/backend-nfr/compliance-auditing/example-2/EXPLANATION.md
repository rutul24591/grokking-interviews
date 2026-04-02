# Focus

Audit logs are frequently over-collected and become a liability.

This example shows a practical pattern:

- Hash raw identifiers (like email) into a stable, queryable token.
- Store *only* what you need for investigations and compliance evidence.
- Avoid raw PII unless you have a strong need, explicit policy, and data minimization controls.

