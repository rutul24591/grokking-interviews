## Why Observer matters in frontend systems design

Observer is the core idea behind:
- state containers (Redux/Zustand/MobX)
- reactive streams
- subscription-based caches (React Query / SWR patterns)

The production pitfall is React integration:
- naïve subscriptions can cause **tearing** (UI reads inconsistent snapshots)
- updates can be missed or applied out of order

`useSyncExternalStore` is the recommended bridge: React controls subscription timing and reads consistent snapshots.

## What to look for
- `createObservable` implements the subject with `get/set/subscribe`.
- `useObservableValue` uses `useSyncExternalStore` to subscribe safely.
- The page renders multiple components observing the same subject.

