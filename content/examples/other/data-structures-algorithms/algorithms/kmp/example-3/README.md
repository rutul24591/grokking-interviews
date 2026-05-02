# Knuth–Morris–Pratt (KMP) — Edge Cases

Covers empty text, pattern longer than text, and non-ASCII characters.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/kmp/example-3/demo.js`

## What to Verify
- pattern longer than text returns -1
- empty text returns -1 unless pattern is empty
- Unicode strings still behave deterministically under code unit comparisons
