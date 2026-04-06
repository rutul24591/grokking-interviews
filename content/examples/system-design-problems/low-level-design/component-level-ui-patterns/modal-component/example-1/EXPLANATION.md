# Modal Component — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + portal** pattern with focus trapping:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Modal API     │────▶│  Zustand Store   │────▶│ ModalContainer  │
│  (singleton)    │     │  (state+promise) │     │    (Portal)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                    ┌─────┴─────┐
                                                    │           │
                                               ModalBackdrop  ModalPanel
                                                              (Focus Trap)
```

### Design Decisions

1. **Zustand for state management** — Zero boilerplate, selector-based subscriptions prevent unnecessary re-renders. The store manages the current modal config, z-index stacking, and Promise resolvers for confirm modals.

2. **Portal rendering** — The modal renders directly to `document.body`, escaping parent CSS constraints (overflow: hidden, z-index stacking contexts).

3. **Promise-based confirm API** — `await modal.confirm("Delete?")` returns `true`, `false`, or `null` (dismissed without choice). This enables clean `async/await` call-site ergonomics instead of callback nesting.

4. **Focus trap via custom hook** — The `useFocusTrap` hook intercepts Tab/Shift+Tab and cycles focus among focusable elements within the modal. On close, focus is restored to the trigger element.

5. **Scroll lock with scrollbar compensation** — When the modal opens, `overflow: hidden` is applied to the body. The scrollbar width is calculated and applied as `padding-right` to prevent layout shift when the scrollbar disappears.

## File Structure

```
example-1/
├── lib/
│   ├── modal-types.ts       # TypeScript interfaces, constants
│   └── modal-store.ts       # Zustand store + singleton API
├── hooks/
│   └── use-focus-trap.ts    # Focus trap custom hook
├── components/
│   ├── modal-container.tsx  # Portal wrapper, scroll lock, escape key
│   ├── modal-backdrop.tsx   # Semi-transparent overlay with fade
│   └── modal-component.tsx  # Modal panel with type-specific UI
└── EXPLANATION.md           # This file
```

## Key Implementation Details

### Zustand Store (lib/modal-store.ts)

The store is the single source of truth. Key aspects:

- **openConfirm**: Creates a `Promise<ModalResult>` and stores its `resolve` function. Opens a confirm modal with Yes/No buttons. Returns the Promise so the caller can `await` the result.
- **openAlert**: Opens an alert modal with an OK button. No Promise needed since there is no choice to make.
- **openCustom**: Opens a modal with arbitrary React content. The caller provides the content as a ReactNode.
- **confirm/cancel**: Resolves the pending Promise with `true` or `false` respectively, then clears the modal state.
- **close**: Resolves the pending Promise with `null` (dismissal without explicit choice), then clears state.
- **Auto-timeout**: If the caller never `await`s the result, the Promise auto-resolves with `null` after 30 seconds to prevent memory leaks.

The exported `modal` singleton wraps store actions for convenient imperative API:
```ts
const result = await modal.confirm('Are you sure?');
if (result === true) { /* proceed */ }

modal.alert('Operation completed');

modal.open(<MyCustomForm />, { title: 'Settings' });
```

### Focus Trap Hook (hooks/use-focus-trap.ts)

The most critical accessibility feature. Key aspects:

1. **Stores previous focus**: On activation, stores `document.activeElement` so it can be restored on cleanup.

2. **Focusable element selector**: Queries for `a[href]`, `button:not([disabled])`, `input`, `select`, `textarea`, `[tabindex]:not([tabindex="-1"])`, `[contenteditable]`. Filters out hidden and aria-hidden elements.

3. **Tab cycling**: On Tab key, if the active element is the last focusable element, prevents default and focuses the first element. Shift+Tab does the reverse.

4. **No focusable elements fallback**: If the modal has no focusable elements, sets `tabindex="-1"` on the container itself so it can receive focus.

5. **Focus restoration**: On cleanup, restores focus to the stored element. This is wrapped in `requestAnimationFrame` to ensure the modal has mounted before focusing.

### Modal Container (components/modal-container.tsx)

The container orchestrates rendering and global event handling:

1. **SSR safety**: Uses `useState(false)` + `useEffect(setMounted(true))` pattern. During SSR, returns null. On client mount, renders the portal.

2. **Portal**: Renders to `document.body` via `createPortal()`. This ensures the modal is always on top regardless of where the container is placed in the component tree.

3. **Scroll lock**: Applies `overflow: hidden` to `document.body` when the modal opens. Calculates the scrollbar width and applies it as `padding-right` to prevent layout shift (the page content would otherwise shift right when the scrollbar disappears).

4. **Escape key**: Listens for Escape key at the document level (capture phase) to dismiss the modal. Respects `closeOnEscape` and `preventDismiss` options.

5. **Cleanup**: Removes scroll lock and padding restoration on unmount via the effect cleanup function.

### Modal Backdrop (components/modal-backdrop.tsx)

Semi-transparent overlay covering the entire viewport:

1. **Full viewport coverage**: Uses `position: fixed` with `inset: 0` to cover the entire screen.
2. **Fade animation**: CSS transition on `opacity` with 300ms duration. GPU-composited.
3. **Backdrop dismissal**: Clicking the backdrop dismisses the modal if `closeOnBackdropClick` is enabled. Respects `preventDismiss` flag.
4. **Z-index**: Renders at `zIndex - 1` (one level below the modal panel).

### Modal Panel (components/modal-component.tsx)

The modal panel itself, with type-specific rendering:

1. **Entrance/Exit animations**: Uses CSS transitions on `scale`, `translateY`, and `opacity`. These properties are GPU-composited (don't trigger layout), ensuring 60fps animations.

2. **ARIA attributes**:
   - `role="dialog"` and `aria-modal="true"` — signals to assistive technologies that this is a modal dialog
   - `aria-labelledby` points to the title element's ID
   - `aria-describedby` points to the content element's ID

3. **Type-specific UI**:
   - **Confirm**: Title, message, Yes/No buttons (customizable labels)
   - **Alert**: Title, message, OK button
   - **Custom**: Arbitrary React content with optional title and close button

4. **Focus trap**: Calls `useFocusTrap(containerRef, true)` to activate focus trapping.

5. **Keyboard support**: Escape key dismisses the modal (unless `preventDismiss` is set). Close button is a native `<button>` element.

## Usage

### 1. Add ModalContainer to your app root

```tsx
// app/layout.tsx
import { ModalContainer } from '@/components/modal-container';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ModalContainer />
      </body>
    </html>
  );
}
```

### 2. Trigger modals from anywhere

```tsx
import { modal } from '@/api/modal-store';

function MyComponent() {
  const handleDelete = async () => {
    const result = await modal.confirm('Are you sure you want to delete this item?');
    if (result === true) {
      await deleteItem();
      modal.alert('Item deleted successfully');
    }
  };

  const openSettings = () => {
    modal.open(<SettingsForm />, {
      title: 'Settings',
      closeOnBackdropClick: false,
    });
  };
}
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| No focusable elements in modal | Container gets `tabindex="-1"` and receives focus |
| Modal content taller than viewport | Modal content area scrolls independently (CSS `max-height` + `overflow-y: auto`) |
| Rapid open/close | Promise always resolves (with `null` on close), no unhandled rejections |
| Route transition during modal | Container persists across routes, modal remains visible |
| Server-side rendering | Container returns null during SSR, mounts on client |
| Component unmount | Scroll lock removed, focus restored, Promise resolved |
| Backdrop click during animation | No special deferral — CSS transition runs independently |
| Promise never awaited | Auto-resolves with `null` after 30-second timeout |

## Performance Characteristics

- **openModal**: O(1) — set state
- **closeModal**: O(1) — clear state, resolve Promise
- **Focus trap setup**: O(n) — query focusable elements (n is typically 5-15)
- **Tab key handling**: O(1) — array index math
- **Scroll lock**: O(1) — set body style
- **Animation**: GPU-composited (transform + opacity only)

## Accessibility Compliance

| Requirement | Implementation |
|-------------|----------------|
| WAI-ARIA dialog pattern | `role="dialog"`, `aria-modal="true"` |
| Label | `aria-labelledby` → title element ID |
| Description | `aria-describedby` → content element ID |
| Focus trap | Tab/Shift+Tab cycle within modal |
| Focus restoration | Returns focus to trigger element on close |
| Escape dismissal | Escape key closes modal (configurable) |
| Keyboard accessible close | Close button is native `<button>` |
| Screen reader announcement | Dialog role causes SR to announce as distinct context |

## Testing Strategy

1. **Unit tests**: Test store actions (openConfirm, openAlert, close, confirm, cancel) with mocked Promise resolvers
2. **Integration tests**: Render container, call `modal.confirm()`, assert modal appears in DOM with correct title and buttons. Click Yes, assert Promise resolves to `true`.
3. **Focus trap tests**: Open modal, dispatch Tab keydown events, assert `document.activeElement` cycles through focusable elements correctly
4. **Accessibility tests**: Run axe-core on rendered modal, verify role, aria-modal, aria-labelledby, focus trap, and keyboard dismissal
5. **Edge case tests**: Modal with no focusable elements, rapid open/close, SSR rendering
