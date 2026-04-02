This is a runnable “Incident Console” demo for **incident response & on-call readiness**:

- Ingest alerts with a **fingerprint** and **severity**.
- **Deduplicate/group** alerts into incidents (prevents paging storms).
- Support basic on-call workflows: **ack** and **resolve**, with a timeline of actions.
- A simple escalation rule (critical incidents that are not acked get escalated).
- A Node agent that generates an alert storm and checks that dedup reduces incident count.

