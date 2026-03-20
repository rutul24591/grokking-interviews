This example implements the “a11y budget” idea: compare a **baseline** accessibility report to a **current** report and fail if things regress.

In large products you almost always need this pattern:
- There is existing debt you can’t fix immediately.
- You still want to prevent new debt from creeping in.

This demo computes a weighted score and also reports per-rule deltas.

