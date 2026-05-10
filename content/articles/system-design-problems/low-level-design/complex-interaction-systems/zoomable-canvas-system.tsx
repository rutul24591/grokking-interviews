"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-zoomable-canvas-system",
  title: "Design a Zoomable Canvas System",
  description:
    "LLD for a zoomable canvas: pan, zoom (wheel/pinch/double-tap), bounded movement, keyboard control, smooth physics, and accessibility.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "zoomable-canvas-system",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-05-04",
  tags: ["lld", "canvas", "zoom", "pan", "react"],
  relatedTopics: [
    "image-gallery-lightbox",
    "collaborative-whiteboard",
    "pan-zoom-minimap-system",
  ],
};

export default function ZoomableCanvasSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a zoomable canvas — a
          surface that users can pan and zoom
          (Figma, Miro, large image viewers,
          maps). The component is the foundation
          for any UI where content exceeds the
          viewport and users navigate spatially.
          The hard work is consistent zoom math
          across input methods, smooth physics,
          and bounded movement.
        </p>
        <p>
          The hard problems are: zoom centered on
          cursor (not viewport center) for
          natural feel; pinch zoom on touch with
          momentum; smooth pan with inertia on
          touch; bounded vs unbounded canvas
          (Figma is unbounded; image viewer is
          bounded); keyboard alternative;
          accessibility for non-pointer users.
        </p>

        <h3>User Context</h3>
        <p>
          End users navigate large content
          (designs, maps, diagrams). Power users
          spend hours panning and zooming.
          Engineering teams provide content;
          runtime handles navigation.
        </p>

        <h3>Assumptions</h3>
        <p>
          Modern browsers; Pointer Events,
          wheel events, transforms.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement what&rsquo;s in
          the canvas (the consumer&rsquo;s
          concern). We do not implement
          minimap (separate Pan + Zoom +
          Minimap subsystem builds on this).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Pan via drag. Zoom via wheel (mouse),
          pinch (touch), double-tap (touch),
          plus/minus keys. Zoom centered on
          cursor or pinch midpoint. Bounded
          option (clamp to canvas size) or
          unbounded. Reset to default
          view (zoom 1, centered). Keyboard
          alternative: arrow keys pan, +/- zoom,
          0 reset.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Smooth physics with momentum on touch.
          Zoom-to-fit (fit content to viewport).
          Zoom-to-region (drag a rectangle to
          zoom). Animated transitions between
          views. Two-finger rotation (rare;
          for design tools).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Content rendering, minimap, multi-
          user awareness (separate
          subsystems).
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Pan and zoom at 60 fps via CSS
          transforms. Heavy content delegates
          its own optimization (virtualization,
          LOD).
        </p>

        <h3>Reliability</h3>
        <p>
          Zoom math consistent across input
          methods. Bounded clamping accurate.
          Reset always works.
        </p>

        <h3>Accessibility</h3>
        <p>
          Keyboard parity for pan and zoom.
          Live region announces zoom level
          changes (chunked, not continuous).
        </p>

        <h3>Maintainability</h3>
        <p>
          Single transform state{" "}
          <code>{` { x, y, scale } `}</code>;
          all input methods update it.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The canvas is a content layer
          wrapped in a viewport. The content
          is positioned via{" "}
          <code>transform: translate(x, y) scale(s)</code>{" "}
          where{" "}
          <code>(x, y, s)</code> is the canonical
          transform state. All input methods
          update this state; CSS handles
          rendering.
        </p>
        <p>
          On <strong>wheel zoom</strong>: compute
          zoom delta from wheel deltaY.
          Compute target scale; clamp to
          min/max. Adjust translation so the
          point under the cursor stays under
          the cursor (zoom-centered-on-cursor
          math): new translation accounts for
          the difference between scale-old
          and scale-new at the cursor
          position.
        </p>
        <p>
          On <strong>pinch zoom</strong>: track
          two pointers&rsquo; positions and
          midpoint. Compute scale delta from
          distance change. Apply the same
          zoom-centered math at the midpoint.
        </p>
        <p>
          On <strong>double-tap</strong>: toggle
          between 1x and a fit-to-screen scale
          centered on the tap point.
        </p>
        <p>
          On <strong>pan</strong>: pointer drag
          updates translation directly.
          Bounded mode clamps so content edges
          stay within or at the viewport
          edges.
        </p>
        <p>
          <strong>Bounded vs unbounded</strong>:
          bounded clamps translation to keep
          content within viewport (typical for
          image viewers). Unbounded allows
          infinite pan (typical for design
          tools, whiteboards).
        </p>
        <p>
          <strong>Smooth physics</strong>: pan
          inertia on touch (continue moving
          briefly after release based on
          velocity). Zoom snap if close to
          1x (nudge to 1x for a clean state).
          CSS transitions handle smooth
          interpolation.
        </p>
        <p>
          <strong>Keyboard</strong>: arrow keys
          pan by step; +/- zoom; 0 reset.
          Step sizes proportional to viewport
          for consistent feel.
        </p>
      </section>

            <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/zoomable-canvas-architecture.svg"
        alt="Zoomable canvas architecture showing viewport transform model with CSS matrix, coordinate conversion formulas, layer architecture (background, content, selection, HUD), viewport culling with quadtree, level of detail, and smooth interaction techniques"
        caption="Zoomable canvas: CSS matrix transform model, layer architecture, viewport culling for 10k+ nodes, and LOD rendering at different zoom levels"
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ZoomableCanvas</strong> wraps
          content. <strong>TransformState</strong>{" "}
          (x, y, scale) in component state.
          <strong> InputControllers</strong>{" "}
          for wheel, pinch, drag, keyboard.
          <strong> BoundsClamper</strong>{" "}
          enforces limits.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Single transform state. All inputs
          dispatch updates. Render is just
          CSS transform.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>children</code>,{" "}
          <code>bounded</code>,
          <code> minScale</code>,
          <code> maxScale</code>,
          <code> initialTransform</code>.
          Output: optional onTransform
          callback.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          CSS transform is GPU-accelerated.
          Pointer-move handler minimal work
          (math only). RAF for smooth
          updates if needed.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Cursor changes for pan mode.
          Zoom indicator (small overlay
          showing percentage). Reset button.
          Smooth transitions on programmatic
          zoom.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Keyboard parity. Zoom level
          announces (chunked, e.g. on
          significant change). Reset has
          accessible button.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          No security surface; presentation
          only.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Zoom math tests across input
          methods. Bounds clamping tests.
          Keyboard tests. Pinch simulation.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Wheel events with small deltaY
          (precise scrolling): scale by a
          smaller factor for finer control.
          Pinch with three fingers: ignore.
          Pan beyond bounds: clamp; visual
          rubber-band optional. Zoom past
          min/max: clamp. Keyboard
          accessibility on touch-only
          devices: not applicable; provide
          on-screen buttons.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic primitive. Used by image
          viewers, whiteboards, maps,
          diagram editors.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Zoom
          percentage formatted via Intl.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Bounded vs unbounded default</h3>
        <p>
          Choose per use case. Image viewer:
          bounded. Whiteboard: unbounded.
          Configurable.
        </p>

        <h3>CSS transform vs canvas-level pan</h3>
        <p>
          CSS transform is simple and works
          for any DOM content. Canvas-level
          pan (transforming the canvas) is
          for game/graphics contexts. CSS is
          right for typical UIs.
        </p>

        <h3>Zoom-centered-on-cursor vs viewport
        center</h3>
        <p>
          Cursor is more intuitive (the
          point under the cursor stays
          there). Viewport center is
          simpler but feels worse. Always
          cursor-centered.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Smarter physics, voice control of
          zoom, AR/VR canvas, AI-assisted
          framing.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How is zoom centered on
          cursor?</strong> Adjust translation
          so the point under the cursor
          stays under the cursor across
          scale change. The math is simple:
          new translation = old translation
          + (cursor - old translation) *
          (1 - newScale/oldScale).
        </p>

        <p>
          <strong>2. How is pinch zoom
          handled?</strong> Track two
          pointers; midpoint and distance
          change drive translation and
          scale. Same zoom-centered math at
          midpoint.
        </p>

        <p>
          <strong>3. Bounded vs
          unbounded?</strong> Bounded clamps
          translation to keep content within
          viewport. Unbounded allows
          infinite pan. Configurable per
          use case.
        </p>

        <p>
          <strong>4. How does keyboard
          control work?</strong> Arrow keys
          pan; +/- zoom; 0 reset. Step
          sizes proportional to viewport.
        </p>

        <p>
          <strong>5. How is performance
          maintained?</strong> CSS transform
          is GPU-accelerated. Single
          transform state; minimal handler
          work; render is automatic.
        </p>

        <p>
          <strong>6. How is this
          accessible?</strong> Keyboard
          parity. Zoom level announces.
          Reset button.
        </p>

        <p>
          <strong>7. How does this compose
          with other systems?</strong> Image
          gallery and collaborative whiteboard
          consume this primitive. Pan + Zoom
          + Minimap adds a navigator.
        </p>

        <p>
          <strong>8. What are limits?</strong>{" "}
          Min/max scale clamps prevent
          extreme zooms. Bounds clamp
          translation. Configurable per
          use case.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A zoomable canvas is{" "}
          <strong>single transform state +
          input controllers + CSS transform
          rendering + bounds clamping</strong>.
          Cursor-centered zoom feels right;
          keyboard parity covers
          accessibility; CSS transform keeps
          it fast.
        </p>
      </section>
    </ArticleLayout>
  );
}
