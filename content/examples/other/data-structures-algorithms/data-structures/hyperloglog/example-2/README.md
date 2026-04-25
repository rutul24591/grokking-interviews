# HyperLogLog — Shard Merge Follow-Up

Shows the follow-up property that makes HyperLogLog operationally useful: independent sketches can be merged register-wise.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hyperloglog/example-2/demo.js`

## What to Verify
- merge keeps the maximum register value per position
- partitioned counting avoids shipping raw identities
- merged estimates remain approximate but scalable
