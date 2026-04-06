# Date Time Picker — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples cover two of the most treacherous areas in date/time handling: timezone conversion with DST transitions, and strict date parsing that avoids JavaScript's silent rollover pitfalls.

---

## 1. Timezone Conversion (`timezone-conversion.ts`)

### The Problem

Dates are stored as UTC on the server but displayed in the user's local timezone. The complications are numerous:

**DST transitions:** During "spring forward," the hour from 2:00 AM to 3:00 AM doesn't exist. A meeting scheduled at 2:30 AM is impossible. During "fall back," the hour from 1:00 AM to 2:00 AM occurs twice — a UTC timestamp could map to either occurrence.

**Traveling users:** A user creates an event in NYC (EST), then views it from London (GMT). The displayed time should update to their current timezone, but the stored UTC value doesn't change.

**Cross-timezone scheduling:** User A in NYC schedules a meeting with User B in Tokyo. Both need to see the time in their respective timezones.

### The Solution

**Store as UTC, convert at render time:** All dates are stored as UTC. Conversion happens only when displaying, using `Intl.DateTimeFormat` with the target timezone.

**DST ambiguity detection:** By comparing the UTC offset of a date with the offset 1 hour before, we can detect if the date falls in a DST transition period. If ambiguous, we show a warning to the user.

**Explicit timezone selection:** Users can override their browser's detected timezone with a manual selector. This is essential for scheduling across timezones.

**localToUTC conversion:** When a user picks a date/time in a form, we convert it back to UTC for server submission. The conversion uses the selected timezone's offset at that specific moment.

### Interview Talking Points

- **What does `Intl.DateTimeFormat().resolvedOptions().timeZone` return?** The browser's detected IANA timezone string (e.g., "America/New_York"). This is more reliable than `new Date().getTimezoneOffset()` which only gives a raw offset, not a timezone name.
- **Why not use `getTimezoneOffset()`:** It returns a raw offset in minutes, doesn't account for DST rules, and can't handle historical timezone changes.
- **Production recommendation:** For complex timezone logic, use `luxon` or `date-fns-tz`. They handle edge cases like historical DST rule changes and timezone database updates.

---

## 2. Date Parsing Edge Cases (`date-parsing-edge-cases.ts`)

### The Problem

JavaScript's `Date` constructor has a critical flaw: **it silently rolls over invalid dates**.

```javascript
new Date(2025, 1, 30)  // February 30, 2025
// Returns: March 2, 2025  ← SILENT ROLLOVER! No error thrown.

new Date("2025-02-30")
// Returns: March 2, 2025  ← SAME SILENT ROLLOVER!
```

This is the #1 source of date bugs in JavaScript applications.

### The Solution: Strict Parsing with Component Validation

**Step 1: Detect format** — Parse the input string to determine if it's `YYYY-MM-DD`, `MM/DD/YYYY`, `DD/MM/YYYY`, etc.

**Step 2: Detect ambiguity** — If both the month and day are ≤ 12 (e.g., "03/04/2025"), the format is ambiguous. We return `ambiguous: true` and ask the user to clarify.

**Step 3: Validate components:**
- Month must be 1-12
- Day must be 1 to `daysInMonth(year, month)` (accounting for leap years)
- Leap year check: divisible by 4, except centuries unless divisible by 400

**Step 4: Construct and verify:** Build the Date object, then check that its year/month/day match the original input. If they don't, a rollover occurred → reject.

**Step 5: Range checks:** Optional `minDate`, `maxDate`, `allowFuture`, `allowPast` constraints.

### Leap Year Logic

```
2024 → leap year (divisible by 4, not by 100) → Feb has 29 days
2000 → leap year (divisible by 400) → Feb has 29 days
1900 → NOT leap year (divisible by 100 but not 400) → Feb has 28 days
2025 → NOT leap year (not divisible by 4) → Feb has 28 days
```

### Interview Talking Points

- **The rollover trap:** Interviewers love to ask "What does `new Date(2025, 1, 30)` return?" The answer is March 2, 2025 — and many engineers get this wrong.
- **Format detection logic:** If the first number > 12, it must be a day. If the second > 12, it must be a month. If both ≤ 12, it's ambiguous.
- **Server-side validation:** Client-side parsing is for UX only. The server must independently validate all date inputs.
- **ISO 8601 is the answer:** For APIs, always use `YYYY-MM-DD` format. It's unambiguous and sorts lexicographically.
