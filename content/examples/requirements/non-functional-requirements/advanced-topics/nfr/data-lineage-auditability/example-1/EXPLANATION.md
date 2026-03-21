This is a runnable “Lineage Ledger” demo that models **data lineage + auditability** in a production-shaped way:

- Every transformation appends an event to an **append-only ledger** with a **hash chain** (tamper-evident).
- A simple pipeline creates derived datasets and records lineage edges (raw → sanitized → aggregated).
- The UI shows the lineage graph, recent ledger events, and verification status.
- A Node agent runs the job and exports an “evidence bundle” (what you attach to audits / compliance tickets).

Key trade-offs you can discuss in interviews:
1) **Event-sourced audit log** vs mutable tables: append-only is easier to audit and safer to replicate.
2) **Tamper evidence** (hash chain) vs tamper resistance (HSM / WORM storage): the latter costs more.
3) **Granularity**: dataset-level lineage is cheap; column/field-level lineage is more expensive but more useful.

