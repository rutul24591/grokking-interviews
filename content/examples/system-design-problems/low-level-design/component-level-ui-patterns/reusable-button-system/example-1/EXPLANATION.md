# Reusable Button System — Implementation Walkthrough

## Architecture Overview

This implementation follows a **polymorphic component + hooks + style map** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Parent Component │  │  Button (tsx)    │     │  Style Map      │
│   renders Button   │─▶│  (forwardRef)    │────▶│  (button-styles)│
└─────────────────┘     │        │         │     └─────────────────┘
                        │        │         │     ┌─────────────────┐
                        │   ┌────┴────┐    │     │  Interaction    │
                        │   │  Hooks  │    │     │  Hook           │
                        │   └────┬────┘    │     └─────────────────┘
                        │        │         │     ┌─────────────────┐
                        │        ▼         │     │  ARIA Hook      │
                        │  Rendered DOM    │     └─────────────────┘
                        └──────────────────┘     ┌─────────────────┐
                                                 │  Ripple Effect  │
                                                 │  (DOM utility)  │
                                                 └─────────────────┘
```

### Design Decisions

1. **Polymorphic `as` prop** — A single component renders as `<button>`, `<a>`, or any React component (e.g., Next.js `Link`). This avoids duplicating styled variants across multiple component types.

2. **Style maps over CSS-in-JS** — Tailwind class strings are stored in plain TypeScript objects. Zero runtime cost, tree-shakeable, and works with Tailwind's compile-time class detection.

3. **Custom hooks for behavior** — `useButtonInteractions` handles click guarding, debounce, keyboard activation, and ripple triggering. `useButtonAria` computes ARIA attributes. The Button component itself is a thin render layer.

4. **Compound ButtonGroup via context** — ButtonGroup provides orientation, variant, and size through React context. It clones children to inject position information (`first`, `middle`, `last`, `only`) for coordinated border styling.

## File Structure

```
example-1/
├── lib/
│   ├── button-types.ts       # TypeScript interfaces, polymorphic ref types, constants
│   ├── button-styles.ts      # Variant-based Tailwind class maps, size maps, spinner config
│   └── ripple-effect.ts      # DOM-level ripple animation with CSS custom properties
├── hooks/
│   ├── use-button-interactions.ts  # Click guard, debounce, keyboard activation, ripple trigger
│   └── use-button-aria.ts          # ARIA attribute computation (busy, disabled, role, label)
├── components/
│   ├── button.tsx            # Main polymorphic Button component (forwardRef + as prop)
│   ├── button-icon.tsx       # Icon slot with loading spinner crossfade
│   ├── button-group.tsx      # Compound component for grouped buttons with shared borders
│   └── button-spinner.tsx    # Animated SVG spinner (indeterminate + determinate modes)
└── EXPLANATION.md            # This file
```

## Key Implementation Details

### Type Definitions (lib/button-types.ts)

The type system is the foundation. Key aspects:

- **`ButtonVariant`**: Union of `'primary' | 'secondary' | 'tertiary' | 'danger' | 'link'`. Fixed set — consumers can't invent new variants without modifying the style map.
- **`ButtonSize`**: Union of `'xs' | 'sm' | 'md' | 'lg' | 'xl'`. Maps to padding, font-size, min-height, and icon size.
- **`ButtonProps<T>`**: Polymorphic interface. Uses `Omit<ComponentPropsWithoutRef<T>, 'onClick'>` to inherit native props of the rendered element while overriding `onClick` with our guarded version. When `as="a"`, props include `href`, `target`, `rel`. When `as="button"`, props include `type` (submit/reset/button).
- **`PolymorphicRef<T>`**: Correctly types the ref based on the rendered element. `HTMLButtonElement` for buttons, `HTMLAnchorElement` for anchors, generic `HTMLElement` for other elements.

### Style Maps (lib/button-styles.ts)

A centralized style map replaces CSS-in-JS:

```ts
variantStyles.primary = {
  base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ...',
  hover: 'hover:bg-blue-700',
  active: 'active:bg-blue-800',
  focus: 'focus-visible:outline-none focus-visible:ring-2 ...',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
  loading: 'opacity-80 cursor-wait',
}
```

The `getButtonClasses()` helper composes the final class string from variant, size, state, and fullWidth. This is memoized in the Button component to prevent redundant string concatenation.

Dark mode is handled via Tailwind's `dark:` prefix in the class strings (e.g., `dark:bg-blue-700`).

### Ripple Effect (lib/ripple-effect.ts)

A pure DOM utility — no React state involved:

1. Injects a `<style>` tag with `@keyframes ripple-expand` (scale 0→4, opacity 0.35→0) on first use.
2. Creates a `<span>` positioned at the click coordinates via `left`/`top` (set once, not animated).
3. The animation uses `transform: scale()` for GPU compositing.
4. Caps concurrent ripples at 5 per container to prevent DOM accumulation.
5. Self-removes after `animationend` (600ms) as a safety net.
6. Returns a cleanup function for unmount scenarios.

### Interaction Hook (hooks/use-button-interactions.ts)

The hook merges three handlers:

- **`onClick`**: Guards against loading/disabled state, applies debounce, triggers ripple, invokes original callback.
- **`onMouseDown`**: Alternative ripple trigger (fires before onClick for immediate visual feedback).
- **`onKeyDown`**: Activates on Enter and Space for non-button elements. Prevents default Space scroll behavior.

The debounce uses a `useRef`-stored timer ID. When `debounceMs > 0`, subsequent clicks within the window are ignored. The timer resets after the debounce period.

### ARIA Hook (hooks/use-button-aria.ts)

Pure computation — no side effects, no state:

- `aria-busy="true"` when loading (not when disabled — disabled takes precedence).
- `aria-disabled="true"` when disabled or loading.
- `role="button"` only when the rendered element is not a native `<button>`.
- Development warning when `iconOnly=true` but `aria-label` is missing.

### Button Component (components/button.tsx)

The main component. Key aspects:

1. **Polymorphic rendering**: `React.forwardRef` with generic typing. `Component = as || 'button'` determines the rendered element. Props spread onto the component, so native props (e.g., `href` for anchors) work automatically.

2. **Class computation**: `useMemo` with dependencies `[variant, size, state, fullWidth, className, position, groupContext]`. Prevents redundant concatenation on parent re-renders.

3. **ButtonGroup integration**: Reads context via `useButtonGroupContext`. If present, inherits variant/size defaults and receives position for border-radius styling.

4. **Ref merging**: Combines the forwarded ref with the internal container ref (used by the ripple hook). Handles both callback refs and ref objects.

5. **Href validation**: In development mode, validates `href` against blocked protocols (`javascript:`, `vbscript:`, `data:`). Warns if anchor button lacks `href`.

6. **Content rendering**:
   - Leading icon (with loading spinner swap)
   - Loading spinner (if no leading icon and loading=true)
   - Button text (truncated with `truncate` class for overflow)
   - Trailing icon (always static)

### Button Icon (components/button-icon.tsx)

Simple slot component. When `isLoading=true`, crossfades from the provided icon to a `ButtonSpinner`. Uses CSS `transition-opacity` for smooth swap without layout shift.

### Button Spinner (components/button-spinner.tsx)

Inline SVG with two modes:

- **Indeterminate** (default): Spinning arc using CSS `animate-spin` class. Uses `stroke-dasharray` to create a partial arc that rotates continuously.
- **Determinate**: Progress arc with `stroke-dashoffset` animated via CSS transition. Accepts `progress` (0-100) and computes the offset from the circle circumference.

Both modes use `aria-hidden="true"` since the button's `aria-busy` already communicates the loading state.

### Button Group (components/button-group.tsx)

Compound component pattern:

1. Wraps children in a flex container with orientation (`flex-row` or `flex-col`).
2. Computes position for each child (`first`, `middle`, `last`, `only`).
3. Clones each child via `React.cloneElement`, injecting `position`, `variant`, and `size` props.
4. Uses CSS `:has` / sibling selectors (`[&>button+button]:border-l`) for shared borders between adjacent buttons.
5. Position-based border-radius: first gets left/top corners, last gets right/bottom corners, middle gets none, only gets all four.

## Usage

### Basic Button

```tsx
import { Button } from './components/button';

<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Save Changes
</Button>;
```

### Loading Button

```tsx
const [loading, setLoading] = useState(false);

<Button
  variant="primary"
  loading={loading}
  loadingText="Saving..."
  onClick={async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  }}
>
  Save
</Button>;
```

### Icon Button

```tsx
import { TrashIcon } from '@heroicons/react/24/solid';

<Button
  variant="danger"
  leadingIcon={<TrashIcon className="h-4 w-4" />}
  aria-label="Delete item"
  iconOnly
/>;
```

### Anchor Button

```tsx
<Button as="a" href="/dashboard" variant="secondary">
  Go to Dashboard
</Button>;
```

### Button Group

```tsx
import { ButtonGroup } from './components/button-group';

<ButtonGroup orientation="horizontal">
  <Button variant="primary">Approve</Button>
  <Button variant="secondary">Reject</Button>
  <Button variant="tertiary">Defer</Button>
</ButtonGroup>;
```

### Ripple Enabled

```tsx
<Button variant="primary" ripple onClick={handleClick}>
  Click Me
</Button>;
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Disabled + loading | Disabled takes precedence; no spinner renders, aria-busy not set |
| Icon-only without aria-label | Console warning in development mode |
| Anchor without href | Console warning in development mode |
| Unsafe href protocol (javascript:) | Blocked with console warning |
| Rapid-fire clicks during loading | onClick guard prevents handler execution |
| Ripple during unmount | Cleanup function removes ripple DOM nodes |
| ButtonGroup mixed variants | Each child retains its own variant; group variant is fallback |
| SSR rendering | No window/document access in render path; ripple creation guarded by typeof check |

## Performance Characteristics

- **Class computation**: O(1) — object lookups and string joins, memoized via useMemo
- **Ripple creation**: O(1) — single DOM node, auto-cleans after 600ms, capped at 5 per container
- **ARIA computation**: O(1) — boolean checks, memoized
- **ButtonGroup cloning**: O(n) — n children cloned via React.cloneElement
- **Debounce**: O(1) — single setTimeout with ref-stored ID
- **Animations**: GPU-composited (transform + opacity for ripple, CSS animate-spin for spinner)

## Testing Strategy

1. **Unit tests**: Test variant rendering (assert correct Tailwind classes), size rendering, loading state (spinner present, aria-busy=true, onClick not called), disabled state, polymorphic rendering.
2. **Integration tests**: Click flow with loading (click → loading → spinner → click guarded → loading false → click fires), ripple animation (click → ripple created → wait 600ms → ripple removed), ButtonGroup border rendering, keyboard activation for non-button elements.
3. **Accessibility tests**: Run axe-core, verify focus-visible ring, aria-busy during loading, aria-disabled for disabled, icon-only aria-label warning.
4. **Edge case tests**: Rapid-fire 20 clicks (only 1 fires), SSR rendering, href validation, ButtonGroup with mixed variants.
