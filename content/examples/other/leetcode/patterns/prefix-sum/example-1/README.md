# Prefix Sum — Implementation Workbench

Builds a prefix sum array to answer range sum queries in O(1) after O(n) preprocessing.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/prefix-sum/example-1/app.js`

## What to Verify
- prefix array is length n+1 with prefix[0]=0
- range sum is computed by subtraction
- multiple queries avoid repeated scanning
