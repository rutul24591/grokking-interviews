Example 3 covers progressive-hydration edge cases:
- **Cancellation**: if the user navigates away or prioritizes a widget, cancel idle work.
- **Deduplication**: multiple islands should share a single dynamic-import promise to avoid downloading/executing the same chunk multiple times.
- **Prioritization**: user interactions (pointer/key) should preempt background hydration.

The demo shows multiple scheduled islands that load on idle, but a user can “Load now” to preempt the schedule.

