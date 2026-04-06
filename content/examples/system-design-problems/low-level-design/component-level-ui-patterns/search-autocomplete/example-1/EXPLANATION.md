# Search Autocomplete — Implementation Walkthrough

## Architecture Overview

This implementation follows a **hook + reducer + composed components** pattern:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Autocomplete Component                       │
│  ┌──────────────┐    ┌────────────────────────┐    ┌────────────┐  │
│  │  Input Field  │───▶│   useAutocomplete()   │───▶│  Dropdown  │  │
│  │  (local state)│    │   (reducer + debounce) │    │  (listbox) │  │
│  └──────────────┘    └────────────┬───────────┘    └────────────┘  │
│                                   │                                 │
│                          ┌────────┴────────┐                       │
│                          │                 │                       │
│                   Cache (Map)      AbortController                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **useReducer for state machine** — Explicit states (idle, loading, success, error) with well-defined transitions. Every state change is traceable and testable. The reducer pattern prevents invalid states (e.g., loading + error simultaneously).

2. **Custom hook encapsulation** — All debounce/cache/abort logic lives in `useAutocomplete`. The UI component only handles rendering and event binding. This separation enables unit testing the logic independently of React rendering.

3. **State splitting for performance** — Input value lives in local `useState`, suggestions live in the reducer. Typing doesn't trigger dropdown re-renders until the debounce timer fires. This is critical for smooth input responsiveness.

4. **Map-based cache with FIFO eviction** — JavaScript `Map` preserves insertion order, making FIFO eviction trivial: delete the first key when size exceeds the limit. O(1) lookup via `Map.get()`.

5. **AbortController + requestId dual protection** — AbortController cancels the in-flight HTTP request. The `requestId` counter discards stale responses that arrive after a newer request was already initiated.

## File Structure

```
example-1/
├── lib/
│   ├── autocomplete-types.ts   # TypeScript interfaces, reducer types
│   ├── use-autocomplete.ts     # Core hook: debounce, cache, abort, reducer
│   ├── debounce.ts             # Reusable debounce utility with cancel
│   └── highlight.ts            # Text segmentation for match highlighting
├── components/
│   └── autocomplete.tsx        # UI: Input + Dropdown + Option + Highlight
├── api/
│   └── search-api.ts           # Mock API for demonstration
└── EXPLANATION.md              # This file
```

## Key Implementation Details

### useAutocomplete Hook (lib/use-autocomplete.ts)

The hook is the brain of the system. Key aspects:

- **State machine via useReducer**: 8 action types cover all transitions. `SET_QUERY` resets highlights and closes dropdown. `FETCH_SUCCESS` opens dropdown only if results exist.

- **Debounce via useRef timer**: Each keystroke clears the previous `setTimeout` and schedules a new one. The timer reference survives re-renders because it's a ref, not state.

- **Cache-first strategy**: Before making a network request, the hook checks `cacheRef.current.get(query)`. Cache hits return immediately with `FETCH_SUCCESS` dispatch — no network latency.

- **FIFO cache eviction**: When cache reaches `cacheSize` (default 100), the oldest entry is deleted:
  ```ts
  if (cacheRef.current.size >= cacheSize) {
    const firstKey = cacheRef.current.keys().next().value;
    if (firstKey !== undefined) {
      cacheRef.current.delete(firstKey);
    }
  }
  ```

- **AbortController per fetch**: Each new fetch creates a fresh `AbortController`. The previous one is aborted before the new request starts:
  ```ts
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  const abortController = new AbortController();
  abortControllerRef.current = abortController;
  ```

- **requestId for stale detection**: Even if abort doesn't fire fast enough, the response's `requestId` is compared against the current counter. Mismatched IDs are silently discarded.

- **Keyboard navigation in hook**: ArrowUp/Down adjust `highlightedIndex` with wrap-around. Enter selects the highlighted suggestion. Escape closes the dropdown.

### Debounce Utility (lib/debounce.ts)

Reusable debounce implementation:

- **Trailing-edge execution**: The function fires after the delay with the last arguments received. This is the correct behavior for autocomplete — we want the final query after typing pauses.

- **cancel() method**: Critical for cleanup. Called on component unmount to prevent state updates on unmounted components.

- **leading option**: Supports leading-edge execution if needed (fires immediately on first call, then ignores subsequent calls until delay passes). Not used in autocomplete but useful for other scenarios like button click prevention.

### Highlight Utility (lib/highlight.ts)

Safe text highlighting:

- **Regex escaping**: Special regex characters in the query are escaped (`.*+?^${}()|[]\`) before creating the RegExp. This prevents crashes when users type characters like `*` or `?`.

- **Segment-based rendering**: The title is split into alternating match/non-match segments. Each segment renders as a separate `<span>` with `isMatch` determining styling. No `dangerouslySetInnerHTML` — this prevents XSS.

- **Case-insensitive matching**: The regex uses the `gi` flags (global + case-insensitive).

### Autocomplete Component (components/autocomplete.tsx)

The UI layer composes four sub-components:

1. **AutocompleteInput**: Standard `<input>` with `aria-autocomplete="list"`, `aria-expanded`, and `aria-activedescendant` linked to the highlighted option's ID.

2. **AutocompleteDropdown**: Renders as `role="listbox"` with `max-height` constraint for scrollability. Shows loading spinner, empty state, or error state as appropriate. Includes an `aria-live="polite"` region for screen reader result count announcements.

3. **AutocompleteOption**: Individual suggestion with `role="option"` and `aria-selected`. Uses `suggestion.id` as React key (not array index — using index would cause stale highlight state when results change).

4. **AutocompleteHighlight**: Renders highlighted text segments. Matched text gets `font-bold text-accent`, non-matched text gets default styling.

### Blur Handling with Delay

When the input loses focus, the dropdown doesn't close immediately. Instead, a 150ms delay allows the user to click a suggestion (which triggers blur on the input before click registers). If no click happens within 150ms, the dropdown closes.

### Outside Click Detection

A `mousedown` listener on `document` closes the dropdown when clicking outside the component. This is more reliable than `blur` alone because it handles clicks on any element outside the autocomplete.

## Usage

### 1. Basic usage with mock API

```tsx
import { Autocomplete } from '@/components/autocomplete';
import { fetchSuggestions } from '@/api/search-api';
import type { Suggestion } from '@/lib/autocomplete-types';

function SearchPage() {
  const handleSelect = (suggestion: Suggestion) => {
    console.log('Selected:', suggestion.title);
    // Navigate to result, update URL, etc.
  };

  return (
    <Autocomplete
      fetchSuggestions={fetchSuggestions}
      onSelect={handleSelect}
      debounceMs={300}
      maxVisible={8}
      placeholder="Search technologies..."
    />
  );
}
```

### 2. Usage with real API

```tsx
async function fetchFromAPI(query: string, signal: AbortSignal) {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}`,
    { signal }
  );
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

<Autocomplete
  fetchSuggestions={fetchFromAPI}
  onSelect={(s) => router.push(`/results/${s.id}`)}
/>
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Rapid typing (h-e-l-l-o in 200ms) | Debounce ensures only 1 API call for "hello", not 5 |
| Response arrives out of order | requestId counter discards stale responses |
| User types "react" then backspaces to "rea" | Previous request is aborted via AbortController |
| Click outside while dropdown is open | 150ms blur delay allows click to register before close |
| API returns empty results | Shows "No results found" message |
| Network failure | Shows error message, dropdown stays closed |
| Cache full (100 entries) | Oldest entry evicted via FIFO |
| XSS in suggestion titles | Rendered as text nodes, never innerHTML |
| CJK input methods | compositionend event fires the debounced handler |
| Component unmount during fetch | AbortController cancels request, debounce timer cleared |

## Performance Characteristics

- **Debounce scheduling**: O(1) — single setTimeout
- **Cache lookup**: O(1) — Map.get()
- **Highlight computation**: O(n) where n = title length — regex matching + string splitting
- **Render suggestions**: O(k) where k = visible items (default 10)
- **Keyboard navigation**: O(1) — index increment/decrement
- **Cache eviction**: O(1) — Map.keys().next() + Map.delete()

## Optimization Strategies

1. **Memoized highlight**: In production, wrap `highlightText()` in `useMemo` per suggestion keyed on `[title, query]` to avoid recomputing on unrelated state changes.

2. **State splitting**: Input value in local `useState`, suggestions in reducer. Input typing only re-renders the input element — the dropdown waits until debounce fires.

3. **Key by ID, not index**: Using `suggestion.id` as React key prevents DOM node reuse when result order changes, avoiding stale highlight visual state.

## Testing Strategy

1. **Unit — Debounce**: Assert function not called before delay, called after delay, `cancel()` prevents invocation.

2. **Unit — Cache**: Assert cache hit returns data without fetch, cache miss triggers fetch, eviction removes oldest at max size.

3. **Unit — Highlight**: Assert case-insensitive match, no-match returns full text, special regex characters are escaped.

4. **Integration — Typing flow**: Type "reac", wait 300ms, assert API called once, assert dropdown renders suggestions.

5. **Integration — Keyboard**: Type query, ArrowDown 3x, assert 4th option has `aria-selected="true"`, Enter, assert `onSelect` fires.

6. **Integration — Abort**: Type "rea" then "react" rapidly, assert only 1 API call completes, "rea" call was aborted.

7. **Accessibility**: Run axe-core, assert no violations. Test VoiceOver announces result count. Test full keyboard navigation without mouse.
