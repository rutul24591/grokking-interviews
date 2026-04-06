# Dashboard Builder — Implementation Walkthrough

## Architecture

```
┌─────────────────────────────────────────────────┐
│ [+ Add Widget]  [Save Layout]  [Reset]          │
├──────────────┬──────────────────┬───────────────┤
│ ╔══════════╗ │ ╔══════════════╗ │ ╔═══════════╗ │
│ ║ Line     ║ │ ║ Metric Card  ║ │ ║ Bar Chart ║ │
│ ║ Chart    ║ │ ║ 1,234 ↑ 12%  ║ │ ║           ║ │
│ ║          ║ │ ╚══════════════╝ │ ║           ║ │
│ ╚══════════╝ │ ╔══════════════╗ │ ╚═══════════╝ │
│              │ ║ Data Table   ║ │               │
│ ╔══════════╗ │ ║ ┌──┬──┬──┐  ║ │ ╔═══════════╗ │
│ ║ Pie      ║ │ ║ │A │B │C │  ║ │ ║ Metric    ║ │
│ ║ Chart    ║ │ ║ ├──┼──┼──┤  ║ │ ║ Card      ║ │
│ ╚══════════╝ │ ╚══════════════╝ │ ╚═══════════╝ │
└──────────────┴──────────────────┴───────────────┘
        12-column responsive grid
```

## Key Design Decisions

1. **12-column CSS Grid** — Flexible layout, widgets span 1-12 columns
2. **Normalized widget store** — Map-based lookup, layout is array of widget configs
3. **IntersectionObserver lazy loading** — Widget data fetched only when visible
4. **Drag with grid snapping** — Pointer Events snap to grid units, collision resolution
5. **Persistence** — Layout serialized to JSON, saved to server, restored on load

## File Structure

- `lib/dashboard-types.ts` — TypeScript interfaces
- `lib/dashboard-store.ts` — Zustand store with widget CRUD, layout save/load
- `lib/grid-layout-engine.ts` — Grid positioning, collision detection, snap-to-grid
- `hooks/use-widget.ts` — Per-widget hook with lazy loading via IntersectionObserver
- `hooks/use-dashboard.ts` — Main orchestrator hook
- `components/dashboard.tsx` — Root dashboard with grid layout
- `components/widget-frame.tsx` — Widget container with lazy loading, error state
- `components/widget-catalog.tsx` — Browse and add widgets
- `EXPLANATION.md`

## Performance

- Collision resolution: O(n) with spatial index optimization
- Lazy loading: only visible widgets fetch data
- Widget memoization: React.memo per widget, re-render only on config change

## Testing

- Unit: grid engine, store CRUD, collision resolution
- Integration: drag/resize, layout persistence, lazy loading
- Accessibility: keyboard navigation, ARIA grid roles
