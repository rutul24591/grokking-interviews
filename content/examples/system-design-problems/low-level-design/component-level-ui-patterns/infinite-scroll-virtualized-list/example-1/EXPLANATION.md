# Infinite Scroll / Virtualized List — Implementation Walkthrough

## Architecture Overview

This implementation follows a **virtualization engine + infinite scroll engine** pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│                     VirtualizedList                             │
│  ┌─────────────────────┐        ┌────────────────────────────┐  │
│  │   useVirtualizer    │        │   useInfiniteScroll        │  │
│  │                     │        │                            │  │
│  │ - scroll tracking   │        │ - IntersectionObserver     │  │
│  │ - height cache      │◄───────│ - page fetching            │  │
│  │ - visible window    │  items │ - loading/error state      │  │
│  │ - spacer heights    │        │ - retry logic              │  │
│  └─────────┬───────────┘        └─────────────┬──────────────┘  │
│            │                                   │                  │
│            ▼                                   ▼                  │
│  ┌─────────────────────┐        ┌────────────────────────────┐  │
│  │ VirtualizedItem × N │        │      DataSource            │  │
│  │ (absolute position) │        │  (REST / WebSocket)        │  │
│  │ + ResizeObserver    │        └────────────────────────────┘  │
│  └─────────────────────┘                                        │
│            │                                                     │
│            ▼                                                     │
│  ┌─────────────────────┐        ┌────────────────────────────┐  │
│  │      Sentinel       │        │    ScrollRestoration       │  │
│  │ (IntersectionObs.)  │        │  (history state)           │  │
│  └─────────────────────┘        └────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Separation of concerns** — Virtualization (computing which items to render) is completely separate from data fetching (loading pages). This allows swapping the data source (REST, WebSocket, GraphQL) without touching the virtualizer.

2. **Pure virtualization engine** — All computation functions (`computeVisibleWindow`, `getItemOffset`, `buildVirtualItems`) are pure functions with no side effects. This makes them trivially testable and predictable.

3. **Height cache via Map** — Measured item heights are stored in a `Map<number, number>` keyed by index. This provides O(1) lookup during scroll event handling. Unmeasured items fall back to the estimated size.

4. **IntersectionObserver for sentinel** — Non-blocking, runs off the main thread. Configurable `rootMargin` allows pre-fetching pages before the user reaches the bottom.

5. **rAF-throttled scroll handling** — Scroll events fire at the display refresh rate (60-120Hz). `requestAnimationFrame` ensures the visible window computation runs once per paint cycle, not once per event.

## File Structure

```
example-1/
├── lib/
│   ├── virtualization-types.ts   # Core type definitions
│   ├── virtualization-engine.ts  # Pure functions: visible window, height cache
│   ├── infinite-scroll-engine.ts # IntersectionObserver, page tracking, retry
│   └── data-source.ts            # REST API adapter, WebSocket adapter, Mock
├── hooks/
│   ├── use-virtualizer.ts        # Main hook: scroll tracking + height measurement
│   └── use-infinite-scroll.ts    # Hook: IntersectionObserver + loading state
├── components/
│   ├── virtualized-list.tsx      # Root container with spacers and sentinel
│   ├── virtualized-item.tsx      # Absolutely positioned item with ResizeObserver
│   ├── sentinel.tsx              # 1px div observed by IntersectionObserver
│   ├── scroll-restoration.tsx    # Restores scroll position from history state
│   └── feed-skeleton.tsx         # Shimmer-animated loading placeholders
└── EXPLANATION.md                # This file
```

## Key Implementation Details

### Virtualization Engine (lib/virtualization-engine.ts)

Pure functions that compute which items to render. Key functions:

- **`computeVisibleWindow`**: Given scroll offset, viewport height, item count, height cache, and overscan, returns `{ startIndex, endIndex, totalHeight }`. Uses binary search to find the start index for variable-height items.
- **`buildVirtualItems`**: Creates `VirtualItem<T>` objects for the visible range, computing each item's offset by accumulating heights from the cache.
- **`updateHeightCache`**: Thread-safe cache update that returns whether the size changed (to avoid unnecessary re-renders).

The height cache is a `Map<number, number>`. For unmeasured items, the `estimatedItemSize` (default: 100px) is used. As items mount and measure themselves via ResizeObserver, the cache fills in and offsets become more accurate.

### Infinite Scroll Engine (lib/infinite-scroll-engine.ts)

Class-based engine managing the IntersectionObserver lifecycle. Key aspects:

- **`createObserver`**: Returns a ref callback for the sentinel element. Configures `rootMargin` to trigger before the sentinel fully enters the viewport (pre-fetching).
- **`loadNextPage`**: Guards against concurrent loads and exhausted data. Uses `AbortController` for request cancellation. On failure, schedules automatic retry with exponential backoff (1s, 2s, 4s, ...).
- **`reset`**: Clears all state, disconnects the observer, aborts in-flight requests, and re-fetches from page 1. Used when filters change.
- **Subscribe/notify pattern**: Listeners receive state updates via a `Set` of callbacks, enabling React hooks to subscribe efficiently.

### Data Source (lib/data-source.ts)

Three implementations:

1. **`RestApiDataSource`**: Takes a URL builder and response parser. Uses `fetch` with `AbortController` for cancellation. The default parser expects `{ data: T[], hasMore: boolean }`.

2. **`WebSocketDataSource`**: Connects to a WebSocket for real-time feed updates. Parses incoming messages into `FeedEvent` objects (`items_added`, `items_removed`, `items_updated`). Does not support `fetchPage` — pagination is still done via REST, WebSocket is for live updates only. Implements auto-reconnect with exponential backoff.

3. **`MockDataSource`**: For testing. Wraps an in-memory array, simulates network delay, and can be configured to fail on a specific page.

### useVirtualizer Hook (hooks/use-virtualizer.ts)

The main integration hook. Key aspects:

1. **Scroll listener**: Attached to the container with `{ passive: true }`. Throttled via `requestAnimationFrame` — if a rAF callback is already scheduled, the scroll event is skipped.

2. **ResizeObserver on container**: Tracks viewport height changes (e.g., window resize, responsive layout changes). Triggers re-computation of the visible window.

3. **Height cache as ref**: Stored in `useRef` to persist across renders without causing re-renders. The cache is only read during `useMemo` computation.

4. **`updateItemSize` callback**: Called by VirtualizedItem's ResizeObserver. Updates the cache and triggers a re-render by calling `setScrollTop(prev => prev)` (functional update with same value forces useMemo recalculation).

5. **`scrollToIndex`**: Computes the pixel offset for a given index and calls `container.scrollTo()`. Supports alignment (`start`, `center`, `end`).

### useInfiniteScroll Hook (hooks/use-infinite-scroll.ts)

Wraps the `InfiniteScrollEngine` class. Key aspects:

1. **Engine lifecycle**: Created on mount (or when data source changes), destroyed on unmount. The `createObserver` callback is stored in a ref and forwarded to the Sentinel component.

2. **State synchronization**: The engine's subscribe callback updates local React state via `useState`. This bridges the class-based engine with React's rendering model.

3. **Exposed actions**: `loadMore()` for manual loading, `retry()` for error recovery, `reset()` for clearing and re-fetching.

### VirtualizedList Component (components/virtualized-list.tsx)

The root container. Renders:

1. **Scroll container**: `<div>` with `overflow: auto` and `role="list"`. The ref is shared with `useVirtualizer`.

2. **Outer spacer**: `<div>` with `height: totalHeight` to simulate the full scrollable content. This is what creates the scrollbar.

3. **VirtualizedItems**: Rendered inside the spacer with `transform: translateY(offset)` for positioning. Using `transform` instead of `top` keeps positioning on the GPU compositor thread.

4. **FeedSkeleton**: Rendered at the bottom when loading the next page.

5. **Error UI**: Rendered when `error` is non-null, with a retry button.

6. **Sentinel**: Always rendered at the bottom (after the spacer).

### VirtualizedItem Component (components/virtualized-item.tsx)

Individual item wrapper. Key aspects:

1. **Absolute positioning via transform**: `position: absolute` + `transform: translateY(offset)` for GPU-accelerated positioning. The item's `top` is always 0 — only the transform changes.

2. **ResizeObserver**: Created per item to detect height changes (e.g., content expansion, image loading). Reports measurements back to the virtualizer via `updateItemSize`.

3. **Inner content div**: The ResizeObserver measures this div, not the absolutely-positioned wrapper. This ensures we measure the actual content height, not the container.

### Sentinel Component (components/sentinel.tsx)

Simple 1px-tall div at the bottom of the content. The ref is forwarded to the `InfiniteScrollEngine`'s `createObserver` callback, which sets up the IntersectionObserver. The `rootMargin` ensures the observer fires before the sentinel is fully visible, giving the network request time to complete.

### ScrollRestoration Component (components/scroll-restoration.tsx)

Side-effect-only component (renders null). Key aspects:

1. **Read on mount**: Reads `window.history.state` for saved scroll position. The state is keyed by a unique constant to avoid collisions with other state.

2. **Restore when ready**: Waits until the items array has enough items (at least `firstVisibleIndex`), then calls `scrollTo({ top: savedOffset, behavior: 'auto' })`. Uses `behavior: 'auto'` for instant scroll — no animation on restoration.

3. **Save on unload**: Listens for `beforeunload` and writes the current scroll position to history state. Uses `replaceState` to avoid creating new history entries.

### FeedSkeleton Component (components/feed-skeleton.tsx)

Renders placeholder rows with a CSS shimmer animation. The animation is a linear gradient moving from right to left (`background-position` animation). Each row has a fixed height matching the estimated item size. Uses `role="status"` and `aria-busy="true"` for accessibility.

## Usage

### 1. Create a data source

```ts
import { RestApiDataSource } from './lib/data-source';

interface Post {
  id: string;
  title: string;
  body: string;
}

const dataSource = new RestApiDataSource<Post>({
  buildUrl: (page, pageSize) =>
    `/api/posts?page=${page}&limit=${pageSize}`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 2. Render the VirtualizedList

```tsx
import { VirtualizedList } from './components/virtualized-list';

function PostFeed() {
  return (
    <VirtualizedList
      dataSource={dataSource}
      config={{ pageSize: 20, overscan: 5, estimatedItemSize: 120 }}
      renderItem={(post) => (
        <div className="p-4 border-b">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      )}
      getItemKey={(post) => post.id}
      className="h-screen w-full"
    />
  );
}
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Fast scroll past sentinel | Dual-trigger: IntersectionObserver + scroll position check |
| Variable height recalculation | ResizeObserver updates cache, virtualizer re-renders with new offsets |
| Real-time insert at top | Scroll offset adjusted by inserted height, user's visual position preserved |
| SSR rendering | All virtualization logic in useEffect/ResizeObserver, defers to client |
| Component unmount during fetch | AbortController cancels in-flight request |
| Page fetch failure | Error UI with retry button, exponential backoff for auto-retry |
| Route navigation | ScrollRestoration saves position to history.state |
| Extremely tall items | Height cache stores actual measured size, no max height constraint |

## Performance Characteristics

- **computeVisibleWindow**: O(log n) with binary search or O(k) incremental scan
- **Scroll handler**: O(k) where k = visible + overscan items (~20-30)
- **updateHeightCache**: O(1) Map set
- **IntersectionObserver callback**: O(1) — triggers async fetch
- **DOM nodes**: Constant (~30) regardless of total item count
- **Memory**: O(n) for height cache + data array, but DOM is O(k)

## Testing Strategy

1. **Unit tests**: Test virtualization engine functions with known scroll offsets and height caches. Verify start/end indices and total height calculations.
2. **Integration tests**: Render VirtualizedList with 1000 items, assert only ~30 DOM nodes. Mock IntersectionObserver and verify page loads trigger correctly.
3. **ResizeObserver tests**: Render items with dynamic content, assert height cache updates and offsets recalculate.
4. **Scroll restoration tests**: Simulate route change, save state, re-render, assert scroll position matches.
5. **Error/retry tests**: Mock fetch failure, assert error UI renders. Click retry, mock success, assert items load.
6. **Accessibility tests**: Run axe-core, verify aria-live announcements, keyboard navigation, role attributes.
