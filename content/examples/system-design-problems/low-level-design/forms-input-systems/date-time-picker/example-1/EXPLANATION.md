# Date/Time Picker — Full Implementation

Example 1 focuses on the non-trivial parts of a date/time picker:
- Time zones and formatting (`Intl.DateTimeFormat`)
- Calendar grid generation (weeks, leading/trailing days)
- Keyboard navigation model (arrow keys, page up/down, home/end)

Interview focus:
- Keeping the picker logic framework-agnostic (pure functions).
- Avoiding DST bugs by operating on **dates** vs timestamps when appropriate.

