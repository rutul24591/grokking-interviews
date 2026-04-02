This is a runnable “Privacy Gateway” demo:

- Data classification (PII vs non-PII) and purpose-based access.
- Field-level redaction based on purpose (support/billing/analytics).
- Audit logging for every access.
- DSAR delete flow that removes PII and leaves a tombstone.
- A Node agent validates that analytics cannot read PII and that deletes take effect.

