/**
 * Split-brain can happen with localStorage coordination if:
 * - clocks drift between tabs/devices,
 * - storage events are missed,
 * - a tab is paused (background throttling),
 * - or two tabs acquire leadership “nearly simultaneously”.
 *
 * This demo prints a mitigation checklist rather than pretending localStorage is transactional.
 */

console.log(
  JSON.stringify(
    {
      risks: [
        "two leaders briefly (duplicate polling / duplicate writes)",
        "stale leader due to timer throttling",
        "clock skew causing early/late expiration",
      ],
      mitigations: [
        "treat leadership as advisory: make server endpoints idempotent",
        "use versioned updates so followers can ignore older snapshots",
        "bound polling: if leader detects another leader heartbeat, back off",
        "prefer SharedWorker / Service Worker for centralized coordination when available",
      ],
    },
    null,
    2,
  ),
);

