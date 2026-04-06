# Loading Skeleton — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples cover two critical edge cases that interviewers frequently ask about as follow-ups to the basic skeleton loading pattern.

---

## 1. Flash Prevention (`flash-prevention.ts`)

### The Problem

When content loads extremely fast (e.g., from cache or a fast CDN), the skeleton appears and disappears in under 150ms. The human eye can detect changes as short as 13ms, and this rapid toggle creates a perceptible **flicker** that feels broken rather than performant.

### The Solution

A **state machine** with four phases:
1. **idle** — Initial state, nothing rendering yet
2. **skeleton** — Loading in progress, skeleton visible
3. **crossfade** — Both skeleton and content render simultaneously with inverse opacity
4. **content** — Only content visible

The key insight: enforce a **minimum display duration** (300ms) for the skeleton. Even if data arrives in 50ms, we wait the remaining 250ms before starting the crossfade transition. This ensures the user perceives a deliberate loading state, not a glitch.

### Crossfade Technique

During the crossfade phase (150ms), the skeleton fades from opacity 1 → 0 while content fades from 0 → 1. Both layers are mounted simultaneously, creating a smooth dissolve transition rather than an abrupt swap.

### Interview Talking Points

- **Why 300ms minimum?** Based on UX research — users need ~300ms to register that "something is loading." Shorter feels like a flash; much longer feels unnecessarily slow.
- **What about accessibility?** The skeleton has `aria-busy="true"` and `aria-hidden` toggled appropriately. Screen readers announce content only when it's fully rendered.
- **Cleanup on unmount:** All timers are tracked in a Set and cleared on unmount to prevent memory leaks and state-updates-on-unmounted-component warnings.

---

## 2. Delay Threshold (`delay-threshold.ts`)

### The Problem

Showing a skeleton for every request, regardless of speed, penalizes fast responses. If an API returns in 80ms, showing a skeleton for 80ms is **worse UX** than showing nothing — the user sees a flash of skeleton before content appears.

### The Solution

Use a **threshold-based approach** (default 200ms):

```
t=0     → Request starts, start delay timer
t=80ms  → Request completes → skeleton never shown (below threshold)
t=200ms → Still loading → show skeleton now
t=500ms → Request completes → hide skeleton
```

The skeleton only renders if the request exceeds the threshold. For fast requests, the user sees content directly with no intermediate state.

### Why 200ms?

The Nielsen Norman Group's research identifies **200ms** as the perceptual boundary where users start noticing delay. Below 200ms, interactions feel instantaneous. Above 200ms, users expect feedback that something is happening.

### Adaptive Threshold (Bonus)

The file also includes `calculateAdaptiveThreshold()` — a function that adjusts the threshold based on historical load times using the **median (p50)** of recent requests. This means:
- Fast endpoints get a lower threshold (skeleton rarely shows)
- Slow endpoints get a higher threshold (skeleton shows less often, reducing visual noise)
- Clamped between 100ms and 1000ms to prevent extreme values

### Interview Talking Points

- **Race conditions:** The delay timer must be cleared if loading completes before the threshold fires. Otherwise, the skeleton could appear after content is already visible.
- **Elapsed time tracking:** Useful for debugging and monitoring. In production, you'd report this to analytics to optimize slow endpoints.
- **Grace period on hide:** After content arrives, we wait 50ms before hiding the skeleton — this gives the browser time to paint the content before removing the skeleton, avoiding a brief white flash.
