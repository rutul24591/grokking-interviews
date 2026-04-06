# Resizable Split Pane — Implementation Walkthrough

## Architecture

```
┌─────────────────────────────────────────┐
│            SplitPane                     │
├───────────────────┬─────────────────────┤
│   Pane 1          │   Pane 2            │
│   (flex-basis)    │   (flex-basis)      │
│                   │                     │
└───────────────────┴─────────────────────┘
         ▲
    Pane Divider
  (draggable handle)
```

## Key Design Decisions

1. **Pointer Events** for unified mouse/touch support
2. **CSS custom properties** during drag to avoid React re-renders
3. **Factory pattern** for Zustand stores (one per SplitPane instance)
4. **ResizeObserver** for container size tracking
5. **localStorage persistence** with debounced writes

## File Structure

- `lib/split-pane-types.ts` — TypeScript interfaces
- `lib/split-pane-store.ts` — Zustand store factory
- `lib/pane-size-calculator.ts` — Pure functions for clamping and flex basis
- `lib/pointer-drag-handler.ts` — Pointer event lifecycle management
- `hooks/use-split-pane.ts` — Main orchestrator hook
- `components/split-pane.tsx` — Root container with all logic composed

## Testing Strategy

- Unit: clampPosition, computeFlexBasis with various bounds
- Integration: drag resize, keyboard resize, persistence save/restore
- Accessibility: axe-core on divider, keyboard navigation
