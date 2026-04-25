# Stacks — Undo and Redo Workbench

Uses two stacks to back an editor-style undo and redo workflow, which is the production pattern most engineers recognize immediately.

## Files
- `stack.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/stacks/example-1/app.js`

## What to Verify
- push and pop obey strict LIFO ordering
- redo history clears when a fresh mutation arrives
- state reconstruction is deterministic from stack history
