# Breadcrumb Component — Implementation Walkthrough

## Architecture Overview

This implementation follows a **pure functional pipeline** pattern:

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Current     │────▶│  Breadcrumb          │────▶│  Truncation      │
│  Path        │     │  Generator           │     │  Algorithm       │
└──────────────┘     └──────────────────────┘     └────────┬─────────┘
                                                           │
                                                    ┌──────┴──────┐
                                                    │             │
                                             JSON-LD Schema   Breadcrumb Items
                                             (SEO)            (rendered)
```

### Design Decisions

1. **Pure functions for data derivation** — The generator, truncator, and SEO functions are all pure and synchronous. They accept inputs and return outputs with no side effects. This makes them trivially testable and SSR-safe.

2. **Hook-based orchestration** — The `useBreadcrumbs` hook composes the pure functions and memoizes results with `useMemo`. Route changes trigger re-computation; unrelated state changes do not.

3. **CSS-only responsive switching** — Desktop and mobile variants are both present in the DOM, toggled via Tailwind's `hidden sm:block` and `sm:hidden` classes. This eliminates JavaScript viewport detection and avoids hydration mismatches.

4. **Semantic HTML with ARIA** — Breadcrumbs render as `<nav> > <ol> > <li>` following the WAI-ARIA breadcrumb pattern. The current page uses `aria-current="page"` and separators use `aria-hidden="true"`.

## File Structure

```
example-1/
├── lib/
│   ├── breadcrumb-types.ts       # TypeScript interfaces, constants, defaults
│   ├── breadcrumb-generator.ts   # Path splitting, slug-to-label, label overrides
│   ├── breadcrumb-truncator.ts   # Ellipsis algorithm, expand utility
│   └── breadcrumb-seo.ts         # JSON-LD BreadcrumbList schema generation
├── hooks/
│   └── use-breadcrumbs.ts        # React hook: orchestrates pipeline
├── components/
│   ├── breadcrumb.tsx            # Root component with responsive switching
│   ├── breadcrumb-item.tsx       # Individual item (link, current, or ellipsis)
│   ├── breadcrumb-separator.tsx  # Configurable separator (slash, chevron, custom)
│   └── breadcrumb-mobile.tsx     # Mobile dropdown variant
└── EXPLANATION.md                # This file
```

## Key Implementation Details

### Breadcrumb Types (lib/breadcrumb-types.ts)

Defines the core interfaces:

- **BreadcrumbItem**: `label`, `href`, `isCurrent`, optional `isEllipsis` and `hiddenItems`
- **BreadcrumbConfig**: `labelOverrides` (Map), `separator`, `truncation`, `mobileBreakpoint`, `baseUrl`, optional `idResolver`
- **TruncationConfig**: `visibleLimit` (default 5), `keepFirst` (default 2), `keepLast` (default 2)

Exports `DEFAULT_CONFIG` with sensible defaults for quick setup.

### Breadcrumb Generator (lib/breadcrumb-generator.ts)

Pure function that transforms a URL path into a breadcrumb array:

1. Strips query parameters and hash from the path
2. Splits on `/` and filters empty segments
3. For each segment, builds cumulative href and resolves label:
   - Checks `labelOverrides` Map for context-sensitive override (keyed by cumulative path)
   - Tries `idResolver` function for dynamic ID segments
   - Falls back to `slugToLabel` (kebab-case to title case, acronym handling)
4. Prepends "Home" item
5. Marks the last item as `isCurrent: true`

**slugToLabel** handles edge cases:
- Numeric segments pass through unchanged (`12345` stays `12345`)
- Acronyms stay uppercase (`api-keys` becomes `API Keys`)
- Standard kebab-case converts to title case (`product-categories` becomes `Product Categories`)

### Breadcrumb Truncator (lib/breadcrumb-truncator.ts)

Pure function that collapses middle items when the trail exceeds the limit:

1. If items length is at or below `visibleLimit`, returns unchanged
2. Slices first `keepFirst` and last `keepLast` items
3. Creates a synthetic ellipsis item with `isEllipsis: true` and `hiddenItems` array
4. Returns `[first...N, ellipsis, last...M]`

**expandEllipsis** utility replaces the ellipsis item with hidden items for rendering the full trail.

### Breadcrumb SEO (lib/breadcrumb-seo.ts)

Generates a JSON-LD string following Schema.org `BreadcrumbList`:

- Expands any ellipsis items so search engines see the full trail
- Maps each item to a `ListItem` with `position` (1-indexed), `name`, and `item` (absolute URL)
- Constructs absolute URLs by prepending `baseUrl` to relative hrefs
- Returns a minified JSON string for `<script type="application/ld+json">`

### useBreadcrumbs Hook (hooks/use-breadcrumbs.ts)

React hook that orchestrates the pipeline:

1. Merges provided config with `DEFAULT_CONFIG` using `useMemo`
2. Calls `generateBreadcrumbs(path, labelOverrides, idResolver)`
3. Calls `truncateBreadcrumbs(items, truncationConfig)`
4. Calls `generateBreadcrumbJSONLD(items, baseUrl)`
5. Returns `{ items, jsonLD }` — both memoized

The hook re-computes only when `path` or `config` changes. All computation is synchronous and sub-millisecond.

### Breadcrumb Component (components/breadcrumb.tsx)

Root component that renders the navigation:

1. Calls `useBreadcrumbs` to get items and JSON-LD
2. Renders JSON-LD as a `<script type="application/ld+json">` tag
3. Renders desktop variant (`hidden sm:block`): `<nav>` with `<ol>` containing `<li>` items with separators
4. Renders mobile variant (`sm:hidden`): `<BreadcrumbMobile>` component

CSS classes handle responsive switching — no JavaScript viewport detection needed.

### Breadcrumb Item (components/breadcrumb-item.tsx)

Handles three rendering modes:

- **Ellipsis item**: Renders a clickable `...` button that triggers expand. Has `aria-label="Show collapsed breadcrumb items"`.
- **Current page**: Renders a `<span>` with `aria-current="page"`, bold font, and foreground text color.
- **Normal link**: Renders an `<a href>` with muted text color and hover transition.

### Breadcrumb Separator (components/breadcrumb-separator.tsx)

Renders the separator between items:

- **Slash**: Plain text `/` with muted color and `aria-hidden="true"`
- **Chevron**: Inline SVG chevron-right icon with `aria-hidden="true"`
- **Custom**: Renders the provided React node with muted color wrapper

All separators have `aria-hidden="true"` since they are decorative.

### Breadcrumb Mobile (components/breadcrumb-mobile.tsx)

Compact mobile variant:

1. Shows a "Menu" button (hamburger icon) that toggles a dropdown popover
2. Shows only the last two breadcrumb items inline with separators
3. The dropdown popover lists the full trail (with ellipsis expanded)
4. A backdrop div closes the dropdown on outside click
5. `useEffect` resets `isOpen` to false when items change (path navigation)

## Usage

### 1. Basic usage with auto-generation

```tsx
import { Breadcrumb } from "@/components/breadcrumb";

// In your page or layout component
<Breadcrumb path="/products/electronics/phones" />
// Renders: Home > Products > Electronics > Phones
```

### 2. With label overrides

```tsx
import { Breadcrumb } from "@/components/breadcrumb";

const overrides = new Map([
  ["/products/electronics", "Consumer Electronics"],
  ["/settings/general", "General Settings"],
]);

<Breadcrumb
  path="/products/electronics/phones"
  config={{ labelOverrides: overrides }}
/>
// Renders: Home > Products > Consumer Electronics > Phones
```

### 3. With custom truncation and separator

```tsx
<Breadcrumb
  path="/a/b/c/d/e/f/g/h"
  config={{
    separator: "slash",
    truncation: { visibleLimit: 4, keepFirst: 1, keepLast: 2 },
  }}
/>
// Renders: Home / ... / G / H
```

### 4. With ID resolver for dynamic segments

```tsx
<Breadcrumb
  path="/users/abc-123/profile"
  config={{
    idResolver: (segment) => {
      if (segment === "abc-123") return "John Doe";
      return null;
    },
  }}
/>
// Renders: Home > Users > John Doe > Profile
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Root path (`/`) | Single "Home" item, no separator |
| Trailing slash (`/products/`) | Empty segment filtered out, no extra item |
| Query parameters (`/products?sort=price`) | Query string stripped before processing |
| Malicious segment (`/<script>alert(1)</script>`) | Rendered as escaped text by React, not executed |
| Extremely deep nesting (15+ levels) | Truncation keeps first N, ellipsis, last M visible |
| Context-sensitive overrides | Map keyed by cumulative path, not segment name |
| Dynamic ID segments | Optional `idResolver` function maps IDs to names |
| SSR rendering | All functions are pure and synchronous, SSR-safe |

## Performance Characteristics

- **Path splitting & generation**: O(n) time, O(n) space
- **Label override lookup**: O(1) per item (Map)
- **Truncation**: O(n) time, O(k) space (k = visible items)
- **JSON-LD generation**: O(n) time, O(n) space
- **Rendering**: O(k) time, O(k) DOM nodes

For typical breadcrumb lengths (3-8 items), all operations are sub-millisecond.

## Testing Strategy

1. **Unit tests**: Test `generateBreadcrumbs` with various paths, verify labels/hrefs/isCurrent. Test `truncateBreadcrumbs` with arrays above and below limit. Test `generateBreadcrumbJSONLD` produces valid Schema.org JSON.
2. **Integration tests**: Render `Breadcrumb` component, assert `nav` has `aria-label`, links have correct `href`, current item has `aria-current="page"`.
3. **Accessibility tests**: Run axe-core, verify landmark, keyboard Tab order, `aria-hidden` on separators.
4. **Edge case tests**: Root path, trailing slash, query params, malicious segments, deep nesting with truncation, SSR rendering.
