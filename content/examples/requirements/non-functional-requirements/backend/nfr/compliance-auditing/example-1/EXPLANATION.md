# What this example covers

Compliance auditing is about answering, reliably:

> Who did what, to which resource, when, and from where — and can we prove it wasn’t tampered with?

This example implements:

- **Append-only audit events** with a **hash chain** (`prevHash` → `hash`) for tamper evidence.
- **PII minimization**: we store a stable **email hash** instead of raw email.
- **Query + verification endpoints** so operators can export and verify integrity.

## What you’d do in production

- Persist events to an **append-only** store (WORM object storage, immutable table, or event log).
- Sign batches with **KMS-managed keys**; rotate keys and store key ids (`kid`).
- Include strong identity context: actor id, authn method, IP, user agent, request id, tenant id.
- Integrate with SIEM (Splunk/ELK/Datadog) for alerting and long-term retention.

