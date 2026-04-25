# Stacks — Underflow and Minimum Tracking

Covers stack underflow and a min-stack extension so correctness checks are not limited to the happy path.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/stacks/example-3/demo.js`

## What to Verify
- underflow throws instead of returning corrupted state
- minimum tracking stays in sync across pops
- duplicate minima do not disappear early
