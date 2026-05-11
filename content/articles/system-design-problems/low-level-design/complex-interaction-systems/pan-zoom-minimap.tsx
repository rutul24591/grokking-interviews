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

export default function PanZoomMinimapArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
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
        <h2>Requirements</h2>
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
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Track viewport (position, zoom level). On mouse/touch events,</HighlightBlock>
<HighlightBlock as="p" tier="important">update viewport. Render only visible region (canvas clipping).</HighlightBlock>
<HighlightBlock as="p" tier="important">Minimap shows full canvas at reduced scale. Viewport rect shows current view on minimap. Update minimap on viewport change.</HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

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
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/viewport-zoom-transformation.svg"
          alt="Zoom-around-cursor transformation showing how viewport adjusts to keep the cursor pointing at the same canvas position before and after zoom"
          caption="Zoom-around-cursor formula: cursor remains on same canvas point before and after zoom by adjusting viewport position"
        />

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
        <h2>Implementation Considerations</h2>

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
        <h2>Trade-offs and Considerations</h2>

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
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">Real-world systems use transform-based animation for GPU acceleration, viewport clipping to</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">avoid rendering off-screen content, and minimap updates synchronized with viewport changes.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
