# LSM Trees — Tombstone and Stale-Read Checks

Covers deletes and stale segments because these are where LSM correctness bugs usually become visible.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/lsm-trees/example-3/demo.js`

## What to Verify
- deletes are represented as tombstones until compaction
- reads must prefer the newest version of a key
- old segments may still contain stale values physically
