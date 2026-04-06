# Spreadsheet-like Grid — Implementation

## Key Decisions
1. **Sparse Map cell storage** — O(1) cell lookup, efficient for sparse data
2. **Formula engine with dependency graph** — Topological sort for evaluation order, circular detection
3. **Command-pattern undo/redo** — Each edit records inverse command, capped at 1000
4. **Virtualized grid** — Only visible cells rendered, overscan buffer

## File Structure
- `lib/spreadsheet-types.ts` — Cell, Formula, Selection types
- `lib/cell-model.ts` — Sparse Map storage, cell value/formula/result
- `lib/formula-engine.ts` — Parser, dependency graph, topological evaluation, circular detection
- `lib/undo-manager.ts` — Command pattern, undo/redo stack
- `lib/clipboard.ts` — Copy/paste handler with range support
- `hooks/use-spreadsheet.ts` — Main grid hook
- `hooks/use-cell-editor.ts` — Per-cell editing state
- `components/spreadsheet.tsx` — Root grid with virtualization
- `components/cell.tsx` — Individual cell with edit/display modes
- `components/column-header.tsx` — Resizable column headers
- `components/row-header.tsx` — Row number gutter
- `components/formula-bar.tsx` — Active cell formula display/editing
- `EXPLANATION.md`

## Testing
- Unit: formula engine (parse/evaluate/circular), undo/redo, cell model
- Integration: edit cell → dependents recalculate, copy-paste range, undo restores value
- Performance: 1000×50 grid — virtualization, scroll at 60fps
