# Modal Component — Edge Cases & Advanced Scenarios

This document covers two advanced modal scenarios that interviewers frequently ask as follow-ups: handling focus trap edge cases (iframes, Shadow DOM, programmatic focus loss), and managing nested modals with proper z-index stacking and independent focus traps.

---

## Edge Case 1: Focus Trap Edge Cases

### The naive approach (and why it fails)

Most focus trap implementations listen for the `Tab` key and manually redirect focus:

```typescript
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Redirect focus...
  }
});
```

This fails in four scenarios:

| Scenario | Why keydown approach fails |
|----------|--------------------------|
| **No focusable elements** | There's nothing to redirect TO. Focus escapes to the next focusable element in the document (e.g., the URL bar). |
| **Iframe content** | Focus enters the iframe, but the keydown listener on the parent modal can't track focus inside the iframe's document (especially cross-origin). |
| **Shadow DOM** | `querySelector('button')` doesn't find buttons inside a shadow root. The tab order is incomplete. |
| **Programmatic focus loss** | A third-party library calls `someElement.focus()` — no keyboard event involved. The keydown listener never fires. |

### The solution: Sentinels + RAF polling

**Sentinel elements**: Two invisible, focusable `<span tabindex="0">` elements are placed at the start and end of the modal's tab order. When Tab naturally reaches the last element, focus moves to the end sentinel, which immediately redirects to the first element. Same logic in reverse for Shift+Tab.

Why sentinels over keydown? Sentinels work for **all** focus mechanisms — Tab, Shift+Tab, mouse clicks, touch taps, and even screen reader navigation. A keydown listener only handles keyboard.

**RAF polling**: A `requestAnimationFrame` loop continuously checks `document.activeElement`. If the active element is outside the modal (and not an allowed iframe), focus is pulled back. This catches **programmatic focus loss** — when some external code calls `.focus()` on an element outside the modal.

### Shadow DOM traversal

The `collectFocusableElements` function recursively traverses into shadow roots:

```
Light DOM query → finds host elements
    ↓
For each element with shadowRoot → recurse into shadow DOM
    ↓
Query shadow root for focusable elements
    ↓
Handle <slot> elements → check assigned nodes
```

This ensures that a custom element like `<my-dialog>` that renders buttons inside its shadow tree is properly included in the tab order.

### MutationObserver for dynamic content

Modals often load content asynchronously — a form might appear after an API call. A `MutationObserver` watches for DOM changes and triggers a re-scan of focusable elements. This is debounced at 100ms to avoid rescanning on every micro-mutation during a React render.

---

## Edge Case 2: Nested Modal Management

### The problem

When a modal opens another modal, you now have two overlapping dialog contexts. The challenges:

1. **Z-index**: The new modal must appear on top. But if the first modal used `z-index: 1000`, the second needs `1001` or higher. What about the third?
2. **Focus trap**: Should both modals trap focus? No — only the topmost modal should. The lower modal's focus trap must be deactivated.
3. **Escape key**: Pressing Escape should close only the topmost modal, not all of them at once.
4. **Backdrop**: Should both modals show a backdrop? No — only the topmost one. Lower modals should hide their backdrops so the user can see through to them.
5. **Scroll lock**: The body scroll should be locked when the first modal opens and only released when the last modal closes.

### The stack-based solution

The `NestedModalManager` maintains a stack:

```
Stack (bottom → top):
[0] Settings modal      — zIndex: 1000, backdrop: hidden,  focusTrap: inactive
[1] Change Password     — zIndex: 1100, backdrop: visible, focusTrap: active
[2] Confirm Delete      — zIndex: 1200, backdrop: visible, focusTrap: active
```

**Push operation** (open new modal):
1. Deactivate the current topmost's focus trap
2. Hide the current topmost's backdrop
3. Push the new modal with `zIndex = base + (depth * increment)`
4. Activate the new modal's focus trap
5. Show the new modal's backdrop

**Pop operation** (close topmost modal):
1. Deactivate the closing modal's focus trap
2. Hide its backdrop
3. Remove from stack
4. The new topmost's focus trap is activated
5. The new topmost's backdrop is re-shown

### Z-index strategy

We use `baseZIndex + (depth * increment)` rather than just incrementing by 1:

```
Depth 0: 1000
Depth 1: 1100  (gap of 100)
Depth 2: 1200
```

The gap of 100 provides room for internal modal elements (e.g., a dropdown inside a modal can use `z-index: 1050` without conflicting with the next modal).

### Escape key routing

A single global `keydown` listener (captured at the document level) intercepts Escape presses. It always routes to `stack[top]` — the topmost modal. That modal's `onEscape()` callback decides whether to close. This ensures Escape closes modals one at a time, from top to bottom.

---

## Diagrams

### Focus trap with sentinels

```
┌────────────────────────────────────────────┐
│                Modal Container              │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │  [Sentinel Start] tabindex=0       │    │ ← Invisible
│  │                                    │    │
│  │  [Button: Cancel]  ← 1st real     │    │
│  │  [Button: Save]    ← 2nd real     │    │
│  │  [Input: Name]     ← 3rd real     │    │
│  │                                    │    │
│  │  [Sentinel End]   tabindex=0       │    │ ← Invisible
│  └────────────────────────────────────┘    │
│                                            │
│  Tab order: Sentinel → Cancel → Save →    │
│  Input → Sentinel → Cancel (loop)          │
│                                            │
│  RAF polling: Every frame, checks if      │
│  document.activeElement is inside modal.   │
│  If not → pull focus back.                 │
└────────────────────────────────────────────┘
```

### Nested modal stack

```
                    Push Modal C
                    ─────────────

Before:                      After:
┌──────────────┐            ┌──────────────┐
│ Modal A      │            │ Modal A      │
│ z: 1000      │            │ z: 1000      │
│ backdrop: ✓  │            │ backdrop: ✗  │
│ focus: ✓     │            │ focus: ✗     │
└──────────────┘            ├──────────────┤
                            │ Modal B      │
                            │ z: 1100      │
                            │ backdrop: ✗  │
                            │ focus: ✗     │
                            ├──────────────┤
                            │ Modal C      │ ← NEW (topmost)
                            │ z: 1200      │
                            │ backdrop: ✓  │
                            │ focus: ✓     │
                            └──────────────┘

Escape on C → C closes → B becomes topmost → B's focus: ✓, backdrop: ✓
```

### Focus polling loop

```
requestAnimationFrame loop (every ~16ms):
    │
    ▼
┌─────────────────────────┐
│ document.activeElement  │
│ = ???                    │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Inside  │  Yes → Continue polling
    │ modal?  │  No  → Pull focus back to
    └────┬────┘         first focusable element
         │
    ┌────┴────┐
    │ Is it   │  Yes → Allow (iframe exception)
    │ an      │  No  → Pull focus back
    │ iframe? │
    └─────────┘

This catches:
- Third-party .focus() calls
- Toast notifications stealing focus
- Analytics libraries focusing hidden elements
- Auto-focus on dynamically loaded content
```
