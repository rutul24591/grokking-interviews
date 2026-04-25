# Hash Tables — Collision Stress Follow-Up

Forces collisions so the follow-up makes the bucket-chain trade-off visible instead of assuming a perfect hash.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hash-tables/example-2/demo.js`

## What to Verify
- multiple keys can occupy the same bucket without data loss
- collision-heavy workloads degrade toward linear bucket scans
- observability into bucket state helps detect poor key distribution
