# Tooltip System — Implementation Explanation

## Overview

This is a production-grade tooltip system for React applications. It supports 12 placement options, automatic boundary collision detection and flipping, configurable show/hide delays, portal-based rendering, rich content, and full accessibility compliance.

## Architecture

The system is composed of four layers:

### 1. State Management (Zustand Store)

The store (`tooltip-store.ts`) is the single source of truth. It enforces the singleton constraint — only one tooltip can be active at any time. When a new tooltip is shown, any previously active tooltip is immediately dismissed.

**Key state:**
- `activeTooltip`: The currently active tooltip object (null if none)
- `isVisible`: Whether the tooltip is currently rendered (false during measurement phase)
- `pendingShow`: ID of a tooltip waiting for its show delay to complete

**Key actions:**
- `showTooltip(id, content, config, triggerElement)`: Schedules tooltip show with delay
- `hideTooltip()`: Schedules tooltip hide with delay
- `forceHide()`: Immediately dismisses any open tooltip and clears all pending timers
- `updatePosition(position)`: Updates the computed position after tooltip measurement

### 2. Position Engine

The position engine (`tooltip-position-engine.ts`) is a pure function module. Given a trigger's bounding rectangle, tooltip dimensions, preferred placement, and viewport size, it returns the exact top/left coordinates, the resolved placement (after auto-flip), and the arrow position.

**How it works:**
1. Computes position for the preferred placement using simple arithmetic based on trigger edges
2. Checks if the computed position would overflow the viewport (boundary collision)
3. If collision detected, flips the primary axis (top to bottom, left to right)
4. Recalculates position for the flipped placement
5. Computes arrow position to align with the trigger center

**All 12 placements:**
- `top-start`, `top-center`, `top-end`
- `bottom-start`, `bottom-center`, `bottom-end`
- `left-start`, `left-center`, `left-end`
- `right-start`, `right-center`, `right-end`

### 3. Delay Manager

The delay manager (`tooltip-delay-manager.ts`) handles the timing aspect. It uses `setTimeout` for both show and hide delays, with proper cancellation support.

**Why delays matter:**
- Show delay (300ms): Prevents tooltips from appearing when the cursor briefly passes over a trigger during navigation
- Hide delay (100ms): Prevents flicker when the cursor briefly leaves and re-enters the trigger area

The delay manager maintains separate Maps for show and hide timers, keyed by tooltip ID. Each timer can be individually cancelled, and `clearAll()` wipes everything for cleanup.

### 4. React Components and Hooks

**Hooks:**
- `useTooltipTrigger`: Attaches mouse, focus, and touch event handlers to trigger elements. Integrates with the delay manager. Supports controlled and uncontrolled modes.
- `useTooltipVisibility`: Uses IntersectionObserver to detect when the trigger scrolls out of view and auto-dismisses the tooltip. Also uses MutationObserver to detect trigger removal from DOM.
- `useTooltipPortal`: Creates and manages a persistent portal container attached to `document.body`. SSR-safe — checks `typeof window` before creating DOM elements.

**Components:**
- `TooltipTrigger`: Wrapper that clones its child element and attaches event handlers + `aria-describedby`. Supports ref merging.
- `TooltipContent`: The tooltip bubble. Renders via portal, computes position via the position engine, and displays rich content. Includes a triangular SVG arrow.
- `TooltipProvider`: App-level wrapper. Registers global Escape key and outside-click listeners. Handles window resize by dismissing open tooltips.

## Accessibility

- `aria-describedby` on the trigger links to the tooltip's `id`
- Tooltip content has `role="tooltip"` for screen reader semantics
- Keyboard users see tooltips on focus (trigger must be focusable)
- Escape key dismisses any open tooltip
- Touch users get tooltips on long-press (500ms), dismissed after 1500ms

## Key Design Decisions

1. **Singleton pattern**: Only one tooltip at a time simplifies positioning, avoids visual clutter, and matches user expectations.

2. **Portal rendering**: Tooltips always render at `document.body` level, escaping any `overflow: hidden` or z-index constraints of parent containers.

3. **Pure position engine**: The position engine has no side effects — it is a pure function that takes inputs and returns coordinates. This makes it trivially testable.

4. **IntersectionObserver over scroll events**: Using IntersectionObserver to detect trigger visibility is far more performant than listening to scroll events and repositioning on every tick.

5. **Controlled + uncontrolled modes**: Consumers can either let the system manage show/hide state (uncontrolled) or pass their own `open` state (controlled) for integration with form validation, tutorials, etc.

## Testing

- **Unit tests**: Position engine with all 12 placements, auto-flip on boundary collision, arrow positioning, delay manager timer cancellation.
- **Integration tests**: Full lifecycle (hover, show after delay, hide after delay), portal rendering outside component tree, accessibility attributes.
- **E2E tests**: Playwright tests with fixed viewport, verifying tooltip coordinates and auto-flip behavior.
