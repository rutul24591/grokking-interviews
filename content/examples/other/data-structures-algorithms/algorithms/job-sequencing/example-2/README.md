# Job Sequencing — Follow-Up: Disjoint Set Optimization

Explains the follow-up optimization: using union-find to find the next free slot in near O(1) amortized time.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/job-sequencing/example-2/demo.js`

## What to Verify
- union-find tracks the latest available slot
- reduces worst-case O(n^2) slot scanning
- useful when deadlines are large and jobs are many
