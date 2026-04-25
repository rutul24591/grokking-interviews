# Tries — Duplicate Words and Empty Prefix Checks

Exercises duplicate inserts and empty-prefix behavior because these are common edge conditions in autocomplete services.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/tries/example-3/demo.js`

## What to Verify
- duplicate word inserts do not corrupt the trie
- an empty prefix can enumerate the whole dictionary
- missing prefixes should terminate early with no candidates
