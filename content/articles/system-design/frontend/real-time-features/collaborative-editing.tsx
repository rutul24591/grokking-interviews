"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "collaborative-editing",
  title: "Collaborative Editing (Operational Transform, CRDT)",
  description:
    "Comprehensive guide to real-time collaborative editing — covering Operational Transformation algorithms, Conflict-free Replicated Data Types, cursor and selection synchronization, undo/redo in multiplayer contexts, and production architectures used by Google Docs, Figma, and Notion.",
  category: "frontend",
  subcategory: "real-time-features",
  slug: "collaborative-editing",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-01",
  tags: [
    "collaborative-editing",
    "OT",
    "CRDT",
    "operational-transform",
    "real-time-collaboration",
    "multiplayer",
  ],
  relatedTopics: ["websockets", "webrtc", "presence-systems"],
};

export default function CollaborativeEditingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Collaborative editing</strong> enables multiple users to
          simultaneously modify the same document, design, spreadsheet, or
          data structure while seeing each other&apos;s changes in real-time.
          The core technical challenge is <strong>conflict resolution</strong>:
          when two users concurrently edit the same region of a document, the
          system must merge their changes in a way that preserves both
          users&apos; intent, produces a consistent result on all clients, and
          does so without requiring explicit coordination (locks, turns, or
          manual merge steps). Two foundational algorithms address this
          challenge: <strong>Operational Transformation (OT)</strong> and{" "}
          <strong>Conflict-free Replicated Data Types (CRDTs)</strong>.
        </p>
        <p className="mb-4">
          <strong>Operational Transformation</strong>, pioneered at Xerox PARC
          in 1989 and famously implemented in Google Docs, works by
          transforming operations against each other. When user A inserts
          &quot;hello&quot; at position 5 and user B simultaneously deletes
          character at position 3, the OT algorithm transforms A&apos;s
          operation to account for B&apos;s deletion (adjusting the insert
          position to 4) and vice versa. The transformed operations can then
          be applied in any order and produce the same result. OT requires a
          central server to determine the canonical operation order and
          perform transformations, which simplifies correctness reasoning but
          introduces a single point of coordination.
        </p>
        <p className="mb-4">
          <strong>CRDTs</strong> take a fundamentally different approach:
          instead of transforming operations, they design the data structure
          itself so that concurrent operations are inherently commutative —
          they can be applied in any order and always converge to the same
          state without any transformation or coordination. For text editing,
          CRDTs like Yjs (based on YATA), Automerge (based on RGA), and
          Diamond Types assign each character a unique, totally ordered
          identifier that determines its position regardless of when or where
          the insertion happened. This eliminates the need for a central
          server — CRDTs can work in peer-to-peer architectures, tolerate
          arbitrary network partitions, and merge changes even after days of
          offline editing. However, CRDT identifiers add metadata overhead (
          typically 2-5x the raw document size in memory) and the algorithms
          are more complex to implement correctly.
        </p>
        <p>
          For staff and principal engineers, collaborative editing is one of
          the most demanding distributed systems problems in frontend
          engineering. It requires reasoning about concurrent operations,
          causal ordering, intention preservation, and convergence guarantees —
          all while maintaining the illusion of instant local responsiveness.
          The user types a character and sees it appear immediately (local
          optimism), then the system asynchronously reconciles that character
          with operations from other users, potentially adjusting its position
          or merging it with conflicting edits. This local-first, eventually
          consistent architecture is becoming a design pattern beyond just text
          editing: Figma uses CRDTs for design files, Notion uses them for
          block-structured documents, and Linear uses them for issue tracker
          state.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/real-time-features/collaborative-editing-diagram-1.svg"
        alt="Operational Transformation showing concurrent edits being transformed against each other to preserve intent and achieve convergence"
        caption="Figure 1: Operational Transformation — concurrent edit resolution through transformation"
      />

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operational Transformation (OT)
        </h3>
        <p className="mb-4">
          OT represents document changes as operations: insert(position,
          character), delete(position), and retain(count) for text documents.
          The key algorithm is the <strong>transform function</strong>{" "}
          <code>transform(op1, op2) → (op1&apos;, op2&apos;)</code> that
          takes two concurrent operations and produces transformed versions
          such that applying op1 then op2&apos; produces the same state as
          applying op2 then op1&apos;. For Google Docs-style editing, the
          server acts as the single source of truth: it receives operations
          from clients, assigns them a sequential version number, transforms
          them against any operations that the client has not yet seen, and
          broadcasts the transformed operations to all clients. Each client
          maintains three states: the server-acknowledged state, a pending
          operation buffer (sent to server but not yet acknowledged), and local
          optimistic state (applied locally but not yet sent). This three-state
          model enables instant local editing while maintaining eventual
          consistency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Conflict-free Replicated Data Types (CRDTs)
        </h3>
        <p className="mb-4">
          CRDTs achieve consistency without transformation by embedding
          conflict resolution into the data structure itself. For text, each
          character receives a unique identifier that encodes its position
          relative to its neighbors. The YATA algorithm (used by Yjs) assigns
          each insertion an ID consisting of a client ID and a logical clock
          value, plus references to the left and right neighbors at the time
          of insertion. When concurrent insertions target the same position,
          the IDs provide a deterministic ordering rule (typically: lower
          client ID wins the left position). Because this ordering is
          determined solely by the IDs (which are globally unique and
          immutable), any replica can apply operations in any order and arrive
          at the same document state. Deletions are handled as tombstones
          (marking characters as deleted rather than removing them) to
          preserve the ordering structure. The trade-off is metadata overhead:
          each character carries its ID, references, and tombstone flag,
          increasing memory usage compared to a plain string.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cursor and Selection Synchronization
        </h3>
        <p className="mb-4">
          In collaborative editing, each user&apos;s cursor position and text
          selection must be visible to all other collaborators. Cursor
          positions are typically represented as document offsets (character
          index) or, in CRDT systems, as references to specific character
          IDs. The challenge is that cursor positions must be transformed along
          with document operations: if user A&apos;s cursor is at position 10
          and user B inserts 5 characters at position 3, A&apos;s cursor must
          shift to position 15. In OT systems, cursor positions are
          transformed using the same transform function as document operations.
          In CRDT systems, cursors reference character IDs that are stable
          across concurrent edits. Cursor updates are broadcast as ephemeral
          presence data (via WebSocket), not persisted in the document state,
          and are rendered as colored carets with the collaborator&apos;s name
          label. Selection ranges are represented as two cursor positions
          (anchor and focus) and highlighted with the collaborator&apos;s
          assigned color.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Undo/Redo in Collaborative Contexts
        </h3>
        <p className="mb-4">
          Undo in a collaborative editor is fundamentally different from
          single-user undo. In a single-user editor, undo reverses the last
          operation. In a collaborative editor, undoing your last operation
          must only reverse <em>your</em> change, not changes made by other
          users since then. This requires <strong>selective undo</strong>:
          inverting a specific operation and transforming the inverse against
          all operations that occurred after it. In OT, this is implemented by
          maintaining per-user operation history and computing inverse
          operations that are then transformed against the current document
          state. In CRDT systems, undo is typically implemented as a new
          forward operation that reverses the effect (re-inserting deleted
          characters or deleting inserted ones), which naturally integrates
          with the CRDT&apos;s conflict resolution. Both approaches must handle
          the case where the undone operation has been partially overwritten by
          other users — undoing an insertion that another user has since edited
          must preserve the other user&apos;s changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Awareness and Presence in Editors
        </h3>
        <p className="mb-4">
          Beyond cursor synchronization, collaborative editors implement rich
          awareness features: who is currently viewing the document, which
          section each person is looking at (viewport awareness), who is
          actively typing versus passively reading, and which elements are
          being selected or manipulated. This awareness data is separate from
          the document state — it is ephemeral, high-frequency, and does not
          need conflict resolution or persistence. Libraries like Yjs provide
          an <strong>awareness protocol</strong> that uses a gossip-based
          approach: each client periodically broadcasts its awareness state
          (cursor position, selection, viewport, custom metadata), and other
          clients merge these updates with timeout-based cleanup for
          disconnected users. The awareness layer is what transforms a
          collaborative editor from a shared document into a shared
          <em> experience</em> — it creates the sense of working together.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          The architecture of a collaborative editor depends heavily on
          whether it uses OT (requiring a central server for transformation)
          or CRDTs (enabling peer-to-peer or server-optional architectures).
          Both approaches share the pattern of local-first editing with
          asynchronous synchronization.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/collaborative-editing-diagram-2.svg"
          alt="OT vs CRDT architecture comparison showing centralized server coordination for OT and decentralized peer-to-peer for CRDT"
          caption="Figure 2: OT (centralized) vs CRDT (decentralized) collaboration architectures"
        />

        <p className="mb-4">
          In the OT architecture (Google Docs model), the server maintains the
          authoritative document state and a version counter. Clients send
          operations to the server, which assigns version numbers, transforms
          operations against any concurrent operations the client has not seen,
          and broadcasts transformed operations to all clients. The server
          is the bottleneck: all operations must pass through it, but this
          simplifies correctness reasoning and enables server-side features
          like revision history and access control. In the CRDT architecture,
          each client maintains a full replica of the document state. Operations
          are applied locally and then broadcast to other clients (via a
          server relay, peer-to-peer, or even exchanged offline via file).
          Each client independently merges received operations using the
          CRDT&apos;s built-in conflict resolution. No central authority is
          needed, enabling offline editing, partition tolerance, and
          peer-to-peer collaboration.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>
        <p className="mb-4">
          OT and CRDTs represent fundamentally different design philosophies
          for collaborative editing. The following comparison highlights their
          trade-offs across key engineering dimensions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme px-4 py-2 text-left">
                  Dimension
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Operational Transformation
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  CRDTs
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Server Dependency
                </td>
                <td className="border border-theme px-4 py-2">
                  Requires central server for transformation and ordering
                </td>
                <td className="border border-theme px-4 py-2">
                  Server optional — works peer-to-peer or offline
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Memory Overhead
                </td>
                <td className="border border-theme px-4 py-2">
                  Low — document stored as plain text with operation log
                </td>
                <td className="border border-theme px-4 py-2">
                  High — each character carries unique ID metadata (2-5x)
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Offline Support
                </td>
                <td className="border border-theme px-4 py-2">
                  Limited — operations queue until server is reachable
                </td>
                <td className="border border-theme px-4 py-2">
                  Native — changes merge automatically on reconnect
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Correctness Complexity
                </td>
                <td className="border border-theme px-4 py-2">
                  High — transform functions must handle all operation
                  combinations correctly
                </td>
                <td className="border border-theme px-4 py-2">
                  Mathematical guarantees — convergence is a property of the
                  data structure
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Scalability
                </td>
                <td className="border border-theme px-4 py-2">
                  Server is bottleneck — all ops pass through it
                </td>
                <td className="border border-theme px-4 py-2">
                  Naturally distributed — no central bottleneck
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Industry Adoption
                </td>
                <td className="border border-theme px-4 py-2">
                  Google Docs, Microsoft Office Online
                </td>
                <td className="border border-theme px-4 py-2">
                  Figma, Notion, Linear, Apple Notes, Liveblocks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Use an established CRDT library (Yjs, Automerge) rather than
            implementing your own — the correctness proofs for collaborative
            editing algorithms are non-trivial, and subtle bugs manifest only
            under specific concurrent edit patterns that are difficult to
            reproduce in testing
          </li>
          <li>
            Apply operations locally first, then sync — the user must see
            their keystroke immediately (under 16ms to maintain 60fps input
            responsiveness). Never wait for a server round-trip before updating
            the local view
          </li>
          <li>
            Implement awareness (cursor synchronization, viewport tracking)
            as a separate channel from document operations — awareness data
            is ephemeral and high-frequency, while document operations require
            guaranteed delivery and ordering
          </li>
          <li>
            Use WebSocket for the synchronization transport with automatic
            reconnection and operation buffering — when the connection drops,
            queue local operations and replay them on reconnection
          </li>
          <li>
            Implement document snapshots at regular intervals (every N
            operations or every M minutes) to speed up document loading — new
            clients load the latest snapshot and then apply operations since
            the snapshot, rather than replaying the entire operation history
          </li>
          <li>
            Design your data model for collaboration from the start —
            retrofitting collaboration onto an existing editor is significantly
            harder than building it in. Choose a document model (plain text,
            rich text, block-structured, tree) that aligns with your CRDT or
            OT implementation
          </li>
          <li>
            Test with chaos engineering: simulate network partitions, delayed
            messages, message reordering, and clients editing the same word
            simultaneously. Convergence bugs only appear under these conditions
          </li>
          <li>
            Implement conflict markers for semantically incompatible changes
            (two users changing the same cell formula in a spreadsheet) even
            if the CRDT handles syntactic convergence — users need to know
            when their intent may have been violated
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Building your own OT/CRDT from scratch</strong> —
            collaborative editing algorithms have decades of research behind
            them. Even Google has publicly discussed bugs in their OT
            implementation that took years to discover. Use battle-tested
            libraries
          </li>
          <li>
            <strong>Conflating document state with view state</strong> —
            cursor positions, selection ranges, and scroll positions are
            ephemeral view state that should not be stored in the CRDT
            document. Mixing them creates unnecessary metadata bloat and
            conflict resolution complexity
          </li>
          <li>
            <strong>Unbounded operation history</strong> — without periodic
            garbage collection (compaction/snapshotting), the operation log
            grows indefinitely. For CRDTs, tombstoned deletions accumulate
            and degrade performance. Implement periodic compaction that
            replaces the operation log with a snapshot
          </li>
          <li>
            <strong>Single-user undo semantics</strong> — implementing undo
            as &quot;reverse the last operation&quot; in a collaborative
            context undoes other users&apos; changes, not just the local
            user&apos;s. Always implement per-user selective undo
          </li>
          <li>
            <strong>Ignoring the awareness layer</strong> — a collaborative
            editor without cursor visibility feels like editing a haunted
            document where text appears and changes without visible cause.
            Cursor and selection synchronization is essential for the
            collaborative experience
          </li>
          <li>
            <strong>Late integration of collaboration</strong> — attempting
            to add real-time collaboration to an existing single-user editor
            by wrapping it in a CRDT layer often fails because the editor&apos;s
            internal data model and change representation are not designed
            for concurrent operations
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Google Docs: The OT Pioneer
        </h3>
        <p className="mb-4">
          Google Docs is the most widely known OT-based collaborative editor,
          handling billions of concurrent editing sessions. Their
          implementation uses a server-authoritative model where the Google
          server is the single point of coordination for each document. Each
          keystroke generates an operation that is applied locally and sent to
          the server. The server transforms the operation against any
          concurrent operations from other users and broadcasts the
          transformed result. Google&apos;s OT implementation handles rich
          text (bold, italic, fonts, colors), table structures, images, and
          embedded objects — each requiring specialized transform functions.
          Their revision history system stores periodic snapshots with the
          complete operation log between snapshots, enabling the
          &quot;Version History&quot; feature that lets users browse and
          restore any point in the document&apos;s editing history.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Figma: CRDT for Visual Design
        </h3>
        <p className="mb-4">
          Figma uses a custom CRDT implementation for their collaborative
          design tool, handling a fundamentally different data model than text
          editors: a tree of visual objects (frames, shapes, text, images)
          with properties (position, size, fill, stroke, effects). Each
          property change is a CRDT operation. Concurrent edits to different
          properties of the same object merge naturally (user A changes the
          fill color while user B moves the shape). Conflicting edits to the
          same property (both users changing the fill color) resolve using
          last-writer-wins with client ID tiebreaking. Figma&apos;s
          implementation is notable for its performance optimization:
          they use a binary encoding for operations (not JSON), incremental
          synchronization (sending only changed properties, not full object
          state), and WebAssembly for the CRDT merge logic on the client.
          Their server acts as a relay and persistence layer, not a
          transformation authority — the CRDT handles convergence without
          server involvement.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Notion: Block-Structured CRDT
        </h3>
        <p className="mb-4">
          Notion&apos;s collaborative editing operates on a block-structured
          document model where each paragraph, heading, list item, toggle,
          database row, and embedded block is a discrete CRDT element. Their
          approach uses a combination of block-level CRDTs (for structural
          changes like reordering, nesting, and type conversion) and
          character-level CRDTs within text blocks (for concurrent text
          editing). This hybrid approach allows Notion to support their
          unique document model — where a page is a tree of heterogeneous
          blocks that can be rearranged, nested, and transformed between
          types — while maintaining real-time collaborative editing within
          any text block. Notion&apos;s offline support leverages the CRDT
          property: users can edit offline, and changes merge automatically
          when connectivity returns, even if other users have made extensive
          changes in the interim.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/collaborative-editing-diagram-3.svg"
          alt="CRDT character insertion showing unique IDs, position references, and convergence across concurrent inserts by multiple users"
          caption="Figure 3: CRDT text insertion with unique character IDs and convergence"
        />
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the fundamental difference between OT and CRDTs for
              collaborative editing.
            </p>
            <p className="mt-2 text-sm">
              OT resolves conflicts by transforming operations: when two users
              make concurrent edits, a transform function adjusts each operation
              to account for the other, requiring a central server to determine
              operation order. CRDTs resolve conflicts by designing the data
              structure so that concurrent operations are inherently commutative
              — they produce the same result regardless of application order.
              OT is algorithmically simpler but operationally complex (central
              server). CRDTs are mathematically elegant but have higher memory
              overhead (unique IDs per character) and work without a central
              coordinator, enabling offline and P2P collaboration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does a CRDT handle two users inserting text at the same
              position simultaneously?
            </p>
            <p className="mt-2 text-sm">
              Each character gets a globally unique ID (client ID + logical
              clock). When two users insert at the same position, both
              characters reference the same left and right neighbors. The CRDT
              uses the unique IDs to deterministically order them — typically,
              the lower client ID goes first. Because this ordering rule is
              built into the data structure and depends only on immutable IDs,
              every replica independently arrives at the same ordering. There is
              no need for communication or coordination to resolve the conflict
              — it is resolved by the mathematical properties of the IDs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement undo in a collaborative editor?
            </p>
            <p className="mt-2 text-sm">
              Undo must be per-user selective undo: reversing only the current
              user&apos;s operations without affecting other users&apos;
              concurrent changes. Maintain a per-user operation stack. On undo,
              compute the inverse of the user&apos;s last operation, transform
              it against all operations that occurred after it (in OT), and
              apply the transformed inverse as a new forward operation. In
              CRDTs, undo reinserts tombstoned characters or deletes inserted
              ones, creating new operations that merge naturally with the
              CRDT state. The key insight is that undo is a new operation, not
              a state rollback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design a collaborative editor that supports
              offline editing?
            </p>
            <p className="mt-2 text-sm">
              Use a CRDT-based approach (Yjs, Automerge). Each client maintains
              a full document replica. Operations are applied locally
              immediately. When offline, operations accumulate in a local
              buffer. On reconnection, buffered operations are sent to the
              server (or directly to peers). The CRDT guarantees that merging
              these operations with any changes made by online users produces
              a consistent result — no conflicts, no data loss. The server
              stores the merged state. OT is poorly suited for offline editing
              because the transform function requires knowledge of concurrent
              operations in order, which is unavailable during disconnection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the performance challenges of CRDTs for large
              documents, and how are they mitigated?
            </p>
            <p className="mt-2 text-sm">
              CRDTs have three main performance challenges: (1) metadata
              overhead — each character carries a unique ID, increasing memory
              2-5x; (2) tombstone accumulation — deleted characters are marked,
              not removed, causing memory growth over time; (3) operation replay
              — loading a document requires replaying all operations from the
              snapshot. Mitigations: periodic garbage collection to remove
              tombstones (when all replicas confirm they have seen the
              deletion), periodic snapshots to avoid full replay on load, binary
              encoding for compact wire format, and lazy loading of document
              sections for large documents.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you synchronize cursor positions across collaborators?
            </p>
            <p className="mt-2 text-sm">
              Cursors are represented as document positions (character index in
              OT, character ID reference in CRDTs). Each client broadcasts
              cursor position via a lightweight presence channel (WebSocket) at
              throttled intervals (on change, max once per 50-100ms). In OT,
              cursor positions must be transformed alongside document operations
              — when a character is inserted before the cursor, the position
              shifts. In CRDTs, referencing a character ID provides stable
              positioning regardless of concurrent edits. Cursors are rendered
              as colored carets with name labels. Selection ranges are two
              cursor positions. These are ephemeral — they are not stored in
              the document and disappear when a user disconnects.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://dl.acm.org/doi/10.1145/67449.67457"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;A Comprehensive Study of Convergence in Distributed
              Editing&quot; — Ellis and Gibbs (1989), foundational OT paper
            </a>
          </li>
          <li>
            <a
              href="https://github.com/yjs/yjs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Near Real-Time Peer-to-Peer Shared Editing on Extensible
              Data Types&quot; — YATA/Yjs research paper
            </a>
          </li>
          <li>
            <a
              href="https://docs.yjs.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yjs documentation — popular CRDT library for collaborative editing
            </a>
          </li>
          <li>
            <a
              href="https://automerge.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Automerge documentation — JSON-like CRDT library with rich data
              type support
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=9L8cT0q1Y8c"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;CRDTs: The Hard Parts&quot; by Martin Kleppmann — talk on
              practical CRDT challenges
            </a>
          </li>
          <li>
            <a
              href="https://www.figma.com/blog/how-figmas-multiplayer-technology-works/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;How Figma&apos;s Multiplayer Technology Works&quot; — Figma
              Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://liveblocks.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Liveblocks documentation — managed collaborative editing
              infrastructure with CRDT support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
