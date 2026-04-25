# LSM Trees — Write-Heavy Key-Value Store

Models an LSM-style store with a mutable memtable and immutable SSTable snapshots to show why writes stay fast.

## Files
- `lsm-store.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/lsm-trees/example-1/app.js`

## What to Verify
- recent writes land in the memtable first
- flush turns sorted memory state into immutable segments
- reads consult recent state before colder levels
