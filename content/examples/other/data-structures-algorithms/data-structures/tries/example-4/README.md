# Tries — Delete Word Follow-Up

Implements word deletion to cover the common follow-up where nodes must be pruned without breaking shared prefixes.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/tries/example-4/demo.js`

## What to Verify
- deleting one word does not remove nodes needed by other words
- unused nodes are pruned on the way back up
- the prefix subtree remains valid after deletions
