# String — Edge Cases

Covers Unicode normalization pitfalls and empty string policies.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/string/example-3/demo.js`

## What to Verify
- empty strings are palindromes/anagrams by definition
- Unicode normalization (NFC/NFKC) can change matching results
- regex-based filters can differ across locales
