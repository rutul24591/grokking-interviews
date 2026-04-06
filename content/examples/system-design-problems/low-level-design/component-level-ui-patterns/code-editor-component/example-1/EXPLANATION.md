# Code Editor Component — Implementation Walkthrough

## Architecture

```
┌──────────────────────────────────────────────┐
│ [File.ts]                            [⚙️]    │
├──────┬───────────────────────────────────────┤
│ 1    │ const x = "hello"; // syntax colored   │
│ 2    │ function foo() {                       │
│ 3    │   return x + " world";                 │
│ 4    │ }                                      │
│      │                                        │
│      │ [cursor]                               │
│      │                                        │
└──────┴───────────────────────────────────────┘
 Line   Virtualized content with syntax highlighting
numbers
```

## Key Design Decisions

1. **CodeMirror 6 as base** — Modular, tree-shakeable (~50KB core), extensible via plugins
2. **Piece table document model** — O(1) insert/delete, efficient undo/redo
3. **Virtualized rendering** — Only visible lines rendered, total scroll height from line count × average height
4. **Lazy tokenization** — Only visible lines tokenized, cached per line, invalidated on edit
5. **IME support** — Composition events handled separately, tokenizer paused during composition

## File Structure

- `lib/editor-types.ts` — TypeScript interfaces
- `lib/document-model.ts` — Piece table for efficient insert/delete with undo/redo
- `lib/tokenizer.ts` — Lezer-based syntax highlighting, per-line caching
- `lib/bracket-matcher.ts` — Depth-counting bracket pair finder
- `hooks/use-editor.ts` — Main editor hook with CodeMirror integration
- `hooks/use-keymap.ts` — Keyboard shortcut handling (Ctrl+C/V/Z/F, etc.)
- `components/code-editor.tsx` — Root editor with gutter, content area, minimap
- `components/line-numbers.tsx` — Gutter with synced scroll
- `components/find-replace.tsx` — Search widget with regex support
- `EXPLANATION.md`

## Performance

- Virtualization: 20-30 lines rendered, 10-line overscan buffer
- Token cache: O(1) lookup per line, invalidate only edited line
- Canvas minimap: rendered as canvas, not DOM, updated incrementally

## Testing

- Unit: document model (insert/delete/undo/redo), tokenizer, bracket matcher
- Integration: type and highlight, virtual scroll, multi-cursor
- Accessibility: screen reader announces line/column, keyboard shortcuts
