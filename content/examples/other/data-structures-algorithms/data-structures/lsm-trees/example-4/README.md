# LSM Trees — Write-Ahead Log Follow-Up

Models WAL replay to show how write-ahead logging pairs with memtables to survive crashes between flushes.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/lsm-trees/example-4/demo.js`

## What to Verify
- updates are appended to the log before being applied to memory
- replay reconstructs memtable state after a simulated crash
- flush boundary determines what must be replayed on restart
