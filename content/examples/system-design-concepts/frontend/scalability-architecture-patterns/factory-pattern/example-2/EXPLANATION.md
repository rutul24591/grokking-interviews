## Focused sub-problem: “type safety without runtime drift”

A typed factory prevents a common production footgun:
- you add a new variant (e.g., new widget type)
- you forget to update the renderer/handler
- you ship a runtime undefined branch

With an exhaustive `switch` and a `never` assertion, TypeScript forces updates at compile time.

