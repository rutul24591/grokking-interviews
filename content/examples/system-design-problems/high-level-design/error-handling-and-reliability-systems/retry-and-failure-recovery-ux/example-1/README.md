# Retry AND Failure Recovery UX - Example 1

This example supports the HLD article for `retry-failure-recovery-ux` in `error-handling-reliability-systems`.

## What it demonstrates

This is a runnable readiness smoke test for the reliability and recovery surface. It is intentionally small, but it uses topic-specific invariants, telemetry, and failure modes rather than a reusable stub.

## Run or inspect

`node --import tsx content/examples/system-design-problems/high-level-design/error-handling-and-reliability-systems/retry-and-failure-recovery-ux/example-1/app.ts`

## Files

- `app.ts` - topic-aligned implementation slice
- `EXPLANATION.md` - how the example maps back to the article
