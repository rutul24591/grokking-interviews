# Spreadsheet-like Grid — Full Implementation (Core Model)

Example 1 implements a spreadsheet-like grid core:

- Cell addressing (`A1`, `B2`), row/col coordinate helpers
- Cell edit sessions (commit/cancel)
- Formula evaluation (small safe subset) with dependency tracking
- Undo/redo command stack model
- Copy/paste model hooks (data-only; renderer-agnostic)

Interview focus:
- Treating the grid as a state machine (idle/editing/selecting).
- Avoiding recompute storms: dependency graph + topological evaluation.
- Handling circular references.

