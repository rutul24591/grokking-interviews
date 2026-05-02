# Divide and Conquer Fundamentals — Follow-Up: When Not to Use D&C

Explains trade-offs: sometimes a linear DP (Kadane’s) beats D&C due to lower constants and simpler implementation.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/divide-and-conquer/example-2/demo.js`

## What to Verify
- linear alternatives can exist with better asymptotics
- recursion overhead matters in hot paths
- choose D&C when the combine step is natural and parallelizable
