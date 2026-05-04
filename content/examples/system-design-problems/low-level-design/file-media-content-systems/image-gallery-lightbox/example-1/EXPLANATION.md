# Image Gallery / Lightbox — Full Implementation (State + Gestures)

Example 1 models a gallery/lightbox subsystem:

- Lazy loading strategy hooks + placeholders
- Lightbox state (open/close, current index)
- Zoom/pan gesture math (clamped transforms)
- Swipe navigation and prefetch hints

Interview focus:
- Preventing layout shift (fixed aspect ratio boxes)
- Handling huge images (tiling) and memory constraints

