# Focus

In the context of Compliance Auditing (compliance, auditing), this example provides a focused implementation of the concept below.

Audit systems often need **exports** (to cold storage / SIEM) that are:

- resumable (checkpointed)
- deduplicated (idempotent)
- ordered (or at least monotonic by cursor)

This example demonstrates a simple cursor-based exporter that can resume safely.

