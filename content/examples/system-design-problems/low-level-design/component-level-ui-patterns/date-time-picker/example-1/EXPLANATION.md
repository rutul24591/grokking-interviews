# Date / Time Picker — Implementation Walkthrough

## Architecture Overview

This implementation follows a **multi-store + hooks + components** pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│                        DatePicker (Root)                         │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ DateInput │  │ CalendarGrid │  │ TimePicker │  │ Timezone   │ │
│  │           │  │ + Header     │  │            │  │ Selector   │ │
│  └─────┬─────┘  └──────┬───────┘  └─────┬──────┘  └─────┬──────┘ │
│        │               │                │               │        │
│        ▼               ▼                ▼               ▼        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Zustand Stores (2 independent)                │  │
│  │  ┌─────────────────────┐    ┌────────────────────────────┐ │  │
│  │  │  DatePickerStore     │    │  TimePickerStore           │ │  │
│  │  │  (month, year,       │    │  (hour, minute, second,    │ │  │
│  │  │   selected, range)   │    │   format, AM/PM)           │ │  │
│  │  └─────────────────────┘    └────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│              ┌───────────────────────────────┐                   │
│              │    datetime-utils.ts           │                   │
│              │  (Pure functions, Intl API)    │                   │
│              └───────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Two independent Zustand stores** — Date picker state and time picker state are separated to minimize re-render cascades. Changing the timezone does not cause the calendar grid to re-render; changing the time does not cause the date selection to re-render.

2. **Pure utility functions** — All date math, formatting, timezone conversion, and DST detection lives in `datetime-utils.ts` as pure functions with no side effects. This makes them trivially testable and reusable.

3. **Computed calendar grid** — The 42-cell grid is computed during render from (currentMonth, currentYear), not stored in state. This avoids unnecessary store updates.

4. **Native Intl API** — Uses `Intl.DateTimeFormat` for timezone conversion and locale-aware formatting. Zero external dependencies.

## File Structure

```
example-1/
├── lib/
│   ├── datetime-types.ts       # TypeScript interfaces and types
│   ├── datetime-utils.ts       # Pure utility functions (formatting, parsing, timezone, DST)
│   ├── date-picker-store.ts    # Zustand store for calendar state
│   └── time-picker-store.ts    # Zustand store for time state
├── hooks/
│   ├── use-date-picker.ts      # Calendar grid generation, navigation, selection logic
│   └── use-time-picker.ts      # Time input handling, format switching, scroll adjustment
├── components/
│   ├── date-picker.tsx         # Root component composing all sub-components
│   ├── calendar-grid.tsx       # 7-column month view with ARIA roles
│   ├── calendar-header.tsx     # Month/year navigation with dropdowns
│   ├── time-picker.tsx         # Hour/minute/second inputs with AM/PM toggle
│   ├── timezone-selector.tsx   # Timezone dropdown with search and UTC offset
│   └── date-input.tsx          # Text input with auto-formatting and validation
└── EXPLANATION.md              # This file
```

## Key Implementation Details

### Type Definitions (lib/datetime-types.ts)

Defines all core types used throughout the system:

- **`DateFormat`**: Union of supported format strings (`"MM/DD/YYYY"` | `"DD/MM/YYYY"` | `"YYYY-MM-DD"`)
- **`TimeFormat`**: `"12h"` | `"24h"`
- **`TimeZone`**: IANA ID, display label, UTC offset string, DST status
- **`DatePickerState`**: currentMonth, currentYear, selectedDate, rangeStart, rangeEnd, hoverDate, isOpen, mode, dateFormat, disabledDateFn, minDate, maxDate
- **`TimePickerState`**: hour, minute, second, isPM, format
- **`CalendarDay`**: date, isCurrentMonth, isToday, isSelected, isDisabled, isRangeStart, isRangeEnd, isInRange, isHovered
- **`DisabledDateFn`**: Predicate function `(date: Date) => boolean`

### Date/Time Utilities (lib/datetime-utils.ts)

Pure functions leveraging the `Intl` API:

- **`formatDate()`**: Formats a Date into the specified DateFormat string using manual component extraction (no Intl for format strings, to ensure exact control).
- **`formatTime()`**: Formats hour/minute/second into 12h or 24h display string.
- **`parseDate()`**: Parses a user-typed string into a Date object with regex-based format matching and validation. Returns `null` for invalid input.
- **`convertTimezone()`**: Converts a Date to its components in a target timezone using `Intl.DateTimeFormat.formatToParts()`.
- **`getUtcOffset()`**: Extracts the UTC offset string for a Date in a specific timezone.
- **`isDST()`**: Detects DST by comparing UTC offsets in January vs July for the target timezone. If they differ, the timezone observes DST. The target date's offset is compared to determine if it's in the "summer" (DST) or "winter" (standard) period.
- **`generateCalendarGrid()`**: Produces a 6x7 array of CalendarDay objects. Includes trailing days from the previous month and leading days from the next month. Computes selection, range, and disabled status for each cell.
- **`getWeekdayNames()` / `getMonthNames()`**: Localized names via `Intl.DateTimeFormat`.
- **Formatter cache**: A `Map<string, Intl.DateTimeFormat>` caches formatters by (locale, timezone, options) key to avoid expensive re-creation.

### Date Picker Store (lib/date-picker-store.ts)

Zustand store managing calendar state:

- **State**: currentMonth, currentYear, selectedDate, rangeStart, rangeEnd, hoverDate, isOpen, mode, dateFormat, disabledDateFn, minDate, maxDate
- **`navigateMonth(delta)`**: Handles year boundary wrapping (December + 1 = January next year)
- **`selectDate(date)`**: In single mode, sets selectedDate and closes dropdown. In range mode, first click sets rangeStart, second click sets rangeEnd.
- **SSR safety**: Initializes with default values (January 2026). Real values set via `initializeDatePicker()` called in a `useEffect`.

### Time Picker Store (lib/time-picker-store.ts)

Zustand store managing time state:

- **State**: hour, minute, second, isPM, format
- **`setFormat(format)`**: Handles hour conversion when switching between 12h and 24h. 14:00 becomes 2:00 PM; 2:00 PM becomes 14:00.
- **`setHour()` / `setMinute()` / `setSecond()`**: Include clamping to valid ranges (hour: 0-23 or 1-12, minute/second: 0-59).
- **SSR safety**: Same pattern as date picker store — defaults initialized, real values set via `useEffect`.

### useDatePicker Hook (hooks/use-date-picker.ts)

Encapsulates calendar logic:

- **`grid`**: Memoized 42-cell array computed from store state
- **`goToPrevMonth()` / `goToNextMonth()`**: Month navigation with year wrapping
- **`jumpTo(month, year)`**: Direct month/year selection
- **`handleDateClick(date)`**: Selection with disabled date check
- **`handleDateHover(date)`**: Range preview on hover
- **`getDisplayText()`**: Human-readable display string for selected date(s)

### useTimePicker Hook (hooks/use-time-picker.ts)

Encapsulates time logic:

- **`displayHour`**: Computed hour based on format (1-12 for 12h, 0-23 for 24h)
- **`formattedTime`**: Full time string
- **`handleScroll(event)`**: Wheel event maps to minute adjustments
- **`timeOptions`**: 30-minute interval list for scrollable picker
- **`isValid`**: Validation check for current time values

### Components

#### DatePicker (components/date-picker.tsx)
Root component. Composes all sub-components. Manages click-outside detection via document-level mousedown listener, Escape key handling, and SSR-safe mounting via `useState(false)` + `useEffect(setMounted(true))` pattern.

#### CalendarGrid (components/calendar-grid.tsx)
Renders the 7-column grid with weekday headers. Each cell is a `<button>` with `role="gridcell"`, `aria-label` (full date for screen readers), `aria-selected`, and `aria-disabled`. Styling handles: current month vs adjacent month, today highlight, selected state, range highlighting, disabled state, and hover preview.

#### CalendarHeader (components/calendar-header.tsx)
Prev/next month arrows + month/year dropdowns. Month dropdown shows a 3x4 grid of month names. Year dropdown shows current year +/- 5 years in a 2-column grid.

#### TimePicker (components/time-picker.tsx)
Three numeric inputs (hour, minute, second) with a format toggle button (12H/24H). In 12h mode, an AM/PM button is displayed. A scrollable list of 30-minute intervals provides quick selection. The formatted time preview is displayed below the inputs.

#### TimezoneSelector (components/timezone-selector.tsx)
Displays the currently selected timezone with its UTC offset and DST status. A search input filters the timezone list. Each option shows the label, IANA ID, UTC offset, and DST badge. The converted current time is displayed next to the timezone name.

#### DateInput (components/date-input.tsx)
Text input with auto-formatting on every keystroke (inserts `/` or `-` separators automatically). On blur, parses and validates the input. Shows an error message for invalid dates. The format specifier hint is displayed below the input.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Leap year Feb 29 → non-leap year | `clampDate()` clamps to Feb 28 |
| DST ambiguous times (fall back) | `Intl.DateTimeFormat` resolves; warning badge shown |
| Invalid typed input (e.g., "02/30/2026") | `parseDate()` returns null, error displayed |
| Same date for range start and end | Treated as single-day range |
| Format switching (24h ↔ 12h) | Hour converted automatically (14 ↔ 2 PM) |
| SSR rendering | Stores use default values, initialized on client via useEffect |
| Half-hour timezone offsets (IST, NPT) | `Intl.DateTimeFormat` handles natively |
| Year boundary month navigation | December + 1 = January next year, January - 1 = December previous year |

## Performance Characteristics

- **generateCalendarGrid**: O(1) — always 42 cells
- **formatDate / parseDate**: O(1) — regex + Date constructor
- **convertTimezone**: O(1) — Intl API call
- **isDST check**: O(1) — two Intl calls (Jan + Jul)
- **Store actions**: O(1) — direct field assignment
- **Formatter cache**: Reduces Intl.DateTimeFormat creation from O(n) per render to O(1) amortized

## Testing Strategy

1. **Unit tests**: Test all utility functions with known inputs/outputs. Test store actions (navigateMonth wraps year boundaries, selectDate handles single vs range, setFormat converts hours correctly).
2. **Integration tests**: Render full DatePicker, click through selection flow, assert store updates and DOM changes.
3. **Accessibility tests**: Run axe-core on calendar grid, verify aria-labels on all cells, keyboard navigation (Tab, Arrow keys, Enter, Escape), and screen reader announcements.
4. **Edge case tests**: Leap year handling, DST transitions, invalid input parsing, half-hour timezone offsets.
