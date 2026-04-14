# Example 3: AI Security Audit Log and Incident Tracker

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `enum`, `json`).

## What This Demonstrates

This example implements a comprehensive audit logging system for AI interactions that tracks every event in the pipeline — from input receipt through output generation — with severity classification, session-level traceability, and security reporting. It provides the observability foundation required for compliance (SOC 2, ISO 27001), incident response, and security forensics in production AI systems.

## Code Walkthrough

### Key Enumerations

**`EventType`** — Nine distinct event types covering the full AI pipeline lifecycle:
- `INPUT_RECEIVED`, `PROMPT_BUILT`, `MODEL_CALLED`, `OUTPUT_GENERATED` — Normal pipeline stages
- `INJECTION_DETECTED`, `OUTPUT_BLOCKED` — Security events
- `PERMISSION_DENIED` — Access control violations
- `TOOL_CALL_MADE` — External tool/API invocations
- `ERROR_OCCURRED` — System errors

**`Severity`** — Four-level severity scale: `INFO`, `WARNING`, `HIGH`, `CRITICAL`.

### Key Classes

**`AuditEntry`** — A dataclass representing a single log entry with timestamp (ISO 8601), event type, severity, session ID, user ID, details dictionary, and optional metadata dictionary.

**`AuditLogger`** — The core audit logging manager:

**`__init__`** — Initializes an empty entries list and alert thresholds configured per severity level:
- `CRITICAL`: alert after 1 event (immediate alerting)
- `HIGH`: alert after 5 events within 1 hour
- `WARNING`: alert after 20 events within 1 hour

**`log(event_type, severity, session_id, user_id, details)`** — Creates an `AuditEntry` with the current timestamp and appends it to the entries list. In production, this would write to a persistent store (database, log aggregation service).

**`get_session_trace(session_id)`** — Returns the complete chronological audit trail for a specific session as a list of dictionaries, each containing timestamp, event name, severity, and details. This is the primary debugging tool for understanding what happened during a specific user interaction.

**`get_security_report(hours=24)`** — Generates an aggregate security report containing:
- Total event count
- Events broken down by severity level
- Events broken down by type
- Up to the 10 most recent critical/high severity events with timestamps, user IDs, and details

### Execution Flow (from `main()`)

1. An `AuditLogger` instance is created.
2. Seven events are logged across three sessions (`sess-1`, `sess-2`, `sess-3`), simulating a realistic mix of normal operations and security incidents:
   - `sess-1`: Normal RAG pipeline execution (input, prompt, model call, output)
   - `sess-2`: Injection detection followed by output blocking
   - `sess-3`: Critical permission denial (user attempted to read admin database)
3. A security report is generated and printed, showing event counts by severity and type, plus details of critical/high events.
4. A session trace for `sess-1` demonstrates the chronological audit trail for a single session.

## Key Takeaways

- **Every AI interaction must be auditable** — Complete audit trails are required for security compliance, incident investigation, and understanding system behavior over time.
- **Session-level correlation is critical** — Grouping events by session ID enables reconstructing the full story of what happened during a specific user interaction, which is essential for debugging and forensics.
- **Severity-based alerting thresholds prevent alert fatigue** — Different thresholds for different severity levels (immediate for critical, aggregated for warnings) ensure that security teams focus on what matters.
- **Event type granularity enables targeted analysis** — Distinguishing between injection detection, output blocking, and permission denied events allows security teams to run targeted queries and build specific dashboards.
- **Production systems need persistent storage** — The in-memory list in this example must be replaced with a database or log aggregation service (e.g., ELK stack, Datadog) that supports retention policies, search, and alerting.
