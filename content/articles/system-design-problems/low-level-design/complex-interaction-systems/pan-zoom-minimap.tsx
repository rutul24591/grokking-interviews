"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pan-zoom-minimap",
  title: "Pan + Zoom + Minimap System",
  description:
    "Interactive viewport with pan/zoom controls, minimap overview, and constraint enforcement",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "pan-zoom-minimap",
  wordCount: 5800,
  readingTime: 35,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "pan-zoom",
    "minimap",
    "canvas",
    "interaction",
  ],
  relatedTopics: [
    "zoomable-canvas-system",
    "observer-apis",
    "performance-optimization",
  ],
};

export default function PanZoomMinimapArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Pan Zoom Minimap</h1><h2>Definition &amp; Context</h2><p>Design a Pan Zoom Minimap is an implementation-heavy interaction design covering world-to-screen transforms, pointer-centered zoom, panning, viewport clamping, minimap projection, click navigation, and resize recovery. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep world coordinates authoritative. Main viewport and minimap are projections of one transform and content bounds. Core structures: world bounds, viewport size, scale, translation, pointer anchor, minimap scale, minimap viewport rectangle, and resize policy.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/pan-zoom-minimap-runtime.svg" alt="Design a Pan Zoom Minimap runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>Problem Clarification</h3>
        <HighlightBlock as="p" tier="crucial">
          Large canvases (maps, diagrams, images) difficult to navigate. Users need to zoom in for detail and pan to explore. Key challenges: smooth zoom and pan interactions, minimap for global overview, and maintaining performance at large scales. Naive approach: full redraw on each zoom (slow). Better: efficient rendering with viewport tracking and minimap synchronization.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Assumptions:</strong>
        </HighlightBlock>
        <ul className="space-y-2">
          <li>Canvas content large (1000x1000+ pixels).</li>
          <li>Smooth interactions required (60fps).</li>
          <li>Touch and mouse input both needed.</li>
          <HighlightBlock as="li" tier="important">Minimap provides context (optional but helpful).</HighlightBlock>
          <li>Performance critical (avoid jank).</li>
        </ul>
      </section>

      <section>
        <h3>Requirements</h3>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Pan:</strong> Click and drag to move around canvas.
          </li>
          <li>
            <strong>Zoom:</strong> Mouse wheel or pinch to zoom in/out.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Minimap:</strong> Small representation of full canvas.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Minimap Navigation:</strong> Click minimap to jump to area.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Viewport Indicator:</strong> Show current view rect on minimap.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Zoom Limits:</strong> Min/max zoom levels (prevent extreme).
          </HighlightBlock>
          <li>
            <strong>Reset View:</strong> Return to initial viewport.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> 60fps during pan/zoom (smooth).
          </li>
          <li>
            <strong>Responsiveness:</strong> Instant visual feedback on input.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Memory:</strong> Efficient for large canvases.
          </HighlightBlock>
          <li>
            <strong>Compatibility:</strong> Touch and mouse, desktop and mobile.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Very large canvas (10K x 10K): render only visible region.</li>
          <li>Very small canvas (100x100): zoom appropriately.</li>
          <li>Multi-touch zoom: pinch with two fingers.</li>
          <li>Mouse wheel while hovering minimap: should zoom canvas, not minimap.</li>
          <li>Rapid pan: smooth animation, not jittery.</li>
        </ul>
      </section>

      <section>
        <h3>High-Level Approach</h3>
        <HighlightBlock as="p" tier="crucial">Track viewport (position, zoom level). On mouse/touch events,</HighlightBlock>
<HighlightBlock as="p" tier="important">update viewport. Render only visible region (canvas clipping).</HighlightBlock>
<HighlightBlock as="p" tier="important">Minimap shows full canvas at reduced scale. Viewport rect shows current view on minimap. Update minimap on viewport change.</HighlightBlock>
      </section>

      <section>
        <h3>Detailed Design</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Viewport Model</h3>
        <p>Tracking view state.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Position:</strong> X, Y offsets (top-left of viewport).
          </HighlightBlock>
          <li>
            <strong>Zoom Level:</strong> Scale factor (1.0 = 100%, 2.0 = 200%).
          </li>
          <li>
            <strong>Dimensions:</strong> Canvas width/height, viewport width/height.
          </li>
          <li>
            <strong>Bounds:</strong> Min/max X, Y to prevent panning beyond edges.
          </li>
          <li>
            <strong>Animation:</strong> Smooth transitions (easing) on zoom/pan.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pan Interaction</h3>
        <p>Dragging to move viewport.</p>
        <ul className="space-y-2">
          <li>
            <strong>Capture Mouse Down:</strong> Record start position.
          </li>
          <li>
            <strong>Mouse Move:</strong> Calculate delta, update viewport.
          </li>
          <li>
            <strong>Mouse Up:</strong> End pan, lock position.
          </li>
          <li>
            <strong>Momentum:</strong> Optional inertia (continue panning after release).
          </li>
          <li>
            <strong>Constraints:</strong> Enforce bounds (don't pan off-canvas).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Zoom Interaction</h3>
        <p>Scaling viewport.</p>
        <ul className="space-y-2">
          <li>
            <strong>Mouse Wheel:</strong> deltaY determines zoom direction.
          </li>
          <li>
            <strong>Pinch Gesture:</strong> Two-finger pinch for touch.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Zoom Center:</strong> Zoom towards cursor position (intuitive).
          </HighlightBlock>
          <li>
            <strong>Limits:</strong> Min 0.1x, max 5x (adjustable).
          </li>
          <li>
            <strong>Smooth Zoom:</strong> Animate to target zoom (not instant).
          </li>
        </ul>
        <HighlightBlock as="p" tier="crucial">
          <strong>Zoom-Around-Cursor Technique:</strong> The most critical aspect of zoom interaction is maintaining the point under the cursor. Calculate the canvas coordinate at the cursor before zooming, apply the zoom level change, then adjust the viewport position so that same canvas point remains under the cursor. This creates intuitive zoom behavior where the user "zooms in on" the point they're hovering over. Without this, zoom appears to jump around, creating disorientation. The formula: before zoom, compute canvasPoint = (cursorScreenPos - viewportPos) / currentZoom. After zoom, calculate newViewportX = canvasPoint * newZoom - cursorScreenPos to restore the same canvas point under the cursor position.
        </HighlightBlock>
        

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Minimap Rendering</h3>
        <p>Showing canvas overview.</p>
        <ul className="space-y-2">
          <li>
            <strong>Scale:</strong> Entire canvas fits in small area (e.g., 200x200).
          </li>
          <li>
            <strong>Scale Factor:</strong> Canvas size / minimap size.
          </li>
          <li>
            <strong>Content:</strong> Simplified rendering (lower res, no details).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Cached image or canvas rendering.
          </HighlightBlock>
          <li>
            <strong>Update:</strong> Redraw when canvas content changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Viewport Indicator</h3>
        <p>Showing current view on minimap.</p>
        <ul className="space-y-2">
          <li>
            <strong>Rectangle:</strong> Draw rect on minimap representing viewport.
          </li>
          <li>
            <strong>Position:</strong> Scale viewport coords to minimap scale.
          </li>
          <li>
            <strong>Size:</strong> Scale viewport dimensions to minimap scale.
          </li>
          <li>
            <strong>Styling:</strong> Contrasting color (semi-transparent).
          </li>
          <li>
            <strong>Update:</strong> Redraw on viewport change.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Minimap Navigation</h3>
        <p>Jumping to new location.</p>
        <ul className="space-y-2">
          <li>
            <strong>Click Minimap:</strong> Jump to clicked location.
          </li>
          <li>
            <strong>Center View:</strong> Center viewport on clicked point.
          </li>
          <li>
            <strong>Animation:</strong> Smooth transition to new viewport.
          </li>
          <li>
            <strong>Drag Viewport Rect:</strong> Drag rect on minimap to pan.
          </li>
          <li>
            <strong>Bounds Checking:</strong> Ensure jumped-to viewport valid.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Canvas Rendering</h3>
        <p>Efficient drawing.</p>
        <ul className="space-y-2">
          <li>
            <strong>Viewport Clipping:</strong> Only render visible region.
          </li>
          <li>
            <strong>Transform:</strong> Apply translate/scale transforms.
          </li>
          <li>
            <strong>Double Buffering:</strong> Render to offscreen canvas first.
          </li>
          <li>
            <strong>RequestAnimationFrame:</strong> Sync with browser frame rate.
          </li>
          <li>
            <strong>Dirty Rect:</strong> Only redraw changed regions.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Animation & Easing</h3>
        <p>Smooth transitions.</p>
        <ul className="space-y-2">
          <li>
            <strong>Zoom Animation:</strong> Ease-out over 200ms.
          </li>
          <li>
            <strong>Pan Animation:</strong> Ease-in-out for jump navigation.
          </li>
          <li>
            <strong>Cancel on Input:</strong> Stop animation if user interacts.
          </li>
          <li>
            <strong>Momentum:</strong> Inertia scrolling (optional).
          </li>
          <li>
            <strong>Performance:</strong> Use transform (GPU acceleration).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Touch Support</h3>
        <p>Mobile interaction.</p>
        <ul className="space-y-2">
          <li>
            <strong>Single Touch Pan:</strong> One finger drag to pan.
          </li>
          <li>
            <strong>Pinch Zoom:</strong> Two-finger pinch distance change.
          </li>
          <li>
            <strong>Touch Events:</strong> touchstart, touchmove, touchend.
          </li>
          <li>
            <strong>Prevent Default:</strong> Disable native pan/zoom.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Visual Feedback:</strong> Cursor change, highlight on minimap interaction.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h3>Implementation Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Canvas Library</h3>
        <HighlightBlock as="p" tier="important">
          HTML5 Canvas for direct rendering. Three.js for 3D. SVG for vector content.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Optimization</h3>
        <HighlightBlock as="p" tier="crucial">
          Viewport clipping crucial. RequestAnimationFrame for 60fps. Minimize canvas size.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="important">
          Test pan smoothness. Test zoom responsiveness. Test touch multi-touch. Test minimap sync.
        </HighlightBlock>
      </section>

      <section>
        <h3>Trade-offs and Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Minimap Size vs Detail</h3>
        <HighlightBlock as="p" tier="important">
          Large minimap: more detail, takes space. Small: saves space, less detail.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Animation vs Instant</h3>
        <HighlightBlock as="p" tier="important">
          Animated zoom: smooth but adds latency. Instant: responsive but jarring.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Momentum vs Control</h3>
        <HighlightBlock as="p" tier="crucial">
          Momentum: natural feel, harder to control. Instant stop: precise control, less natural.
        </HighlightBlock>
      </section>

      <section>
        <h3>Summary</h3>
        <HighlightBlock as="p" tier="crucial">Real-world systems use transform-based animation for GPU acceleration, viewport clipping to</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">avoid rendering off-screen content, and minimap updates synchronized with viewport changes.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep world coordinates authoritative. Main viewport and minimap are projections of one transform and content bounds.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/pan-zoom-minimap-recovery.svg" alt="Design a Pan Zoom Minimap recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Transform state is local. Persist only intentional workspace preference and clamp on restore. Scale pressure comes from huge canvases, extreme zoom, resize, floating-point drift, touch gestures, and minimap clicks outside bounds. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: world-screen transforms and minimap projection</h3><p>Keep world coordinates independent from viewport transform. Convert pointer anchors through inverse transforms, clamp zoom and pan, derive the minimap viewport rectangle, cull invisible objects, and treat the minimap as a projection rather than a second source of scene truth.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, clamp scale and translation, preserve pointer anchor during zoom, recalculate minimap rectangle, recover after resize, and expose keyboard controls.</p><h3>Transform math and minimap synchronization</h3><p>Represent the viewport as translation plus scale and expose screenToWorld and worldToScreen as the only coordinate conversion functions. Zoom around the pointer by converting the pointer to world space before scale changes, then solving the new translation so that world point remains under the pointer. Clamp scale and world bounds after each transition. This prevents drift from accumulating through ad hoc coordinate math.</p><p>The minimap derives a viewport rectangle from the visible world bounds and the minimap scale. Dragging that rectangle updates the main translation through the same transform API. Render large scenes through culling and level-of-detail rules; the minimap may use simplified shapes or a cached raster layer. Provide keyboard zoom controls, reset-to-fit, and a textual location fallback for users who cannot operate direct manipulation.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep world coordinates authoritative. Main viewport and minimap are projections of one transform and content bounds.</p><h3>What breaks at scale?</h3><p>huge canvases, extreme zoom, resize, floating-point drift, touch gestures, and minimap clicks outside bounds.</p><h3>What consistency applies?</h3><p>Transform state is local. Persist only intentional workspace preference and clamp on restore.</p><h3>How do you recover?</h3><p>clamp scale and translation, preserve pointer anchor during zoom, recalculate minimap rectangle, recover after resize, and expose keyboard controls.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}