"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-date-time-picker",
  title: "Design a Date / Time Picker",
  description:
    "Complete LLD solution for a production-grade Date/Time Picker component with timezone support, format switching, range selection, keyboard accessibility, and SSR safety.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "date-time-picker",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "date-picker",
    "time-picker",
    "timezone",
    "accessibility",
    "state-management",
    "form-controls",
  ],
  relatedTopics: [
    "modal-component",
    "search-autocomplete",
    "form-builder",
    "state-management",
  ],
};

export default function DateTimePickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Date-Time Picker</h1>
        <h2>Definition &amp; Context</h2>
        <p>Design a Date-Time Picker is a low-level design problem about implementing calendar navigation, time-slot selection, timezone projection, locale formatting, disabled-range validation, keyboard movement, and form commit. A principal-level interview answer must define ownership boundaries, browser and accessibility semantics, local data structures, lifecycle cleanup, server reconciliation, and explicit degraded behavior.</p>
        <p>Separate the user-entered wall-clock draft from the resolved instant and timezone. This makes ambiguous or nonexistent daylight-saving times explicit rather than silently shifting them. The central structures are draft fields, resolved instant, timezone id, locale formatter, min-max range, disabled interval set, focused day, active view, and validation result. The implementation is not complete until cancellation, stale work, SSR behavior, privacy, metrics, and rollback are deliberate rather than incidental.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/date-time-picker-runtime.svg" alt="Design a Date-Time Picker runtime flow" caption="Runtime flow: input becomes a guarded state transition, a semantic projection, and a recoverable outcome." />
      </section>
      <section>
        <h2>Core Concepts</h2>
        <p>The following deep dive preserves the component-specific mechanics and browser constraints that determine the implementation.</p>
        {/* Section 1: Problem Clarification */}
      <section>
        <h3>Problem Clarification</h3>
        <HighlightBlock as="p" tier="crucial">
          We need to design a reusable Date/Time Picker component for a large-scale
          web application. The component must allow users to select dates via a
          calendar grid, pick times with hour/minute/second precision, handle time
          zone conversions, support multiple date formats (12h/24h, locale-aware),
          enable date range selection (start/end with visual highlighting), and be
          fully keyboard accessible. The component must work correctly in server-side
          rendering contexts — no browser APIs during SSR — and mount gracefully on
          the client.
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <HighlightBlock as="li" tier="important">
            The component will be used across multiple pages and forms (booking systems,
            scheduling dashboards, admin panels).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Users span multiple geographic regions and must be able to select and view
            times in different time zones.
          </HighlightBlock>
          <li>
            The application supports both light and dark mode.
          </li>
          <li>
            Maximum date range is configurable (e.g., +/- 5 years from current date).
          </li>
          <HighlightBlock as="li" tier="important">
            Some dates may be disabled (past dates, holidays, unavailable slots) via a
            custom disable function.
          </HighlightBlock>
          <li>
            The component must be screen-reader friendly and fully navigable via keyboard.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h3>Requirements</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Calendar Grid:</strong> Display a month view with a 7-column grid
            (Mon-Sun or Sun-Sat based on locale), highlight the current date, support
            prev/next month navigation, and allow month/year selection via dropdowns.
          </li>
          <li>
            <strong>Day Selection:</strong> Clicking a date cell selects it. In range
            mode, the first click sets the start date and the second click sets the end
            date, with a visual highlight spanning all dates in between.
          </li>
          <li>
            <strong>Time Selection:</strong> Provide hour/minute/second inputs with an
            AM/PM toggle for 12-hour format. Support scrollable time lists (e.g., 30-minute
            intervals) as an alternative to manual input.
          </li>
          <li>
            <strong>Time Zone Support:</strong> Display a timezone selector dropdown showing
            UTC offsets. When a timezone is selected, display the converted time alongside
            the local time. Handle Daylight Saving Time transitions correctly.
          </li>
          <li>
            <strong>Format Support:</strong> Support 12-hour and 24-hour time formats.
            Support locale-aware date formats (MM/DD/YYYY for US, DD/MM/YYYY for Europe,
            YYYY-MM-DD ISO format). Auto-format typed input.
          </li>
          <li>
            <strong>Input Field:</strong> A text input that accepts typed dates, parses
            them, validates them, and auto-formats them on blur. Support backspace to
            clear.
          </li>
          <li>
            <strong>Disabled Dates:</strong> Disable past dates by default. Support custom
            disable functions (e.g., disable weekends, disable specific holidays). Disabled
            cells must be visually distinct and non-interactive.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Keyboard Navigation:</strong> Tab navigates between input, calendar
            trigger, and timezone display. Arrow keys move selection within the calendar
            grid. Enter selects the focused date. Escape closes the calendar dropdown.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Calendar grid generation must be O(1) — computed
            from month/year, not iterated. Month navigation should not cause visible jank.
          </HighlightBlock>
          <li>
            <strong>SSR Safety:</strong> No browser APIs (Intl, Date, localStorage) during
            server-side rendering. The component must render a minimal input during SSR and
            hydrate fully on the client.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for all state types
            (DatePickerState, TimePickerState, TimeZone, DateFormat) and utility functions.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Accessibility:</strong> Screen readers must announce each date cell
            with a meaningful label (e.g., &quot;Monday, April 7, 2026&quot;). The grid
            must use <code>role=&quot;grid&quot;</code> and each cell must use
            <code>role=&quot;gridcell&quot;</code> with <code>aria-selected</code> and
            <code>aria-disabled</code> attributes.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Reliability:</strong> Date parsing must handle edge cases — invalid
            input, leap years, DST transitions, timezone offsets with half-hour increments
            (e.g., India Standard Time, UTC+5:30).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User selects February 29 in a leap year, then navigates to a non-leap year —
            the date should clamp to February 28.
          </li>
          <li>
            Time zone change during DST transition — 2:00 AM may not exist or may exist
            twice. The component must handle ambiguous times gracefully.
          </li>
          <li>
            User types an invalid date (e.g., &quot;02/30/2026&quot;) — the input must
            show a validation error and not crash.
          </li>
          <li>
            Range selection where the user picks the same date for start and end — treat
            as a single-day range.
          </li>
          <li>
            User selects a time like 23:59:59 and switches from 24h to 12h format — the
            display must correctly convert to 11:59:59 PM without losing precision.
          </li>
          <HighlightBlock as="li" tier="important">
            SSR rendering — <code>Intl.DateTimeFormat</code> may behave differently on
            Node.js vs browser. The component must produce consistent output.
          </HighlightBlock>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h3>High-Level Approach</h3>
        <HighlightBlock as="p" tier="crucial">
          The core idea is to separate the <strong>date picker state</strong>,{" "}
          <strong>time picker state</strong>, and <strong>timezone state</strong> into
          independent Zustand stores, each managing its own domain logic. The calendar
          grid is computed purely from the current month/year — no iteration over all
          dates is needed. Time formatting, timezone conversion, and DST detection are
          handled by a dedicated utility module leveraging the{" "}
          <code>Intl</code> API. The component tree consists of a root date picker
          (input + calendar dropdown + timezone display), a calendar grid (month view
          with day cells), a calendar header (month/year navigation), a time picker
          (hour/minute/second inputs with AM/PM toggle), a timezone selector (dropdown
          with UTC offset display), and a date input (typed input with auto-formatting
          and validation).
        </HighlightBlock>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Single monolithic store:</strong> Combining all state (calendar,
            time, timezone, format, range) into one Zustand store creates a single
            source of truth but leads to a large, complex state shape with many unrelated
            fields. Updates to one domain (e.g., changing timezone) trigger re-renders
            of unrelated components (e.g., calendar grid). Splitting stores minimizes
            re-render cascades.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Context API + useReducer:</strong> Viable but requires wrapping the
            component tree in a Provider and consuming context in every sub-component.
            Adds coupling. Zustand provides the same functionality with less boilerplate
            and better performance via selectors.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Uncontrolled inputs with ref-based state:</strong> Simpler for basic
            use cases but makes range selection, timezone conversion, and format switching
            significantly harder because the source of truth is scattered across DOM
            nodes. Centralized state is necessary for this level of complexity.
          </HighlightBlock>
        </ul>
        <HighlightBlock as="p" tier="important">
          <strong>Why Zustand + computed grid is optimal:</strong> Zustand provides
          lightweight, selector-based global stores with zero boilerplate. The calendar
          grid is a pure function of (month, year, selectedDate, hoverDate) — no side
          effects, no external API calls. This pattern is used by production date picker
          libraries like react-day-picker and date-fns.
        </HighlightBlock>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h3>System Design</h3>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/date-time-picker-architecture.svg"
          alt="Date time picker architecture showing calendar state, navigation, DST-safe storage, and range selection"
          caption="Architecture Overview"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>datetime-types.ts</code>)</h4>
          <HighlightBlock as="p" tier="important">
            Defines the core interfaces used throughout the system. The{" "}
            <code>DatePickerState</code> interface tracks the current month, current year,
            selected date, selected range (start/end), hover date (for range highlighting),
            and the open/closed state of the calendar dropdown. The <code>TimePickerState</code>
            interface tracks hour, minute, second, AM/PM flag, and the active time format
            (12h or 24h). The <code>TimeZone</code> interface holds the IANA timezone ID,
            display label, UTC offset string, and DST status. The <code>DateFormat</code>{" "}
            type is a union of supported format strings (&quot;MM/DD/YYYY&quot; | &quot;DD/MM/YYYY&quot;
            | &quot;YYYY-MM-DD&quot;). See the Example tab for the complete type definitions.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Date/Time Utilities (<code>datetime-utils.ts</code>)</h4>
          <HighlightBlock as="p" tier="important">
            Pure functions for date formatting, timezone conversion, DST detection,
            locale-aware formatting, and date parsing. Key functions include{" "}
            <code>formatDate()</code> which takes a Date and a DateFormat string and
            returns the formatted string, <code>parseDate()</code> which parses a user-typed
            string into a Date object with validation, <code>convertTimezone()</code> which
            converts a Date from one timezone to another using <code>Intl.DateTimeFormat</code>,
            and <code>isDST()</code> which detects whether a given Date falls within DST
            for a specific timezone. These functions are pure — no side effects, no external
            state — making them trivially testable. See the Example tab for the complete
            implementation.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Date Picker Store (<code>date-picker-store.ts</code>)</h4>
          <HighlightBlock as="p" tier="important">
            Zustand store managing calendar state. State includes <code>currentMonth</code>,{" "}
            <code>currentYear</code>, <code>selectedDate</code>, <code>rangeStart</code>,{" "}
            <code>rangeEnd</code>, <code>hoverDate</code>, and <code>isOpen</code>. Actions
            include navigating to the next/previous month, selecting a date, setting the
            range start/end on first/second click, updating the hover date for range
            preview, and toggling the dropdown open/closed. The store is initialized with
            the current month/year derived from <code>new Date()</code> — but only on the
            client (SSR-safe).
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Time Picker Store (<code>time-picker-store.ts</code>)</h4>
          <p>
            Zustand store managing time state. State includes <code>hour</code>,{" "}
            <code>minute</code>, <code>second</code>, <code>isPM</code>, and{" "}
            <code>format</code> (&quot;12h&quot; | &quot;24h&quot;). Actions include setting
            individual time fields, toggling AM/PM, switching between 12h and 24h formats
            (with automatic hour conversion — e.g., 14:00 becomes 2:00 PM), and resetting
            to midnight. The store initializes with the current time on the client.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Hooks (<code>use-date-picker.ts</code> &amp; <code>use-time-picker.ts</code>)</h4>
          <p>
            Custom hooks that encapsulate complex logic. The <code>useDatePicker</code>
            hook generates the calendar grid array for the current month/year, handles
            month/year navigation (with year boundary crossing), manages date selection
            logic (single vs range mode), and computes disabled dates by evaluating the
            custom disable function. The <code>useTimePicker</code> hook handles time
            input changes, format switching, scroll wheel adjustment on the time list,
            and validation (e.g., hour must be 0-23 in 24h mode, 1-12 in 12h mode).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Components</h4>
          <p>The UI layer consists of six components:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>DatePicker</code> — Root component composing the date input, calendar
              dropdown trigger, timezone display, and time picker. Manages click-outside
              detection to close the dropdown.
            </li>
            <HighlightBlock as="li" tier="crucial">
              <code>CalendarGrid</code> — Renders the 7-column month view with weekday
              headers (localized), day cells with range highlighting, and disabled date
              styling. Uses <code>role=&quot;grid&quot;</code> for accessibility.
            </HighlightBlock>
            <li>
              <code>CalendarHeader</code> — Renders the month/year navigation bar with
              prev/next arrows and dropdowns for jumping to any month/year within the
              allowed range.
            </li>
            <li>
              <code>TimePicker</code> — Renders hour/minute/second inputs with an AM/PM
              toggle. Supports both manual typing and scroll wheel adjustment. Adapts
              display based on 12h/24h format.
            </li>
            <li>
              <code>TimezoneSelector</code> — Dropdown listing all IANA timezones with
              their UTC offset. Displays the converted time for the selected date/time
              in the target timezone.
            </li>
            <li>
              <code>DateInput</code> — Text input that accepts typed dates, auto-formats
              on blur, parses input into a Date object, validates against invalid dates,
              and shows error states.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <HighlightBlock as="p" tier="important">
          Two independent Zustand stores serve as the source of truth. The date picker
          store manages all calendar-related state (current view, selection, range,
          dropdown open state). The time picker store manages time state (hour, minute,
          second, format). The timezone selector maintains its own local state (selected
          timezone, dropdown open state) since it does not need to be globally shared.
          This separation ensures that changing the timezone does not cause the calendar
          grid to re-render, and changing the selected date does not cause the time picker
          to re-render.
        </HighlightBlock>
        <p>
          The calendar grid is computed on each render from (currentMonth, currentYear).
          It generates a 6-row x 7-column array (42 cells) that includes trailing days
          from the previous month and leading days from the next month to fill the grid.
          This is a pure computation — no API calls, no side effects.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User clicks the input field or calendar icon — <code>isOpen</code> is set to
            true in the date picker store.
          </li>
          <li>
            Calendar dropdown renders with the current month/year view. The CalendarGrid
            computes the 42-day array from the store&apos;s currentMonth and currentYear.
          </li>
          <li>
            User clicks a day cell — <code>selectDate(date)</code> is called. In single
            mode, this sets <code>selectedDate</code> and closes the dropdown. In range
            mode, the first click sets <code>rangeStart</code>, the second click sets
            <code>rangeEnd</code>.
          </li>
          <li>
            User navigates to a different month via prev/next arrows — <code>navigateMonth(delta)</code>
            updates currentMonth/currentYear, wrapping year boundaries (December + 1 =
            January next year).
          </li>
          <li>
            User adjusts time in the TimePicker — <code>setHour()</code>,{" "}
            <code>setMinute()</code>, <code>setSecond()</code> update the time picker
            store. On format switch, the hour is converted (e.g., 14 &rarr; 2 PM).
          </li>
          <li>
            User changes timezone in the TimezoneSelector — the component calls{" "}
            <code>convertTimezone()</code> to compute and display the converted time for
            the selected date/time in the target timezone.
          </li>
          <li>
            User types a date in the DateInput — <code>parseDate()</code> validates and
            parses the input. On blur, the input auto-formats to the active DateFormat.
          </li>
          <li>
            User presses Escape or clicks outside — <code>setIsOpen(false)</code> closes
            the dropdown.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h3>Data Flow / Execution Flow</h3>
        <HighlightBlock as="p" tier="crucial">
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand stores, and all rendering flows from store
          subscriptions. Calendar grid computation is a pure render-side calculation,
          not stored in state. Timezone conversion happens on-demand when the timezone
          changes, not on every render.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Leap year February 29:</strong> When navigating from a leap year to
            a non-leap year with February 29 selected, the selected date is clamped to
            February 28. The <code>clampDate()</code> utility checks if the target month
            has fewer days than the selected day and adjusts accordingly.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>DST ambiguous times:</strong> When the user selects 2:00 AM on a DST
            transition day, <code>Intl.DateTimeFormat</code> resolves the ambiguity based
            on the IANA timezone database. The component displays a warning badge indicating
            the time is ambiguous and offers the user the choice between the two possible
            interpretations (before/after DST shift).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Invalid typed input:</strong> If the user types &quot;02/30/2026&quot;,
            <code>parseDate()</code> returns <code>Invalid Date</code>. The DateInput
            component displays a red border and an error message. The store is not updated
            with invalid dates.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>SSR safety:</strong> The stores initialize their date-dependent state
            (current month/year, current time) inside a <code>useEffect</code> on the root
            component. During SSR, the stores return default values (January 2026, 00:00:00).
            On client hydration, the stores are re-initialized with actual values. This
            prevents hydration mismatches.
          </HighlightBlock>
          <li>
            <strong>Half-hour timezone offsets:</strong> Timezones like IST (UTC+5:30) and
            NPT (UTC+5:45) are correctly handled by <code>Intl.DateTimeFormat</code> with
            the <code>timeZone</code> option. The UTC offset display uses the{" "}
            <code>formatToParts()</code> API to extract the exact offset string.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h3>Implementation</h3>
        <HighlightBlock as="p" tier="important">
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </HighlightBlock>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">&#128230; Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 13 files: type
            definitions, date/time utilities, two Zustand stores, two custom hooks, six
            UI components, and a full EXPLANATION.md walkthrough. Click the{" "}
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (datetime-types.ts)</h3>
        <HighlightBlock as="p" tier="important">
          Defines <code>DatePickerState</code> with fields for currentMonth, currentYear,
          selectedDate, rangeStart, rangeEnd, hoverDate, and isOpen. Defines{" "}
          <code>TimePickerState</code> with hour, minute, second, isPM, and format.
          Defines <code>TimeZone</code> with IANA ID, label, utcOffset, and isDST.
          Defines <code>DateFormat</code> as a string union. The <code>DisabledDateFn</code>{" "}
          type is a predicate function taking a Date and returning boolean. All types are
          strictly typed — no <code>any</code>, no <code>unknown</code> without narrowing.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Date/Time Utilities (datetime-utils.ts)</h3>
        <HighlightBlock as="p" tier="important">
          Pure functions leveraging the <code>Intl</code> API. <code>formatDate()</code>{" "}
          uses <code>Intl.DateTimeFormat</code> with locale-aware options.{" "}
          <code>parseDate()</code> handles multiple input formats with regex-based parsing
          and validation. <code>convertTimezone()</code> creates a Date in the target
          timezone and extracts components. <code>isDST()</code> compares the UTC offset
          of a date in January vs July for the target timezone to determine DST status.
          <code>getDaysInMonth()</code>, <code>getFirstDayOfMonth()</code>, and{" "}
          <code>generateCalendarGrid()</code> are pure calendar math functions.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Date Picker Store (date-picker-store.ts)</h3>
        <p>
          Zustand store with state for the calendar view and selection. Actions include
          <code>setCurrentMonth()</code>, <code>setCurrentYear()</code>,{" "}
          <code>navigateMonth()</code>, <code>selectDate()</code>,{" "}
          <code>setRangeStart()</code>, <code>setRangeEnd()</code>,{" "}
          <code>setHoverDate()</code>, and <code>setIsOpen()</code>. The store initializes
          with default values during SSR and is re-hydrated on the client via a{" "}
          <code>useEffect</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Time Picker Store (time-picker-store.ts)</h3>
        <HighlightBlock as="p" tier="important">
          Zustand store managing time state. Actions include <code>setHour()</code>,{" "}
          <code>setMinute()</code>, <code>setSecond()</code>, <code>toggleAmPm()</code>,
          and <code>setFormat()</code>. The <code>setFormat()</code> action handles the
          hour conversion: when switching from 24h to 12h, hours &gt; 12 are converted
          (14 &rarr; 2, isPM &rarr; true); when switching from 12h to 24h, PM hours have
          12 added (2 PM &rarr; 14). Hour, minute, and second setters include clamping
          to valid ranges.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Custom Hooks</h3>
        <p>
          <code>useDatePicker</code> generates the 42-cell calendar grid array from the
          store&apos;s currentMonth/currentYear. It computes which cells are disabled,
          which are selected, and which fall within the range highlight. It handles month
          navigation with year boundary wrapping. <code>useTimePicker</code> manages
          time input changes with validation, handles scroll wheel events on the time
          list (mapping scroll delta to minute increments), and computes the display
          values for 12h/24h formats.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Components</h3>
        <HighlightBlock as="p" tier="crucial">
          <code>DatePicker</code> is the root component, composing all sub-components. It
          manages click-outside detection via a <code>useEffect</code> with a ref and
          document-level click listener. <code>CalendarGrid</code> renders the accessible
          grid with proper ARIA attributes. <code>CalendarHeader</code> provides month/year
          dropdowns. <code>TimePicker</code> renders time inputs with format support.
          <code>TimezoneSelector</code> provides timezone conversion display.{" "}
          <code>DateInput</code> handles typed input with auto-formatting and validation.
        </HighlightBlock>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h3>Performance &amp; Scalability</h3>

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
                <td className="p-2">generateCalendarGrid</td>
                <td className="p-2">O(1) — always 42 cells</td>
                <td className="p-2">O(1) — fixed array of 42</td>
              </tr>
              <tr>
                <td className="p-2">formatDate</td>
                <td className="p-2">O(1) — Intl API call</td>
                <td className="p-2">O(1) — returns string</td>
              </tr>
              <tr>
                <td className="p-2">parseDate</td>
                <td className="p-2">O(1) — regex + Date constructor</td>
                <td className="p-2">O(1) — returns Date</td>
              </tr>
              <tr>
                <td className="p-2">convertTimezone</td>
                <td className="p-2">O(1) — Intl API call</td>
                <td className="p-2">O(1) — returns object</td>
              </tr>
              <tr>
                <td className="p-2">isDST check</td>
                <td className="p-2">O(1) — two Intl calls (Jan + Jul)</td>
                <td className="p-2">O(1) — returns boolean</td>
              </tr>
              <tr>
                <td className="p-2">Store actions</td>
                <td className="p-2">O(1) — direct assignment</td>
                <td className="p-2">O(1) — single field update</td>
              </tr>
            </tbody>
          </table>
        </div>
        <HighlightBlock as="p" tier="important">
          All operations are O(1). The calendar grid is always 42 cells regardless of
          month. Date formatting and timezone conversion use native <code>Intl</code> API
          calls which are optimized at the engine level. Store actions are direct field
          assignments with no iteration.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Timezone list rendering:</strong> The full IANA timezone list contains
            400+ entries. Rendering all as dropdown options causes initial render lag.
            Mitigation: virtualize the dropdown list (window only 20 visible items at a
            time) or group timezones by region (Americas, Europe, Asia, etc.) with
            collapsible sections.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Re-render cascades on month change:</strong> Changing currentMonth
            triggers a full re-render of the CalendarGrid (42 cells). While 42 is small,
            each cell computes its disabled/selected/range status. Mitigation: memoize
            individual CalendarDay cells with <code>React.memo</code> and compare only
            their specific date&apos;s status.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong><code>Intl.DateTimeFormat</code> instantiation:</strong> Creating a new
            <code>Intl.DateTimeFormat</code> on every render is expensive. Mitigation:
            cache formatters using <code>useMemo</code> or a module-level Map keyed by
            (locale, timezone, options).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each component subscribes only
            to the store fields it needs. CalendarGrid subscribes to (currentMonth,
            currentYear, selectedDate) — it does not re-render when the timezone changes.
          </li>
          <li>
            <strong>Memoized grid generation:</strong> Wrap <code>generateCalendarGrid()</code>{" "}
            in <code>useMemo</code> with [currentMonth, currentYear] dependencies. The
            grid is only recomputed when the view changes, not on every render.
          </li>
          <li>
            <strong>Cached Intl formatters:</strong> Create a module-level formatter cache:
            <code>{"const formatters = new Map<string, Intl.DateTimeFormat>()"}</code>.
            Reuse existing formatters instead of creating new ones.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Virtualized timezone dropdown:</strong> For the timezone selector, use
            windowing to render only visible options. This reduces DOM nodes from 400+ to
            ~20 at any time.
          </HighlightBlock>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h3>Security Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <HighlightBlock as="p" tier="important">
          The DateInput component accepts free-text user input. While the parsed output
          is a Date object (not rendered as HTML), the raw input string should be sanitized
          before display in error messages to prevent XSS if the error message is reflected
          elsewhere. Use <code>textContent</code> instead of <code>innerHTML</code> for
          error messages.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The calendar grid uses <code>role=&quot;grid&quot;</code> with{" "}
              <code>role=&quot;row&quot;</code> for each week and <code>role=&quot;gridcell&quot;</code>{" "}
              for each day. Arrow keys navigate between cells.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> moves
              focus between the date input, calendar trigger button, and timezone display.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> selects
              the focused date cell.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> closes
              the calendar dropdown.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Home</kbd> /{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">End</kbd> jump to
              the first/last day of the current week.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">PageUp</kbd> /{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">PageDown</kbd>{" "}
              navigate to the previous/next month.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              Each day cell has <code>aria-label</code> with the full date (e.g., &quot;Monday,
              April 7, 2026&quot;) so screen readers announce the complete date, not just
              the number.
            </HighlightBlock>
            <li>
              Selected cells have <code>aria-selected=&quot;true&quot;</code>. Disabled cells
              have <code>aria-disabled=&quot;true&quot;</code>.
            </li>
            <HighlightBlock as="li" tier="important">
              The calendar grid has <code>aria-label=&quot;Calendar&quot;</code> and{" "}
              <code>aria-multiselectable=&quot;false&quot;</code> (or &quot;true&quot; for
              range mode).
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              The timezone selector displays the converted time in a visually hidden but
              screen-reader-accessible span.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Focus Management</h4>
          <HighlightBlock as="p" tier="crucial">
            When the calendar dropdown opens, focus is moved to the currently selected
            date (or today&apos;s date if nothing is selected). When the dropdown closes
            (Escape or outside click), focus returns to the date input. This prevents
            focus from being lost in the DOM, which is a common accessibility bug.
          </HighlightBlock>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Server-Side Validation</h3>
        <p>
          Client-side date validation is a UX convenience, not a security boundary. Any
          date submitted by this component must be re-validated on the server. The server
          must check that the date is within the allowed range, is not disabled (e.g.,
          a holiday), and is in a valid format. Never trust client-side date values for
          business logic.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h3>Testing Strategy</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Utility functions:</strong> Test <code>formatDate()</code> with
            various Date objects and formats, verify correct output. Test{" "}
            <code>parseDate()</code> with valid and invalid strings, verify correct
            parsing and error detection. Test <code>convertTimezone()</code> with known
            timezone pairs and expected offsets. Test <code>isDST()</code> with dates
            known to be in/out of DST for specific timezones.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Store actions:</strong> Test <code>navigateMonth()</code> wraps year
            boundaries correctly (December + 1 = January next year, January - 1 = December
            previous year). Test <code>selectDate()</code> sets selectedDate in single
            mode and rangeStart/rangeEnd in range mode. Test <code>setFormat()</code>{" "}
            converts hours correctly between 12h and 24h.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Grid generation:</strong> Test <code>generateCalendarGrid()</code>{" "}
            produces exactly 42 cells for every month of every year from 2020 to 2030.
            Verify the first row includes trailing days from the previous month.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full selection flow:</strong> Render DatePicker, click input to open
            dropdown, click a date cell, assert selectedDate updates and dropdown closes.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Range selection:</strong> Enable range mode, click first date (assert
            rangeStart set), click second date (assert rangeEnd set), assert all cells
            between rangeStart and rangeEnd have the range highlight class.
          </HighlightBlock>
          <li>
            <strong>Timezone conversion:</strong> Select a date and time, change timezone,
            assert the converted time display updates with the correct offset.
          </li>
          <li>
            <strong>Format switching:</strong> Set time to 14:30 in 24h mode, switch to
            12h mode, assert display shows 2:30 PM. Switch back, assert 14:30.
          </li>
          <li>
            <strong>Date input parsing:</strong> Type &quot;04/07/2026&quot; in the input,
            blur, assert the input auto-formats to the active DateFormat and the store
            updates.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify the component renders a minimal input during SSR and
            hydrates fully on the client without mismatches.
          </li>
          <li>
            Leap year: navigate from February 2024 (leap year) to February 2025 (non-leap),
            verify February 29 selection is clamped to February 28.
          </li>
          <li>
            DST transition: select 2:00 AM on a DST change date, verify the component
            handles the ambiguous time gracefully.
          </li>
          <HighlightBlock as="li" tier="crucial">
            Accessibility: run axe-core automated checks on the calendar grid, verify
            aria-labels on all day cells, role attributes, and keyboard navigation.
          </HighlightBlock>
          <li>
            Invalid input: type &quot;abc&quot; in the DateInput, blur, assert error state
            is displayed and the store is not updated.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h3>Interview-Focused Insights</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Storing the full calendar grid in state:</strong> Candidates often put
            the 42-cell array in the Zustand store. This is unnecessary — the grid is a
            pure function of (month, year) and should be computed during render, not stored.
            Storing it causes unnecessary store updates and re-renders on every month
            change.
          </li>
          <li>
            <strong>Not handling DST transitions:</strong> Many candidates ignore DST
            entirely. When a timezone has a DST transition, certain times don&apos;t exist
            (spring forward) or exist twice (fall back). Interviewers expect candidates to
            at least acknowledge this and propose a strategy (e.g., use <code>Intl</code>{" "}
            API, display a warning).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Using <code>Date.parse()</code> for user input:</strong>{" "}
            <code>Date.parse()</code> is inconsistent across browsers for non-ISO formats.
            Interviewers look for candidates who know to use regex-based parsing with
            explicit format matching or the <code>Intl</code> API.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Ignoring accessibility on the calendar grid:</strong> Rendering a grid
            of <code>&lt;div&gt;</code> elements without ARIA roles means screen reader
            users cannot navigate the calendar. Interviewers expect <code>role=&quot;grid&quot;</code>,{" "}
            <code>role=&quot;gridcell&quot;</code>, arrow key navigation, and meaningful
            <code>aria-label</code> on each cell.
          </HighlightBlock>
          <li>
            <strong>Not considering SSR:</strong> Using <code>new Date()</code> during
            module initialization causes hydration mismatches between server and client.
            Interviewers expect candidates to defer browser-dependent initialization to{" "}
            <code>useEffect</code>.
          </li>
          <li>
            <strong>Format switching without hour conversion:</strong> Simply changing the
            display format without converting the hour value (e.g., showing 14:00 as
            &quot;14:00 PM&quot; instead of &quot;2:00 PM&quot;) is a common bug.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Two Stores vs One Store</h4>
          <HighlightBlock as="p" tier="important">
            Splitting date picker state and time picker state into two Zustand stores
            minimizes re-render cascades but adds complexity in coordinating the combined
            Date/Time value. A single store simplifies coordination but causes every
            component to re-render on any state change. The two-store approach is justified
            when the date and time pickers are used independently (e.g., date-only picker
            on one form, time-only picker on another). For a tightly coupled component,
            a single store is simpler. Interviewers expect you to articulate this trade-off
            and pick based on your use case.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Intl API vs date-fns / moment.js / day.js</h4>
          <HighlightBlock as="p" tier="important">
            The native <code>Intl</code> API is zero-dependency, well-supported in modern
            browsers, and handles timezones and locale-aware formatting natively. However,
            it lacks some features (e.g., date arithmetic, duration formatting) and has
            inconsistent behavior across Node.js versions. Libraries like date-fns provide
            a richer API, better tree-shaking, and consistent behavior across environments.
            The trade-off is bundle size (date-fns adds ~10KB gzipped) and an external
            dependency. For a component that needs deep timezone support, the <code>Intl</code>{" "}
            API is sufficient; for complex date arithmetic, date-fns is worth the cost.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Controlled vs Uncontrolled Date Input</h4>
          <p>
            A controlled input (value driven by store state) ensures the displayed value
            always matches the source of truth but requires careful handling of intermediate
            typing states (user types &quot;04/&quot; — not yet a valid date). An
            uncontrolled input (value managed by DOM, synced on blur) provides a smoother
            typing experience but creates a second source of truth. The hybrid approach
            — controlled display value with a separate internal buffer for in-progress
            typing — is the most robust but adds complexity. Interviewers look for
            candidates who can explain why they chose their approach and its limitations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add recurring date support (e.g., &quot;Every Monday&quot;)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>recurrence</code> field to the DatePickerState with type
              &quot;none&quot; | &quot;daily&quot; | &quot;weekly&quot; | &quot;monthly&quot;
              | &quot;yearly&quot;. When a recurrence is set, the selected date becomes a
              template. On form submission, generate all occurrences within a date range
              using date arithmetic (addDays, addWeeks, etc.). Display recurring dates
              with a recurring icon. Store the recurrence rule in iCal RRULE format for
              interoperability with calendar systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle date picker performance when rendering 100+ date
              pickers on a page (e.g., a scheduling grid)?
            </p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: The key bottleneck is the timezone list and Intl formatter creation. For
              bulk rendering, share a single Intl formatter cache across all pickers (module-level
              Map). Virtualize the timezone dropdown. Lazy-load the calendar dropdown only
              when a picker is focused (don&apos;t render all 100 calendars eagerly). Use
              <code>React.memo</code> on each picker component to prevent re-renders when
              unrelated pickers change. If the grid is static (no interactivity), consider
              rendering a simplified read-only date display instead of full pickers.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add multi-timezone comparison (e.g., &quot;What time is
              this in New York, London, and Tokyo simultaneously&quot;)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>comparisonTimezones</code> array to the state. For each timezone
              in the array, call <code>convertTimezone()</code> and render the result in a
              comparison panel below the main picker. Limit the array to 3-4 timezones to
              avoid UI clutter. Provide an &quot;Add timezone&quot; button that opens the
              timezone selector. Store the comparison list in localStorage so it persists
              across sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you integrate this with a form library like React Hook Form?
            </p>
            <p className="mt-2 text-sm">
              A: Wrap the DatePicker in a component that implements the <code>Controller</code>{" "}
              pattern from React Hook Form. Use <code>useController</code> to connect the
              picker&apos;s value (combined Date + Time as an ISO string) to the form state.
              Implement <code>onChange</code> to call <code>field.onChange()</code> with the
              ISO string. Implement <code>onBlur</code> to call <code>field.onBlur()</code>{" "}
              for validation triggering. The form library handles validation messages and
              error display.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle locale changes (e.g., user switches from English to
              Japanese)?
            </p>
            <p className="mt-2 text-sm">
              A: Store the active locale in a global app state (or Zustand store). Pass the
              locale to <code>Intl.DateTimeFormat</code> calls. The weekday headers in the
              calendar grid, the month names in the dropdown, and the date format all use
              the active locale. For Japanese, the weekday order changes (Sun-Sat instead
              of Mon-Sun), the era-based year format may be preferred, and the date format
              becomes YYYY/MM/DD. The <code>Intl.DateTimeFormat</code> API handles most of
              this automatically when you pass the locale option.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add a &quot;quick select&quot; feature (e.g., &quot;Today&quot;,
              &quot;Next 7 days&quot;, &quot;This month&quot;)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a row of quick-select buttons below the calendar grid. Each button
              calls a store action that computes the date(s) based on the current date.
              &quot;Today&quot; selects <code>new Date()</code>. &quot;Next 7 days&quot;
              sets rangeStart to today and rangeEnd to today + 7 days. &quot;This month&quot;
              sets rangeStart to the first of the current month and rangeEnd to the last.
              Style the buttons with a distinct visual treatment. This is a common UX
              pattern in analytics dashboards and booking systems.
            </p>
          </div>
        </div>
      </section>
      </section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>Implement the component as a small runtime with five boundaries. The input adapter normalizes keyboard, pointer, touch, browser, and async events. The state controller applies guards and separates preview state from committed state. The projection layer derives semantic DOM and ARIA relationships. The integration adapter owns server requests, URL synchronization, or browser APIs. The observability adapter emits bounded evidence for failures and slow paths.</p>
        <p>For this topic, the critical state rule is: Separate the user-entered wall-clock draft from the resolved instant and timezone. This makes ambiguous or nonexistent daylight-saving times explicit rather than silently shifting them. During interaction, record enough context to cancel safely. On commit, validate the latest intent, update the durable projection, and release temporary listeners, timers, observers, pointer capture, and abort controllers. On unmount, cleanup must be idempotent.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/date-time-picker-edge-cases.svg" alt="Design a Date-Time Picker edge-case defense map" caption="Edge-case map: validate intent, contain scale pressure, recover from failure, reconcile committed state, and emit evidence." />
      </section>
      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>native date and time inputs are robust on mobile; a custom picker is justified for timezone resolution, ranges, blocked slots, and consistent enterprise workflows. The custom design should still lean on native semantics and browser primitives where they remain correct. Replacing them creates testing obligations for keyboard behavior, focus ownership, reduced motion, touch interaction, zoom, SSR hydration, and assistive technology.</p>
        <p>The picker can validate locally for responsiveness, but the server remains authoritative for business availability and returns a reasoned rejection when a slot changed. At scale, the failure pressure is timezone databases, daylight-saving transitions, locale differences, dense disabled ranges, mobile input methods, and server validation drift. Defend the latency budget by batching measurement, aborting stale async work, bounding caches and prefetch, and emitting analytics only for committed outcomes.</p>
        <p>A principal answer should distinguish local responsiveness from durable correctness. Optimistic UI is appropriate when the rollback is deterministic and visible. It is inappropriate when the client cannot validate authorization, inventory, resource conflicts, or destructive side effects.</p>
      </section>
      <section>
        <h2>Best practices</h2>
        <p>Use explicit state unions, typed events, idempotent cleanup, stable ids, native semantics, SSR-safe feature detection, abortable requests, and deterministic tests. Exercise keyboard-only use, touch cancellation, screen-reader output, high zoom, reduced motion, slow network, stale responses, unmount during work, and browser back-forward behavior where relevant.</p>
        <p>Observe blocked transitions, rollback frequency, stale-response drops, slow interaction latency, cache pressure, retry count, and accessibility regression results. Keep telemetry small and avoid sensitive payloads. Publish the public behavior contract before changing shared component semantics.</p>
      </section>
      <section>
        <h2>Common Pitfalls</h2>
        <p>Common failures include mixing draft and committed state, treating rendering state as the source of truth for browser-owned behavior, leaving listeners or timers active after unmount, accepting stale async completion, trusting client-side authorization, and producing inaccessible custom controls.</p>
        <p>For this component specifically, the failure policy is to retain the draft on validation failure, distinguish invalid from ambiguous times, offer an explicit offset choice, and degrade to typed input when advanced UI is unavailable. Security and privacy require the implementation to bound input length, parse strictly, escape labels, avoid trusting client-side availability, and minimize telemetry because dates may disclose sensitive plans.</p>
      </section>
      <section>
        <h2>Real-world use cases</h2>
        <p>Representative deployments include a travel booking flow, a global meeting scheduler, and a maintenance-window form that must represent offsets precisely. In each case, the same component shell may be reused, but the policy layer changes: latency budget, permissions, persistence, fallback, and telemetry should be injected explicitly instead of hidden in presentation code.</p>
      </section>
      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you model component state?</h3><p>I would separate committed state, transient interaction state, derived presentation, and async request generations. For this component, Separate the user-entered wall-clock draft from the resolved instant and timezone. This makes ambiguous or nonexistent daylight-saving times explicit rather than silently shifting them. That model makes cancellation and rollback explicit.</p>
        <h3>What breaks at scale?</h3><p>The dominant pressures are timezone databases, daylight-saving transitions, locale differences, dense disabled ranges, mobile input methods, and server validation drift. I would bound work per interaction, virtualize or cache only where measured, and cancel work that is no longer relevant.</p>
        <h3>What consistency model applies?</h3><p>The picker can validate locally for responsiveness, but the server remains authoritative for business availability and returns a reasoned rejection when a slot changed. The interview answer must state which layer is authoritative and how stale completion is rejected.</p>
        <h3>How do you handle failure and rollback?</h3><p>I would retain the draft on validation failure, distinguish invalid from ambiguous times, offer an explicit offset choice, and degrade to typed input when advanced UI is unavailable. I would also emit a reason code so product metrics distinguish expected cancellation from defects and provider failures.</p>
        <h3>How do you defend the architecture over alternatives?</h3><p>native date and time inputs are robust on mobile; a custom picker is justified for timezone resolution, ranges, blocked slots, and consistent enterprise workflows. I would choose the smallest design that satisfies the required behavior and explicitly accept the testing and operability cost of custom interaction.</p>
      </section>
      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer events</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li>
          <li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React: Sharing State Between Components</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
