# Toast Notification System — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + portal** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Toast API     │────▶│  Zustand Store   │────▶│ ToastContainer  │
│  (singleton)    │     │  (state+timers)  │     │    (Portal)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                    ┌─────┴─────┐
                                                    │           │
                                              ToastItem     ToastItem
                                              ToastItem     ToastItem
```

### Design Decisions

1. **Zustand for state management** — Zero boilerplate, selector-based subscriptions prevent unnecessary re-renders. Each ToastItem only re-renders when its own toast changes.

2. **Portal rendering** — Toasts render directly to `document.body`, escaping parent CSS constraints (overflow: hidden, z-index stacking contexts).

3. **FIFO queue with visible limit** — Only N toasts render at once (default: 3). Excess toasts queue implicitly and become visible as earlier toasts dismiss.

4. **Timer management via Map** — Each toast's setTimeout ID is stored in a Map keyed by toast ID. This enables O(1) lookup for pause/resume/cleanup.

## File Structure

```
example-1/
├── lib/
│   ├── toast-types.ts       # TypeScript interfaces, constants
│   └── toast-store.ts       # Zustand store + singleton API
├── components/
│   ├── toast-container.tsx  # Portal wrapper, event listeners
│   ├── toast-item.tsx       # Individual toast with animations + ARIA
│   └── toast-icon.tsx       # Type-specific SVG icons
├── api/
│   └── toast-api.ts         # Public API facade
└── EXPLANATION.md           # This file
```

## Key Implementation Details

### Zustand Store (lib/toast-store.ts)

The store is the single source of truth. Key aspects:

- **addToast**: Creates toast with defaults, generates UUID, starts setTimeout. Returns the toast ID for manual dismissal.
- **dismissToast**: Clears timer, removes toast from array, calls onDismiss callback.
- **pauseTimer/resumeTimer**: Calculates remaining time dynamically. This is critical — if we stored the original duration instead of remaining time, toasts would disappear immediately after hover ends.
- **dismissAll**: Clears all timers and empties the array. Called on unmount to prevent memory leaks.

The exported `toast` singleton wraps store actions for convenient imperative API:
```ts
toast.success('Saved!');
toast.error('Failed', { duration: 8000 });
```

### Toast Container (components/toast-container.tsx)

The container orchestrates rendering and global event handling:

1. **SSR safety**: Uses `useState(false)` + `useEffect(setMounted(true))` pattern. During SSR, returns null. On client mount, renders the portal.

2. **Portal**: Renders to `document.body` via `createPortal()`. This ensures toasts are always on top regardless of where the container is placed in the component tree.

3. **Global Escape key**: Listens for Escape key at window level to dismiss the most recent toast. This provides keyboard accessibility for users who can't reach the close button.

4. **Pause/Resume events**: ToastItem components dispatch custom events (`toast:pause`, `toast:resume`) on hover. The container listens for these and calls the store's pauseTimer/resumeTimer.

5. **Cleanup on unmount**: Calls `dismissAll()` in the effect cleanup function to prevent stale timers firing after the component unmounts.

### Toast Item (components/toast-item.tsx)

The most complex component. Key aspects:

1. **Entrance/Exit animations**: Uses CSS transitions on `translateX` and `opacity`. These properties are GPU-composited (don't trigger layout), ensuring 60fps animations.

2. **ARIA attributes**: 
   - `role="status"` for info/success, `role="alert"` for error/warning
   - `aria-live="polite"` for non-critical, `aria-live="assertive"` for critical
   - `aria-atomic="true"` ensures the entire message is announced
   - Close button has `aria-label="Dismiss notification"`

3. **Keyboard support**: `tabIndex={0}` makes the toast focusable. Escape and Enter keys dismiss the toast. The close button is a native `<button>` element.

4. **Hover pause**: `onMouseEnter` dispatches `toast:pause` event, `onMouseLeave` dispatches `toast:resume`. The store handles the actual timer manipulation.

### Toast Icon (components/toast-icon.tsx)

Simple inline SVG icons for each toast type. Uses stroke-based icons from Heroicons. Colors match the toast type:
- Success: Green (#22c55e)
- Error: Red (#ef4444)
- Warning: Yellow (#f59e0b)
- Info: Blue (#3b82f6)

## Usage

### 1. Add ToastContainer to your app root

```tsx
// app/layout.tsx
import { ToastContainer } from '@/components/toast-container';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

### 2. Trigger toasts from anywhere

```tsx
import { toast } from '@/api/toast-api';

function MyComponent() {
  const handleSubmit = async () => {
    try {
      await saveData();
      toast.success('Data saved successfully');
    } catch (err) {
      toast.error('Failed to save data', {
        action: { label: 'Retry', onClick: handleSubmit },
      });
    }
  };
}
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Rapid-fire (20 toasts in 1s) | Only 3 render, rest queue without performance impact |
| Route transition during toast | Container persists across routes, toasts remain visible |
| Hover just before auto-dismiss | Remaining time calculated dynamically, toast doesn't disappear immediately |
| Server-side rendering | Container returns null during SSR, mounts on client |
| Component unmount | All timers cleared via dismissAll() in cleanup |
| Duplicate toasts | No deduplication by default (can be added via group field) |
| Extremely long message | Text wraps via flex layout, container has max-width |

## Performance Characteristics

- **addToast**: O(1) — array push
- **dismissToast**: O(n) — array filter (n is small, typically < 10)
- **getVisibleToasts**: O(k) — slice first k items (k = 3)
- **Timer operations**: O(1) — Map lookup
- **Animation**: GPU-composited (transform + opacity only)

## Testing Strategy

1. **Unit tests**: Test store actions (add, dismiss, pause, resume) with mocked setTimeout
2. **Integration tests**: Render container, call toast.success(), assert DOM updates
3. **Accessibility tests**: Run axe-core on rendered toasts, verify aria-live regions
4. **Edge case tests**: Rapid-fire 50 toasts, verify no memory leaks, all timers cleaned up
