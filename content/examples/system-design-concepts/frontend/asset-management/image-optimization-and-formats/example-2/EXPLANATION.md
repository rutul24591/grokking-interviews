# Example 2 — `srcset`/`sizes` generation (focused)

The most common real-world bug is **overserving images**:

- you generate widths, but `sizes` is wrong
- the browser picks a much larger variant than needed
- bandwidth and LCP regress

This example provides a small helper to generate `srcset` and demonstrates why `sizes` must reflect layout.

