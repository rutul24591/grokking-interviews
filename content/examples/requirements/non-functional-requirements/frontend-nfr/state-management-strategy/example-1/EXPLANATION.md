# State management strategy: define boundaries first

Rather than picking a library first, pick where each state belongs:

- **Local component state:** ephemeral UI (open/close, input values).
- **URL state:** shareable filters, pagination, sort; supports back/forward.
- **Global UI state:** cross-cutting toggles (sidebar, theme), often persisted.
- **Server state:** data fetched from APIs; cache/invalidations are the hard part.

This example encodes that partition with minimal tooling.

