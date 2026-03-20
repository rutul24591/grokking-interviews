Example 1 demonstrates the *observable behavior* behind **Selective Hydration**:

- A server-rendered button is visible immediately.
- A `Suspense` boundary intentionally suspends **during client hydration**, delaying when React can attach handlers.
- User clicks are still accepted by the browser and then **replayed** by React once the boundary hydrates.

This is the reason selective hydration matters:
- you can ship useful HTML early (SSR/streaming)
- hydration can be incremental
- discrete interactions (click, submit) can be prioritized and replayed

