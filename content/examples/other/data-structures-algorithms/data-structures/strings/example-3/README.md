# Strings — Unicode and Grapheme Edge Cases

Highlights the gap between code units and user-visible characters so edge cases are not ignored in multilingual systems.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/strings/example-3/demo.js`

## What to Verify
- string length can differ from grapheme count
- Array.from helps inspect code points more safely
- naive slicing can split visible characters unexpectedly
