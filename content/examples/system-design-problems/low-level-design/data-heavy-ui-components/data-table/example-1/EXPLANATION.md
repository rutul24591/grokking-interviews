# Data Table — Full Implementation (Model + State)

Example 1 is a production-style **data table subsystem** focused on interview-grade concerns:

- Sorting (multi-column) and stable tie-breaking
- Filtering (column + global search) with debounced application
- Pagination (offset and cursor support; UI model for both)
- Column resizing and persistence
- Virtualization/windowing hooks (for 10k–1M rows) without coupling to a renderer
- Selection model (single/multi, shift-range) and “select all” semantics

This example is intentionally built as **pure state + algorithms** so it can be reused in React, React Native, or server-side rendering.

