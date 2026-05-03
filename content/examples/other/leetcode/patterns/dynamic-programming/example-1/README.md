# Dynamic Programming — Tabulation Workbench

Implements bottom-up DP tabulation for coin change (min coins) to show table fill order and subproblem reuse.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/dynamic-programming/example-1/app.js`

## What to Verify
- dp[0]=0 base case anchors the recurrence
- fill order ensures dp[a-coin] is available when computing dp[a]
- returns -1 when no solution exists
