# Local Component State — Example 1

This app keeps all state local to the page because the workflow is highly interactive and not shared across routes.

It demonstrates:
- `useState` for ephemeral UI concerns like selected draft and unsaved title input
- `useReducer` for coordinated transitions like save, archive, and undo
- derived local views such as filtered task lists and the activity log
