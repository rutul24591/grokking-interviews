# Pagination Component — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + hooks + components** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pagination UI                           │
│  ┌──────────────┐  ┌─────────────────────┐  ┌───────────────┐ │
│  │ Range Display│  │   Page Buttons      │  │ Page Size     │ │
│  │              │  │   (with ellipsis)   │  │ Selector      │ │
│  └──────┬───────┘  └──────────┬──────────┘  └───────┬───────┘ │
│         │                     │                      │         │
│         └─────────────────────┼──────────────────────┘         │
│                               │                                │
│                    ┌──────────▼──────────┐                     │
│                    │   usePagination     │                     │
│                    │   (main hook)       │                     │
│                    └──────────┬──────────┘                     │
│                               │                                │
└───────────────────────────────┼────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Zustand Store       │
                    │   (state + actions)   │
                    └───────┬───────┬───────┘
                            │       │
              ┌─────────────┘       └─────────────┐
              │                                    │
  ┌───────────▼───────────┐      ┌────────────────▼──────────┐
  │ useClientPagination   │      │ useServerPagination       │
  │ (slices data array)   │      │ (fetches from API)        │
  └───────────────────────┘      └───────────────────────────┘
              │                                    │
              ▼                                    ▼
  ┌───────────────────────┐      ┌─────────────────────────────┐
  │   In-memory data      │      │   API endpoint              │
  │   (full dataset)      │      │   ?page=N&pageSize=M        │
  └───────────────────────┘      └─────────────────────────────┘
```

### Design Decisions

1. **Zustand for state management** — Provides reactive global state that multiple components can subscribe to independently (pagination bar, data table, URL sync). Minimal boilerplate with selector-based subscriptions.

2. **Page range calculator as pure function** — The ellipsis algorithm has no side effects and is independently testable. It takes currentPage, totalPages, and siblingCount, and returns the computed page display structure.

3. **Bidirectional URL sync** — The store reads URL params on init and writes back on every state change via `replaceState`. The `popstate` listener handles browser back/forward navigation.

4. **Separate client/server hooks** — Both modes share the same pagination state but differ in data fetching strategy. Client-side slices an array; server-side triggers API fetches with AbortController for request cancellation.

## File Structure

```
example-1/
├── lib/
│   ├── pagination-types.ts       # TypeScript interfaces and type unions
│   ├── page-range-calculator.ts  # Ellipsis algorithm + range display computation
│   └── pagination-store.ts       # Zustand store + URL sync + popstate listener
├── hooks/
│   ├── use-pagination.ts              # Main hook combining store + calculator
│   ├── use-url-pagination-state.ts    # URL query param sync on mount + popstate
│   ├── use-client-pagination.ts       # Client-side: slices data array
│   └── use-server-pagination.ts       # Server-side: API fetch with AbortController
├── components/
│   ├── pagination.tsx          # Main container assembling all sub-components
│   ├── page-button.tsx         # Page number, ellipsis, and navigation buttons
│   ├── page-size-selector.tsx  # Dropdown for items-per-page selection
│   └── pagination-range.tsx    # "Showing X-Y of Z" range display
└── EXPLANATION.md              # This file
```

## Key Implementation Details

### Type Definitions (lib/pagination-types.ts)

The type system uses a **discriminated union** for pagination items:

```ts
interface PageItem { type: "page"; value: number; }
interface EllipsisItem { type: "ellipsis"; value: null; }
type PaginationItem = PageItem | EllipsisItem;
```

This allows the rendering layer to use a simple switch on `type` to determine whether to render a clickable button or a non-interactive ellipsis span. The `PaginationConfig` interface controls display options (sibling count, page size options, show/hide first/last buttons).

### Page Range Calculator (lib/page-range-calculator.ts)

The most algorithmically interesting module. Given `currentPage = 12`, `totalPages = 30`, `siblingCount = 2`:

1. Computes `leftBound = max(12 - 2, 2) = 10`
2. Computes `rightBound = min(12 + 2, 29) = 14`
3. Since `leftBound > 2`, inserts ellipsis after page 1
4. Since `rightBound < 29`, inserts ellipsis before page 30
5. Outputs: `[1, ellipsis, 9, 10, 11, 12, 13, 14, 15, ellipsis, 30]`

Edge cases:
- **totalPages <= 7**: No ellipsis needed, all pages shown
- **currentPage = 1**: Window shifts right, left ellipsis may not appear
- **currentPage = totalPages**: Window shifts left, right ellipsis may not appear
- **totalPages = 0 or 1**: Returns empty or single-item array

### Zustand Store (lib/pagination-store.ts)

The store manages pagination state with **boundary validation** on every action:

- **goToPage(page)**: Clamps to `[1, totalPages]` before setting. If the resulting page differs from the input (e.g., input was 999 but totalPages is 20), it corrects silently and updates the URL via `replaceState` (not `pushState` to avoid spurious history entries).
- **changePageSize(size)**: Resets `currentPage` to 1, since page boundaries shift entirely.
- **setTotalItems(count)**: Recalculates `totalPages` and corrects `currentPage` if it exceeds the new total. This handles the beyond-last-page recovery case.
- **initFromUrl()**: Parses query parameters, validates them (NaN detection, negative value handling), and defaults to safe values.

URL sync uses `replaceState` by default to avoid polluting browser history with every page change. The `popstate` listener deserializes the history state or falls back to parsing URL params.

### Main Hook (hooks/use-pagination.ts)

Combines store access with page range computation. The `pageRange` is memoized via `useMemo` with dependencies on `currentPage`, `totalPages`, `siblingCount`, `pageSize`, and `totalItems`. This prevents unnecessary recomputation when unrelated state changes.

Returns all navigation actions, computed values (`hasNext`, `hasPrev`, `totalPages`), and the page range object for rendering.

### URL State Hook (hooks/use-url-pagination-state.ts)

Simple hook that runs two effects:
1. On mount, reads URL params and initializes the store.
2. On mount, sets up the `popstate` listener for browser back/forward navigation.

### Client-Side Hook (hooks/use-client-pagination.ts)

Takes a full data array and returns the sliced subset:

```ts
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
return data.slice(startIndex, endIndex);
```

Also sets `totalItems` in the store from `data.length`. The slice is memoized via `useMemo`.

### Server-Side Hook (hooks/use-server-pagination.ts)

Manages the full API request lifecycle:

1. On `currentPage` or `pageSize` change, aborts any in-flight request via `AbortController`.
2. Creates a new `AbortController`, starts fetch with query params.
3. On success, updates data, loading state, and calls `setTotalItems` on the store.
4. On error, sets error state and calls the optional `onError` callback.
5. On unmount or dependency change, aborts the current request in the cleanup function.

The `buildQuery` option allows callers to customize the query string (e.g., adding sort or filter params).

### Pagination Component (components/pagination.tsx)

The main container assembles all sub-components:

- **Range display** on the left (hidden on mobile via CSS).
- **Page size selector** next to it.
- **Navigation controls** (first, prev, page numbers, next, last) in the center.
- On small screens (`hidden sm:flex`), page number buttons are hidden, leaving only prev/next.

Uses `role="navigation"` and `aria-label="Pagination"` on the root element. Conditional rendering: if `totalPages <= 1`, only the range display renders (if enabled).

### Page Button (components/page-button.tsx)

Handles three button types via discriminated union:

- **Page button**: Renders a numbered button. Active state uses `aria-current="page"` and distinct styling (blue background, white text). Inactive state has hover styling.
- **Ellipsis**: Non-interactive span with `aria-hidden="true"`. Not focusable.
- **Navigation button**: Renders an SVG arrow icon (first, prev, next, last). Disabled state applies `aria-disabled="true"` and visual dimming.

All buttons are native `<button>` elements, providing built-in keyboard support (Enter/Space activation, Tab focus management).

### Page Size Selector (components/page-size-selector.tsx)

Native `<select>` element with options for each configured page size. On change, calls the store's `changePageSize` action (which resets to page 1). Styled with Tailwind, includes `aria-label` for accessibility.

### Pagination Range (components/pagination-range.tsx)

Computes `startItem` and `endItem` from current page, page size, and total items. Displays "Showing X-Y of Z". Includes a screen-reader-only span with the full descriptive text for accessibility. Returns "No results found" when `totalItems === 0`.

## Usage

### Client-Side Pagination

```tsx
import { Pagination } from "@/components/pagination";
import { useClientPagination } from "@/hooks/use-client-pagination";
import { useUrlPaginationState } from "@/hooks/use-url-pagination-state";

function MyTable({ data }: { data: Item[] }) {
  useUrlPaginationState();
  const { paginatedData } = useClientPagination(data);

  return (
    <div>
      <table>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}><td>{item.name}</td></tr>
          ))}
        </tbody>
      </table>
      <Pagination config={{ mode: "client" }} />
    </div>
  );
}
```

### Server-Side Pagination

```tsx
import { Pagination } from "@/components/pagination";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useUrlPaginationState } from "@/hooks/use-url-pagination-state";

function MyTable() {
  useUrlPaginationState();
  const { data, loading, error } = useServerPagination("/api/items", {
    onSuccess: (data) => console.log("Loaded", data),
    onError: (err) => console.error("Failed", err),
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <table>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}><td>{item.name}</td></tr>
          ))}
        </tbody>
      </table>
      <Pagination config={{ mode: "server" }} />
    </div>
  );
}
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Empty dataset (totalItems = 0) | Range shows "No results found", no page buttons |
| Single page | Only range display renders, no navigation controls |
| Beyond-last-page (URL ?page=999, totalPages=20) | Store clamps to page 20, updates URL via replaceState |
| Invalid URL params (?page=abc) | Defaults to page 1, pageSize 25 |
| Page size change on page 10 | Resets to page 1, recalculates boundaries |
| Rapid page changes (server mode) | AbortController cancels in-flight requests, only latest resolves |
| Mobile viewport | Page numbers hidden, only prev/next visible |
| SSR hydration | URL params read during init, client hydrates with matching state |

## Performance Characteristics

- **Page range computation**: O(p) where p = visible page buttons (typically 7-9), independent of total page count
- **goToPage**: O(1) — clamp + set
- **Client-side slice**: O(k) where k = pageSize
- **Server-side fetch**: O(network) with AbortController cancellation
- **URL sync**: O(1) — pushState/replaceState
- **Memoized computations**: useMemo prevents unnecessary recomputation

## Testing Strategy

1. **Unit tests for calculator**: Test all ellipsis scenarios (boundaries, middle, small page counts, edge cases)
2. **Unit tests for store**: Test goToPage clamping, changePageSize reset, initFromUrl parsing, popstate handling
3. **Integration tests**: Render full component, click pages, verify URL updates, verify re-renders
4. **Accessibility tests**: Run axe-core, verify aria-current, aria-label, role, keyboard navigation
5. **Edge case tests**: Empty data, single page, beyond-last-page, rapid server requests, mobile viewport resize
