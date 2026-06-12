"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-collaborative-whiteboard",
  title: "Design a Collaborative Whiteboard",
  description:
    "LLD for a real-time whiteboard: vector shapes, free-draw, multi-user CRDT sync, infinite canvas with pan/zoom, live cursors, and offline-aware persistence.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "collaborative-whiteboard",
  wordCount: 6700,
  readingTime: 35,
  lastUpdated: "2026-04-30",
  tags: ["lld", "whiteboard", "canvas", "crdt", "collaboration", "react"],
  relatedTopics: [
    "real-time-collaborative-editor",
    "live-cursor-presence-system",
    "virtualized-grid-2d",
    "zoomable-canvas-system",
  ],
};

export default function CollaborativeWhiteboardArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Collaborative Whiteboard</h1><h2>Definition &amp; Context</h2><p>Design a Collaborative Whiteboard is an implementation-heavy low-level design problem covering canvas objects, pointer sampling, viewport transforms, operation batching, presence, undo, conflict handling, and snapshots. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Store semantic objects and operations separately from canvas pixels. Viewport and selection are local projections. The core structures are object map, operation log, snapshot version, local selection, viewport transform, stroke buffer, presence TTL, undo journal, and reconnect cursor.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/collaborative-whiteboard-runtime.svg" alt="Design a Collaborative Whiteboard runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a collaborative whiteboard —
          a Figma/Miro/FigJam-style infinite canvas
          where multiple users draw shapes, write
          text, sketch freehand, and arrange content
          in real time. Each user sees others&rsquo;
          changes live, with cursors and presence.
          The component combines a 2D rendering
          surface, vector graphics, multi-user CRDT
          sync, and the live cursor system.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: choosing the
          rendering technology (Canvas, SVG, WebGL);
          a CRDT model for vector shapes; smooth
          pan/zoom on large boards; freehand drawing
          with low latency; selection, transform, and
          group operations; offline-aware sync;
          performance at thousands of objects;
          accessibility for non-mouse users.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users brainstorm, diagram, and design
          collaboratively. They expect Figma-class
          fluency: instant drawing, smooth pan/zoom,
          live remote cursors. Engineering teams
          provide the canvas; this article covers
          the architecture.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          A CRDT library (Yjs preferred). A
          rendering surface (Canvas 2D for moderate
          scale; WebGL for very large boards).
          Modern browsers; we use Pointer Events,
          Web Workers for hit-testing on large
          boards, IndexedDB for offline.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the CRDT internals.
          We do not implement video/audio
          collaboration. Voting and stickies
          beyond basic shapes are pluggable, not
          core.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Tools: select, freehand, line, rectangle,
          circle, text, eraser. Pan and zoom (mouse
          wheel, pinch, keyboard). Multi-select via
          rubber-band. Move, resize, rotate
          selected objects. Group/ungroup. Layering
          (bring forward, send back). Delete.
          Undo/redo. Live multi-user sync via
          CRDT. Live cursors of other users.
          Auto-save and offline-aware. Export
          (image, PDF). Empty state and toolbar.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Sticky notes. Connectors / arrows
          between objects. Templates (mind map,
          flowchart). Comments anchored to
          objects. Voting on stickies. Frames
          (logical groupings). Version history.
          Search within board. Rich text in text
          objects.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          From-scratch CRDT, video chat,
          enterprise admin features.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Smooth pan/zoom at 60 fps on boards
          with thousands of objects. Drawing
          latency under 16 ms (drawn shape
          appears at the pointer immediately).
          Remote update latency under 200 ms
          end-to-end. Memory bounded for very
          large boards (virtualize off-canvas
          objects).
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          CRDT convergence. Offline edits queue
          locally. Reconnect syncs. Disconnect
          doesn&rsquo;t lose work.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Authenticated transport. Per-board
          access control. Object content
          (text in text objects) sanitized at
          render boundary.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Toolbar accessible. Selected object
          announces. Keyboard shortcuts for
          tools. Object positions accessible
          (read by screen reader on focus).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          CRDT library vendored. Tools as
          plugins. Renderer abstraction (Canvas
          / WebGL).
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>

        

        <HighlightBlock as="p" tier="crucial">
          The whiteboard composes <strong>CRDT
          document</strong> (Yjs Y.Map of objects),
          <strong> rendering surface</strong>{" "}
          (Canvas with viewport-based
          virtualization), <strong>tool system</strong>{" "}
          (pluggable tools handling pointer events),
          <strong> multi-user awareness</strong>{" "}
          (cursors and selections via the Live
          Cursor system), and <strong>offline
          persistence</strong> (IndexedDB-backed
          CRDT).
        </HighlightBlock>
        <p>
          The <strong>document</strong> is a Yjs
          Y.Map keyed by object id. Each entry is a
          shape:{" "}
          <code>{` { type, x, y, width, height, ...props } `}</code>.
          Free-draw paths store points as a Y.Array.
          Selection state is per-user awareness
          (ephemeral, not in document).
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>renderer</strong> uses Canvas
          2D for typical boards; WebGL for very
          large boards (10k+ objects). On each
          frame, we draw only objects whose
          bounding box intersects the viewport
          (viewport-based virtualization). Off-
          screen objects don&rsquo;t draw. Pan/zoom
          updates the viewport transform; objects
          stay in document coordinates.
        </HighlightBlock>
        <p>
          On <strong>tool action</strong>: pointer
          events route to the active tool. Freehand
          tool collects points and creates a path
          object on pointer-up. Rectangle tool
          drags a bounding box and creates a
          rectangle. Text tool clicks to insert.
          The tool dispatches a CRDT operation
          (add object); the operation broadcasts
          to peers via the Yjs provider.
        </p>
        <p>
          On <strong>remote operation</strong>: the
          provider applies the op to the CRDT;
          the renderer re-renders affected
          regions. We track which screen regions
          need redraw and only repaint those (dirty
          rect optimization).
        </p>
        <p>
          On <strong>selection</strong>: pointer
          down hits an object via hit testing
          (per-shape geometric tests, e.g. point
          in rectangle, distance to circle, point-
          on-path for freehand). Multi-select via
          rubber-band on empty space. Selected
          objects render with handles for resize
          and rotate.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>transform</strong> (move,
          resize, rotate): pointer drag updates
          object properties in the CRDT
          incrementally. Throttled to RAF for
          smooth rendering. Other users see
          smooth interpolation via the awareness
          channel.
        </HighlightBlock>
        <p>
          <strong>Pan and zoom</strong>: pan via
          space+drag or middle-mouse-drag; zoom
          via scroll wheel (pinch on touch). The
          viewport transform updates; the canvas
          re-renders with the new transform. Zoom
          centered on the pointer for natural
          feel.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Hit testing</strong> on large
          boards: spatial indexing (R-tree or
          quadtree) for O(log n) hit tests. We
          rebuild the index incrementally on
          object changes. Without indexing, hit
          tests are O(n) which gets slow at
          thousands of objects.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Live cursors</strong> via the
          Live Cursor / Presence subsystem.
          Cursor positions in document
          coordinates so all users see them at
          correct logical positions regardless
          of their own pan/zoom.
        </HighlightBlock>
        <p>
          <strong>Undo/redo</strong>: Yjs has a
          built-in UndoManager that records
          operations and can revert. Per-user
          undo (each user can undo their own
          operations independently).
        </p>
        <p>
          <strong>Offline</strong>: CRDT operations
          queue locally; IndexedDB persists.
          Reconnect syncs cleanly via Yjs
          provider.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>SpatialIndex</strong> for hit testing.{" "}
          <strong>CursorOverlay</strong> for live cursors.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>SelectionHandles</strong> render around selected objects.{" "}
          <Highlight tier="important"><strong>ToolImplementations</strong></Highlight>{" "}
          per tool type.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Document in CRDT. Local state (active
          tool, <Highlight tier="important">selected objects, viewport
          transform) in component</Highlight> state.
          Awareness for cursors and selections
          ephemeral.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">Object schema:{" "}
          <code>{` { id, type, transform, ...typeProps } `}</code>.
          CRDT operations: add, update, delete.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Awareness: cursor positions, selection
          ids per user. Tool contract:
          </Highlight><code>{` { onPointerDown, onPointerMove, onPointerUp, render? } `}</code>.</HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="crucial">Viewport virtualization: draw only
          on-screen objects. Spatial index for</HighlightBlock>
<HighlightBlock as="p" tier="important">O(log n) hit tests. Dirty-rect
          rendering: redraw only changed regions.</HighlightBlock>
<HighlightBlock as="p" tier="important">Web Worker for heavy hit tests.
          RAF-aligned commits for transforms.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Familiar tools palette (Figma-style).
          Smooth pan/zoom. Live cursors with</HighlightBlock>
<HighlightBlock as="p" tier="important">colored arrows. Selection handles for
          transform. Snap to grid (optional).</HighlightBlock>
<HighlightBlock as="p" tier="important">Auto-save status indicator. Empty
          state with template suggestions.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Selected
          object announces (&ldquo;Rectangle, x
          120 y 80, width 200</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">height 100&rdquo;).
          Keyboard equivalents for all mouse
          actions.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Authenticated transport. Per-board
          authorization. <Highlight tier="important">Text content sanitized
          at render. Rate-limit</Highlight> object creation
          to prevent spam.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for hit testing,
          transformations, spatial index.
          Integration</HighlightBlock>
<HighlightBlock as="p" tier="important">tests with simulated
          peers: collaborative draw converges.
          Performance</HighlightBlock>
<HighlightBlock as="p" tier="important">tests on 10k-object
          boards. Accessibility tests for
          keyboard parity.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Two users edit
          the same object: CRDT converges; one
          user&rsquo;s position update wins
          (last-writer-per-property typically).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Network drop during transform: local
          updates continue; sync on reconnect.
          User with no GPU on a WebGL renderer:
          fall back to Canvas 2D.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The pattern (CRDT + canvas + <Highlight tier="important">tools +
          cursors) reuses for design</Highlight> tools,
          mind maps, diagram editors,
          interactive whiteboards.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Toolbar labels via i18n. Text in <Highlight tier="important">text
          objects is the user&rsquo;s. RTL</Highlight>
          doesn&rsquo;t affect canvas geometry
          (positions are absolute).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Canvas vs WebGL vs SVG</h3>
        <HighlightBlock as="p" tier="crucial">
          Canvas 2D: simple, sufficient for
          moderate boards. WebGL: scales to
          tens of thousands of objects, more
          complex. SVG: declarative, but slow at
          scale and limited animation. Default
          Canvas; switch to WebGL for very large
          boards.
        </HighlightBlock>

        <h3>CRDT vs OT</h3>
        <HighlightBlock as="p" tier="important">
          CRDT (Yjs) is the right default for
          new systems — offline-first, no central
          coordinator needed for correctness. OT
          requires central server.
        </HighlightBlock>

        <h3>Document coordinates vs viewport
        coordinates</h3>
        <HighlightBlock as="p" tier="important">
          Document coordinates (canonical) work
          across viewers with different pan/zoom.
          Viewport coordinates would need
          translation per viewer.
        </HighlightBlock>

        <h3>Spatial index vs linear scan</h3>
        <HighlightBlock as="p" tier="important">
          Linear scan is O(n); fine for small
          boards. R-tree / quadtree is O(log
          n); essential at scale. We always
          index for production boards.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          AI-assisted shape recognition (draw a
          rough rectangle, <Highlight tier="important">get a perfect one).
          Voice annotations.</Highlight> Templates. AR/VR
          whiteboard. Real-time path
          simplification for performance.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Store semantic objects and operations separately from canvas pixels. Viewport and selection are local projections.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/collaborative-whiteboard-recovery.svg" alt="Design a Collaborative Whiteboard recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Sending bitmap frames is simple but wasteful; semantic operations are justified for collaboration and replay.</p><p>Server operation sequence or CRDT merge is authoritative. Cursor and selection presence are ephemeral TTL state. Scale pressure comes from high-frequency strokes, large boards, reconnect gaps, concurrent edits, object deletion, and memory pressure. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: semantic operation batching and snapshots</h3><p>Persist semantic object operations rather than pixels. Sample strokes locally, batch points under a payload budget, order operations by document version or CRDT clock, compact snapshots, replay reconnect gaps, and keep cursor presence outside durable history.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, batch stroke points, compact snapshots, replay missing operations, discard stale presence, bound history, and preserve offline edits.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Store semantic objects and operations separately from canvas pixels. Viewport and selection are local projections.</p><h3>What breaks at scale?</h3><p>high-frequency strokes, large boards, reconnect gaps, concurrent edits, object deletion, and memory pressure.</p><h3>What consistency applies?</h3><p>Server operation sequence or CRDT merge is authoritative. Cursor and selection presence are ephemeral TTL state.</p><h3>How do you recover?</h3><p>batch stroke points, compact snapshots, replay missing operations, discard stale presence, bound history, and preserve offline edits.</p><h3>Why this architecture?</h3><p>Sending bitmap frames is simple but wasteful; semantic operations are justified for collaboration and replay.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}