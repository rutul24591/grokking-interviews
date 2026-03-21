This example demonstrates two advanced, real-world needs in accessibility automation:

1) **Suppression**: occasionally you must silence false positives or known issues with strong justification.
2) **SARIF export**: many orgs ingest static analysis + a11y findings into one pipeline (GitHub code scanning, internal dashboards).

The demo takes an axe-like JSON input, applies suppressions, and emits a minimal SARIF v2.1.0 payload.

