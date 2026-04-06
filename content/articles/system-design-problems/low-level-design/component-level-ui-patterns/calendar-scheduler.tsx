"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-calendar-scheduler",
  title: "Design a Calendar / Scheduler",
  description:
    "Complete LLD solution for a production-grade calendar/scheduler with drag-and-drop event movement, collision detection, recurring event expansion, multi-view rendering, time zone support, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "calendar-scheduler",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "calendar",
    "scheduler",
    "drag-and-drop",
    "collision-detection",
    "recurring-events",
    "state-management",
    "accessibility",
  ],
  relatedTopics: [
    "date-time-picker",
    "drag-drop-list",
    "modal-component",
    "data-table",
  ],
};

export default function CalendarSchedulerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable calendar/scheduler component for a large-scale
          React application. The calendar must support multiple views (month grid, week
          time-grid, day detail, and agenda list), render events as colored blocks on
          time slots, allow users to drag events to move them between time slots or
          resize them by dragging edges, detect and resolve overlapping events with
          side-by-side layout, expand recurring events from pattern definitions into
          individual occurrences within a visible date range, support time zone
          conversion for display, and provide full keyboard navigation and screen reader
          accessibility. The calendar must be globally accessible through a Zustand store
          so that any component can query or modify the current view, date range, or
          event data without prop drilling.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Events are stored on the backend in UTC. The frontend converts to the
            user&apos;s local time zone for display.
          </li>
          <li>
            Recurring events follow RRULE patterns (daily, weekly, monthly, yearly) with
            optional exception dates and an end date or occurrence count.
          </li>
          <li>
            Multiple events can overlap in the same time slot. They must render
            side-by-side with proper column assignment.
          </li>
          <li>
            Drag operations support both moving an event to a new time slot and resizing
            its duration by dragging the bottom edge.
          </li>
          <li>
            The calendar supports keyboard navigation: arrow keys move between cells,
            Enter creates a new event, Escape cancels an in-progress operation.
          </li>
          <li>
            Maximum event density per time slot is unbounded, but the collision layout
            algorithm must handle 10+ overlapping events gracefully.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Multi-view rendering:</strong> Support month view (7-column grid of
            days), week view (time slots with hour rows), day view (detailed single-day
            time grid), and agenda view (scrollable list of upcoming events).
          </li>
          <li>
            <strong>Event rendering:</strong> Events render as colored blocks positioned
            on time slots. Multi-day events span multiple cells in month view with
            continuation indicators.
          </li>
          <li>
            <strong>Drag to move:</strong> Users can drag an event from its current time
            slot to a different slot. The event updates its start time while preserving
            duration.
          </li>
          <li>
            <strong>Drag to resize:</strong> Users can drag the bottom edge of an event
            to extend its duration. The end time updates in real time during the drag.
          </li>
          <li>
            <strong>Collision detection:</strong> Overlapping events in the same time
            slot are detected and rendered side-by-side with proportional column widths.
          </li>
          <li>
            <strong>Recurring events:</strong> Events with RRULE patterns expand into
            individual occurrences within the visible date range. Exception dates
            exclude specific occurrences.
          </li>
          <li>
            <strong>Event creation:</strong> Clicking an empty slot or dragging across
            multiple slots opens a modal form for creating a new event with title, time,
            recurrence, and description.
          </li>
          <li>
            <strong>Navigation:</strong> Previous/next period buttons, today button, and
            a mini month calendar for quick date selection.
          </li>
          <li>
            <strong>Keyboard navigation:</strong> Arrow keys navigate between cells,
            Enter creates an event on the focused cell, Escape cancels modal or drag
            operations.
          </li>
          <li>
            <strong>Time zone support:</strong> Events stored in UTC are converted to
            the user&apos;s configured time zone. A time zone selector is available in
            settings.
          </li>
          <li>
            <strong>Accessibility:</strong> Calendar grid uses <code>role="grid"</code>,
            each cell has <code>aria-label</code> with the date, and all interactive
            elements are keyboard-accessible.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Month view with 200+ events (including
            expanded recurring occurrences) must render without jank. Virtualization
            should be considered for week/day views with dense event data.
          </li>
          <li>
            <strong>Scalability:</strong> The collision detection algorithm must handle
            50+ overlapping events in a single time slot within O(n log n) time.
          </li>
          <li>
            <strong>Reliability:</strong> Drag operations must not lose event data.
            Failed API updates should rollback the event to its pre-drag state.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for event shapes,
            recurring patterns, collision groups, and view types.
          </li>
          <li>
            <strong>SSR Safety:</strong> The calendar must render a skeleton or empty
            state during SSR and hydrate correctly on the client.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Multi-day event spanning month boundaries — must render partial blocks in
            the first and last month with correct start/end indicators.
          </li>
          <li>
            Recurring event with an exception date that falls on a visible day — the
            occurrence must be excluded from rendering.
          </li>
          <li>
            Drag event across DST boundary — the displayed time must adjust correctly
            for the time change (e.g., 2 AM becomes 3 AM).
          </li>
          <li>
            15+ overlapping events in a 30-minute slot — columns become too narrow.
            Must cap column count and show overflow indicator.
          </li>
          <li>
            User changes time zone while viewing — all event times must re-render with
            the new offset without losing event positions.
          </li>
          <li>
            Recurring event with no end date (infinite recurrence) — must cap expansion
            to a reasonable range (e.g., 2 years from today) to prevent infinite loops.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>calendar state management</strong> from
          the <strong>view rendering</strong> and <strong>event computation</strong>. A
          Zustand store holds the current view type, active date range, event list,
          selected date, and drag state. Pure utility functions handle event collision
          detection, recurring event expansion, and time slot generation. Each view
          component (month, week, day, agenda) subscribes to the store, computes its
          visible events, and renders them with appropriate layout.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Context API + useReducer:</strong> Viable but the calendar has
            multiple independent state slices (view state, event data, drag state, modal
            state). A single context would cause unnecessary re-renders across all
            consumers. Zustand selectors allow each view component to subscribe only to
            the state it needs.
          </li>
          <li>
            <strong>Full calendar library (FullCalendar, react-big-calendar):</strong>
            These provide out-of-the-box functionality but are heavy bundles (50KB+
            gzipped) and offer limited customization. For a design interview, building
            from scratch demonstrates understanding of the underlying algorithms
            (collision detection, recurring expansion, drag mechanics).
          </li>
          <li>
            <strong>Server-side rendering of all views:</strong> Pre-computing all view
            layouts on the server eliminates client-side computation but increases
            bandwidth and makes interactive features (drag, resize) harder to implement.
            Client-side computation is the right trade-off for an interactive calendar.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + pure utilities is optimal:</strong> Zustand provides
          lightweight, selector-based state management. Collision detection and recurring
          expansion are pure functions — they take input (events, date range) and return
          output (collision groups, occurrence list) with no side effects. This makes
          them easy to test, memoize, and reason about. The view components are
          stateless renderers that receive computed data as props.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Calendar Types (<code>calendar-types.ts</code>)</h4>
          <p>
            Defines the core type system: <code>CalendarEvent</code> with fields for id,
            title, start, end, color, description, recurring pattern, and exception dates;
            <code>CalendarView</code> union (`month` | `week` | `day` | `agenda`);
            <code>RecurringPattern</code> with frequency, interval, end date, and count;
            <code>TimeSlot</code> with start time, duration, and snap granularity;
            <code>CollisionGroup</code> with events array, column assignment, and max
            columns. These types form the contract between all modules.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Calendar Store (<code>calendar-store.ts</code>)</h4>
          <p>
            Zustand store managing current view, active date range, event list, selected
            date, drag state (dragging event id, resize mode, preview position), and modal
            state (open/closed, pre-filled date/time). Exposes actions for view switching,
            date navigation (prev/next/today), event CRUD, drag state transitions, and
            modal control. The store is the single source of truth for all calendar state.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Event Collision Detector (<code>event-collision-detector.ts</code>)</h4>
          <p>
            Pure function that takes an array of events within a time range and returns
            collision groups. Uses a sweep-line algorithm: sort events by start time,
            maintain active event columns, assign each event to the first non-overlapping
            column or create a new column. Computes max columns per group for proportional
            width calculation. Time complexity is O(n log n) due to sorting; column
            assignment is O(n * k) where k is max columns per group. See the Example tab
            for the complete algorithm implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Recurring Event Expander (<code>recurring-event-expander.ts</code>)</h4>
          <p>
            Pure function that generates individual occurrence objects from a recurring
            event definition within a date range. Supports RRULE frequencies (daily,
            weekly, monthly, yearly) with interval multipliers. Handles exception dates
            by filtering out matching occurrences. Caps infinite recurrences to a maximum
            of 730 occurrences (2 years) to prevent runaway computation. See the Example
            tab for the complete expansion logic.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Time Slot Utilities (<code>time-slot-utils.ts</code>)</h4>
          <p>
            Generates time slot arrays for week/day views at configurable granularities
            (15, 30, or 60 minutes). Provides snap-to-grid rounding for drag operations,
            duration calculation between two Date objects, and hour label formatting.
            Slots are pre-computed once per view render and reused across event
            positioning calculations.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Custom Hooks</h4>
          <p>
            <strong>`use-calendar-navigation.ts`</strong> — Computes the visible date
            range for each view type, handles prev/next/today navigation, and manages
            mini calendar date selection.
          </p>
          <p className="mt-2">
            <strong>`use-event-drag.ts`</strong> — Handles drag-to-move and drag-to-resize
            interactions. Computes the target time slot from mouse position, provides
            visual feedback via preview state, and detects collisions during drag for
            real-time collision preview.
          </p>
          <p className="mt-2">
            <strong>`use-calendar-events.ts`</strong> — Filters events by the visible date
            range, expands recurring events into occurrences, and sorts them by start
            time. Memoized to avoid recomputation on unrelated state changes.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. View Components</h4>
          <p>
            <strong>`calendar.tsx`</strong> — Root component with view switcher,
            navigation header, and event grid orchestration.
          </p>
          <p className="mt-2">
            <strong>`calendar-month-view.tsx`</strong> — 7-column month grid with day
            cells, multi-day event spanning, and overflow indicators.
          </p>
          <p className="mt-2">
            <strong>`calendar-week-view.tsx`</strong> — Time grid with hour rows, event
            blocks positioned absolutely within the time column, collision-aware
            side-by-side layout.
          </p>
          <p className="mt-2">
            <strong>`calendar-event.tsx`</strong> — Individual event block with drag
            handle, resize handle, color-coded left border, and overflow text truncation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. Supporting Components</h4>
          <p>
            <strong>`event-creation-modal.tsx`</strong> — Form modal for new events:
            title input, date/time pickers, recurrence selector, color picker, and
            description textarea.
          </p>
          <p className="mt-2">
            <strong>`mini-calendar.tsx`</strong> — Compact month calendar for quick date
            navigation. Highlights the currently selected date and the active date range.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store maintains five state slices:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <code>currentView: CalendarView</code> — active view type (month, week, day,
            agenda)
          </li>
          <li>
            <code>activeDate: Date</code> — the reference date for navigation (first day
            of visible week/month, or selected day)
          </li>
          <li>
            <code>events: CalendarEvent[]</code> — all events (single and recurring
            definitions)
          </li>
          <li>
            <code>dragState</code> — currently dragged event ID, drag mode
            (`move` | `resize`), preview start/end times, and original position for
            rollback
          </li>
          <li>
            <code>modalState</code> — open flag, pre-filled start/end dates from the
            clicked slot
          </li>
        </ul>
        <p className="mt-3">
          View components subscribe to only the slices they need. The month view
          subscribes to `currentView`, `activeDate`, and `events`. The drag hook
          subscribes to `dragState` and `events`. This prevents unnecessary re-renders.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/calendar-scheduler-architecture.svg"
          alt="Calendar scheduler architecture showing event store, view rendering, and drag-drop flow"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User opens calendar. Root component renders with default view (month).
          </li>
          <li>
            `useCalendarEvents` filters events by visible date range, expands recurring
            occurrences, returns sorted occurrence list.
          </li>
          <li>
            Month view renders 7-column grid. Events are placed in day cells. Multi-day
            events span cells with continuation indicators.
          </li>
          <li>
            User switches to week view via view switcher. Store updates `currentView`.
          </li>
          <li>
            Week view renders time grid (00:00 to 23:30 at 30-min granularity). Events
            are positioned absolutely within the time column.
          </li>
          <li>
            Collision detector groups overlapping events and assigns columns. Events
            render side-by-side with proportional widths.
          </li>
          <li>
            User drags an event to a new time slot. `useEventDrag` computes target slot,
            updates preview state, and shows collision preview.
          </li>
          <li>
            On drop, store updates the event&apos;s start time. If the API call fails,
            event rolls back to original position.
          </li>
          <li>
            User clicks an empty slot. Modal opens with pre-filled date/time. User fills
            form, submits. Store adds the event. Store adds event to array, modal closes.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions. Pure utility functions (collision detection, recurring expansion)
          are called within memoized hooks to avoid recomputation on unrelated state
          changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Event Filtering and Expansion Pipeline</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            `useCalendarEvents` receives the full event array and the visible date range
            (start, end) from `useCalendarNavigation`.
          </li>
          <li>
            For each event, check if it has a recurring pattern. If yes, call the
            recurring expander to generate occurrences within [start, end].
          </li>
          <li>
            For single events, check if the event overlaps [start, end]. If yes, include
            it as a single occurrence.
          </li>
          <li>
            Merge all occurrences (expanded recurring + single events), sort by start
            time. Memoize the result — recompute only when events or date range changes.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Collision Detection Pipeline (Week View)</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Week view receives the filtered occurrence list for the visible week.
          </li>
          <li>
            Group occurrences by day (events on different days cannot collide).
          </li>
          <li>
            For each day, pass the day&apos;s events to the collision detector. The
            detector sorts events by start time, then iterates through them assigning
            each to the first available column.
          </li>
          <li>
            The detector returns collision groups with column assignments. Each event
            knows its `columnIndex` and `totalColumns`.
          </li>
          <li>
            Events render with `width: calc(100% / totalColumns)` and
            `left: calc(100% / totalColumns * columnIndex)`.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>DST transitions:</strong> When computing event times across a DST
            boundary, use the `Intl.DateTimeFormat` API with the user&apos;s time zone
            to correctly handle the offset shift. The stored UTC time is invariant; only
            the display time changes.
          </li>
          <li>
            <strong>Infinite recurring events:</strong> The recurring expander caps at
            730 occurrences (2 years). If an RRULE has no end date and no count, the
            expander generates occurrences from the visible range start up to 2 years
            from today, then stops.
          </li>
          <li>
            <strong>Column overflow:</strong> If a collision group exceeds the maximum
            column count (default: 4), the remaining events stack below with an
            &quot;+N more&quot; indicator. This prevents columns from becoming too narrow
            to interact with.
          </li>
          <li>
            <strong>Drag rollback:</strong> If the API call to update an event&apos;s time
            fails, the store restores the event to its original start/end times from the
            `originalPosition` stored in `dragState`. The UI re-renders the event at its
            pre-drag position.
          </li>
          <li>
            <strong>SSR hydration:</strong> During SSR, the calendar renders a skeleton
            grid with no events. On client hydration, the store initializes with the
            current date and events, and the full calendar renders. This avoids
            hydration mismatches.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 15 files:
            TypeScript interfaces for all types, Zustand store with navigation and drag
            state, collision detection algorithm with sweep-line column assignment,
            recurring event expander with RRULE support, time slot utilities, three
            custom hooks for navigation/drag/event-filtering, six view and supporting
            components, and a full EXPLANATION.md walkthrough. Click the
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Calendar Types (calendar-types.ts)</h3>
        <p>
          Defines the <code>CalendarEvent</code> interface with id, title, start, end,
          and all-day flag. The <code>CalendarView</code> union supports month, week,
          day, and agenda. The <code>RecurringPattern</code> captures frequency, interval,
          end date, occurrence count, and exception dates. <code>CollisionGroup</code>
          holds an events array, column assignments, and max column count. These types
          are the shared contract across all modules.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Calendar Store (calendar-store.ts)</h3>
        <p>
          The Zustand store manages five state slices: current view, active date, event
          array, drag state, and modal state. Key actions include `setView`, `navigate`
          (prev/next/today), `selectDate` (from mini calendar), `setEvents` (bulk update),
          `addEvent`, `updateEvent`, `deleteEvent`, `startDrag`, `updateDragPreview`,
          `endDrag` (with rollback support), `openModal`, and `closeModal`. The store
          exports selectors for each state slice to enable fine-grained subscriptions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Event Collision Detector (event-collision-detector.ts)</h3>
        <p>
          Implements a sweep-line algorithm. Events are sorted by start time, then
          iterated through. For each event, the algorithm checks existing columns to find
          the first column where the event does not overlap with the column&apos;s last
          event. If no such column exists, a new column is created. The result is a
          <code>CollisionGroup</code> per day with each event assigned a column index and
          the total column count. This enables proportional width and positioning
          calculations in the week view renderer.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Recurring Event Expander (recurring-event-expander.ts)</h3>
        <p>
          Takes a recurring event definition and a date range, then generates individual
          occurrence objects. For `DAILY` frequency, it advances by `interval` days from
          the event start. For `WEEKLY`, it advances by `interval` weeks. For `MONTHLY`,
          it advances by `interval` months (handling month-end edge cases). For `YEARLY`,
          it advances by `interval` years. Each generated occurrence is checked against
          the exception dates array and the visible range. Occurrences outside the range
          or matching an exception are excluded. A hard cap of 730 occurrences prevents
          infinite loops.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Time Slot Utilities (time-slot-utils.ts)</h3>
        <p>
          Provides `generateTimeSlots(granularity)` returning an array of time slot
          objects from 00:00 to 23:59 at 15, 30, or 60 minute intervals.
          `snapToGrid(date, granularity)` rounds a Date to the nearest grid boundary for
          drag positioning. `calculateDuration(start, end)` returns the duration in
          minutes. `formatHour(date)` returns a locale-aware hour label for the time
          axis. These utilities are pure functions with no external dependencies.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useCalendarNavigation Hook</h3>
        <p>
          Computes the visible date range (start, end) for the current view. For month
          view, it returns the first day of the month&apos;s week (including trailing
          days from the previous month) through the last day of the month&apos;s week.
          For week view, it returns the Monday through Sunday of the active week. For day
          view, it returns the single active date. The hook also exposes `goPrev`,
          `goNext`, and `goToday` actions that update the store&apos;s active date.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: useEventDrag Hook</h3>
        <p>
          Handles drag-to-move and drag-to-resize interactions. On `mousedown` on an
          event&apos;s drag handle, it records the event ID, original position, and drag
          mode. On `mousemove`, it computes the target time slot from the mouse Y
          position, snaps to grid, and updates the drag preview state. The week view
          renders a ghost preview at the target position. On `mouseup`, it dispatches
          the update to the store. If the API call fails, the store rolls back to the
          original position. Pressing Escape during drag cancels the operation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: useCalendarEvents Hook</h3>
        <p>
          Memoized hook that filters events by visible date range, expands recurring
          events into occurrences, merges single and recurring occurrences, and sorts by
          start time. Recomputes only when the event array or date range changes. Returns
          an array of occurrence objects with all fields needed for rendering (start, end,
          column assignment from collision detector, etc.).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Calendar Root (calendar.tsx)</h3>
        <p>
          Root component that renders the view switcher (month, week, day, agenda tabs),
          navigation header (prev/next/today, current period label), and the active view
          component. Subscribes to `currentView` from the store. Conditionally renders
          `CalendarMonthView`, `CalendarWeekView`, or the agenda list based on the active
          view. Wraps the `EventCreationModal` and `MiniCalendar` as side panels.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Month View (calendar-month-view.tsx)</h3>
        <p>
          Renders a 7-column grid (Sunday through Saturday or locale-aware first day of
          week). Each cell shows the day number and events starting on that day. Multi-day
          events render with a start indicator (left edge highlight) on the first day,
          continuation bars on intermediate days, and an end indicator on the last day.
          If a day has more events than fit, an &quot;+N more&quot; overflow link expands
          to show all events.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: Week View (calendar-week-view.tsx)</h3>
        <p>
          Renders a time grid with hour rows (00:00 to 23:00) and a left time axis.
          Events are positioned absolutely within the time column based on their start
          time and duration. The collision detector assigns columns, and events render
          side-by-side with `width: calc(100% / totalColumns)` and offset left positions.
          A drag preview ghost renders during drag operations. The current time indicator
          (red horizontal line) shows the present time.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: Calendar Event (calendar-event.tsx)</h3>
        <p>
          Renders an individual event block with a color-coded left border, title text
          (truncated with ellipsis), time label, drag handle (grip icon at top), and
          resize handle (drag bar at bottom). Supports month view (compact, title-only)
          and week view (full, with time and positioning) rendering modes. Uses
          `pointer-events-none` during drag to avoid interfering with the drop target
          detection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 13: Event Creation Modal (event-creation-modal.tsx)</h3>
        <p>
          Modal form with fields for title (text input), date (date picker), start time
          and end time (time pickers), all-day toggle (checkbox), recurrence selector
          (dropdown: none, daily, weekly, monthly, yearly), color picker (preset swatches),
          and description (textarea). On submit, validates that end is after start,
          constructs a `CalendarEvent` object, and dispatches `addEvent` to the store.
          Closes on Escape key or backdrop click.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 14: Mini Calendar (mini-calendar.tsx)</h3>
        <p>
          Compact month calendar rendered as a side panel. Shows the current month&apos;s
          grid with day numbers. Highlights the currently selected date with a filled
          circle. Highlights the active date range with a subtle background fill. Clicking
          a day navigates to that date (sets the store&apos;s active date and switches to
          day view if needed). Arrow keys navigate between months.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Event filtering</td>
                <td className="p-2">O(n) — iterate all events</td>
                <td className="p-2">O(m) — m occurrences in range</td>
              </tr>
              <tr>
                <td className="p-2">Recurring expansion</td>
                <td className="p-2">O(r * k) — r recurring, k occurrences each</td>
                <td className="p-2">O(k) — occurrence array</td>
              </tr>
              <tr>
                <td className="p-2">Collision detection</td>
                <td className="p-2">O(n log n) — sort + sweep</td>
                <td className="p-2">O(n) — column assignments</td>
              </tr>
              <tr>
                <td className="p-2">Time slot generation</td>
                <td className="p-2">O(s) — s slots per day</td>
                <td className="p-2">O(s) — slot array</td>
              </tr>
              <tr>
                <td className="p-2">Drag preview update</td>
                <td className="p-2">O(1) — single event reposition</td>
                <td className="p-2">O(1) — preview state</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of events in the visible range,
          <code>r</code> is the number of recurring event definitions, <code>k</code> is
          the max occurrences per recurring event (capped at 730), and <code>s</code> is
          the number of time slots per day (48 for 30-min granularity). For a typical
          week view with 200 events and 5 recurring definitions, total computation is
          well under 10ms.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Recurring expansion on every view change:</strong> Switching from
            month to week view triggers re-expansion of all recurring events. Mitigation:
            memoize occurrences keyed by (event-id, date-range). If the new range
            overlaps with the cached range, filter the cached array instead of
            re-expanding.
          </li>
          <li>
            <strong>Collision detection on every render:</strong> Running the O(n log n)
            algorithm on every render is wasteful if events haven&apos;t changed.
            Mitigation: wrap the collision detector call in `useMemo` with dependencies
            on the occurrence array. Only recompute when events change.
          </li>
          <li>
            <strong>Drag preview re-renders:</strong> `mousemove` fires at 60Hz. Updating
            Zustand store on every event would cause 60 re-renders per second. Mitigation:
            store drag preview in a `useRef` and update via `requestAnimationFrame`. Only
            commit to Zustand store on `mouseup`.
          </li>
          <li>
            <strong>Month view with 500+ events:</strong> Rendering 500 event blocks in
            the DOM causes layout thrashing. Mitigation: virtualize the month grid using
            `@tanstack/react-virtual` or cap visible events per cell to 3-4 with an
            overflow indicator.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Memoized event filtering:</strong> `useCalendarEvents` uses `useMemo`
            with dependencies on `events` and `dateRange`. Switching views without
            changing the date range returns the cached occurrence array.
          </li>
          <li>
            <strong>Selector-based subscriptions:</strong> Each view component subscribes
            to only the store slices it needs. The month view doesn&apos;t subscribe to
            `dragState`, so drag operations don&apos;t trigger month view re-renders.
          </li>
          <li>
            <strong>CSS containment:</strong> Apply `contain: layout style` to event
            blocks to isolate them from the browser&apos;s layout engine. This reduces
            reflow when events are repositioned during drag.
          </li>
          <li>
            <strong>will-change for drag preview:</strong> Apply `will-change: transform`
            to the drag ghost element to promote it to its own compositor layer, avoiding
            layout recalculations during the drag animation.
          </li>
          <li>
            <strong>Debounced time zone changes:</strong> When the user changes the time
            zone, debounce the re-render by 50ms to avoid intermediate states during the
            dropdown selection.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Event titles and descriptions may contain user-generated content. If rendered
          with <code>dangerouslySetInnerHTML</code> (e.g., rich text descriptions), they
          are XSS vectors. Always sanitize HTML content before rendering. Prefer rendering
          strings as plain text (React&apos;s default escaping) and only allow rich text
          from trusted sources. Validate that start times are before end times, that date
          values are valid Date objects, and that RRULE patterns conform to the supported
          frequency set.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The calendar grid uses <code>role="grid"</code> with <code>role="row"</code>
              for each row and <code>role="gridcell"</code> for each cell.
            </li>
            <li>
              Arrow keys navigate between cells. <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> moves focus into and out of the grid.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> on an empty cell opens the event creation modal with that date pre-filled.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> on an event opens the event detail view.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> closes the modal or cancels an in-progress drag operation.
            </li>
            <li>
              Drag operations also support keyboard: focus an event, press
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Space</kbd> to grab it, arrow keys to move,
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Space</kbd> to drop.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              Each grid cell has <code>aria-label</code> with the full date
              (e.g., &quot;Monday, April 7, 2026&quot;) and event count.
            </li>
            <li>
              Events within cells have <code>aria-label</code> with title, start time,
              and end time (e.g., &quot;Team standup, 9:00 AM to 9:30 AM&quot;).
            </li>
            <li>
              The event creation modal uses <code>role="dialog"</code> with
              <code>aria-modal="true"</code> and <code>aria-labelledby</code> pointing
              to the modal title. Focus is trapped within the modal while open.
            </li>
            <li>
              The mini calendar has <code>aria-label="Mini calendar for quick navigation"</code>
              and each day cell is a button with an accessible date label.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Event creation rate limiting:</strong> Cap event creation at 5 per
            minute to prevent accidental or malicious flooding (e.g., a script creating
            events in a loop).
          </li>
          <li>
            <strong>Recurring event cap:</strong> Limit recurring event definitions to a
            maximum of 2 years (730 occurrences) to prevent runaway computation from
            malformed RRULE patterns.
          </li>
          <li>
            <strong>Time zone validation:</strong> Validate that the selected time zone
            exists in the IANA time zone database before applying it. Reject invalid
            time zone strings to prevent display errors.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Collision detector:</strong> Test with 2 overlapping events (should
            assign columns 0 and 1), 3 events where events 1 and 2 overlap but event 3
            doesn&apos;t (should assign columns 0, 1, 0), and 10+ events to verify max
            column cap.
          </li>
          <li>
            <strong>Recurring expander:</strong> Test daily recurrence generates correct
            occurrences within range, weekly recurrence with interval=2 skips alternate
            weeks, monthly recurrence handles month-end (e.g., 31st of month in a 30-day
            month), exception dates exclude specific occurrences, and infinite recurrence
            caps at 730.
          </li>
          <li>
            <strong>Time slot utilities:</strong> Test `generateTimeSlots(30)` returns 48
            slots, `snapToGrid` rounds to nearest 30-min boundary, and `calculateDuration`
            returns correct minutes.
          </li>
          <li>
            <strong>Store actions:</strong> Test `navigate` advances/rewinds the active
            date correctly for each view, `addEvent` appends to the array, `updateEvent`
            replaces by id, and `endDrag` with rollback restores original position.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Month view rendering:</strong> Render the calendar in month view,
            assert the 7-column grid has 5 or 6 rows depending on the month, verify
            events appear in correct day cells, and multi-day events span cells.
          </li>
          <li>
            <strong>Week view with collisions:</strong> Create 3 overlapping events on
            the same day, render week view, assert they render side-by-side with correct
            column widths and positions.
          </li>
          <li>
            <strong>Drag and drop:</strong> Render an event in week view, simulate
            mousedown on the drag handle, mousemove to a different time slot, mouseup.
            Assert the event&apos;s start time in the store updates correctly.
          </li>
          <li>
            <strong>Event creation:</strong> Click an empty slot, assert the modal opens
            with pre-filled date. Fill in the form, submit, assert the event appears in
            the calendar.
          </li>
          <li>
            <strong>Navigation:</strong> Click prev/next buttons, assert the visible date
            range updates. Click today, assert the calendar navigates to the current date.
            Click a date in the mini calendar, assert the active date updates.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Multi-day event spanning month boundaries — verify it renders correctly in
            both the starting and ending months.
          </li>
          <li>
            Recurring event with exception date on a visible day — verify the occurrence
            is excluded from rendering.
          </li>
          <li>
            Drag event across DST boundary — verify the displayed time adjusts correctly.
          </li>
          <li>
            15+ overlapping events — verify the column cap kicks in and the overflow
            indicator renders.
          </li>
          <li>
            Time zone change — verify all event times re-render with the new offset.
          </li>
          <li>
            Accessibility: run axe-core automated checks on the calendar grid, verify
            aria-label on cells, role attributes, and keyboard navigation.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not handling collisions:</strong> Candidates often render overlapping
            events on top of each other, making them unreadable. Interviewers expect
            candidates to discuss collision detection algorithms and side-by-side layout
            strategies.
          </li>
          <li>
            <strong>Ignoring recurring event complexity:</strong> Many candidates assume
            all events are single occurrences. Expanding recurring events from RRULE
            patterns within a date range, handling exception dates, and capping infinite
            recurrences is a critical part of any production calendar.
          </li>
          <li>
            <strong>Animating with state updates on every mousemove:</strong> Calling
            Zustand&apos;s setState on every `mousemove` event causes 60 re-renders per
            second. Interviewers look for candidates who know to use `useRef` +
            `requestAnimationFrame` for drag previews and only commit to state on `mouseup`.
          </li>
          <li>
            <strong>Not handling DST transitions:</strong> Treating all days as 24 hours
            ignores DST shifts. On DST start day, the day is 23 hours; on DST end day,
            it is 25 hours. Event times must display correctly in the user&apos;s time
            zone regardless.
          </li>
          <li>
            <strong>Forgetting accessibility:</strong> Rendering a calendar without
            <code>role="grid"</code>, <code>aria-label</code> on cells, and keyboard
            navigation makes it unusable for screen reader and keyboard-only users. This
            is a critical oversight in production systems.
          </li>
          <li>
            <strong>Not implementing drag rollback:</strong> If the API call to update an
            event&apos;s time fails, the event should revert to its original position.
            Without rollback, the UI shows an incorrect state that doesn&apos;t match the
            server.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Client-side vs Server-side Recurring Expansion</h4>
          <p>
            Expanding recurring events on the client means the browser computes all
            occurrences within the visible range. This is fast for typical ranges (1
            week to 1 month) and enables instant view switches. The trade-off is that
            for very large ranges (year view), the client computes thousands of
            occurrences. Server-side expansion offloads this work but adds network
            latency and makes view switches dependent on API round trips. The right
            approach is client-side expansion with caching — cache occurrences keyed
            by (event-id, date-range) and reuse them when the new range overlaps.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Sweep-line vs Brute-force Collision Detection</h4>
          <p>
            A brute-force approach compares every pair of events (O(n^2)) to find
            overlaps. For a typical day with 20 events, this is 190 comparisons —
            acceptable. But for a busy day with 100 events, this is 4,950 comparisons.
            The sweep-line algorithm sorts events by start time (O(n log n)) and
            maintains active columns, reducing comparisons to O(n * k) where k is the
            max columns (typically 4-5). The sweep-line approach is clearly superior
            for dense schedules. Interviewers expect candidates to discuss both and
            justify the choice based on expected event density.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Absolute Positioning vs CSS Grid for Event Placement</h4>
          <p>
            In week view, events can be positioned using absolute positioning (top/left
            based on time) or CSS Grid (placing events in grid rows corresponding to
            time slots). Absolute positioning gives pixel-perfect placement and smooth
            drag animations but requires manual collision layout computation. CSS Grid
            handles the layout automatically but is less flexible for drag-and-drop
            (events snap to grid rows, not pixel positions). For a production calendar
            that needs both precision and flexibility, absolute positioning with a
            collision detector is the better choice. CSS Grid works well for month view
            where events occupy whole-day cells.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement virtualization for the week view with 1000+ events?
            </p>
            <p className="mt-2 text-sm">
              A: Use `@tanstack/react-virtual` to virtualize the time column. Only render
              event blocks that are within the visible viewport plus a small buffer. As
              the user scrolls, the virtualizer computes which events are in view and
              renders only those. The time axis (hour labels) is always rendered since it
              is a fixed set of 24 rows. Event positioning uses the same absolute
              positioning logic, but only for visible events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle shared calendars (multiple users&apos; events)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a `userId` or `calendarId` field to the `CalendarEvent` interface.
              The store maintains a map of calendar IDs to event arrays. The view
              components merge events from all active calendars, using the calendar&apos;s
              assigned color for event coloring. A sidebar checkbox list lets users toggle
              individual calendars on/off. Collision detection runs across all active
              calendars&apos; events for the visible range.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you sync calendar state with a backend API?
            </p>
            <p className="mt-2 text-sm">
              A: The store&apos;s event mutations (`addEvent`, `updateEvent`, `deleteEvent`)
              dispatch optimistic updates — immediately update local state, then make the
              API call. If the API succeeds, the local state is already correct. If it
              fails, rollback to the pre-mutation state. For initial load, fetch events
              for the visible date range on mount and on range change. Use pagination or
              cursor-based fetching for large ranges.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement drag-and-drop accessibility for keyboard-only users?
            </p>
            <p className="mt-2 text-sm">
              A: Provide a keyboard drag mode: focus an event, press Space to &quot;pick
              up&quot; the event (announced via `aria-live`), use arrow keys to move the
              event to adjacent cells (with visual highlight on the target cell), and
              press Space again to &quot;drop&quot; it. The target cell&apos;s new date/time
              is announced via `aria-live`. Pressing Escape cancels the drag. This mirrors
              the mouse drag interaction using only keyboard events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle all-day events differently from timed events?
            </p>
            <p className="mt-2 text-sm">
              A: All-day events have no specific start/end time. In week view, they render
              in a separate &quot;all-day&quot; row above the time grid, spanning the full
              width of the day&apos;s column. In month view, they render like any other
              event in the day cell. The `CalendarEvent` interface has an `allDay: boolean`
              flag. The collision detector treats all-day events separately — they collide
              only with other all-day events on the same day, not with timed events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement the agenda view efficiently?
            </p>
            <p className="mt-2 text-sm">
              A: Agenda view is a scrollable list of events sorted by start time, grouped
              by day. Use the same filtered occurrence list from `useCalendarEvents`.
              Group occurrences by date using a Map (date string to events array). Render
              each group with a date header followed by event list items. Virtualize the
              list if the agenda spans many weeks. The agenda view doesn&apos;t need
              collision detection since events are in a linear list, not a time grid.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://fullcalendar.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FullCalendar — Production Calendar Library (Reference Architecture)
            </a>
          </li>
          <li>
            <a
              href="https://github.com/intljusticemission/react-big-calendar"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Big Calendar — Lightweight React Calendar
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/wai-aria-1.2/#grid"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Grid Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc5545"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 5545 — iCalendar RRULE Specification
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intl.DateTimeFormat for Time Zone Handling
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
