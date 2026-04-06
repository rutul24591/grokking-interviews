# Carousel / Slider — Implementation

## Key Decisions
1. **CSS transform translateX** — GPU-composited slide transitions, no layout thrashing
2. **Pointer Events swipe** — Unified mouse/touch, delta computation with threshold
3. **Autoplay with visibility awareness** — setInterval, pauses on hover/focus/document hidden
4. **CSS scroll-snap fallback** — Native scroll-snap for reduced-motion preference

## File Structure
- `lib/carousel-types.ts` — CarouselState, Slide types
- `lib/carousel-store.ts` — Zustand store with currentIndex, autoplay state
- `lib/swipe-detector.ts` — Pointer-based swipe with threshold
- `hooks/use-carousel.ts` — Main hook with autoplay, swipe, keyboard
- `hooks/use-autoplay.ts` — Autoplay manager with pause/resume
- `components/carousel.tsx` — Root carousel with track, controls
- `components/carousel-slide.tsx` — Individual slide with lazy loading
- `components/carousel-controls.tsx` — Arrows, dots, autoplay toggle
- `EXPLANATION.md`

## Testing
- Unit: swipe detector (threshold), autoplay (pause/resume/visibility)
- Integration: swipe → slide changes, autoplay fires, keyboard nav
- Accessibility: reduced motion, keyboard arrows, screen reader slide announcements
