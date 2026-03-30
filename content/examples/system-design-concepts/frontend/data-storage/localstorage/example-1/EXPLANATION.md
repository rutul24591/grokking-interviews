# LocalStorage Example 1

This example focuses on the production-safe version of localStorage:

- reads are browser-only and SSR-safe
- persisted values use a schema version
- draft autosave is separate from the full settings write path

LocalStorage is useful for small, synchronous values like preferences and unsent drafts. It should not be used for large datasets or sensitive tokens.

