# Tries — Autocomplete Dictionary

Implements a trie to back prefix-based autocomplete over a small dictionary of search suggestions.

## Files
- `trie.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/tries/example-1/app.js`

## What to Verify
- common prefixes share nodes instead of duplicating storage
- prefix traversal reaches the candidate sub-tree directly
- autocomplete is faster than scanning every whole string
