# Image Gallery Lightbox — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples address two complex challenges in image gallery implementations: graceful image load failure handling and touch gesture disambiguation in lightbox mode.

---

## 1. Image Load Fallback (`image-load-fallback.ts`)

### The Problem

Images can fail to load for many reasons: network errors, 404s, CDN replication delays, corrupted data, or malformed URLs. Showing a broken image icon is poor UX.

### The Solution: State Machine with Auto-Retry

```
loading → loaded (success)
loading → error → retrying → loaded (retry succeeded)
                    → error → retrying → ... → fallback (max retries)
fallback → retrying (manual retry)
```

**Key features:**

**Fallback URL generation:** A callback generates alternate URLs for retries — e.g., switching from `/high-res/image.jpg` to `/low-res-1/image.jpg`. This is useful when the high-res version hasn't replicated to all CDN edges yet.

**Exponential delay:** Each retry waits longer (1s, 2s, 4s...), giving the CDN time to replicate.

**Placeholder → Image → Fallback layers:** Three rendering layers ensure there's always something visible:
1. Placeholder (gray skeleton) while loading
2. Actual image when loaded
3. Fallback (icon + message) after all retries fail

### Interview Talking Points

- **Why not just use `<img onerror>`?** The `onerror` event alone doesn't handle retries, URL switching, or loading states. A hook encapsulates the full lifecycle.
- **CDN replication delay:** When images are uploaded, they propagate to edge servers over 1-30 seconds. A retry with 1-2 second delay often succeeds on the next attempt.
- **Cleanup on unmount:** Pending retry timers are cleared to prevent state updates on unmounted components.
- **Src change detection:** When the `src` prop changes (e.g., navigating to next image), state resets automatically.

---

## 2. Touch Gesture Conflicts (`touch-gesture-conflicts.ts`)

### The Problem

A lightbox has multiple competing touch gestures on the same surface:
- Single-finger swipe → next/prev image
- Pinch → zoom in/out
- Two-finger pan → pan around zoomed image
- Tap → toggle chrome
- Double-tap → zoom to fit

These conflict because they share the same touch surface.

### The Solution: Gesture State Machine with Lock-In

**Detection pipeline:**

1. **onTouchStart:** Record initial positions, enter "detecting" state
2. **onTouchMove:** Analyze movement patterns:
   - 1 pointer + movement > 50px → lock as "swipe"
   - 2 pointers + distance changing > 10px → lock as "pinch-zoom"
   - 2 pointers + distance stable + movement > 10px → lock as "two-finger-pan"
3. **Once locked:** Ignore competing gestures until touch ends
4. **onTouchEnd:** Fire callback, reset to "none"

**Key insight:** The lock-in mechanism prevents a swipe from morphing into a pan mid-gesture. Once the system commits to "swipe," all subsequent movement is treated as swipe data.

**Two-finger pan detection:** When two pointers are present, we track both the distance between them (for pinch) AND the midpoint movement (for pan). If distance is stable but midpoint moves, it's a pan.

### Interview Talking Points

- **Why `event.preventDefault()` in onTouchMove?** Prevents the browser's native scroll from interfering with our gesture handling.
- **Double-tap detection:** Track the time between consecutive taps. If < 300ms, it's a double-tap. The first tap still fires its callback.
- **Zoom level awareness:** When `zoomLevel > 1`, single-finger swipes should be disabled (user is panning a zoomed image, not navigating). The hook should check zoom level before firing swipe callbacks.
- **Passive event listeners:** For performance, some browsers require `{ passive: false }` to allow `preventDefault()`. React's synthetic events handle this, but native listeners need explicit configuration.
