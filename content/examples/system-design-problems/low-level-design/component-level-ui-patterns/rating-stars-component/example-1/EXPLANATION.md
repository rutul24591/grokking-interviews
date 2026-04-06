# Rating / Stars Component — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + hooks + composition** pattern:

```
┌──────────────────┐     ┌──────────────────┐
│  RatingStars     │────▶│  Zustand Store   │
│  (main cmp)      │     │  (value+hover)   │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
    ┌────┴────┐              ┌────┴────┐
    │         │              │         │
 StarIcon  StarIcon    useRating   useRating
 StarIcon  StarIcon   Interactions   ARIA
```

### Design Decisions

1. **Zustand for state management** — Each RatingStars instance creates its own scoped store via a factory function. This prevents state collision when multiple rating components exist on the same page. Selectors prevent unnecessary re-renders.

2. **Custom hooks for interaction logic** — `useRatingInteractions` encapsulates all mouse and keyboard handling. `useRatingAria` generates ARIA attributes. This keeps the rendering component clean and makes interaction logic testable in isolation.

3. **SVG clip-path for fractional fills** — Half-stars and fractional ratings (e.g., 3.7) are rendered by overlaying a filled star on an empty star and clipping the filled one to the appropriate width. This avoids complex path math and works for any fractional amount.

4. **Hover preview with throttled updates** — The hover handler only updates the store when the computed fill value (0.5 or 1.0 per star) actually changes, not on every pixel move. This prevents excessive re-renders during mouse movement.

## File Structure

```
example-1/
├── lib/
│   ├── rating-types.ts        # TypeScript interfaces, constants
│   ├── rating-store.ts        # Zustand store factory
│   ├── star-path-data.ts      # SVG star path and clip-path data
│   └── hover-position.ts      # Mouse position → fill value detection
├── hooks/
│   ├── use-rating-interactions.ts  # Mouse + keyboard handlers
│   └── use-rating-aria.ts          # ARIA attribute generation
├── components/
│   ├── rating-stars.tsx       # Main interactive component
│   ├── star-icon.tsx          # Individual star SVG renderer
│   ├── rating-label.tsx       # Optional text label
│   └── rating-display.tsx     # Read-only fractional display
└── EXPLANATION.md             # This file
```

## Key Implementation Details

### Zustand Store (lib/rating-store.ts)

The store is created via a factory function `createRatingStore(initialConfig)` so each RatingStars instance has isolated state. Key aspects:

- **setValue**: Clamps the value to [0, max], rounds to nearest 0.5, and clears hoverValue. This prevents stale preview values persisting after selection.
- **setHover**: Sets the hover preview value (or null to clear). Also clamps and rounds.
- **State shape**: `{ value, hoverValue, config }` — minimal and focused.

### Star Path Data (lib/star-path-data.ts)

Exports the SVG path string for a 5-pointed star within a 24x24 viewBox. The path is:
```
M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z
```

Clip-path rectangles are defined for half-fill (50% width) and computed dynamically for fractional fills.

### Hover Position Detection (lib/hover-position.ts)

A pure function that computes the fill value from mouse position:
1. Gets the star element's bounding rect
2. Computes `relativeX = clientX - rect.left`
3. Computes `ratio = relativeX / rect.width`
4. Returns 1.0 if ratio > 0.5, otherwise 0.5

This simple geometric approach works reliably across browsers and avoids complex hit-testing.

### Interaction Hook (hooks/use-rating-interactions.ts)

Encapsulates all user interaction logic:

- **handleMouseMove**: Computes hover value, only updates store if value actually changed (throttling)
- **handleMouseLeave**: Clears hover preview
- **handleClick**: Commits hover value to selected value
- **handleKeyDown**: ArrowLeft/Right for +/- 0.5, Home for 0, End for max
- **displayValue**: Returns hoverValue if hovering, otherwise value

### ARIA Hook (hooks/use-rating-aria.ts)

Generates the complete ARIA attribute set for the slider pattern:
- `role="slider"`
- `aria-valuenow` — current numeric value
- `aria-valuemin` — always 0
- `aria-valuemax` — configured max
- `aria-valuetext` — human-readable string (e.g., "3.5 out of 5 stars")
- `aria-label` — optional context label
- `aria-disabled` — true for read-only mode
- `tabIndex` — 0 for interactive, -1 for read-only

### Star Icon (components/star-icon.tsx)

Renders a single star SVG with three states:

1. **Filled**: Solid fill color, no stroke
2. **Half**: Two overlapping paths — empty star as background, filled star clipped to 50% (or custom fraction) via SVG clipPath
3. **Empty**: Stroke only, no fill

CSS transitions on `fill` and `stroke` provide smooth hover color changes. The component accepts event handlers for mouse interaction.

### Rating Stars (components/rating-stars.tsx)

The main component orchestrates everything:

1. **SSR safety**: Uses `useState(false)` + `useEffect(setMounted(true))` pattern. During SSR, renders static read-only stars. On client mount, renders interactive version.
2. **Store creation**: Uses `useMemo` to create a scoped store on first render.
3. **Controlled mode**: If `value` prop is provided, syncs it into the store via `useEffect`.
4. **Fill computation**: For each star, computes fill state based on displayValue (hover or selected).
5. **ARIA**: Container receives slider attributes from the ARIA hook.
6. **Focus ring**: `focus-visible:ring-2` with high-contrast colors for light and dark mode.

### Rating Display (components/rating-display.tsx)

Simplified read-only variant:
- No interaction handlers
- Supports arbitrary fractional fills (e.g., 3.7)
- Uses `role="img"` with descriptive aria-label
- No keyboard navigation or ARIA slider role needed

### Rating Label (components/rating-label.tsx)

Optional text label. Supports `screenReaderOnly` mode for accessibility when the visual label is hidden.

## Usage

### 1. Interactive Rating

```tsx
import { RatingStars } from '@/components/rating-stars';

function ProductReview() {
  const [rating, setRating] = useState(0);

  return (
    <RatingStars
      value={rating}
      onChange={setRating}
      label="Product rating"
      size="lg"
    />
  );
}
```

### 2. Read-Only Display (Average Rating)

```tsx
import { RatingDisplay } from '@/components/rating-display';

function ProductCard({ averageRating }: { averageRating: number }) {
  return (
    <RatingDisplay
      value={averageRating}
      size="md"
      showLabel
    />
  );
}
```

### 3. Customized Colors

```tsx
<RatingStars
  max={10}
  size="sm"
  colors={{ filled: '#22c55e', empty: '#e5e7eb', hover: '#4ade80' }}
  label="Difficulty rating"
/>
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Rating value 0 | All stars empty, aria-valuetext reads "0 out of 5 stars" |
| Rating value max | All stars filled, aria-valuetext reads "5 out of 5 stars" |
| Fractional value (3.7) in read-only | 3 full + 1 at 70% clip + 1 empty |
| Mouse at exact 50% boundary | Resolves to 0.5 (left half) |
| Rapid keyboard input | Each keypress +/- 0.5, clamped to [0, max] |
| Multiple rating components on page | Each has its own scoped store — no state collision |
| Server-side rendering | Renders read-only stars during SSR, activates interactivity after hydration |
| Touch devices | Tap directly sets rating without hover preview |

## Performance Characteristics

- **setValue**: O(1) — number assignment
- **setHover**: O(1) — number assignment
- **hoverPosition**: O(1) — arithmetic
- **Star fill computation**: O(n) — one per star (n = 5 typically)
- **SVG clip-path render**: O(1) — GPU composited
- **Hover updates**: Throttled — only updates when fill value crosses a boundary, not on every pixel move

## Testing Strategy

1. **Unit tests**: Test store actions (setValue clamps, setHover updates, clearHover), hoverPosition with various mouse positions, ARIA attribute generation
2. **Integration tests**: Render RatingStars, fire mouseMove on star, assert hover preview, fire click, assert value update, fire keyboard events, assert value changes
3. **Accessibility tests**: Run axe-core, verify role="slider", aria-* attributes, keyboard focus ring, screen reader announcements
4. **Edge case tests**: Value 0, value max, fractional read-only display, multiple components on page
