# Basic State Boundary Implementation — Walkthrough

## Architecture

```
┌─────────────────────────────────────────┐
│              App Shell                   │
├──────────────┬──────────────────────────┤
│ ThemeContext │ GlobalStore (Zustand)    │
│ (Context)    │ - notifications          │
│              │ - app settings           │
├──────────────┴──────────────────────────┤
│  LocalCounter   │   UserForm            │
│  (useState)     │   (useState)          │
└─────────────────┴───────────────────────┘
```

## Key Design Decisions

1. **Local State for Component Concerns** - Counter and form inputs use useState because they are consumed only by their owning component
2. **Context API for Theme** - Theme is consumed by many components in the subtree but changes infrequently, making Context ideal
3. **Zustand for Global Notifications** - Notifications can be triggered from anywhere and displayed globally, requiring app-wide access

## File Structure

- `components/local-counter.tsx` — Counter using useState (local state example)
- `components/user-form.tsx` — Form using useState for input tracking
- `contexts/theme-context.tsx` — Theme provider with read/write split
- `stores/globalStore.ts` — Zustand store for notifications and app settings
- `hooks/useGlobalStore.ts` — Typed selector hooks for global store

## Testing Strategy

- Unit: Counter increment/decrement, form input changes
- Integration: Theme context propagation to consumers
- Store: Notification creation, dismissal, and selector isolation
