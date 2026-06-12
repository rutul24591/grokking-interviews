"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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

export default function ZoomableCanvasSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Zoomable Canvas System</h1><h2>Definition &amp; Context</h2><p>Design a Zoomable Canvas System is an implementation-heavy interaction design covering scene graph, world transforms, pan and zoom, hit testing, selection, rendering layers, culling, and persistence. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep world-space scene data separate from viewport transform and render projection. Hit tests convert screen coordinates into world coordinates. Core structures: scene graph, world bounds, viewport transform, spatial index, visible set, selection, render layers, pointer session, and history journal.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/zoomable-canvas-system-runtime.svg" alt="Design a Zoomable Canvas System runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a zoomable canvas — a
          surface that users can pan and zoom
          (Figma, Miro, large image viewers,
          maps). The component is the foundation
          for any UI where content exceeds the
          viewport and users navigate spatially.
          The hard work is consistent zoom math
          across input methods, smooth physics,
          and bounded movement.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: zoom centered on
          cursor (not viewport center) for
          natural feel; pinch zoom on touch with
          momentum; smooth pan with inertia on
          touch; bounded vs unbounded canvas
          (Figma is unbounded; image viewer is
          bounded); keyboard alternative;
          accessibility for non-pointer users.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users navigate large content
          (designs, maps, diagrams). Power users
          spend hours panning and zooming.
          Engineering teams provide content;
          runtime handles navigation.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Modern browsers; Pointer Events,
          wheel events, transforms.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement what&rsquo;s in
          the canvas (the consumer&rsquo;s
          concern). We do not implement
          minimap (separate Pan + Zoom +
          Minimap subsystem builds on this).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Pan via drag. Zoom via wheel (mouse),
          pinch (touch), double-tap (touch),
          plus/minus keys. Zoom centered on
          cursor or pinch midpoint. Bounded
          option (clamp to canvas size) or
          unbounded. Reset to default
          view (zoom 1, centered). Keyboard
          alternative: arrow keys pan, +/- zoom,
          0 reset.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Smooth physics with momentum on touch.
          Zoom-to-fit (fit content to viewport).
          Zoom-to-region (drag a rectangle to
          zoom). Animated transitions between
          views. Two-finger rotation (rare;
          for design tools).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Content rendering, minimap, multi-
          user awareness (separate
          subsystems).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Pan and zoom at 60 fps via CSS
          transforms. Heavy content delegates
          its own optimization (virtualization,
          LOD).
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Zoom math consistent across input
          methods. Bounded clamping accurate.
          Reset always works.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Keyboard parity for pan and zoom.
          Live region announces zoom level
          changes (chunked, not continuous).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Single transform state{" "}
          <code>{` { x, y, scale } `}</code>;
          all input methods update it.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The canvas is a content layer
          wrapped in a viewport. The content
          is positioned via{" "}
          <code>transform: translate(x, y) scale(s)</code>{" "}
          where{" "}
          <code>(x, y, s)</code> is the canonical
          transform state. All input methods
          update this state; CSS handles
          rendering.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <p>
          On <strong>pinch zoom</strong>: track
          two pointers&rsquo; positions and
          midpoint. Compute scale delta from
          distance change. Apply the same
          zoom-centered math at the midpoint.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>double-tap</strong>: toggle
          between 1x and a fit-to-screen scale
          centered on the tap point.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Smooth physics</strong>: pan
          inertia on touch (continue moving
          briefly after release based on
          velocity). Zoom snap if close to
          1x (nudge to 1x for a clean state).
          CSS transitions handle smooth
          interpolation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard</strong>: arrow keys
          pan by step; +/- zoom; 0 reset.
          Step sizes proportional to viewport
          for consistent feel.
        </HighlightBlock>
      </section>

            

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial"><strong>ZoomableCanvas</strong></Highlight> wraps
          content. <strong>TransformState</strong>{" "}
          (x, y, scale) in <Highlight tier="important">component state.
          <strong> InputControllers</strong>{" "}
          for wheel,</Highlight> pinch, drag, keyboard.
          <strong> BoundsClamper</strong>{" "}
          enforces limits.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Single transform state. <Highlight tier="important">All inputs
          dispatch updates. Render is</Highlight> just
          CSS transform.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Inputs:</Highlight>{" "}
          <code>children</code>, <code>bounded</code>,{" "}
          <Highlight tier="important"><code>minScale</code></Highlight>,{" "}
          <code>maxScale</code>, <code>initialTransform</code>. Output: optional{" "}
          <code>onTransform</code> callback.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CSS transform is GPU-accelerated.
          Pointer-move <Highlight tier="important">handler minimal work
          (math only). RAF</Highlight> for smooth
          updates if needed.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Cursor changes for pan mode.
          Zoom <Highlight tier="important">indicator (small overlay
          showing percentage). Reset</Highlight> button.
          Smooth transitions on programmatic
          zoom.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Keyboard parity. Zoom level
          <Highlight tier="important">announces (chunked, e.g. on
          significant change).</Highlight> Reset has
          accessible button.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          No security surface; <Highlight tier="important">presentation</Highlight>{" "}
          only.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Zoom math tests <Highlight tier="important">across input
          methods. Bounds clamping tests.</Highlight>
          Keyboard tests. Pinch simulation.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Pan beyond bounds: clamp; visual
          rubber-band optional. Zoom past
          min/max: clamp. Keyboard</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">accessibility on touch-only
          devices: not applicable; provide
          on-screen buttons.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic primitive. <Highlight tier="important">Used by image
          viewers, whiteboards, maps,</Highlight>
          diagram editors.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">UI strings via{" "}
          <Highlight tier="important">i18n</Highlight>. Zoom
          percentage formatted via{" "}
          <Highlight tier="important">Intl</Highlight>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Bounded vs unbounded default</h3>
        <HighlightBlock as="p" tier="important">
          Choose per use case. Image viewer:
          bounded. Whiteboard: unbounded.
          Configurable.
        </HighlightBlock>

        <h3>CSS transform vs canvas-level pan</h3>
        <HighlightBlock as="p" tier="important">
          CSS transform is simple and works
          for any DOM content. Canvas-level
          pan (transforming the canvas) is
          for game/graphics contexts. CSS is
          right for typical UIs.
        </HighlightBlock>

        <h3>Zoom-centered-on-cursor vs viewport
        center</h3>
        <HighlightBlock as="p" tier="crucial">
          Cursor is more intuitive (the
          point under the cursor stays
          there). Viewport center is
          simpler but feels worse. Always
          cursor-centered.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Smarter physics, <Highlight tier="important">voice control of
          zoom, AR/VR canvas,</Highlight> AI-assisted
          framing.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep world-space scene data separate from viewport transform and render projection. Hit tests convert screen coordinates into world coordinates.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/zoomable-canvas-system-recovery.svg" alt="Design a Zoomable Canvas System recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Scene mutations are durable transactions. Viewport transforms are local preferences and disposable projection state. Scale pressure comes from many objects, extreme zoom, expensive redraw, hit-test load, resize, and floating-point drift. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: scene graph, culling, and hit testing</h3><p>Keep scene objects in world space and viewport transform as local projection state. Convert screen pointers through the inverse transform, query a spatial index for hit tests, cull outside the visible world bounds, batch redraws, and journal only durable scene mutations.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, cull invisible objects, batch redraw, clamp transforms, preserve pointer anchor, validate hit tests, and restore stable viewport.</p><h3>Scene graph and rendering layers</h3><p>Partition the scene into durable semantic objects, a spatial index, transient selection state, viewport transform, and rendering layers. Query visible world bounds after pan or zoom and redraw only affected layers. Static background content, semantic objects, selection handles, and transient guides have different invalidation rates and should not force one full render path.</p><p>Hit testing converts the pointer to world space and queries nearby indexed objects before applying precise shape tests. Normalize floating-point values when committing geometry so repeated transforms do not accumulate noisy diffs. For very large scenes, add level-of-detail rendering and worker-assisted indexing while keeping input projection on the main thread. Provide reset zoom, keyboard pan, zoom controls, and a semantic object list fallback.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep world-space scene data separate from viewport transform and render projection. Hit tests convert screen coordinates into world coordinates.</p><h3>What breaks at scale?</h3><p>many objects, extreme zoom, expensive redraw, hit-test load, resize, and floating-point drift.</p><h3>What consistency applies?</h3><p>Scene mutations are durable transactions. Viewport transforms are local preferences and disposable projection state.</p><h3>How do you recover?</h3><p>cull invisible objects, batch redraw, clamp transforms, preserve pointer anchor, validate hit tests, and restore stable viewport.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}