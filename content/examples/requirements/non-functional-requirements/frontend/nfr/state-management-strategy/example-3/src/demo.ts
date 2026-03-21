/**
 * Conceptual demo: “tearing” happens when multiple components read inconsistent snapshots
 * of a mutable external store during concurrent rendering.
 *
 * React’s useSyncExternalStore provides a safe contract for reading external stores.
 */

console.log(
  JSON.stringify(
    {
      guidance: [
        "If you have a global store, read it via useSyncExternalStore (or a library built on it).",
        "Avoid ad-hoc mutable singletons accessed directly from components.",
        "Prefer server state tools for data fetching (cache/invalidation), separate from UI state."
      ]
    },
    null,
    2,
  ),
);

