# Toast Notification System — Edge Cases & Advanced Scenarios

This document walks through the two most commonly asked follow-up questions in interviews about toast notification systems: handling rapid-fire toast floods, and managing the hover-dismiss race condition.

---

## Edge Case 1: Rapid-Fire Toast Flood (20+ toasts in 1 second)

### Scenario

A user performs a bulk operation — e.g., "Delete all 47 items" — and each deletion triggers its own toast. Without protection, 47 toasts stack on screen, the DOM thrashes from mount/unmount cycles, and the user cannot process any single message.

### How `rapid-fire-handler.ts` solves it

The solution uses a **three-layer defense**:

```
Layer 1: Deduplication (content hash)
    ↓
Layer 2: Debounce (sliding window)
    ↓
Layer 3: Batch/Group (by type)
```

**Layer 1 — Deduplication**: Every toast gets a content hash from `type + title + message`. If an identical hash is already in the queue, we increment a counter instead of adding a duplicate. This handles the common case of 20 identical "Save failed" errors.

**Layer 2 — Debounce**: A sliding window timer (default 800ms) accumulates toasts. Each new toast resets the timer, so the flush only fires after a quiet period.

**Layer 3 — Batch/Group**: If the queue exceeds `maxIndividualToasts` (default 5), toasts are grouped by type. The user sees "23 error notifications" as a single grouped toast instead of 23 individual ones.

### Interview follow-up: "What if grouping still produces too many groups?"

If you have 6 different types each with 10 toasts, you'd get 6 grouped toasts — still too many. The handler collapses everything into a single "47 notifications received" group as a safety valve.

### Time complexity

- **Dedup**: O(1) average (hash map lookup)
- **Grouping**: O(n) single pass through the queue
- **Total**: O(n) where n = number of toasts in the window

---

## Edge Case 2: Hover-Dismiss Race Condition

### Scenario

A toast has a 5-second auto-dismiss timer. At t=4.5s, the user moves their cursor over the toast to click an "Undo" button. The timer fires at t=5s and the toast begins its exit animation. The user's click lands on a fading element — a broken interaction.

### State machine

The `HoverDismissHandler` models this as a state machine:

```
entering → visible → exiting → dismissed
              ↕
           paused (hovering)
```

### Key race conditions handled

#### Race 1: Hover during enter animation

The user hovers while the toast is still animating in. The handler checks `isHovering` in `onEnterComplete()` and skips starting the countdown if the user is already hovering.

#### Race 2: Hover during exit animation (grace period)

The exit animation has started but is within the 300ms grace period. The handler calls `reverseExit()` which:
1. Clears the dismiss timeout
2. Calculates how far into the exit we were (exitProgress)
3. Restores remaining time proportionally: `duration * (1 - exitProgress)`
4. Ensures a minimum of 1 second remains so the user can actually interact

#### Race 3: Remaining time recalculation

When the user hovers, we don't just "pause the timer." We calculate the **exact remaining time** at the moment of hover:

```
remainingMs = totalDuration - elapsedSincePhaseStart
```

This prevents the toast from living forever if the user hovers, leaves, hovers again repeatedly. Each pause captures the remaining time, and each resume continues from that captured value.

### Time tracking approach

We use `performance.now()` (monotonic clock) instead of `Date.now()` because:
- It's not affected by system clock changes
- It has sub-millisecond precision
- It's the standard for animation timing

---

## Production considerations

### Memory leaks

Both handlers must be cleaned up on component unmount. The `HoverDismissHandler.destroy()` method clears all timers and RAF handles. The `RapidFireToastHandler.forceFlush()` ensures no toasts are lost on unmount.

### Touch devices

On touch devices, there's no true "hover." The handlers use Pointer Events (`pointerenter`/`pointerleave`) which work for both mouse and touch. For touch, the "hover" state maps to touch-active (finger on the toast).

### Accessibility

- Screen readers should announce the grouped toast count: "23 error notifications"
- The pause-on-hover behavior should also pause for `prefers-reduced-motion` users
- Grouped toasts should expand to show individual items on request

---

## Diagrams

### Rapid-fire handler flow

```
┌──────────────────────────────────────────────────────────┐
│                    Toast Dispatcher                       │
│                  (20+ toasts in 1s)                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Content Hasher    │  ← Dedup layer
              │  (type+title+msg)   │
              └────────┬────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
     Hash exists?           New hash
     → increment count      → add to queue
            │                     │
            └──────────┬──────────┘
                       ▼
              ┌─────────────────────┐
              │   Debounce Timer    │  ← Sliding window (800ms)
              │   (resets each)     │
              └────────┬────────────┘
                       │ (quiet period reached)
                       ▼
              ┌─────────────────────┐
              │    Flush + Group    │  ← By type
              │  (≤5 → individual   │
              │   >5 → grouped)     │
              └────────┬────────────┘
                       ▼
              ┌─────────────────────┐
              │  Render toasts to   │
              │  DOM (1-5 items)    │
              └─────────────────────┘
```

### Hover-dismiss state machine

```
                    ┌──────────┐
                    │ entering │
                    └────┬─────┘
                         │ onEnterComplete()
                         │ (check isHovering first)
                         ▼
                    ┌──────────┐
         onHoverStart() │        │ onHoverEnd()
          ┌─────────────│ visible│──────────────┐
          │             └───┬────┘              │
          ▼                 │                   ▼
    ┌───────────┐           │ auto-dismiss      │
    │  paused   │           │ fires             │
    │ (hovering)│           ▼                   │
    └─────┬─────┐     ┌──────────┐             │
          │     │     │ exiting  │◄────────────┘
          │     │     │(300ms    │  within grace
          │     │     │ grace)   │  period → reverse
          ▼     │     └────┬─────┘
    ┌───────────┐          │ exit complete
    │  visible  │          │
    │(resumed)  │          ▼
    └───────────┐    ┌───────────┐
                │    │ dismissed │
                │    └───────────┘
```
