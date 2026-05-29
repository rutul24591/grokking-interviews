# ETL Pipeline Monitoring UI - Example 1

This example supports the HLD article for `etl-pipeline-monitoring-ui` in `data-import-export-systems`.

## What it demonstrates

This is a runnable readiness smoke test for the data movement workflow. It is intentionally small, but it uses topic-specific invariants, telemetry, and failure modes rather than a reusable stub.

## Run or inspect

`node --import tsx content/examples/system-design-problems/high-level-design/data-import-export-systems/etl-pipeline-monitoring-ui/example-1/app.ts`

## Files

- `app.ts` - topic-aligned implementation slice
- `EXPLANATION.md` - how the example maps back to the article
