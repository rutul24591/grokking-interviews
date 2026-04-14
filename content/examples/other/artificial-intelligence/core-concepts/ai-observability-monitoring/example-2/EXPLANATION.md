# Example 2: AI Quality Drift Detection

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `math`).

## What This Demonstrates

This example implements a quality drift detection system that monitors AI output quality over time by comparing recent performance against a historical baseline. It tracks four quality metrics (accuracy, helpfulness, safety, overall) and generates alerts when quality drops exceed configurable thresholds. This is essential for detecting quality degradation caused by model updates, data drift, prompt changes, or infrastructure issues in production AI systems.

## Code Walkthrough

### Key Data Structure

**`QualitySnapshot`** — Represents a point-in-time quality measurement with a timestamp and four float metrics (each 0.0 to 1.0):
- `accuracy` — How correct the AI's outputs are
- `helpfulness` — How useful the outputs are to users
- `safety` — How well the outputs adhere to safety guidelines
- `overall` — Aggregate quality score

### Key Class

**`QualityDriftDetector`** — Detects quality degradation by comparing recent performance against a historical baseline:

**`__init__`** — Configures four parameters:
- `baseline_window_hours` (default 168 = 1 week) — How far back to look for the baseline average
- `detection_window_hours` (default 24) — How recent data to compare against the baseline
- `alert_threshold` (default 0.05 = 5%) — Quality drop that triggers a warning
- `critical_threshold` (default 0.10 = 10%) — Quality drop that triggers a critical alert

**`add_snapshot(snapshot)`** — Appends a quality snapshot to the internal list. In production, snapshots would be generated periodically (e.g., hourly) from aggregated user feedback, automated evaluations, or human review scores.

**`_get_baseline_avg()`** — Filters snapshots within the baseline window and calculates the average of each metric. Returns zeros if no snapshots exist in the window.

**`_get_current_avg()`** — Filters snapshots within the detection window (most recent period) and calculates the average of each metric.

**`detect_drift()`** — The core detection method:
1. Calculates baseline and current averages for all four metrics.
2. Computes the delta (current minus baseline) for each metric.
3. For each metric with a negative delta exceeding the critical threshold, generates a `CRITICAL` alert with the action "Immediate investigation required."
4. For each metric with a negative delta exceeding the alert threshold but not the critical threshold, generates a `WARNING` alert with the action "Monitor closely, prepare rollback."
5. Returns a report containing baseline values, current values, deltas, alerts, and overall status (`"ALERT"` or `"OK"`).

### Execution Flow (from `main()`)

1. A `QualityDriftDetector` is configured with a 1-week baseline, 24-hour detection window, 3% alert threshold, and 6% critical threshold.
2. **Baseline generation:** 168 hourly snapshots are created spanning the past week, with stable quality values (accuracy ~0.92, helpfulness ~0.88, safety ~0.97, overall ~0.90) and minor variation.
3. **Recent generation:** 24 hourly snapshots are created for the most recent day, with progressively dropping quality simulated by an increasing `drop` factor.
4. `detect_drift()` is called, comparing the 24-hour average against the 1-week average.
5. Results are printed showing baseline, current, and delta for each metric, followed by any generated alerts with severity, delta values, and recommended actions.

## Key Takeaways

- **Drift detection catches quality degradation early** — Without automated drift detection, quality drops can persist for days or weeks before being noticed through user complaints.
- **Dual-window comparison is more robust than absolute thresholds** — Comparing recent performance against a recent baseline (rather than a fixed target) accounts for natural variation and adapts to gradual quality improvements over time.
- **Multi-metric tracking identifies specific failure modes** — A drop in accuracy suggests knowledge or reasoning issues, a drop in safety suggests guardrail failures, and a drop in helpfulness suggests relevance problems — each requiring different investigation paths.
- **Configurable thresholds enable tuning** — Different systems have different quality baselines; configurable alert and critical thresholds allow teams to set appropriate sensitivity without excessive false positives.
- **Alerts drive action** — Each alert includes a recommended action (investigate immediately vs. monitor and prepare rollback), enabling automated response workflows in production systems.
