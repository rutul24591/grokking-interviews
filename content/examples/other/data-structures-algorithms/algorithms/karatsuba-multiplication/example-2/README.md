# Karatsuba Multiplication — Follow-Up: Threshold Tuning

Explains why real implementations switch to grade-school multiplication below a threshold to reduce overhead.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/karatsuba-multiplication/example-2/demo.js`

## What to Verify
- recursion overhead dominates for small inputs
- threshold tuning is hardware/runtime dependent
- big integer libraries use multiple algorithms by size range
