# Fast & Slow Pointers — Cycle Detection Workbench

Implements Floyd’s cycle detection on a linked list — the core fast/slow pointer pattern.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/fast-slow-pointers/example-1/app.js`

## What to Verify
- fast advances 2 steps, slow advances 1 step
- meeting implies a cycle; reaching null implies acyclic
- uses O(1) extra memory
