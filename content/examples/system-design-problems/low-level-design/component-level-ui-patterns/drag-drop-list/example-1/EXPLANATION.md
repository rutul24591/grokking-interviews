# Drag & Drop List — Implementation Walkthrough

## Overview

This implementation provides a production-grade drag-and-drop list with reordering, multi-column support, touch/keyboard accessibility, FLIP animations, optimistic updates, and screen reader announcements.

## File Structure

```
example-1/
├── lib/
│   ├── drag-drop-types.ts    # Core type definitions
│   ├── drag-drop-store.ts    # Zustand store for drag state
│   ├── pointer-drag-handler.ts  # Pointer event drag detection
│   └── html5-drag-handler.ts    # HTML5 DnD API wrapper
├── hooks/
│   ├── use-draggable.ts      # Hook for individual draggable items
│   ├── use-droppable.ts      # Hook for drop target zones
│   └── use-sortable-list.ts  # Main sortable list orchestrator
└── components/
    ├── drag-drop-list.tsx    # Root container with context
    ├── draggable-item.tsx    # Individual item component
    ├── drop-indicator.tsx    # Visual drop position line
    └── drag-ghost.tsx        # Floating dragged item clone
```

## Module Details

### 1. Types (`lib/drag-drop-types.ts`)

Defines the core type system:

- **`DraggableItem<T>`**: Represents an item in the list. Has `id`, generic `data`, optional `disabled` flag, `groupId` for nested lists, and `columnId` for multi-column (Kanban) layouts.
- **`DropTarget`**: Represents where an item would land if dropped. Contains `itemId`, `position` (before/after), optional `columnId`, and `groupId`.
- **`DragState`**: Tracks the active drag operation with the active item, origin coordinates, current pointer position, dragging flag, drag source type, and source index/column.
- **`DragConfig`**: Tunable parameters: `longPressDelay` (300ms), `movementThreshold` (5px), `animationDuration` (250ms), `ghostOffsetY` (10px), `autoScrollThreshold` (50px), `autoScrollSpeed` (5px/frame), `maxHistoryDepth` (10), `apiDebounceMs` (300ms).
- **`ReorderPayload`**: The API contract for reorder operations.
- **`ReorderHistoryEntry`**: Snapshot of items at a point in time for rollback.
- **`BoundingBox`**: Spatial representation of an element's position for collision detection.

### 2. Zustand Store (`lib/drag-drop-store.ts`)

Manages global drag state via a factory function (`createDragDropStore<T>()`) so multiple lists can have isolated stores.

**State:**
- `activeDrag: DragState | null` — current drag operation
- `dropTarget: DropTarget | null` — current drop target
- `history: ReorderHistoryEntry[]` — previous states for rollback
- `pendingRequests: Map<string, PendingRequest>` — in-flight API calls with AbortControllers

**Actions:**
- `startDrag(state)` — begins a drag operation, clears drop target
- `updatePointer(x, y)` — updates pointer coordinates
- `setDropTarget(target)` — updates the drop target
- `endDrag()` — clears active drag and drop target
- `pushHistory(items)` — saves current state to history (capped at 10 entries)
- `commitReorder()` — clears history on successful API commit
- `rollbackReorder()` — restores previous state from history, returns the entry
- `cancelPendingRequest(key)` — aborts an in-flight API call
- `reset()` — aborts all pending requests and clears all state

### 3. Pointer Drag Handler (`lib/pointer-drag-handler.ts`)

Handles the full pointer event lifecycle for mouse and touch input.

**Lifecycle:**
1. **pointerdown**: Records origin coordinates, starts long-press timer (300ms), captures the pointer, attaches document-level move/up/cancel listeners
2. **pointermove**: Computes delta from origin. If delta exceeds movement threshold (5px), cancels long-press timer and initiates drag immediately
3. **long-press timer fires**: If pointer hasn't moved beyond threshold, initiates drag on long-press (for touch devices)
4. **pointerup**: Ends drag, cleans up listeners
5. **pointercancel**: Cancels drag, cleans up listeners

**Key design:**
- Uses `PointerEvent` which unifies mouse, touch, and pen input
- Pointer capture (`setPointerCapture`) ensures events are received even if the pointer leaves the element
- Document-level listeners ensure events are received even if the pointer moves outside the list
- Cleanup method removes all listeners and cancels timers

### 4. HTML5 Drag Handler (`lib/html5-drag-handler.ts`)

Wrapper around the HTML5 Drag and Drop API for interop scenarios.

**Features:**
- Sets `dataTransfer` with serialized item data using a custom MIME type (`application/x-drag-drop-item`)
- Configures `effectAllowed` and `dropEffect` for visual cursor feedback
- Creates a custom drag image by cloning the source element and styling it
- `parseDragData(e)` static method extracts item data from drag events
- `attach(element)` / `detach(element, events)` lifecycle management

**When to use:** When external drag sources (file explorer, browser tabs, other applications) need to interact with the list. For internal list reordering, pointer events are preferred.

### 5. FLIP Animator (`lib/flip-animator.ts`)

Implements the FLIP animation technique for smooth 60fps reordering.

**FLIP steps:**
1. **First**: `captureFirst(elements)` records `getBoundingClientRect()` of all items BEFORE the DOM updates. Stores in a Map keyed by item ID.
2. **Last**: After React re-renders with the new order, `applyFlip()` queries each element by `[data-item-id]` and gets the new bounding box.
3. **Invert**: Computes `deltaY = first.top - last.top` and applies `transform: translateY(deltaY)` with `transition: none` to instantly move the element back to its old position.
4. **Play**: In the next animation frame (via `requestAnimationFrame`), sets `transition: transform 250ms cubic-bezier(0.2, 0, 0, 1)` and `transform: translateY(0)`. The browser animates from the inverted position to the natural position.

**Key design:**
- Uses `will-change: transform` during animation to promote elements to their own compositor layer
- Cleans up all inline styles after animation completes
- `cancel()` method aborts in-flight animations
- `getPendingAnimationCount()` checks how many elements would animate (useful for skipping animation when only 1 element moves)

### 6. use-draggable Hook (`hooks/use-draggable.ts`)

Attaches pointer and keyboard event listeners to an individual draggable item.

**Pointer behavior:**
- Creates a `PointerDragHandler` instance and attaches `onPointerDown` to the element
- On drag start, sets status to 'dragging' and announces position to screen reader
- On drag end, sets status to 'dropped', then resets to 'idle' after 200ms

**Keyboard behavior:**
- **Space/Enter** (when idle): Picks up the item, sets status to 'grabbed', announces instructions
- **Space/Enter** (when grabbed/dragging): Drops the item, announces drop position
- **ArrowUp** (when grabbed/dragging): Moves item one position up, announces new position
- **ArrowDown** (when grabbed/dragging): Moves item one position down, announces new position
- **Escape** (when not idle): Cancels drag, announces cancellation

**Returns:**
- `props`: Object to spread on the element (`ref`, `tabIndex`, `role`, `aria-*`, `onKeyDown`, `data-item-id`)
- `status`: Current drag status ('idle' | 'grabbed' | 'dragging' | 'dropped')

### 7. use-droppable Hook (`hooks/use-droppable.ts`)

Attaches to drop target zones and computes collision detection.

**Features:**
- Uses `ResizeObserver` to keep bounding boxes up to date as the layout changes
- On each resize, updates the bounding box via `getBoundingClientRect()`
- `checkCollision(pointerX, pointerY)` determines if the pointer is within the element's bounding box
- For vertical lists, splits the box horizontally: top half = "before", bottom half = "after"
- Exposes the collision check function on the element DOM node (`__checkCollision`) for parent traversal
- `findDropTarget()` utility function performs collision detection across multiple targets, using linear scan for small lists (< 50 items) and binary search for larger lists

### 8. use-sortable-list Hook (`hooks/use-sortable-list.ts`)

The main orchestrator hook that coordinates the sortable list.

**Responsibilities:**
- Manages the local item array (`useState`)
- Handles drop events: computes target index, prevents no-ops and circular nesting, computes new order
- Triggers FLIP animation on reorder
- Handles API persistence with optimistic updates and rollback
- Debounces API calls (default 300ms) to batch rapid reorders
- On API failure: restores previous state from history, triggers reverse FLIP, reports error

**Key functions:**
- `handleDrop(dropTarget, sourceIndex, sourceColumnId)`: Computes new order, commits reorder
- `handleMoveItem(index, direction)`: Handles keyboard-driven single-step moves with FLIP animation

### 9. Components

**DragDropListContainer** (`components/drag-drop-list.tsx`):
- Root container that provides `DragDropContext` to all children
- Renders the list with `role="list"`
- Manages `aria-live` region for screen reader announcements
- Subscribes to Zustand store for `activeDrag` and `dropTarget`
- Instantiates `useSortableList` for reorder logic

**DraggableItemComponent** (`components/draggable-item.tsx`):
- Individual item with drag handle, keyboard support, visual states
- Uses `useDraggable` for behavior
- Visual states: default (border-panel), hover (border-accent), dragging placeholder (dashed, dimmed, opacity 40%), drop target (ring-accent)
- Drop position indicator rendered as CSS `::before` / `::after` pseudo-elements
- Drag handle renders a 6-dot grip icon (SVG)

**DropIndicator** (`components/drop-indicator.tsx`):
- Renders a thin horizontal line (2px, accent color) at the computed drop position
- Positioned absolutely within the container to avoid layout impact
- Pulsing animation via Tailwind `animate-pulse`
- Decorative endpoint circles for visual clarity
- `aria-hidden="true"` (purely visual)

**DragGhost** (`components/drag-ghost.tsx`):
- Renders a floating clone of the dragged item following the pointer
- Uses `fixed` positioning with `translate(pointerX, pointerY + offsetY)`
- Scale 1.05x, opacity 0.85, shadow for depth
- Also exports `createDomGhost()` / `removeDomGhost()` for DOM-based ghost cloning

## Data Flow

1. User presses drag handle → `PointerDragHandler` detects movement/long-press → calls `onDragStart`
2. Store sets `activeDrag` → `DragGhost` renders, following pointer
3. Original item becomes placeholder (dimmed, dashed border)
4. Pointer moves → `useDroppable` hooks compute collision → `dropTarget` updates in store
5. `DropIndicator` renders at target position
6. Screen reader announces: "Item picked, position 3 of 12"
7. User releases → `handleDrop` computes new order → saves history → applies reorder → FLIP animation
8. API call fires (debounced 300ms)
9. On success: history cleared. On failure: rollback from history, reverse FLIP, error toast
10. Screen reader announces: "Item dropped at position 7"

## Key Design Decisions

### Pointer Events over HTML5 DnD API
Pointer events provide unified mouse/touch support, custom ghost rendering, and consistent cross-browser behavior. HTML5 DnD has no touch support and limited customization.

### FLIP over CSS transitions
FLIP can animate items that change position in the DOM. Pure CSS transitions cannot animate from "where the item was" to "where the item is" because the browser has no memory of the old position.

### Optimistic Updates with Rollback
Immediate UI feedback (0ms latency) with safety net (history-based rollback). The history stack is capped at 10 entries to limit memory usage.

### Debounced API Calls
300ms debounce batches rapid reorders (e.g., keyboard arrow presses) into a single API request, reducing network traffic and server load.

### Collision Detection: Linear vs Binary Search
For lists under 50 items, linear scan is faster than binary search due to function call overhead. For larger lists, binary search on Y-sorted bounding boxes provides O(log n) lookups.
