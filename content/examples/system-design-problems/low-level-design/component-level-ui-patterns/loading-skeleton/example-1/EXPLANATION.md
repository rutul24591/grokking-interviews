# Loading Skeleton — Implementation Walkthrough

## Architecture Overview

This implementation follows a **type-dispatch + composition** pattern:

```
┌──────────────────────────────────────────────────────────────┐
│                    SkeletonWrapper                           │
│              (loading state composition)                      │
│                                                              │
│   loading=true                    loading=false              │
│   ┌─────────────────┐            ┌─────────────────┐        │
│   │    Skeleton     │            │   Actual Content │        │
│   │   (dispatch)    │            │   (children)     │        │
│   │                 │            └─────────────────┘        │
│   │  ┌─────┬─────┐  │                                       │
│   │  │Line │Rect │  │                                       │
│   │  │Circle│Custom│ │                                       │
│   │  └─────┴─────┘  │                                       │
│   └─────────────────┘                                       │
└──────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Type-dispatch root component** — The `Skeleton` component accepts a `type` prop and delegates to specialized sub-components (`SkeletonLine`, `SkeletonRect`, `SkeletonCircle`). This keeps the public API simple while encapsulating shape-specific logic.

2. **CSS-only shimmer animation** — The shimmer effect uses `@keyframes` animating `background-position` on the compositor thread. Zero JavaScript overhead, 60fps, battery-friendly on mobile.

3. **SkeletonWrapper composition** — Eliminates the repetitive `{loading ? <Skeleton /> : <Content />}` pattern at every call site. Centralizes `aria-busy` attributes and supports a delay threshold to prevent skeleton flashing on fast loads.

4. **CLS-first design** — Every skeleton component is designed to match the dimensions of the eventual content. Text skeletons use configurable line counts and widths, image skeletons use explicit aspect ratios, and avatar skeletons use fixed sizes.

## File Structure

```
example-1/
├── lib/
│   └── skeleton-types.ts       # TypeScript interfaces for all skeleton types
├── components/
│   ├── skeleton.tsx            # Root Skeleton component with type-based dispatch
│   ├── skeleton-line.tsx       # Text line skeleton (multiple lines support)
│   ├── skeleton-rect.tsx       # Rectangular skeleton (images, cards)
│   ├── skeleton-circle.tsx     # Circular skeleton (avatars)
│   └── skeleton-wrapper.tsx    # Loading state wrapper (renders skeleton or children)
├── styles/
│   └── shimmer-animation.css   # CSS keyframes for shimmer effect
└── EXPLANATION.md              # This file
```

## Key Implementation Details

### Skeleton Types (lib/skeleton-types.ts)

Defines the core type system:

- **`SkeletonType`**: Union of `'text' | 'image' | 'avatar' | 'custom'`
- **`BaseSkeletonProps`**: Shared fields (width, height, animated, className, ariaLabel)
- **`SkeletonLineProps`**: Adds count, widths array, gap for text skeletons
- **`SkeletonRectProps`**: Adds border-radius for rectangular shapes
- **`SkeletonCircleProps`**: Adds size (diameter) for circular shapes
- **`SkeletonWrapperProps`**: Adds loading boolean, skeleton/content children, delay threshold

### Root Skeleton (components/skeleton.tsx)

The entry-point component uses a switch statement to dispatch to the correct sub-component based on the `type` prop:

- **`text`**: Renders `SkeletonLine` with count and widths
- **`image`**: Renders `SkeletonRect` with full width and configurable height
- **`avatar`**: Renders `SkeletonCircle` with default 48px size
- **`custom`**: Renders `SkeletonRect` with configurable border-radius

The component applies the `animate-shimmer` CSS class when `animated=true` (default). Exhaustive type checking (`never` case) ensures compile-time safety for the type union.

### Skeleton Line (components/skeleton-line.tsx)

Renders `count` horizontal bars with configurable widths. Key aspects:

1. **Varying line widths**: The `widths` array allows natural text simulation (e.g., `[100%, 85%, 60%]` mimics a paragraph where the last line is shorter).
2. **Default last-line shortening**: If no `widths` array is provided and `count > 1`, the last line defaults to 60% width.
3. **Accessibility**: Wraps lines in a container with `role="status"`, `aria-busy="true"`, and a screen-reader-only "Loading..." text.
4. **Gap spacing**: Configurable gap between lines (default: 8px) matches typical text line-height spacing.

### Skeleton Rect (components/skeleton-rect.tsx)

A rectangular placeholder for images, cards, or banners. Key aspects:

1. **Tailwind class support**: Accepts Tailwind width/height classes (e.g., `w-full`, `h-48`) or arbitrary CSS values (e.g., `200px`).
2. **Border-radius**: Configurable for rounded corners (cards use 8px, thumbnails use 4px).
3. **Accessibility**: Includes `role="status"`, `aria-busy="true"`, and screen-reader-only text.

### Skeleton Circle (components/skeleton-circle.tsx)

A circular placeholder for avatars. Key aspects:

1. **Fixed size**: Defaults to 48px (common avatar size). Scales via the `size` prop.
2. **`border-radius: 50%`**: Ensures perfect circle regardless of size.
3. **`flexShrink: 0`**: Prevents the circle from shrinking in flex layouts (important for avatar+text row layouts).
4. **Accessibility**: Same ARIA pattern as other skeletons.

### Skeleton Wrapper (components/skeleton-wrapper.tsx)

The composition component that handles loading-state switching. Key aspects:

1. **Delay threshold**: If `delay > 0`, the skeleton only renders after the delay expires. If loading resolves before the delay, the skeleton never appears. This prevents the jarring flash of skeleton → content in under 200ms.
2. **`aria-busy` management**: Sets `aria-busy="true"` when skeletons are visible, `aria-busy="false"` when content is rendered.
3. **`role="status"`**: The container acts as a status region for screen readers.
4. **Optional skeleton prop**: The `skeleton` prop allows passing a separate skeleton tree, decoupling the skeleton definition from the content children. If not provided, the `children` are used as both skeleton and content (the wrapper decides which to render based on `loading`).

### Shimmer CSS (styles/shimmer-animation.css)

Defines the `@keyframes shimmer` animation:

1. **Gradient**: Three-stop linear gradient (base → highlight → base) at 90 degrees.
2. **Animation**: Moves `background-position` from `-200% 0` to `200% 0` over 1.5 seconds, linear easing, infinite loop.
3. **`will-change: background-position`**: Hints the browser to optimize for this property.
4. **Light mode colors**: Base `#e5e7eb` (gray-200), highlight `#f3f4f6` (gray-100).
5. **Dark mode colors**: Base `#374151` (gray-700), highlight `#4b5563` (gray-600).
6. **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables the animation entirely, rendering a static base color. This applies to both light and dark mode variants.

## Usage

### 1. Import the shimmer CSS globally

```tsx
// app/globals.css
@import '@/components/skeleton/styles/shimmer-animation.css';
```

Or import in your layout:

```tsx
// app/layout.tsx
import '@/components/skeleton/styles/shimmer-animation.css';
```

### 2. Basic skeleton usage

```tsx
import { Skeleton } from '@/components/skeleton';

function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton type="avatar" size={48} />
      <div>
        <Skeleton type="text" count={1} widths={['60%']} />
        <Skeleton type="text" count={1} widths={['40%']} />
      </div>
    </div>
  );
}
```

### 3. SkeletonWrapper with React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { SkeletonWrapper, Skeleton } from '@/components/skeleton';

function UserProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return (
    <SkeletonWrapper
      loading={isLoading}
      ariaLabel="Loading user profile"
      delay={200}
    >
      <Skeleton type="avatar" size={48} />
      <Skeleton type="text" count={2} widths={['60%', '40%']} />
    </SkeletonWrapper>
  );

  // When loaded, this renders instead:
  // return (
  //   <div className="flex items-center gap-4">
  //     <Avatar src={data.avatar} />
  //     <div>
  //       <h2>{data.name}</h2>
  //       <p>{data.email}</p>
  //     </div>
  //   </div>
  // );
}
```

### 4. Card skeleton composition

```tsx
function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton type="image" width="w-full" height="h-48" radius={8} />
      <div className="mt-4 space-y-2">
        <Skeleton type="text" count={1} widths={['80%']} />
        <Skeleton type="text" count={2} widths={['100%', '60%']} />
      </div>
    </div>
  );
}
```

### 5. Data table skeleton

```tsx
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex gap-4">
        <Skeleton type="text" count={1} widths={['30%']} />
        <Skeleton type="text" count={1} widths={['25%']} />
        <Skeleton type="text" count={1} widths={['20%']} />
        <Skeleton type="text" count={1} widths={['25%']} />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton type="text" count={1} widths={['30%']} />
          <Skeleton type="text" count={1} widths={['25%']} />
          <Skeleton type="text" count={1} widths={['20%']} />
          <Skeleton type="text" count={1} widths={['25%']} />
        </div>
      ))}
    </div>
  );
}
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Fast resolution (< 100ms) | Delay threshold prevents skeleton flash |
| Extended loading (slow network) | Shimmer loops indefinitely via CSS, zero JS overhead |
| Reduced motion preference | CSS `@media (prefers-reduced-motion: reduce)` disables animation |
| SSR hydration mismatch | Skeleton renders on server, client checks for cached data before rendering |
| Dynamic content height | Use `min-height` on container matching skeleton height |
| Rapid loading toggles | Cleanup of delay timeout in SkeletonWrapper effect |
| Dark mode | CSS media query adjusts gradient colors automatically |

## Performance Characteristics

- **Animation**: GPU-composited `background-position` on compositor thread
- **JS overhead**: Zero — no `requestAnimationFrame`, no state updates during animation
- **Memory**: One CSS animation shared across all skeleton elements (CSS class, not inline)
- **CLS prevention**: Skeleton dimensions match content dimensions by design
- **Batch rendering**: Skeleton elements are plain divs with CSS classes — minimal React reconciliation cost

## Testing Strategy

1. **Unit tests**: Test each skeleton component renders with correct dimensions, ARIA attributes, and shimmer class
2. **Integration tests**: Render SkeletonWrapper with React Query mock, assert skeleton → content transition
3. **CLS measurement**: Use Playwright `PerformanceObserver` to verify CLS < 0.1 during transition
4. **Accessibility tests**: Run axe-core on pages with skeletons, verify `aria-busy`, `role="status"`, screen reader announcements
5. **Reduced motion**: Test with `prefers-reduced-motion: reduce` in browser dev tools, verify static placeholder renders
6. **Delay threshold**: Advance timers, verify skeleton only appears after delay expires
