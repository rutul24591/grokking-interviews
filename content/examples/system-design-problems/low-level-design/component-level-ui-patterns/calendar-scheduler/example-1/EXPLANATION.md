# Calendar / Scheduler — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + pure utilities + view components** pattern:

```
┌──────────────────────┐     ┌───────────────────────┐     ┌──────────────────┐
│   Calendar Root      │────▶│   Zustand Store       │────▶│   View Components │
│   (view switcher,    │     │   (view, date, events, │     │   (month, week,   │
│    nav header)       │     │    drag, modal)        │     │    day, agenda)   │
└──────────────────────┘     └───────────┬───────────┘     └─────────┬────────┘
                                         │                           │
                    ┌────────────────────┼────────────────┐          │
                    │                    │                │          │
              ┌─────▼─────┐     ┌───────▼───────┐  ┌────▼─────┐    │
              │ Collision  │     │ Recurring     │  │ TimeSlot │    │
              │ Detector   │     │ Expander      │  │ Utils    │    │
              └────────────┘     └───────────────┘  └──────────┘    │
                                                                     │
                    ┌────────────────────────────────────────────────┘
                    │
              ┌─────▼──────────┐
              │ useCalendar     │
              │ Events Hook    │
              │ (filter+merge) │
              └────────────────┘
```

### Design Decisions

1. **Zustand for state management** — Selector-based subscriptions prevent unnecessary re-renders. The month view subscribes only to `currentView`, `activeDate`, and `events`, so drag operations don't trigger month view re-renders.

2. **Pure utility functions** — Collision detection and recurring expansion are pure functions with no side effects. This makes them easy to test, memoize, and reason about. They take input (events, date range) and return output (collision groups, occurrence list).

3. **Sweep-line collision detection** — O(n log n) algorithm that sorts events by start time and assigns each to the first non-overlapping column. Handles up to MAX_COLUMNS (4) simultaneous events, with overflow stacking for denser schedules.

4. **Drag preview via requestAnimationFrame** — `mousemove` fires at 60Hz. Updating Zustand store on every event would cause 60 re-renders per second. Instead, we store preview state in a `useRef` and update via `requestAnimationFrame`, committing to the store only on `mouseup`.

## File Structure

```
example-1/
├── lib/
│   ├── calendar-types.ts            # TypeScript interfaces
│   ├── calendar-store.ts            # Zustand store + selectors
│   ├── event-collision-detector.ts  # Sweep-line collision detection
│   ├── recurring-event-expander.ts  # RRULE expansion with exception handling
│   └── time-slot-utils.ts           # Time slot generation, snap-to-grid, positioning
├── hooks/
│   ├── use-calendar-navigation.ts   # Date range computation, prev/next/today
│   ├── use-event-drag.ts           # Drag-to-move/resize with preview + rollback
│   └── use-calendar-events.ts      # Event filtering, recurring expansion, collision grouping
├── components/
│   ├── calendar.tsx                 # Root calendar with view switcher, nav header
│   ├── calendar-month-view.tsx     # Month grid with day cells, multi-day events
│   ├── calendar-week-view.tsx      # Time grid with hour rows, collision layout
│   ├── calendar-event.tsx          # Event block with drag/resize handles, color coding
│   ├── event-creation-modal.tsx    # Form for new event
│   └── mini-calendar.tsx           # Small month calendar for quick navigation
└── EXPLANATION.md                   # This file
```

## Key Implementation Details

### Zustand Store (lib/calendar-store.ts)

The store manages five state slices: `currentView`, `activeDate`, `events`, `dragState`, and `modalState`. Key actions:

- **`setView(view)`** — Switches between month, week, day, agenda views.
- **`goPrev()` / `goNext()`** — Navigates by one period (month, week, or day depending on current view).
- **`goToday()`** — Resets active date to today.
- **`selectDate(date)`** — Sets active date from mini calendar click.
- **`addEvent(event)`** — Appends event to the array.
- **`updateEvent(id, updates)`** — Replaces event fields by ID.
- **`startDrag(event, mode)`** — Records event ID, original position, and drag mode (move or resize).
- **`updateDragPreview(start, end)`** — Updates preview times during drag.
- **`endDrag(success)`** — If success=true, commits preview times to the event. If false, rolls back to original position.
- **`openModal(start, end)`** / **`closeModal()`** — Controls the event creation modal.

Exported selectors (`selectCurrentView`, `selectActiveDate`, etc.) enable fine-grained subscriptions so view components only re-render when their specific state slice changes.

### Collision Detector (lib/event-collision-detector.ts)

Implements a sweep-line algorithm:

1. **Sort** events by start time (ties broken by duration descending — longer events get priority columns).
2. **Maintain** an array of column end times (the end timestamp of the last event in each column).
3. **For each event**, find the first column where the event's start time is >= the column's end time (no overlap). Assign to that column.
4. **If no column is available** and max columns (4) haven't been reached, create a new column.
5. **If max columns reached**, assign to the column with the earliest end time (events stack vertically).

Result: a `CollisionGroup` with each event assigned a `columnIndex` and `totalColumns`. In the week view, events render with `width: calc(100% / totalColumns)` and `left: calc(100% / totalColumns * columnIndex)`.

### Recurring Event Expander (lib/recurring-event-expander.ts)

Generates individual occurrences from a recurring event within a date range:

- **DAILY**: Advances by `interval` days from the event start.
- **WEEKLY**: Advances by `interval * 7` days.
- **MONTHLY**: Advances by `interval` months, with month-end clamping (e.g., 31st in a 30-day month becomes the 30th).
- **YEARLY**: Advances by `interval` years, with leap year handling (Feb 29 in non-leap year becomes Feb 28).
- **Exception dates**: A Set of ISO date strings. If a generated occurrence matches an exception, it is excluded.
- **Hard cap**: 730 occurrences (2 years) to prevent infinite loops from RRULEs with no end date.

Each occurrence gets a unique ID: `${originalId}-${dateKey}`.

### Time Slot Utilities (lib/time-slot-utils.ts)

- **`generateTimeSlots(date, granularity)`** — Returns 48 slots (30-min) or 24 slots (60-min) from 00:00 to 23:59.
- **`snapToGrid(date, granularity)`** — Rounds a Date to the nearest grid boundary. E.g., 9:17 AM with 30-min granularity snaps to 9:00 AM.
- **`getTimeOffsetPx(date, slotHeight, granularity)`** — Computes the pixel offset from midnight for absolute positioning in week view.
- **`getEventHeightPx(start, end, slotHeight, granularity)`** — Computes the pixel height based on event duration.

### useCalendarNavigation Hook (hooks/use-calendar-navigation.ts)

Computes the visible date range for each view:

- **Month view**: First day of the week containing the 1st through last day of the week containing the month's end (typically 35 or 42 days).
- **Week view**: Monday through Sunday of the active week (7 days).
- **Day view**: Single active date (1 day).
- **Agenda view**: 4-week window from the active date (28 days).

Also exposes `goPrev`, `goNext`, `goToday`, and `selectDate` actions.

### useEventDrag Hook (hooks/use-event-drag.ts)

Handles drag interactions:

1. **mousedown** on drag handle: Records event ID, original position, drag mode. Adds `mousemove` and `mouseup` listeners on `document`.
2. **mousemove**: Computes delta Y from the start position, converts to time delta (slots * granularity), creates preview dates, and updates via `requestAnimationFrame` (avoids 60 re-renders/sec).
3. **mouseup**: Removes listeners, commits to store via `endDrag(true)`.
4. **Escape key during drag**: Calls `endDrag(false)` to trigger rollback.

The hook returns `isDragging`, `previewStart`, `previewEnd`, and mouse down handlers for the event component.

### useCalendarEvents Hook (hooks/use-calendar-events.ts)

Memoized hook that:

1. Filters events by visible date range.
2. Expands recurring events via `expandAllRecurringEvents`.
3. Runs collision detection via `detectCollisionsByDay`.
4. Enriches each occurrence with `columnIndex` and `totalColumns`.

Recomputes only when `events` or `dateRange` changes (via `useMemo`).

### Month View (components/calendar-month-view.tsx)

Renders a 7-column grid. Key features:

- **Day cells**: Show day number (highlighted circle for today) and events starting on that day.
- **Multi-day events**: Span multiple cells with `gridColumn: span N`. First day shows the event block, continuation days show a subtle bar.
- **Overflow**: If a day has more than 3 events, shows "+N more" link.
- **Accessibility**: `role="grid"`, `role="gridcell"`, `aria-label` per cell.

### Week View (components/calendar-week-view.tsx)

Renders a time grid with absolute event positioning:

- **Time axis**: Left column with hour labels at each slot boundary.
- **Day columns**: 7 columns (Mon-Sun), each with grid lines at slot intervals.
- **Events**: Positioned absolutely with `top` (from `getTimeOffsetPx`), `height` (from `getEventHeightPx`), `left` and `width` (from collision detection).
- **Current time indicator**: Red horizontal line at the current time position (only on today's column).
- **Drag preview**: Ghost event block renders at the preview position during drag.

### Calendar Event (components/calendar-event.tsx)

Renders individual event blocks:

- **Month variant**: Compact, title-only, with color-coded left border. Supports multi-day spanning.
- **Week variant**: Full block with title, time range, drag handle (grip icon at top), and resize handle (drag bar at bottom).
- **Drag handle**: Visible on hover, triggers `onMoveMouseDown`.
- **Resize handle**: Visible on hover, triggers `onResizeMouseDown`.
- **During drag**: Event becomes `opacity-50` to show it is being moved.

### Event Creation Modal (components/event-creation-modal.tsx)

Form modal with fields for title, date, start/end time, all-day toggle, recurrence selector, color picker, and description. On submit, validates end > start, constructs a `CalendarEvent`, and dispatches `addEvent`. Closes on Escape key or backdrop click. Uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` for accessibility.

### Mini Calendar (components/mini-calendar.tsx)

Compact month calendar for quick navigation. Highlights the selected date with a filled circle, today with a ring outline, and prev/next month days with dimmed text. Clicking a day sets the store's `activeDate` and switches to day view.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Multi-day event spanning month boundaries | Renders partial blocks in both months with start/continuation indicators |
| Recurring event with exception date on visible day | Excluded from expanded occurrence list |
| Drag across DST boundary | UTC storage is invariant; display time uses `Intl.DateTimeFormat` with user's time zone |
| 15+ overlapping events in one slot | Column cap at 4, remaining events stack with overflow indicator |
| Time zone change | All event times re-render with new offset; positions computed from UTC timestamps |
| Infinite recurring event (no end date) | Capped at 730 occurrences (2 years) |
| Month-end recurring (31st in 30-day month) | Clamped to last day of intended month |
| Leap year recurring (Feb 29) | In non-leap years, clamped to Feb 28 |
| Drag during API failure | Store rolls back event to original position from `dragState.originalStart/End` |
| SSR rendering | Calendar renders skeleton/empty state during SSR; hydrates on client mount |

## Performance Characteristics

- **Event filtering**: O(n) — iterate all events
- **Recurring expansion**: O(r * k) — r recurring definitions, k occurrences each (capped at 730)
- **Collision detection**: O(n log n) — sort + sweep-line column assignment
- **Time slot generation**: O(s) — s slots per day (48 for 30-min)
- **Drag preview update**: O(1) — ref update + requestAnimationFrame, no re-render
- **Store operations**: O(1) — array push/splice, Map lookup

## Testing Strategy

1. **Unit tests**: Test collision detector with 2, 3, and 10+ overlapping events. Test recurring expander with daily/weekly/monthly/yearly patterns, exception dates, and infinite recurrence cap. Test time slot utilities for correct slot count, snap-to-grid, and offset calculations.

2. **Integration tests**: Render month view, verify events in correct cells and multi-day spanning. Render week view with overlapping events, verify side-by-side layout. Simulate drag-and-drop, verify store updates. Test event creation modal form submission.

3. **Accessibility tests**: Run axe-core on calendar grid, verify `role="grid"`, `aria-label` on cells, keyboard navigation (arrow keys, Enter, Escape), and screen reader announcements.

4. **Edge case tests**: Multi-day events across month boundaries, DST transitions, 15+ overlapping events, time zone changes, and infinite recurring events.
