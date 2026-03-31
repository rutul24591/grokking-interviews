# Event listener cleanup

Attach and remove global listeners predictably so panels can mount and unmount without stacking duplicate handlers.

- Example 1 demonstrates the primary memory-management concept end to end with a Next.js UI and Node API.
- The app makes memory ownership, cleanup, or retention visible through user actions.
- Example 2 and Example 3 isolate important checks and edge cases tied to the same topic.
