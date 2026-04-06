# Kanban Board — Implementation Walkthrough

## Architecture

```
┌───────────┬──────────────┬───────────┬──────────┐
│ Backlog   │ In Progress  │ Review    │ Done     │
├───────────┼──────────────┼───────────┼──────────┤
│ ┌───────┐ │ ┌──────────┐ │ ┌───────┐ │ ┌──────┐ │
│ │Task 1 │ │ │Task 3    │ │ │Task 5 │ │ │Task 2│ │
│ │ 🏷bug  │ │ │🏷feature │ │ │🏷bug  │ │ │🏷feat│ │
│ └───────┘ │ │ 👤Alice  │ │ └───────┘ │ └──────┘ │
│ ┌───────┐ │ └──────────┘ │ ┌───────┐ │          │
│ │Task 4 │ │ ┌──────────┐ │ │Task 6 │ │          │
│ │ 🏷docs │ │ │Task 7    │ │ │🏷test │ │          │
│ └───────┘ │ │ 👤Bob    │ │ └───────┘ │          │
│           │ └──────────┘ │           │          │
└───────────┴──────────────┴───────────┴──────────┘
     Drag cards between columns and reorder within
```

## Key Design Decisions

1. **Normalized store** — Cards Map for O(1) lookup, columns with ordered cardIds arrays
2. **Optimistic moves** — UI updates instantly, server confirms, rollback on failure
3. **Pointer Events drag** — Unified mouse/touch support, document-level listeners
4. **WebSocket real-time** — Concurrent moves with vector clock conflict resolution
5. **Keyboard navigation** — Arrow keys between cards/columns, Space to pick up, Enter to drop

## File Structure

- `lib/kanban-types.ts` — Card, Column, Swimlane, DragState types
- `lib/board-store.ts` — Zustand store with normalized data, optimistic moves
- `lib/conflict-resolver.ts` — Vector clock comparison, last-write-wins
- `hooks/use-kanban.ts` — Main board hook
- `hooks/use-card-drag.ts` — Pointer-based drag with column drop detection
- `components/kanban-board.tsx` — Root board with columns
- `components/kanban-column.tsx` — Column with card list, drop zone
- `components/kanban-card.tsx` — Card with drag handle, labels, assignee
- `EXPLANATION.md`

## Performance

- moveCard: O(n) column splice, O(1) card Map update
- Drop target: O(columns × cards) hit-testing, optimized with spatial index
- Virtualization for columns with 50+ cards

## Testing

- Unit: store (move/rollback), conflict resolver, drag handler
- Integration: drag between columns, real-time sync, keyboard navigation
- Accessibility: aria-live for card moves, keyboard drag flow
