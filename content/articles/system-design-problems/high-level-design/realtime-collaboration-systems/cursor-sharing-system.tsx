"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cursor-sharing-system",
  title: "Design a Cursor-Sharing System (Figma-Like)",
  description:
    "Architecture for real-time cursor sharing: high-frequency position broadcasting, interpolation, viewport transformation, identity display, and scaling to hundreds of simultaneous collaborators.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "cursor-sharing-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-10",
  tags: ["hld", "cursor-sharing", "real-time", "collaboration", "WebSocket", "interpolation"],
  relatedTopics: ["real-time-collaborative-whiteboard", "presence-system"],
};

export default function CursorSharingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Cursor sharing—showing each collaborator's mouse position in real-time on a shared canvas or document—is a foundational feature of collaborative tools like Figma, Miro, and Google Docs. It creates a sense of shared space: you can see where your colleagues are looking and what they are about to interact with. The feature appears simple but involves non-trivial engineering: cursor positions update at up to 60Hz per user, must be transformed from the sender's coordinate system to the receiver's (accounting for different zoom levels and pan positions), and must remain smooth even when the underlying delivery rate is lower than the display refresh rate.</p>
        <p>The cursor-sharing system is intentionally distinct from the document state synchronization system. Cursors are ephemeral (they do not need to be persisted or replayed on reconnect), high-frequency (60Hz vs typical document edits at 1–2Hz), and loss-tolerant (dropping a cursor update simply means a slightly stale position for 16ms—imperceptible). This different quality-of-service profile justifies a separate technical path optimized for throughput and low latency over reliability.</p>
        <p><strong>Explicit assumptions:</strong> The shared space is an infinite canvas (like Figma or Miro) where each user has their own viewport (position and zoom level). Users have distinct names and assigned colors (randomly assigned at join time, or from a configured palette). Maximum 200 concurrent collaborators per canvas (Figma's practical limit). Cursor positions are transmitted in canvas coordinates (not screen pixels). The cursor rendering shows a pointer with a name label. Cursor data does not persist—reconnecting users start with no cursor position until they move their mouse.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-time cursor position:</strong> Each collaborator's cursor position is visible to all other collaborators within 100ms of the movement.</li>
          <li><strong>Cursor identity:</strong> Each cursor displays the collaborator's name and a unique color. The name label follows the cursor without overlapping other labels (best-effort label positioning).</li>
          <li><strong>Smooth animation:</strong> Cursor movement is visually smooth (no jerky teleportation) even when the underlying network delivery rate is 10–30Hz.</li>
          <li><strong>Viewport independence:</strong> Cursors are rendered correctly for each viewer regardless of their zoom level and pan position. A cursor at canvas position (500, 300) renders at the correct screen pixel for each viewer.</li>
          <li><strong>Cursor visibility:</strong> Cursors outside the viewer's current viewport are shown as labeled arrows at the edge of the viewport (directional indicators), allowing collaborators to find each other on the canvas.</li>
          <li><strong>Cursor inactivity:</strong> A cursor that has not moved for 30 seconds fades out and is not rendered until it moves again.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Bandwidth:</strong> Each client's cursor transmission should consume under 5KB/s of upstream bandwidth (cursor data, not document edits).</li>
          <li><strong>Scale:</strong> 200 concurrent cursors per canvas. Receiving 199 cursor update streams must not degrade the receiving client's performance.</li>
          <li><strong>Loss tolerance:</strong> Dropping up to 30% of cursor update messages must not produce visible degradation (interpolation fills gaps).</li>
          <li><strong>Latency budget:</strong> Network delivery + rendering combined must produce visually smooth cursor movement at 30–60fps with under 100ms of lag behind the actual cursor.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The cursor sharing system operates on a lightweight pub/sub model separate from the document state synchronization. Clients publish their cursor position updates via the same WebSocket connection used for document edits, but cursor messages use a distinct message type that the server handles differently: it does not persist cursor messages, does not sequence them globally, and delivers them with fire-and-forget semantics. The server's cursor relay is a pure broadcast function: receive a cursor message from one client, relay it to all other connected clients in the same canvas session. No storage, no ordering guarantees, no acknowledgment required.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/cursor-sharing-system-architecture.svg"
          alt="Cursor sharing architecture showing client (mousemove event throttled to 30Hz, canvas coordinate transformation, WebSocket cursor message), server relay (pure broadcast, no persistence, fire-and-forget), receiving client (cursor position buffer per collaborator, linear interpolation renderer, viewport transformation, edge indicator for out-of-viewport cursors, 30-second inactivity fade). Message format: {userId, x, y, timestamp}."
          caption="Cursor sharing: 30Hz throttled transmission, server pure broadcast relay, client-side interpolation, viewport transformation, and edge indicators"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Coordinate System and Transmission Format</h3>
        <p>Cursors are transmitted in canvas coordinates, not screen pixels. The canvas has its own coordinate system (origin at center or top-left of the infinite canvas, with positive x rightward and positive y downward). Screen pixels are a function of both the canvas position and the viewer's viewport state (panX, panY, zoom). Transmitting canvas coordinates decouples the cursor position from any viewer's specific zoom level—each viewer independently converts the received canvas coordinate to a screen pixel using their own viewport state.</p>
        <p>The conversion: screenX = (canvasX - viewportPanX) × zoom + canvasOriginX. Each viewer performs this conversion on every cursor position they receive, using their current viewport state. When the viewer pans or zooms, all cursor positions are recomputed and re-rendered at the next animation frame. This means cursor positions "move" from the viewer's perspective when they pan—which is correct behavior, since the cursor represents a fixed point on the shared canvas that the viewer is moving relative to.</p>
        <p>The cursor message format is compact: &#123;userId: uint32 (4 bytes), x: float32 (4 bytes), y: float32 (4 bytes), timestamp: uint32 (4 bytes, seconds since epoch)&#125; = 16 bytes per message. Binary encoding (ArrayBuffer) rather than JSON eliminates the JSON parsing cost and reduces message size by 3–5×. At 30Hz transmission, each client generates 30 × 16 bytes = 480 bytes/second of cursor data. With 200 collaborators, each client receives 199 × 480 = 95,520 bytes/second ≈ 95KB/s of incoming cursor data. This is within the bandwidth budget for a broadband-connected device, though it is significant for mobile connections where the user may be on a metered 4G plan.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side Throttling and Transmission</h3>
        <p>The browser fires mousemove events at up to 60Hz (every 16ms). Transmitting a cursor message on every mousemove event would generate 60 × 16 bytes = 960 bytes/second per cursor, and with 200 collaborators, 192KB/s of incoming data per client. The throttling strategy: collect mousemove events and transmit at exactly 30Hz using requestAnimationFrame (every 33ms). The transmitted position is the latest received mousemove position (not an average—the most recent position is the most accurate).</p>
        <p>Additionally, cursor messages are only transmitted when the cursor has moved (a cursor at rest does not generate any traffic). A comparison between the current position and the last-transmitted position checks for movement exceeding a minimum threshold (1 pixel of canvas movement, to avoid transmitting sub-pixel jitter from touch input noise). If the cursor has not moved, no message is sent. This optimization eliminates the majority of cursor messages during periods of inactivity within the 30Hz window.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Interpolation for Smooth Cursor Rendering</h3>
        <p>Receiving cursor positions at 30Hz (every 33ms) and rendering them directly at each received position produces visible jitter: the cursor appears to stutter between positions rather than moving smoothly. Linear interpolation (lerp) between positions produces smooth movement: at time t between two received positions p0 (received at t0) and p1 (received at t1), render the cursor at p0 + (p1 - p0) × (t - t0) / (t1 - t0). The interpolation runs at the screen refresh rate (60Hz), producing smooth motion even when updates arrive at 30Hz.</p>
        <p>The interpolation buffer per collaborator: store the last two received positions with their timestamps. On each animation frame, interpolate between them. If the next position arrives before the interpolation is complete, update the target (p1) to the new position and restart the interpolation from the current interpolated position (not from p0, to avoid visible jumps). If the next position is late (network delay, packet loss), extrapolate briefly beyond p1 for up to 100ms, then stop the cursor at p1 (do not extrapolate indefinitely—a stopped cursor is less jarring than one that continues moving in an incorrect direction).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Indicators for Out-of-Viewport Cursors</h3>
        <p>Collaborators may be working in different areas of the infinite canvas. A cursor at canvas position (5000, 3000) is not visible to a collaborator whose viewport shows canvas area (0, 0) to (1920, 1080). Rather than simply not rendering out-of-viewport cursors (which provides no indication that a collaborator exists), the system shows an edge indicator: an arrow-shaped element at the edge of the viewport, pointing in the direction of the off-screen cursor, with the collaborator's name label.</p>
        <p>The edge indicator position is computed by projecting the line from the viewport center to the off-screen cursor position onto the viewport boundary. The indicator is positioned at the intersection of this line with the boundary rectangle. The indicator tracks the cursor's position in real-time (it moves along the edge as the cursor moves off-screen). A click or tap on the edge indicator pans the viewport to center on the cursor's position (a "go to collaborator" action). This is the exact behavior in Figma and Miro.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server-Side Relay Architecture</h3>
        <p>The server receives cursor messages from one client and relays them to all other clients in the canvas session. For a session with 200 collaborators, each cursor message is relayed to 199 clients. At 30Hz per collaborator, 200 × 30 = 6,000 messages per second per session flow through the relay server. The relay is implemented as a pure in-memory broadcast: incoming cursor WebSocket frames are forwarded to all other WebSocket connections in the session without parsing (the server processes the raw binary frame at the WebSocket level, not at the application level). This avoids JSON parsing and serialization overhead, reducing relay latency to sub-millisecond.</p>
        <p>For sessions distributed across multiple relay servers (when a session's connections span multiple WebSocket servers), the relay uses Redis pub/sub: each session has a Redis channel; incoming cursor messages are published to the channel, and all relay servers subscribed to the channel relay to their connected clients. For cursor data (high-frequency, loss-tolerant), Redis pub/sub is appropriate—dropped messages are handled by the client's interpolation. The fire-and-forget semantics of Redis pub/sub match the loss-tolerance requirement perfectly.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Inactivity and Cursor Lifecycle</h3>
        <p>A cursor that has not moved for 30 seconds is considered inactive. The client stops transmitting cursor messages for inactive cursors (the throttled transmission loop stops sending when no movement is detected). On the receiving side, a cursor that has not received an update for 30 seconds fades out (CSS opacity transition from 1 to 0 over 1 second) and is removed from the render list. When the cursor moves again (a new message arrives), it fades back in at the new position.</p>
        <p>Collaborator disconnect is handled by the server: when a WebSocket connection closes (collaborator disconnects), the server broadcasts a cursor_removed event to all other clients with the disconnected userId. Clients receiving this event immediately remove the cursor and edge indicator for that userId. This ensures disconnected collaborators do not leave ghost cursors on the canvas.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/cursor-sharing-system-workflow.svg"
          alt="Cursor sharing data flow showing mousemove events throttled at requestAnimationFrame (30Hz) → binary cursor message (16 bytes) → WebSocket send → server pure relay (binary forward, no parse) → receiving client interpolation buffer (p0, p1, timestamps) → 60Hz animation frame interpolation → viewport transform → canvas render. Edge indicator computation for out-of-viewport cursors. Inactivity fade after 30s."
          caption="Cursor flow: 30Hz throttled binary transmission → server relay → client interpolation buffer → 60Hz animation frame render with viewport transform"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Transmission frequency: 30Hz is a practical balance between smoothness and bandwidth. At 60Hz, bandwidth doubles (190KB/s per client for 200 cursors) but smoothness improvement is imperceptible when combined with interpolation (the interpolation already fills the gap between 30Hz updates). At 10Hz, bandwidth is low but interpolation must predict over 100ms windows, making cursor extrapolation visibly wrong for fast-moving cursors. 30Hz is the industry standard for cursor sharing in collaborative tools.</p>
        <p>Canvas coordinates versus relative coordinates: transmitting absolute canvas coordinates (as described) requires each receiver to know the sender's canvas origin—but since all collaborators share the same canvas, the canvas origin is the same for all. An alternative is transmitting relative viewport position (x as a fraction of the screen width, y as a fraction of the screen height)—this avoids the viewport transformation calculation but requires the receiver to know the sender's screen resolution to position the cursor on the shared canvas. Canvas coordinates are more meaningful for a shared infinite canvas and avoid the screen resolution assumption.</p>
        <p>Label collision avoidance: when many collaborators are in the same area, name labels can overlap. Simple label positioning (label follows cursor at a fixed offset) produces readable results for under 10 collaborators in an area. For higher densities, a force-directed label positioning algorithm (labels repel each other) produces cleaner results but requires O(N²) computation per frame. The practical approach: use fixed offset by default, and only apply collision avoidance when labels actually overlap (detected by bounding box intersection). For most collaborative sessions (under 20 people in the same viewport area), the overlap case is rare enough that simple fixed-offset positioning is sufficient.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A cursor-sharing system is a high-frequency, loss-tolerant pub/sub system that broadcasts collaborator cursor positions in canvas coordinates at 30Hz. The binary message format (16 bytes per update) keeps bandwidth to approximately 95KB/s per client for 200 collaborators. Server-side relay is a pure binary forward (no parsing) for minimal latency. Client-side interpolation (linear lerp between received positions, running at 60Hz via requestAnimationFrame) produces smooth visual movement from 30Hz delivery. Viewport transformation (canvasCoord → screenPixel) is performed per-receiver using their current pan/zoom state, keeping the system coordinate-system-agnostic. Edge indicators show directional arrows for out-of-viewport collaborators. Cursor inactivity (30 seconds no movement) fades the cursor out and stops transmission. Server disconnect events clean up ghost cursors immediately. The system is intentionally separate from document state synchronization: different quality-of-service requirements (loss-tolerant, no persistence, pure broadcast) warrant a different technical approach optimized for throughput over reliability.</p>
      </section>
    </ArticleLayout>
  );
}
