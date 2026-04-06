# Context Menu / Right-click Menu — Implementation Walkthrough

## Architecture Overview

This implementation follows a **trigger + store + portal** pattern:

```
┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ ContextMenuTrigger│────▶│  Zustand Store   │────▶│   ContextMenu   │
│ (useContextMenu) │     │  (state+actions) │     │    (Portal)     │
└──────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                     ┌─────┴─────┐
                                                     │           │
                                              ContextMenuItem  ContextMenuItem
                                              ContextMenuItem  ContextMenuItem
                                                     │
                                              ┌──────┴──────┐
                                              │             │
                                      ContextMenuSubmenu  (more...)
```

### Design Decisions

1. **Zustand for state management** — Zero boilerplate, selector-based subscriptions prevent unnecessary re-renders. Only the focused item and the menu container re-render on navigation.

2. **Portal rendering** — The menu renders directly to `document.body`, escaping parent CSS constraints (overflow: hidden, z-index stacking contexts).

3. **Position calculator as pure function** — The boundary detection and flip logic is a standalone pure function, making it trivially testable without React or DOM dependencies.

4. **Keyboard handler as pure function** — Keyboard event processing is separated into a pure function that takes the event and items array, returns an action string. No side effects within the handler itself.

## File Structure

```
example-1/
├── lib/
│   ├── context-menu-types.ts       # TypeScript interfaces (MenuItem, ContextMenuState, MenuPosition)
│   ├── context-menu-store.ts       # Zustand store with open/close/focus/sub-menu actions
│   ├── menu-position-calculator.ts # Viewport boundary detection, flip logic
│   ├── submenu-manager.ts          # Sub-menu open/close, stack management, ArrowRight/Left
│   └── menu-keyboard-handler.ts    # Arrow key navigation, Enter/Space, Escape, Home/End
├── hooks/
│   ├── use-context-menu.ts         # Trigger hook: contextmenu, long-press, keyboard
│   └── use-outside-click.ts        # Detects clicks outside menu, closes menu
└── components/
    ├── context-menu-trigger.tsx    # Wrapper capturing right-click/long-press/keyboard
    ├── context-menu.tsx            # Portal-rendered menu with focus trap, animation
    ├── context-menu-item.tsx       # Individual item with icon, label, shortcut, disabled
    ├── context-menu-separator.tsx  # Divider line between groups
    └── context-menu-submenu.tsx    # Fly-out sub-menu portal with nested items
```

## Key Implementation Details

### Zustand Store (lib/context-menu-store.ts)

The store is the single source of truth. Key aspects:

- **openMenu**: Sets all state (items, position, trigger ref, trigger type). Resets focused index to first non-disabled item. If a menu is already open, it closes the old one first (single-menu constraint) and restores focus to the old trigger.
- **closeMenu**: Restores focus to the trigger element (if it still exists in DOM), clears the sub-menu stack, resets all state.
- **setFocusedIndex**: Updates the focused item index. Used by the keyboard handler and hover events.
- **pushSubMenu/popSubMenu**: Manages the sub-menu stack with a max depth of 3. Push returns false if max depth is reached. Pop returns the parent index for focus restoration.

The `findFirstFocusable` helper skips separators and disabled items when computing the initial focus target.

### Position Calculator (lib/menu-position-calculator.ts)

Pure function that takes cursor coordinates and viewport dimensions. The algorithm:

1. Start with `x = cursorX + margin`, `y = cursorY + margin`.
2. Check if `x + menuWidth > viewportWidth`. If so, flip: `x = cursorX - menuWidth - margin`, set `flipX = true`.
3. Check if `y + menuHeight > viewportHeight`. If so, flip: `y = cursorY - menuHeight - margin`, set `flipY = true`.
4. Clamp to viewport edges to ensure the menu is never fully off-screen.

The sub-menu position calculator works similarly but relative to the parent item's bounding rect instead of the cursor.

### Keyboard Handler (lib/menu-keyboard-handler.ts)

Processes keyboard events within the menu context:

- **ArrowUp/ArrowDown**: Find the next non-disabled, non-separator item in the given direction. Wraps around (from last to first, first to last).
- **Enter/Space**: Activate the focused item (call `onSelect`). Close the menu afterward (unless it's a sub-menu trigger).
- **Escape**: If sub-menus are open, close the top-most one. Otherwise, close the entire menu.
- **Home/End**: Jump to the first/last non-disabled item.
- **ArrowRight**: If the focused item is a sub-menu, open it. Gets the DOM element's bounding rect for position calculation.
- **ArrowLeft**: If sub-menus are open, close the top-most one.

All operations return an action string for the caller to react to.

### Trigger Hook (hooks/use-context-menu.ts)

The hook attaches three types of event listeners to the referenced element:

1. **contextmenu**: Prevents default browser menu, captures clientX/clientY, calculates position, opens menu with type "mouse".
2. **touchstart/touchend/touchmove**: Starts a 500ms timer on touchstart. If the timer fires before touchend or touchmove, it opens the menu at the touch position with type "touch". Cancelled on touchend or touchmove (user is scrolling, not long-pressing).
3. **keydown**: Listens for Menu key (code: "ContextMenu") or Shift+F10. For keyboard triggers, positions the menu at the element's bounding rect (bottom-left corner) since there is no cursor position.

All listeners are cleaned up on unmount, including any pending long-press timer.

### Outside Click Hook (hooks/use-outside-click.ts)

Attaches a `mousedown` listener to `document`. On each click, it checks if the target is inside the menu ref using `contains()`. It also checks all open sub-menus (queried by `data-context-submenu` attribute). If the click is outside everything, it calls `closeMenu`.

Using `mousedown` instead of `click` ensures the detection fires before any click handlers on page elements.

### Context Menu Component (components/context-menu.tsx)

The main menu container:

1. **SSR safety**: Uses `useState(false)` + `useEffect(setMounted(true))` pattern. During SSR, returns null.
2. **Portal**: Renders to `document.body` via `createPortal()`.
3. **Entrance/exit animations**: CSS transitions on `opacity` and `scale`. These are GPU-composited properties.
4. **Focus management**: On mount, focuses the first menu item via `requestAnimationFrame` to ensure the DOM is ready.
5. **Keyboard delegation**: All key events are handled by the `handleMenuKeyDown` pure function.
6. **Sub-menu rendering**: Iterates over the sub-menu stack from the store and renders each as a `ContextMenuSubmenu` component.

### Context Menu Item Component (components/context-menu-item.tsx)

Renders three variants:

- **Disabled items**: Grayed out with `opacity-50`, `cursor-not-allowed`, and a `title` attribute for the tooltip explanation. Uses `aria-disabled="true"`.
- **Normal items**: Styled button with icon, label, and shortcut hint. Focusable with `tabIndex={-1}` (managed focus, not tab order).
- **Sub-menu items**: Similar styling but with a chevron arrow indicator on the right. Uses `aria-haspopup="menu"`.

Focus styling uses the `isFocused` prop (compared against the store's `focusedIndex`) to apply the accent background color.

### Context Menu Submenu Component (components/context-menu-submenu.tsx)

A secondary portal-rendered menu for nested items:

1. Renders at the position computed by the sub-menu manager.
2. Has its own local `focusedIndex` state for focus styling within the sub-menu.
3. Focuses the first item on mount via `requestAnimationFrame`.
4. Delegates keyboard events to the same `handleMenuKeyDown` function but with its own items array.
5. Z-index is set to 60 (higher than the main menu's 50) to ensure it renders on top.

## Usage

### 1. Add ContextMenu to your app root

```tsx
// app/layout.tsx
import { ContextMenu } from '@/components/context-menu';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ContextMenu />
      </body>
    </html>
  );
}
```

### 2. Wrap any element with ContextMenuTrigger

```tsx
import { ContextMenuTrigger } from '@/components/context-menu-trigger';
import type { MenuItem } from '@/lib/context-menu-types';

const menuItems: MenuItem[] = [
  { id: '1', type: 'item', label: 'Copy', shortcut: 'Ctrl+C', icon: '📋', onSelect: () => console.log('Copy') },
  { id: '2', type: 'item', label: 'Paste', shortcut: 'Ctrl+V', icon: '📌', onSelect: () => console.log('Paste') },
  { id: '3', type: 'separator' },
  {
    id: '4', type: 'submenu', label: 'Share', icon: '🔗',
    children: [
      { id: '4a', type: 'item', label: 'Email', onSelect: () => console.log('Share via Email') },
      { id: '4b', type: 'item', label: 'Link', onSelect: () => console.log('Copy Link') },
    ],
  },
  { id: '5', type: 'item', label: 'Delete', shortcut: 'Del', disabled: true, disabledReason: 'You do not have permission' },
];

function FileItem({ file }: { file: File }) {
  return (
    <ContextMenuTrigger items={menuItems}>
      <div className="p-2 rounded hover:bg-panel-hover">{file.name}</div>
    </ContextMenuTrigger>
  );
}
```

### 3. Dynamic items based on context

```tsx
<ContextMenuTrigger
  items={[]}
  getItems={(element) => {
    const fileId = element.dataset.fileId;
    const file = files.find((f) => f.id === fileId);
    return [
      { id: 'open', type: 'item', label: 'Open', onSelect: () => openFile(file) },
      ...(file?.isFolder ? [{ id: 'new', type: 'item', label: 'New File' }] : []),
      { id: 'sep', type: 'separator' },
      { id: 'delete', type: 'item', label: 'Delete', onSelect: () => deleteFile(file) },
    ];
  }}
>
  <div data-file-id={file.id}>{file.name}</div>
</ContextMenuTrigger>
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Right-click near bottom-right corner | Position calculator flips X and Y, menu appears above-left of cursor |
| Long-press on touch | 500ms timer starts on touchstart, cancelled on touchend/touchmove |
| Trigger element removed while menu open | Focus restoration checks `document.contains()` before focusing, falls back to body |
| Multiple context menus | Singleton store ensures only one menu is open at a time |
| Menu items change while open | Store updates items array, focused index is clamped to new length |
| Sub-menu near right viewport edge | Sub-menu position calculator flips to left side of parent item |
| SSR rendering | ContextMenu returns null during SSR, mounts on client |
| Keyboard trigger (no cursor) | Positions at element's bounding rect bottom-left corner |

## Performance Characteristics

- **Position calculation**: O(1) — constant arithmetic operations
- **openMenu/closeMenu**: O(1) — state assignment
- **Keyboard navigation**: O(n) — scans items for next valid target (n is small, typically 5-15)
- **Sub-menu push/pop**: O(1) — stack operations, max depth 3
- **Outside click detection**: O(1) — single `contains()` check per click
- **Animation**: GPU-composited (opacity + scale only)

## Testing Strategy

1. **Unit tests**: Test position calculator with all flip scenarios (corner, edge, center). Test keyboard handler with various item configurations (disabled items, separators, sub-menus). Test store actions (open, close, focus, sub-menu stack).
2. **Integration tests**: Render trigger + menu, fire contextmenu event, assert menu appears at correct position. Fire ArrowDown 3 times, assert focused index is 3. Fire Enter, assert onSelect was called.
3. **Accessibility tests**: Run axe-core on rendered menu, verify role attributes, aria-disabled, aria-haspopup, aria-expanded, and keyboard navigation.
4. **Edge case tests**: Trigger near viewport edges, verify flip logic. Remove trigger element while menu is open, verify no errors on close. Long-press at 200ms (should not open), at 500ms (should open).
