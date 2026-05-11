"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-snap-to-grid-alignment",
  title: "Snap-to-Grid / Alignment System",
  description: "Grid snapping, alignment guides, and intelligent positioning for interactive canvas tools",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "snap-to-grid-alignment",
  wordCount: 5900,
  readingTime: 35,
  lastUpdated: "2026-05-06",
  tags: ["lld", "snap-to-grid", "alignment", "drag-drop", "design-tool"],
  relatedTopics: ["drag-drop-list", "dashboard-builder", "zoomable-canvas-system"],
};

export default function SnapToGridAlignmentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Design tools (Figma, Adobe XD) allow dragging elements. Without snapping, precise positioning difficult. Key challenges: detecting nearby grid lines or elements, smoothly snapping, showing alignment guides, and performance at many elements. Naive approach: snap to fixed grid (limited control). Better: snap to grid, snap to objects, and adaptive guides.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Assumptions:</strong>
        </HighlightBlock>
        <ul className="space-y-2">
          <li>Grid resolution configurable (8px, 16px).</li>
          <HighlightBlock as="li" tier="important">Many elements on canvas (need efficient detection).</HighlightBlock>
          <li>Visual guides helpful for alignment.</li>
          <li>Snap threshold tunable (within pixels).</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Grid Snapping:</strong> Snap to fixed grid (8px, 16px).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Object Snapping:</strong> Snap to edges of other elements.
          </HighlightBlock>
          <li>
            <strong>Alignment Guides:</strong> Show lines when snapping.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Smart Guides:</strong> Guides for edges, centers, spacing.
          </HighlightBlock>
          <li>
            <strong>Snap Threshold:</strong> Configurable snap distance.
          </li>
          <li>
            <strong>Snap Toggle:</strong> Enable/disable snapping.
          </li>
          <li>
            <strong>Snap Feedback:</strong> Visual/audio on snap.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Performance:</strong> Fast snap detection (10ms or less).
          </HighlightBlock>
          <li>
            <strong>Accuracy:</strong> Snap within 1 pixel.
          </li>
          <li>
            <strong>Scale:</strong> 100+ elements without lag.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Multiple snap candidates: snap to closest.</li>
          <li>Rotating elements: snap edges, not corners.</li>
          <li>Nested groups: snap within group or parent.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          While dragging, calculate snap candidates (grid intersections, other element edges). <Highlight tier="important">Find closest within threshold. Move element</Highlight> to snap position. Draw alignment guides. On drop, finalize position.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Grid Snapping</h3>
        <p>Aligning to fixed grid.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Grid Size:</strong> 8px, 16px, or custom (set by user).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Snap Logic:</strong> Round position to nearest grid intersection.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Formula:</strong> snappedX = Math.round(x / gridSize) * gridSize.
          </HighlightBlock>
          <li>
            <strong>Performance:</strong> O(1) operation, very fast.
          </li>
          <li>
            <strong>Visual Guide:</strong> Optional faint grid overlay.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Object Snapping</h3>
        <p>Aligning to other elements.</p>
        <ul className="space-y-2">
          <li>
            <strong>Snap Points:</strong> Left, right, top, bottom, center of each element.
          </li>
          <li>
            <strong>Detection:</strong> Find elements within threshold of current position.
          </li>
          <li>
            <strong>Threshold:</strong> Default 8px (configurable).
          </li>
          <li>
            <strong>Algorithm:</strong> For each snap point on dragging element, find nearest snap points on other elements.
          </li>
          <li>
            <strong>Performance:</strong> Spatial indexing (quadtree) for large element counts.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Alignment Guides</h3>
        <p>Visual feedback.</p>
        <ul className="space-y-2">
          <li>
            <strong>Guide Lines:</strong> Horizontal/vertical lines at snap edges.
          </li>
          <li>
            <strong>Appearance:</strong> Thin colored lines (blue, 1px).
          </li>
          <li>
            <strong>Animation:</strong> Fade in/out smoothly.
          </li>
          <li>
            <strong>Clarity:</strong> Show only while snapping (avoid clutter).
          </li>
          <li>
            <strong>Multiple Guides:</strong> Show all active snap edges.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Smart Guides</h3>
        <p>Advanced alignment detection.</p>
        <ul className="space-y-2">
          <li>
            <strong>Center Alignment:</strong> Snap to element centers.
          </li>
          <li>
            <strong>Spacing:</strong> Equal spacing between elements.
          </li>
          <li>
            <strong>Vertical/Horizontal:</strong> Guide lines extend across canvas.
          </li>
          <li>
            <strong>Distribution:</strong> Detect when 3+ elements evenly spaced.
          </li>
          <li>
            <strong>Customizable:</strong> Enable/disable by type.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Snap Calculation</h3>
        <p>Finding best snap position.</p>
        <ul className="space-y-2">
          <li>
            <strong>Candidates:</strong> Grid intersections, other element edges, centers.
          </li>
          <li>
            <strong>Distance Calculation:</strong> For each candidate, calculate distance to element.
          </li>
          <li>
            <strong>Threshold Filter:</strong> Keep candidates within snap distance.
          </li>
          <li>
            <strong>Ranking:</strong> Prefer grid over objects, closest over far.
          </li>
          <li>
            <strong>Result:</strong> Return snapped position with guide info.
          </li>
        </ul>
        <HighlightBlock as="p" tier="crucial">
          <strong>Snap Priority Ranking:</strong> When multiple snap candidates exist, rank them by strength and distance. Grid snapping is the weakest priority (just a grid), object edge alignment is medium priority (aligns with other elements), and center alignment or equal spacing is the strongest priority (meaningful compositional relationship). Within the same priority tier, prefer candidates closest to the element (smallest distance). Distance-based ranking prevents snapping to distant grids when a closer object edge is available. This ensures snap behavior feels predictable and intentional rather than random.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/snap-to-grid-alignment-guides.svg"
          alt="Snap-to-grid and alignment guides system showing grid snapping, alignment guides between objects, and equal spacing detection with snap threshold zones"
          caption="Snap-to-grid and alignment guides: grid snapping (8px increments), alignment guides highlighting edge/center alignment, and equal spacing detection for distributing elements"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Optimization</h3>
        <p>Handling many elements.</p>
        <ul className="space-y-2">
          <li>
            <strong>Spatial Index:</strong> Quadtree or grid acceleration structure.
          </li>
          <li>
            <strong>Candidate Filtering:</strong> Only check nearby elements.
          </li>
          <li>
            <strong>Debouncing:</strong> Calculate snap less frequently if dragging fast.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Caching:</strong> Cache element bounds, update only on resize.
          </HighlightBlock>
          <li>
            <strong>Worker Thread:</strong> Offload snap calculation to web worker.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Configuration & Presets</h3>
        <p>User control.</p>
        <ul className="space-y-2">
          <li>
            <strong>Grid Size:</strong> User selectable (8, 16, 32px).
          </li>
          <li>
            <strong>Snap Threshold:</strong> Distance to snap (default 8px).
          </li>
          <li>
            <strong>Snap Types:</strong> Checkbox for grid, objects, guides.
          </li>
          <li>
            <strong>Visual Feedback:</strong> Guide color, thickness (customizable).
          </li>
          <li>
            <strong>Persistent:</strong> Save preferences to localStorage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Snap Threshold Sensitivity</h3>
        <HighlightBlock as="p" tier="crucial">
          Large threshold: snaps easily, may snap unintentionally. Small: requires precise positioning.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Guide Visibility</h3>
        <HighlightBlock as="p" tier="important">
          Many guides: clear feedback, cluttered. Few guides: simple, may miss snaps.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance vs Accuracy</h3>
        <HighlightBlock as="p" tier="important">
          Spatial index: faster, memory overhead. Linear search: simple, slower at scale.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">Real-world systems use{" "}
          <Highlight tier="important">spatial indexing</Highlight>{" "}
          for fast candidate detection,</HighlightBlock>
<HighlightBlock as="p" tier="important">visual guide feedback, and configurable snap types and thresholds.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
