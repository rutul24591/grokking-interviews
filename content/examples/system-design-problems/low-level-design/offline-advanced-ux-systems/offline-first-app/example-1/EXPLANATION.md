# Explanation

This example supports Design an Offline-First App. It demonstrates offline-first application shell, the invariant "Critical journeys must remain usable without network while freshness and conflict risk stay visible.", and the production edge case where a returning user opens the app on a train, edits cached data, then reconnects to newer server state. Use it to discuss API shape, state transitions, retry behavior, conflict handling, privacy scoping, and observability.
