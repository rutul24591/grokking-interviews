# Multi-Select / Tag Input — Implementation Walkthrough

## Overview

This is a production-ready multi-select / tag input component built with React 19+, TypeScript, and Zustand. It supports async suggestions, debounced search, result caching, tag creation, grouped options, keyboard navigation, max-selection limits, and full ARIA accessibility.

## Architecture

The system follows a three-layer architecture:

```
┌─────────────────────────────────────────────────┐
│                  UI Layer                       │
│  MultiSelect → TagPill, InputField,             │
│  SuggestionDropdown, SuggestionOption            │
├─────────────────────────────────────────────────┤
│               Orchestration Layer               │
│  useMultiSelect (debounce, paste, keyboard)     │
│  useSuggestions (fetch, cache, group, filter)   │
├─────────────────────────────────────────────────┤
│                State & Data Layer               │
│  Zustand Store (selected, input, highlight)      │
│  TagCache (LRU cache + custom tag tracking)     │
└─────────────────────────────────────────────────┘
```

## File Structure

```
example-1/
├── lib/
│   ├── multi-select-types.ts   # Type definitions: Tag, Suggestion, SelectState, MultiSelectConfig
│   ├── multi-select-store.ts   # Zustand store: selection state, actions, computed values
│   └── tag-cache.ts            # LRU cache for API responses + custom tag tracking
├── hooks/
│   ├── use-multi-select.ts     # Orchestration: debounce, paste, keyboard, add/remove
│   └── use-suggestions.ts      # Async fetch: AbortController, cache, grouping, filtering
└── components/
    ├── multi-select.tsx         # Root component: composes all sub-components
    ├── tag-pill.tsx             # Individual tag pill with avatar, label, remove button
    ├── suggestion-dropdown.tsx  # Dropdown with grouped options, loading/empty/error states
    ├── suggestion-option.tsx    # Individual option with highlight, selection indicator
    └── input-field.tsx          # Auto-resizing text input with ARIA attributes
```

## Key Design Decisions

### 1. Zustand for Selection State

The Zustand store manages selected tags, input value, dropdown open/closed state, keyboard highlight index, and loading state. Using Zustand (instead of useState) allows sibling components (TagPill, InputField, SuggestionDropdown) to subscribe only to the slices they need, preventing unnecessary re-renders.

### 2. AbortController for Stale Request Prevention

When the user types rapidly, each keystroke resets the debounce timer. If a previous API call is still in-flight when a new one fires, the AbortController cancels the old request. This prevents stale results from overwriting fresh data — a common race condition bug in async autocomplete implementations.

### 3. LRU Cache with Namespace Support

The TagCache stores API responses in a Map with LRU eviction. When the cache exceeds maxSize (default: 100), the least-recently-accessed entry is removed. Namespacing allows multiple MultiSelect instances on the same page to share the cache without key collisions (e.g., `users:react` vs `labels:react`).

### 4. ARIA Combobox Pattern

The component follows the WAI-ARIA Combobox pattern:
- The wrapper has `role="combobox"` with `aria-expanded`
- The input has `aria-autocomplete="list"` and `aria-activedescendant`
- The dropdown has `role="listbox"` with `role="option"` children
- Each option has `aria-selected` reflecting its selection state
- An `aria-live="polite"` region announces selection changes to screen readers

### 5. Keyboard Navigation

Full keyboard support includes:
- **Arrow Down/Up**: Navigate suggestion list with wrap-around
- **Enter**: Select highlighted option or create new tag
- **Escape**: Close dropdown and clear input
- **Backspace**: Remove last tag when input is empty
- **Tab**: Select highlighted option and move focus

### 6. Paste Handling

When the user pastes a comma/semicolon/tab-separated list, the component splits on delimiters, trims each segment, deduplicates against already-selected tags, and adds each as an individual tag. This is useful for bulk operations (e.g., pasting a list of email addresses or skill names).

### 7. Viewport Edge Detection

The dropdown renders absolutely positioned below the input by default. For components near the bottom of the viewport, a ResizeObserver can detect insufficient space and flip the dropdown to open upward. (Implementation detail — add a `useViewportPosition` hook for production use.)

## Usage

```tsx
import { MultiSelect } from './components/multi-select';
import type { Suggestion, Tag } from './lib/multi-select-types';

interface UserMetadata {
  email: string;
  department: string;
}

async function fetchUsers(
  query: string,
  signal: AbortSignal
): Promise<Suggestion<UserMetadata>[]> {
  const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`, {
    signal,
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

function MyForm() {
  const handleChange = (tags: Tag<UserMetadata>[]) => {
    console.log('Selected users:', tags);
  };

  return (
    <MultiSelect<UserMetadata>
      config={{
        maxSelections: 5,
        debounceMs: 300,
        allowCreate: false,
        groupBy: 'category',
        placeholder: 'Search users...',
      }}
      fetcher={fetchUsers}
      onChange={handleChange}
    />
  );
}
```

## Performance Characteristics

| Operation | Time | Space |
|-----------|------|-------|
| addTag | O(n) — duplicate check | O(n) — selected array |
| removeTag | O(n) — array filter | O(1) |
| Cache lookup | O(1) — Map.get | O(m) — cached queries |
| Suggestion filter | O(s) — scan results | O(s) — filtered array |
| Debounce timer | O(1) | O(1) |

Where n = selected tags (< 10), m = cached queries (< 100), s = API results (< 200).

## Testing Notes

- Unit test the store actions (add, remove, dedup, max limit)
- Unit test the cache (get/set/has, LRU eviction, custom tag tracking)
- Integration test the full user flow (type → suggestions → select → tag appears)
- Test AbortController behavior (type rapidly, verify stale requests are cancelled)
- Test accessibility with axe-core and screen readers
- Test edge cases: API errors, empty results, paste handling, viewport edges
