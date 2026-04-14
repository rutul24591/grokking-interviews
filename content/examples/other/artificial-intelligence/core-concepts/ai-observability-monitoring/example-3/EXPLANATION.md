# Example 3: Cost Anomaly Detection for AI Systems

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `math`).

## What This Demonstrates

This example implements a cost anomaly detection system that uses statistical methods (z-score analysis on a rolling window) to identify unexpected spikes in AI API spending. It tracks per-request costs broken down by feature, user, and model, then automatically detects when individual request costs deviate significantly from the historical norm. This is critical for catching runaway loops, misconfigured prompts, or abuse that cause unexpected cost explosions.

## Code Walkthrough

### Key Data Structure

**`CostRecord`** — Represents a single AI API request with:
- `timestamp` — ISO 8601 timestamp
- `model` — Model name (e.g., `"gpt-4"`)
- `input_tokens` / `output_tokens` — Token counts
- `cost` — Dollar cost of the request
- `feature` — Which product feature generated the request
- `user_id` — Which user generated the request

### Key Class

**`CostAnomalyDetector`** — Detects cost anomalies using z-score analysis:

**`__init__`** — Configures two parameters:
- `window_size` (default 100) — Size of the rolling window for statistical calculations
- `z_threshold` (default 3.0) — Number of standard deviations above the mean that triggers an anomaly alert

**`add_record(record)`** — Appends a cost record and immediately checks whether it is anomalous via `_check_anomaly()`.

**`_get_rolling_stats(feature)`** — Calculates the mean and standard deviation of costs for a specific feature within the rolling window:
- Filters records to those matching the feature within the last `window_size` records.
- Requires at least 10 records to produce meaningful statistics.
- Returns mean, standard deviation, and count, all rounded to 6 decimal places.

**`_check_anomaly(record)`** — Determines whether a single cost record is anomalous:
1. Retrieves rolling statistics for the record's feature.
2. If insufficient data (std is 0 or fewer than 10 records), skips analysis.
3. Calculates the z-score: `(record.cost - mean) / std`.
4. If the z-score exceeds the threshold, creates an alert with timestamp, feature, model, user ID, cost, baseline statistics, z-score, and severity (`"HIGH"` for z-score > 5, `"MEDIUM"` otherwise).

**`get_summary()`** — Produces an aggregate cost report:
- Total records, total cost, and average cost per request.
- Per-feature breakdown showing total cost, request count, and average cost.
- Total anomaly count and the 5 most recent alerts.

### Execution Flow (from `main()`)

1. A `CostAnomalyDetector` is configured with a 100-record rolling window and a z-score threshold of 3.0.
2. **Normal behavior simulation:** 80 cost records are added for the `"customer_support"` feature with normal costs around $0.00975 (varying by +/- $0.005). These establish the baseline statistics.
3. **Anomaly simulation:** 5 cost records are added with 6x normal cost ($0.065) caused by much larger input (15,000 vs. 2,500 tokens) and output (2,000 vs. 350 tokens) from a single anomalous user.
4. `get_summary()` is called and the report is printed, showing total cost, per-feature costs, anomaly count, and details of each detected alert including z-scores.

## Key Takeaways

- **Z-score detection is effective for anomaly identification** — Using statistical deviation rather than absolute thresholds adapts to the normal cost profile of each feature, catching anomalies that would be missed by fixed dollar limits.
- **Per-feature analysis isolates root causes** — Tracking costs by feature means that an anomaly in one feature does not mask or trigger false positives in another, and the alert directly identifies which feature is problematic.
- **Rolling windows balance sensitivity and stability** — A 100-record window provides enough data for stable statistics while still being responsive to recent changes in cost patterns.
- **Severity classification enables prioritization** — Distinguishing between MEDIUM (z > 3) and HIGH (z > 5) severity helps teams prioritize which anomalies to investigate first.
- **Cost tracking must be per-request** — Aggregate daily or monthly cost totals cannot identify which specific request or user caused a cost spike; per-request tracking with feature and user attribution is essential for rapid incident response.
