# Plug-In Quality Monitoring and Anomaly Detection

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `datetime`, `collections`).

## What This Demonstrates

This example implements a quality monitoring system for plug-in execution that tracks call frequency, error rates, and latency per plug-in, detects anomalous behavior (high error rates, excessive latency, zero usage), and generates comprehensive quality reports for operational oversight.

## Code Walkthrough

### Key Classes

- **`ToolCallRecord`** (dataclass): Represents a single tool call event with `plugin_id`, `tool_name`, `timestamp`, `success` boolean, `latency_ms`, and optional `error` message.
- **`PluginMonitor`**: The core monitoring class that collects call records, computes per-plug-in statistics, detects anomalies, and generates quality reports.

### Key Methods

1. **`record_call(record)`**: Appends a tool call record to the monitor's event log.
2. **`get_plugin_stats()`**: Aggregates call records by plug-in to compute:
   - Total call count.
   - Error rate (errors / total calls).
   - Average latency in milliseconds.
   - Unique tools used and list of tool names.
3. **`detect_anomalies()`**: Identifies problematic plug-in behavior using three thresholds:
   - **High error rate** (> 20%): Triggers investigation into tool implementation or description clarity.
   - **High latency** (> 5000ms): Suggests the need for optimization or timeout configuration.
   - **Zero usage**: Indicates the LLM may not understand when to use the tool (poor descriptions or discovery).
4. **`get_quality_report()`**: Combines plugin statistics and anomaly detection into a comprehensive report.

### Execution Flow

1. **`main()`** creates a monitor and records nine simulated tool call events across three plug-ins (GitHub, Database, Web-Search).
2. The simulated data includes:
   - GitHub: 3 calls (2 success, 1 error from API timeout).
   - Database: 3 calls (2 success, 1 error from table not found).
   - Web-Search: 3 calls (all failures from rate limiting and timeouts, with high latency).
3. A quality report is generated showing per-plug-in statistics (call count, error rate, avg latency, tools used).
4. Anomaly detection identifies the Web-Search plug-in as having both a high error rate (100%) and high latency (averaging 6167ms).

### Important Variables

- `anomaly_thresholds`: Configuration dictionary with three thresholds:
  - `error_rate = 0.2` (20% error rate triggers anomaly).
  - `avg_latency_ms = 5000` (5 seconds triggers anomaly).
  - `zero_usage_days = 7` (7 days without usage triggers review -- not used in this demo).
- `self.records`: Append-only log of all tool call events.
- Per-plug-in stats computed dynamically from raw call records.

## Key Takeaways

- Quality monitoring is essential for plug-in ecosystems -- individual plug-in failures can degrade the overall AI system's reliability without proper observability.
- Anomaly detection thresholds (error rate, latency) should be tunable per plug-in based on its criticality and expected behavior.
- Zero-usage detection identifies tools that the LLM never calls, which typically indicates poor tool descriptions or inadequate discovery in the agent's tool selection logic.
- High latency detection helps identify plug-ins that need optimization -- slow tools block the agent's reasoning loop and degrade user experience.
- Production monitoring systems integrate with alerting platforms (PagerDuty, Slack alerts), track trends over time (not just point-in-time), and provide dashboards for operational teams.
