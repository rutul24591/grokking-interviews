# Multi-Store Architecture — Basic Implementation

## Architecture

```
┌─────────────────────────────────────────────┐
│                CoreStore                     │
│        Auth User, Locale, Flags              │
└────────────┬─────────────────────┬──────────┘
             │ reads               │ reads
             ▼                     ▼
┌──────────────────┐   ┌─────────────────────┐
│   UserStore      │   │  DashboardStore      │
│   Profile, Prefs │   │  Widgets, Layout     │
└────────┬─────────┘   └──────────┬──────────┘
         │                        │
         │  user:updated          │  dashboard:refresh
         ▼                        ▼
┌─────────────────────────────────────────────┐
│              Event Bus                       │
│    Typed Events, Rate Limited               │
└─────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Independent Zustand Stores** - Each domain has its own create() call with no direct imports between stores
2. **CoreStore for Shared State** - Auth user, locale, and feature flags live in CoreStore, readable by all domains
3. **Event Bus for Cross-Store Communication** - Stores emit typed events instead of calling each other directly
4. **Rate Limiter** - Event bus has built-in rate limiting to prevent event flooding

## File Structure

- `stores/core-store.ts` — Shared kernel state (auth user, locale, feature flags)
- `stores/user-store.ts` — User profile and preferences
- `stores/dashboard-store.ts` — Dashboard widgets and layout
- `lib/event-bus.ts` — Typed event emitter with rate limiting
- `hooks/useStoreComposer.ts` — Compose data from multiple stores

## Testing Strategy

- Unit: Each store's actions and selectors in isolation
- Integration: Event emission and cross-store reaction
- Performance: Rate limiter throttling under load
