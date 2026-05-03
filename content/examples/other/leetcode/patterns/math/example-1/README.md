# Math — GCD/LCM Workbench

Implements Euclid’s algorithm for gcd and derives lcm — common math primitives used in many Leetcode problems.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/math/example-1/app.js`

## What to Verify
- gcd handles negatives via abs()
- lcm uses gcd to avoid overflow patterns where possible
- gcd(a,0)=|a| behavior is correct
