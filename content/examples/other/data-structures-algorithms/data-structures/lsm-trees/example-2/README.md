# LSM Trees — Compaction Follow-Up

Adds a compaction pass because merge and cleanup behavior is the essential follow-up for LSM discussions.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/lsm-trees/example-2/demo.js`

## What to Verify
- newer SSTables shadow older values for the same key
- compaction rewrites data into fewer sorted runs
- read amplification falls as levels are merged
