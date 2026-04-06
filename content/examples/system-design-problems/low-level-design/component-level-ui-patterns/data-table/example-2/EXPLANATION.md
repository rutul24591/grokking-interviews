# Data Table — Edge Cases & Advanced Scenarios

This document covers two advanced data table scenarios: handling column resize during virtualization (with scroll position preservation), and combining server-side pagination with client-side virtualization for million-row datasets.

---

## Edge Case 1: Virtualized Column Resize

### The problem

When a table virtualizes rows (only renders visible rows to the DOM), resizing a column creates a cascade of measurement problems:

1. **Text reflow**: Widening a column may cause long text to stop wrapping, reducing row height. Narrowing may cause wrapping, increasing row height.
2. **Stale measurements**: The virtualizer caches row heights to calculate scroll position. After a column resize, these cached heights are wrong.
3. **Scroll drift**: If row heights change but the scroll offset stays the same, the user sees different content — the row they were looking at disappears.
4. **Performance**: Re-measuring all rows is O(n) and blocks the main thread. For 100,000 rows, this is unacceptable.

### The solution: Anchor-based scroll restoration

**Step 1 — Capture the anchor**: Before applying any width changes, capture which row is at the top of the viewport (the "anchor row") and its offset from the viewport top.

```
anchorRowIndex = startIndex (first visible row)
anchorRowOffset = scrollOffset - cumulativeHeight(rows 0 to startIndex-1)
```

**Step 2 — Apply the resize**: Update the column width.

**Step 3 — Re-measure visible rows only**: Only re-measure rows in the current visible window (typically 20-50 rows), not all rows. This is O(visible) instead of O(n).

**Step 4 — Restore scroll position**: Calculate the new scroll offset:

```
newScrollOffset = cumulativeHeight(rows 0 to anchorRowIndex, with NEW heights) + anchorRowOffset
```

This ensures the anchor row stays at the same visual position on screen.

**Step 5 — Deferred measurement**: Schedule measurement of non-visible rows using `requestIdleCallback`. This runs when the browser is idle, so it doesn't block scrolling or other interactions. Rows are measured in batches, stopping when `deadline.timeRemaining()` drops below 5ms.

### Resize debouncing

During a drag resize, the mouse moves many pixels per second. We don't want to re-measure on every pixel. The handler debounces resize moves at 16ms (one frame), which feels smooth to the user while avoiding unnecessary work.

---

## Edge Case 2: Large Dataset Hybrid (Server + Client)

### Why pure approaches fail

| Approach | Problem |
|----------|---------|
| Load all 1M rows client-side | ~100MB JSON, seconds of load time, high memory |
| Server pagination only | No smooth scrolling, jarring page jumps, lost scroll position |

### The hybrid approach

**Server-side pagination** (fetch 200 rows at a time) + **client-side virtualization** (render 20 rows at a time) + **infinite scroll** (auto-fetch next pages).

### Scrollbar accuracy with partial data

The total scroll height is calculated as:

```
totalScrollHeight = totalCount × estimatedRowHeight
```

Where `totalCount` comes from the server's first response. Even though we've only loaded 200 rows, the scrollbar is sized as if all 1,000,000 rows exist. As rows are loaded, their actual heights replace the estimates in the cache, but the overall scrollbar size remains stable.

### Prefetch strategy

When the user scrolls within `preloadThreshold` rows of the end of loaded data, the next `prefetchPages` pages are fetched in the background. This means by the time the user reaches the boundary, the next page is already loaded.

```
Loaded: pages 0-5 (rows 0-1199)
User scrolls to row 1100
Distance to boundary: 1199 - 1100 = 99 rows
preloadThreshold: 100 rows → TRIGGER PREFETCH
Fetch: pages 6 and 7
```

### Cache eviction

An LRU (Least Recently Used) cache keeps only `maxCachedPages` pages in memory. When the cache is full, the oldest page (lowest page number, excluding the current page) is evicted. This keeps memory bounded regardless of how far the user scrolls.

### Preventing duplicate requests

The `inFlightPages` set tracks which pages are currently being fetched. Before requesting a page, we check this set. This prevents the race condition where rapid scrolling triggers multiple fetches for the same page.

---

## Diagrams

### Column resize with scroll anchor

```
Before resize:                        After resize (column widened):
┌──────────────────────────┐          ┌────────────────────────────────┐
│ Row 45  │ "Hello..."     │          │ Row 45  │ "Hello world text..."│
│ Row 46  │ "Short"        │  ← ANCHOR│ Row 46  │ "Short"              │  ← ANCHOR
│ Row 47  │ "Very long..." │          │ Row 47  │ "Very long text..."  │
│ Row 48  │ "Medium"       │          │ Row 48  │ "Medium"             │
└──────────────────────────┘          └────────────────────────────────┘

Steps:
1. Capture: anchorRow = 46, anchorOffset = 12px from viewport top
2. Apply: column.width = 300 (was 150)
3. Re-measure rows 45-48 with new width
4. Restore: newScrollOffset = height(rows 0-45, new) + 12px
5. Defer: requestIdleCallback → measure rows 0-44 and 49+ at idle time
```

### Hybrid data loading timeline

```
Dataset: 1,000,000 rows | Page size: 200 | Prefetch: 2 pages

t=0:     Page 0 fetched (rows 0-199)
         Total scroll height = 1,000,000 × 40px = 40,000,000px
         Scrollbar rendered with proportional thumb

t=5s:    User scrolls to row 150
         Visible: rows 150-170
         Distance to boundary: 199 - 170 = 29 rows (< 100 threshold)
         → Prefetch pages 1 and 2 (rows 200-599)

t=5.2s:  Pages 1 and 2 loaded → cached

t=8s:    User scrolls to row 350
         Visible: rows 350-370 (all in cache — instant render)
         Distance to boundary: 599 - 370 = 229 rows (> 100)
         → No prefetch needed

t=12s:   User jumps to row 50,000
         Page 250 requested (rows 50,000-50,199)
         Rows 50,000-50,020 show skeleton placeholders
         Old pages 0-2 evicted from cache (LRU)

Cache state: { pages: [250], inFlight: 0, totalCount: 1,000,000 }
```

### Virtualized resize performance comparison

```
Naive approach (re-measure ALL rows):
  100,000 rows × 2ms per measurement = 200,000ms = 3.3 minutes
  Main thread blocked → page is frozen

Anchor-based approach (visible rows only):
  30 visible rows × 2ms = 60ms
  Main thread free → scroll is smooth

Deferred approach (remaining rows at idle):
  99,970 remaining rows × 2ms = 199,940ms
  But spread across idle periods → user never notices
  Complete in ~2-3 seconds of background time
```
