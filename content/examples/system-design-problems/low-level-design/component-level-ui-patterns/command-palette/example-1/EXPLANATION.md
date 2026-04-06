# Command Palette — Implementation Walkthrough

## Architecture

```
┌─────────────────────────────────────┐
│        CommandPalette (Portal)       │
├─────────────────────────────────────┤
│  [Search Input]                      │
├─────────────────────────────────────┤
│  Navigation                          │
│  ● Toggle Dark Theme         ⌘D      │
│  ● Go to Settings                    │
│  Actions                             │
│  ● Logout                            │
│  ● Copy Link                         │
└─────────────────────────────────────┘
```

## Key Design Decisions

1. **Command Registry** (Map-based) for O(1) lookup and plugin extensibility
2. **Fuzzy Matcher** with scoring tiers: exact > prefix > substring > fuzzy
3. **Zustand Store** for open/close state, query, results, recent commands
4. **Portal Rendering** to escape overflow and z-index constraints
5. **Debounced Query** (150ms) for async command fetching with AbortController

## File Structure

- `lib/command-palette-types.ts` — TypeScript interfaces
- `lib/command-registry.ts` — Singleton registry with plugin API
- `lib/fuzzy-matcher.ts` — Scoring algorithm with consecutive bonuses
- `lib/command-palette-store.ts` — Zustand store with LRU recent history
- `components/command-palette.tsx` — Portal-rendered UI with keyboard nav

## Testing

- Unit: fuzzyMatch scoring for exact, prefix, substring, fuzzy, non-match
- Integration: Cmd+K opens, typing filters, Enter executes, Escape closes
- Accessibility: axe-core, VoiceOver announcements, focus trap
