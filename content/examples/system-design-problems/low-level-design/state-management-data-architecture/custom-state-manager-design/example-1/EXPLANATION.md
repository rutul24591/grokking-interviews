# Custom State Manager — Basic Implementation

## Architecture

```
┌──────────────────────────────────────────┐
│            createStore(initialState)      │
│                                          │
│  getState()  → returns current state     │
│  setState(partial) → merge & notify      │
│  subscribe(selector, listener)           │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   Subscriptions:                   │  │
│  │   - { selector, listener, cache }  │  │
│  │   - { selector, listener, cache }  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
         ▲                    │
         │                    ▼
   setState           notify subscribers
```

## Key Design Decisions

1. **Observer Pattern with Selectors** - Subscribers provide a selector function that extracts their slice; notification only fires when the selected value changes (Object.is)
2. **Shallow Merge** - setState performs shallow merge for predictable O(1) updates; engineers explicitly spread nested objects
3. **Unsubscribe Function** - subscribe returns a cleanup function for memory leak prevention
4. **No External Dependencies** - Pure TypeScript implementation, ~80 lines for core

## File Structure

- `lib/store-core.ts` — createStore factory with getState, setState, subscribe
- `hooks/useMyStore.ts` — React integration hook with useSyncExternalStore
- `components/counter-demo.tsx` — Demo component using the custom store
- `components/todo-list.tsx` — More complex demo showing multiple subscribers

## Testing Strategy

- Unit: getState, setState, subscribe/unsubscribe, selector filtering
- Integration: React hook re-renders on selected changes only
- Performance: 1000 subscribers, 1000 updates/sec measurement
