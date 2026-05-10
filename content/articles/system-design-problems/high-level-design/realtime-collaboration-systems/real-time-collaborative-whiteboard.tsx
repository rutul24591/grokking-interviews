"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-real-time-collaborative-whiteboard",
  title: "Design a Real-Time Collaborative Whiteboard (Miro/Figma Style)",
  description:
    "Architecture for a multiplayer infinite canvas: CRDT-based conflict resolution, operational transform, WebSocket delivery, viewport culling, and performance at scale.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "real-time-collaborative-whiteboard",
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-10",
  tags: ["hld", "whiteboard", "collaborative", "CRDT", "OT", "canvas", "WebSocket"],
  relatedTopics: ["collaborative-editor", "cursor-sharing-system"],
};

export default function RealTimeCollaborativeWhiteboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A collaborative whiteboard is an infinite canvas where multiple users can simultaneously create, move, resize, and delete shapes, sticky notes, images, and freehand drawings. The defining technical challenges are: concurrent edit conflict resolution (two users moving the same shape simultaneously must not produce inconsistent results), low-latency local feedback (the user must see their own edits immediately, before the server acknowledges them), scalable presence (a whiteboard with 50 simultaneous participants must show all 50 cursors without overwhelming the rendering pipeline), and performance on a potentially infinite canvas with hundreds of objects (only objects within the viewport should be rendered).</p>
        <p>The distinction from a collaborative text editor (Google Docs) is the spatial nature of the data: shapes have position, size, and z-order (stacking layer). Moving a shape is not analogous to inserting text—there is no sequence index to track. Two users moving the same shape to different positions creates a conflict that must be resolved. The conflict resolution strategy (last-write-wins, or a more sophisticated CRDT that preserves intent) determines whether the collaborative experience is trustworthy.</p>
        <p><strong>Explicit assumptions:</strong> Canvas objects are discrete entities (shapes, sticky notes, images, connectors) with unique IDs, not a continuous spatial grid. Each object has: id, type, position (x, y), size (width, height), z-index, content, style, ownerId, createdAt, updatedAt. Object operations are: create, move, resize, restyle, delete. Concurrent moves of the same object resolve by last-write-wins (the most recent server timestamp wins). The canvas is infinite; the viewport is a bounded window over the canvas. Maximum 100 concurrent participants per board.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Multi-user editing:</strong> Multiple users can create, move, resize, and delete objects simultaneously. All participants see each other's changes in real-time.</li>
          <li><strong>Optimistic local editing:</strong> The user sees their own edits immediately, without waiting for server confirmation. Server-confirmed state reconciles with local state on receipt.</li>
          <li><strong>Cursor presence:</strong> Each participant's cursor position is broadcast and displayed on other participants' canvases as a named, colored cursor.</li>
          <li><strong>Undo/Redo:</strong> Each user has their own undo/redo history. Undoing an operation reverses the user's own action, even if other users have since modified the affected object.</li>
          <li><strong>Selection and locking:</strong> When a user selects an object for editing, other users see the object as "selected by [Name]" and cannot move it simultaneously (soft lock).</li>
          <li><strong>Persistence:</strong> The board state is persisted server-side. Rejoining the board restores the complete current state. History of all operations is preserved for audit and time-travel.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Edit latency:</strong> Local edits visible immediately (0ms local, optimistic). Remote edits visible within 100ms of the source user's action.</li>
          <li><strong>Canvas performance:</strong> 60fps rendering with up to 10,000 objects on the canvas, of which at most ~100 are in any given viewport.</li>
          <li><strong>Scale:</strong> Up to 100 concurrent participants per board. Up to 1 million boards per deployment.</li>
          <li><strong>Consistency:</strong> After all participants disconnect and reconnect, all clients must converge to the same board state.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The whiteboard system uses an operation-based architecture: rather than sending full object state on every change, clients send operations (move object X to position (100, 200), resize object Y to width 300). The server applies operations to the authoritative board state, broadcasts to other connected clients, and appends to an operation log for persistence and history. This operation-based approach is more bandwidth-efficient than state-based sync (sending the entire board state on every change) and enables undo/redo (by recording and replaying operations in reverse).</p>
        <p>Each board is assigned to a Board Session Server—a stateful WebSocket server that maintains the in-memory board state and the list of connected participants. The Board Session Server is the hub for all real-time operations on a board: it receives operations from clients, applies them to the in-memory state, broadcasts to all other connected clients, and persists operations to the database asynchronously. A single server per board avoids the distributed coordination problem of multi-server ordering, at the cost of requiring board migration when a server goes down (handled by reassigning the board to another server with state reload from the database).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/real-time-collaborative-whiteboard-architecture.svg"
          alt="Collaborative whiteboard architecture showing client (optimistic local state, operation queue, viewport culling renderer), Board Session Server (in-memory board state, operation sequencer, WebSocket broadcast to all participants), operation log persistence (PostgreSQL append-only operations table), cursor presence channel (separate lightweight WebSocket), and board migration on server failure."
          caption="Whiteboard architecture: Board Session Server per board, operation-based sync, optimistic local state, and separate cursor presence channel"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operation Model and Conflict Resolution</h3>
        <p>Every user action produces a typed operation: CreateObject, MoveObject, ResizeObject, RestyleObject, DeleteObject, SetContent. Each operation carries a clientId (the client that generated it), a sequenceNumber (monotonically increasing per client), a timestamp, and the operation's payload (for MoveObject: objectId, fromPosition, toPosition). Operations are sent to the Board Session Server via WebSocket. The server assigns a globalSequenceNumber (monotonically increasing across all operations on the board) and broadcasts the operation with the global sequence number to all clients.</p>
        <p>Conflict resolution for concurrent moves: if two clients simultaneously send MoveObject for the same objectId (both clients moved the shape before either received the other's move), the server resolves by last-write-wins using the globalSequenceNumber—the operation with the higher global sequence number wins. The client whose operation lost receives the server's canonical state and must reconcile: if the client already applied its own move optimistically, it reverses the optimistic move and applies the server's outcome. This reconciliation is the core of operational transform for spatial objects.</p>
        <p>Operational transform (OT) would allow both moves to be intelligently merged (both users' intent is preserved by composing the transforms). For spatial objects, OT is less natural than for text (there is no composition of two moves to the same object that preserves both intents—the object can only be in one position). Last-write-wins is the pragmatic choice for spatial operations and is what Miro and Figma use. CRDTs (Conflict-free Replicated Data Types) apply more naturally to the object set (creating and deleting objects can use add-wins CRDT semantics, ensuring that concurrent create and delete of the same object always resolves to the create surviving, if desired).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Local State and Reconciliation</h3>
        <p>The client maintains two state representations: the confirmed state (the last board state acknowledged by the server, built by applying all operations up to the latest received globalSequenceNumber) and the optimistic state (the confirmed state plus any locally-generated operations not yet confirmed by the server). The canvas renders the optimistic state, giving the user instant visual feedback for their own edits.</p>
        <p>When the server broadcasts a new operation (either the client's own operation confirmed, or another client's operation), the client reconciles. If the received operation is the client's own (matched by clientId + clientSequenceNumber), it moves from optimistic to confirmed. If it is another client's operation, the client applies it to the confirmed state and recomputes the optimistic state by re-applying the client's pending (unconfirmed) operations on top. This recomputation is necessary because another client's operation may conflict with a pending local operation, and the conflict must be resolved using the server's ordering.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Viewport Culling and Canvas Rendering</h3>
        <p>The canvas can contain 10,000+ objects, but the user's viewport shows only a bounded rectangle. Rendering all 10,000 objects on every frame—most of which are not visible—is wasteful. Viewport culling filters the object list to only those whose bounding boxes intersect the current viewport before each render. At a typical viewport size (1920×1080) and typical object density, only 50–200 objects are in the viewport at any zoom level.</p>
        <p>Culling is implemented using a spatial index: an R-tree or a quadtree partitions the canvas space and supports efficient range queries (which objects intersect this viewport rectangle?). The spatial index is updated whenever an object is moved, resized, created, or deleted. Query cost is O(log N + k) where k is the number of results, making it efficient even for large object counts. The spatial index lives in client memory (not on the server); the server's canonical state is a flat map from objectId to object data.</p>
        <p>Rendering uses HTML canvas (not SVG): at 10,000 objects, SVG DOM nodes would be prohibitively expensive for style recalculation and layout. The canvas renderer issues draw calls for each visible object in z-index order. For complex objects (rich text sticky notes, embedded images), the canvas uses OffscreenCanvas to pre-render the object once and then blit (copy) the pre-rendered image to the main canvas on each frame, avoiding redundant re-rendering of unchanged complex objects. This caching strategy reduces per-frame rendering cost dramatically for static objects.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cursor Presence Architecture</h3>
        <p>Cursor position is the highest-frequency real-time event in the system: 60 cursor position updates per second per participant × 100 participants = 6,000 events per second per board. These events must not be routed through the operation log (they do not need to be persisted or ordered globally). A separate lightweight cursor channel handles this: cursor positions are broadcast via the same WebSocket connection but on a dedicated message type that the Board Session Server routes directly to all other participants without persistence or sequencing. The server acts as a pub/sub relay for cursor events.</p>
        <p>Cursor positions are transmitted in canvas coordinates (not screen pixels), so each participant's client transforms the received canvas coordinate to their own screen coordinate for rendering. This correctly handles participants at different zoom levels and viewport positions: a cursor at canvas position (500, 300) renders at different screen positions for each participant depending on their current pan and zoom. The transformation is: screenX = (canvasX - viewportX) × zoomLevel.</p>
        <p>Cursor events are throttled client-side to 30Hz (every 33ms) using requestAnimationFrame, even if the mouse is moving at 60fps. Receiving clients interpolate cursor positions between received events (linear interpolation over the 33ms interval) for smooth visual display. At 100 participants × 30Hz × (objectId, x, y) payload, cursor traffic is approximately 100 × 30 × 12 bytes = 36KB/s per client receiving all cursors—manageable on modern connections.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Undo/Redo in a Collaborative Context</h3>
        <p>Undo in a single-user context is trivial (pop the last operation, apply its inverse). In a collaborative context, undo is more complex: user A creates an object, user B moves it, user A undoes their create—the object should be deleted, even though user B has since moved it. The correct behavior is to undo user A's operation regardless of what user B has done since. This requires selective undo: undoing a specific operation in the operation log, not necessarily the most recent operation.</p>
        <p>The implementation: each client maintains its own operation history (the sequence of operations the client has sent). Undo applies the inverse of the latest client operation (DeleteObject for a CreateObject, the original position for a MoveObject). The inverse operation is sent to the server as a new operation (not a special "undo" message), ensuring it goes through the same ordering and broadcast as any other operation. This approach works correctly even when the operation to be undone is not the most recent global operation—the inverse is applied to the current state, not to the state at the time of the original operation. For moves and resizes, the "inverse" is the operation's fromPosition/fromSize (the position before the move). For creates, the inverse is DeleteObject. For deletes, the inverse is CreateObject with the deleted object's stored data.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Board State Bootstrap and Persistence</h3>
        <p>When a client joins a board, it must receive the complete current board state before it can participate in real-time editing. The Board Session Server sends the full board state as a snapshot (all objects and their current values) plus the current globalSequenceNumber. Subsequent WebSocket messages (new operations) include globalSequenceNumbers greater than the snapshot's sequence number. The client applies the snapshot, then applies any buffered operations received during the snapshot fetch (operations received while waiting for the snapshot but with sequence numbers above the snapshot's).</p>
        <p>Board state persistence uses an operation log pattern: every operation is appended to a database table (boardId, globalSequenceNumber, operationData, timestamp). The current board state can be reconstructed by replaying all operations from the beginning. For performance, a periodic snapshot (a full board state serialized to S3 at every 1000 operations) allows the board to be reconstructed from the nearest snapshot plus the subsequent operations, rather than replaying the entire history. Board loading: load the latest snapshot, then replay operations since the snapshot's sequence number. This bootstrap is the same process used when a Board Session Server crashes and a replacement server must reload a board's state.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/real-time-collaborative-whiteboard-workflow.svg"
          alt="Whiteboard operation flow showing optimistic local apply → WebSocket send to Board Session Server → server sequence assignment → broadcast to all participants → client reconciliation (confirmed state update, optimistic re-apply). Conflict resolution for concurrent MoveObject shown. Cursor presence separate channel. Board state bootstrap on join."
          caption="Whiteboard operation flow: optimistic local apply, server sequencing, broadcast, and client reconciliation with conflict resolution"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Stateful server per board versus stateless distributed approach: assigning each board to a single stateful server simplifies ordering (no distributed consensus needed for global sequence numbers) and avoids the latency of cross-server coordination for real-time operations. The trade-off is that a server failure requires board migration—loading the board state from the database on a replacement server, which takes 1–5 seconds during which the board is unavailable. For a system serving millions of boards, the server failure rate and the impact of brief unavailability per board must be weighed against the complexity of a distributed approach (using a distributed log like Kafka for operation ordering, which would eliminate the single-server bottleneck at the cost of higher per-operation latency).</p>
        <p>Last-write-wins versus CRDT for object sets: using last-write-wins for concurrent moves is simple and predictable. The user whose move "lost" sees their object snap back to the server position, which is slightly jarring but clearly communicates that a conflict occurred. A CRDT approach for object creation and deletion (add-wins CRDT) is more complex but prevents the "concurrent create and delete" anomaly where one client creates an object and another immediately deletes it, and the outcome depends on which operation reaches the server first. For most whiteboard use cases, last-write-wins is acceptable; teams building legal/contractual boards may need stronger consistency guarantees.</p>
        <p>Canvas rendering library choice: building a canvas renderer from scratch provides maximum control over culling, caching, and render order, but requires significant engineering investment. Libraries like Konva.js (React wrapper for canvas), Fabric.js, and Pixi.js provide built-in rendering, event handling, and some object management. The trade-off is that library abstractions may not expose the fine-grained control needed for optimal performance (OffscreenCanvas caching, custom culling strategies). Figma's and Miro's renderers are custom-built for exactly this reason: the performance requirements of a production whiteboard exceed what general-purpose canvas libraries can provide without extensive modification.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A real-time collaborative whiteboard uses a per-board stateful Board Session Server to sequence and broadcast operations (CreateObject, MoveObject, ResizeObject, DeleteObject), eliminating distributed coordination complexity. Clients apply operations optimistically (immediate local feedback) and reconcile with the server's canonical ordering on receipt of broadcasts. Conflict resolution for concurrent spatial edits uses last-write-wins by global sequence number. Cursor presence is handled on a separate lightweight channel (throttled to 30Hz, transmitted in canvas coordinates). Canvas rendering uses an R-tree spatial index for viewport culling and OffscreenCanvas caching for complex objects, maintaining 60fps with 10,000+ canvas objects. Undo sends inverse operations as new operations (preserving collaborative ordering). Board state persistence uses an operation log with periodic snapshots (every 1000 operations) for fast bootstrap. The fundamental architectural choice—stateful server per board versus distributed ordering—trades operational simplicity against single-server failure impact, with the stateful approach being correct for most production scales.</p>
      </section>
    </ArticleLayout>
  );
}
