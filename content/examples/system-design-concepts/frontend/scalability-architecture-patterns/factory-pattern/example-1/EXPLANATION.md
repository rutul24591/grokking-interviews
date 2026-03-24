## Why Factory is useful here

When you render UI from data (CMS, experiments, server-driven UI), you need:
- a stable, typed mapping of “widget type” → implementation
- explicit handling for unsupported types
- a single “composition point” to enforce constraints and defaults

The factory acts as:
- an extensibility point (add a widget without touching every consumer)
- a safety point (reject unknown shapes via schema validation)

