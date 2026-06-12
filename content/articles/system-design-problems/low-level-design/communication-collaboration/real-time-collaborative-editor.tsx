"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-real-time-collaborative-editor",
  title: "Design a Real-time Collaborative Editor",
  description:
    "LLD for a real-time collaborative editor: CRDTs vs OT, presence, live cursors, conflict resolution, offline-aware sync, and accessibility.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "real-time-collaborative-editor",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-30",
  tags: ["lld", "collaboration", "crdt", "ot", "real-time", "react"],
  relatedTopics: [
    "rich-text-editor",
    "live-cursor-presence-system",
    "conflict-resolution-ui",
    "collaborative-whiteboard",
  ],
};

export default function RealTimeCollaborativeEditorArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Real-time Collaborative Editor</h1><h2>Definition &amp; Context</h2><p>Design a Real-time Collaborative Editor is an implementation-heavy low-level design problem covering document operations, local transactions, CRDT or OT merge, awareness, offline queue, snapshots, undo, and reconnect. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Keep durable document operations separate from ephemeral awareness and local render projection. The core structures are document version, operation log, local queue, snapshot, CRDT state or OT transform, selection bookmark, awareness TTL, and reconnect cursor.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/real-time-collaborative-editor-runtime.svg" alt="Design a Real-time Collaborative Editor runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
          We are designing a real-time collaborative
          editor — multiple users editing the same
          document concurrently, seeing each other&rsquo;s
          changes and cursors live, with eventual
          consistency across all clients (Google Docs,
          Notion, Figma-style editors). The component
          sits on top of a base editor (the Rich Text
          Editor) and adds the synchronization layer.
          The hard work is the synchronization: how
          do conflicts resolve, how do disconnected
          users sync on reconnect, how do we minimize
          latency, how do we keep the document
          consistent regardless of network behavior.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The hard problems are: choosing between
          CRDTs and Operational Transformation (OT) —
          both work; CRDTs are easier to reason about
          in distributed settings, OT is more
          bandwidth-efficient; integrating with the
          base editor (ProseMirror, Lexical, Slate);
          live cursors and presence (the Live Cursor
          subsystem); offline-aware sync (queue
          changes locally, send on reconnect);
          conflict resolution that&rsquo;s deterministic
          across all clients; and accessibility for
          collaborative content (announcements when
          others edit).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users edit shared documents. They
          expect changes to appear smoothly across
          all viewers, with their own changes feeling
          local-instant. Engineering teams plug in:
          provide an editor, a sync engine (Yjs,
          Automerge, ShareJS), and the runtime
          handles connection lifecycle, presence,
          and integration.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend supports a real-time sync protocol
          (typically WebSocket with binary or JSON
          messages). A CRDT library (Yjs, Automerge)
          handles the document model. The base editor
          integrates with the CRDT (Yjs has bindings
          for ProseMirror, Slate, Quill, etc.).
          Modern browsers; we use WebSocket and
          IndexedDB for offline buffering.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the CRDT or OT
          algorithm from scratch. We do not implement
          the base editor (Rich Text Editor). We do
          not implement video/audio collaboration.
          End-to-end encryption is out of scope but
          accommodatable.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Multiple users edit the same document
          concurrently. Local edits appear instantly.
          Remote edits stream in and apply
          smoothly. Live cursors show where other
          users are editing. Presence list shows who
          is currently in the document. Connection
          status indicator (connected, reconnecting,
          offline). Offline mode: edits queue
          locally and sync on reconnect. Conflict
          resolution is deterministic (CRDT
          guarantees convergence). Document loads
          quickly even with long edit histories.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Comments anchored to text ranges. Suggestion
          mode (track changes). Version history with
          named versions. Restoring a previous
          version. Permissions (view-only,
          comment-only, editor). Real-time
          collaboration on rich content (images,
          embeds). Mention-driven invites.
          Read-only mode showing only viewers.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          From-scratch CRDT/OT implementation, the
          base editor, video/audio.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Local edits perceptibly instant. Remote
          edits apply within ~100 ms of arrival.
          Cursor updates at 60 fps. Document load
          under 2 s for typical sizes.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Convergence guaranteed: all clients
          eventually see the same document.
          Network blips don&rsquo;t lose edits.
          Disconnect/reconnect handled cleanly.
          Conflict resolution deterministic.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Authenticated WebSocket. Per-document
          authorization. Server validates edits
          server-side. End-to-end encryption
          accommodated via consumer integration.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Remote edits announce subtly via live
          region (chunked, not per-keystroke).
          Cursors of others have accessible
          labels. Presence list accessible. The
          base editor&rsquo;s accessibility
          preserved.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          CRDT library as a vendored dependency.
          Wrapper around base editor + CRDT
          binding. Plugins for cursors,
          comments, version history.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The editor uses a CRDT library (Yjs in
          our recommendation) as the underlying
          document model. The base editor (Rich
          Text Editor on ProseMirror or Lexical)
          binds to the CRDT via the library&rsquo;s
          provider. The provider handles network
          sync; the editor stays unaware of
          collaboration.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The <strong>CRDT document</strong> represents
          the document as a tree of nodes and
          marks (matching the editor&rsquo;s
          schema). Local edits produce CRDT
          operations; remote operations apply
          to the same document. CRDTs guarantee
          that any sequence of operations
          converges to the same state regardless
          of order — no central server is
          required for correctness, though one
          is used for relay and persistence.
        </HighlightBlock>
        <p>
          On <strong>local edit</strong>, the editor
          generates a CRDT operation; the
          provider sends it via WebSocket to the
          server, which broadcasts to other
          clients. The local document updates
          immediately (optimistic and deterministic
          since CRDTs commute).
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>remote edit</strong>, the
          provider receives the operation, applies
          it to the CRDT, and the editor reflects
          the change. The base editor&rsquo;s
          binding handles selection preservation:
          when a remote edit changes text near
          the local cursor, the cursor
          intelligently shifts to maintain
          intent.
        </HighlightBlock>
        <p>
          <strong>Offline buffering</strong>: edits
          queue in the CRDT locally. On
          reconnect, the queued operations sync
          with the server&rsquo;s state; CRDT
          ensures convergence regardless of how
          long the user was offline. IndexedDB
          backs the local CRDT for durability
          across reload.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Live cursors and presence</strong>{" "}
          ride alongside the document sync. The
          provider broadcasts cursor positions
          and user metadata (name, color); the
          editor renders other users&rsquo;
          cursors as colored markers in the
          document. Presence list shows active
          users with avatars. Detail in the Live
          Cursor / Presence subsystem.
        </HighlightBlock>
        <p>
          <strong>Connection lifecycle</strong>: the
          provider auto-reconnects with backoff.
          Status (connected, syncing,
          reconnecting, offline) drives a
          status indicator. While offline,
          edits continue locally; on reconnect,
          sync resumes seamlessly.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Document loading</strong>: on
          mount, fetch the current document
          state from the server (or load from
          local cache if available, then sync).
          For long documents with many edits,
          servers typically maintain a
          snapshotted current state plus recent
          operations; the client receives the
          snapshot and any subsequent ops.
        </HighlightBlock>
        <p>
          <strong>Conflict resolution</strong> is
          mostly automatic via CRDT convergence
          properties. For semantic conflicts
          (two users want to phrase the same
          thing differently), CRDT picks one
          deterministically; the UI may surface
          the alternate via the Conflict
          Resolution UI when it makes sense
          (e.g. for comments or structured
          fields).
        </p>
        <p>
          <strong>Version history</strong>: the
          server snapshots periodically; users
          can browse versions and restore.
          Restoration creates a new edit that
          rewrites the document — itself a
          CRDT operation that converges
          across clients.
        </p>
        <p>
          <strong>Permissions</strong>: server
          enforces (view, comment, edit). The
          UI reflects permissions (read-only
          editor, comment-only mode).
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>PresenceList</strong> renders active users.{" "}
          <strong>ConnectionStatus</strong> renders status indicator.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>VersionHistory</strong> manages version snapshots.{" "}
          <Highlight tier="important"><strong>SyncProvider</strong></Highlight>{" "}
          (Yjs WebSocket provider or similar) handles network.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">CRDT document is the source of truth
          for content. The base editor binds</HighlightBlock>
<HighlightBlock as="p" tier="important">to
          it; React doesn&rsquo;t hold the
          document in state directly.</HighlightBlock>
<HighlightBlock as="p" tier="important">Presence,
          cursors, connection status in
          collaboration store. UI state (panel
          open) in component state.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CRDT operations: opaque to consumers;
          handled by the library. Sync messages:
          <Highlight tier="important">the library&rsquo;s wire protocol.
          Cursor messages:</Highlight>
          </Highlight><code>{` { userId, position, selection? } `}</code>.
          Presence: user metadata broadcast.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          CRDT operations are small and fast.
          Updates batch <Highlight tier="important">within frames.
          Library handles efficient serialization.</Highlight>
          Indexed offline storage for
          durability. Cursor updates throttled.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Presence list visible.
          <Highlight tier="important">Status indicator</Highlight>{" "}
          subtle but informative.</HighlightBlock>
<HighlightBlock as="p" tier="important">Offline mode lets users keep editing;
          reconnect surfaces &ldquo;Synced&rdquo;.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Remote edits announce in chunks (not
          per keystroke) via <Highlight tier="important">polite live region.
          Presence list accessible</Highlight> (real list).
          Cursor labels announce on focus.
          Status changes announce.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Authenticated WebSocket. Server-enforced
          permissions. CRDT operations <Highlight tier="important">validated
          server-side (no malicious clients
          can</Highlight> corrupt). Audit log of edits per
          user.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests via the CRDT library&rsquo;s
          tests. Integration tests with multiple
          simulated clients: concurrent edits
          converge.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Offline/reconnect tests.
          Permission enforcement tests.
          Performance tests with large documents
          and many edits.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Concurrent rename of the same field:
          CRDT picks deterministically; one
          name wins; users see consistently.
          Permission changed during edit:</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">server rejects subsequent edits;
          client shows view-only banner. Very
          large document: snapshot+ops handles;
          we compact periodically.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The collab wrapper around base editor
          + CRDT works for any <Highlight tier="important">editor that has
          a CRDT binding</Highlight> (ProseMirror, Slate,
          Quill, custom). Pattern reuses for
          collaborative whiteboards, spreadsheets,
          design tools.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. Document content
          is <Highlight tier="important">the user&rsquo;s. Cursor labels
          show user</Highlight> names which may be in any
          language.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>CRDT vs OT</h3>
        <HighlightBlock as="p" tier="important">
          CRDTs (Yjs, Automerge): conflict-free
          by construction; easier to reason about
          in distributed settings; offline-first
          friendly. OT (ShareJS, ot.js):
          bandwidth-efficient; requires central
          server for transform function;
          mature with Google Docs heritage. For
          new systems, CRDTs are usually the
          right choice.
        </HighlightBlock>

        <h3>Yjs vs Automerge vs Loro</h3>
        <HighlightBlock as="p" tier="important">
          Yjs is mature, has rich editor
          bindings, performance-tuned.
          Automerge is newer with strong
          theoretical foundations. Loro is
          newer still with promising
          performance. Yjs is the safest pick
          today.
        </HighlightBlock>

        <h3>Central server vs P2P</h3>
        <HighlightBlock as="p" tier="crucial">
          Central server: simpler auth,
          persistence, history. P2P: lower
          latency between peers but harder to
          coordinate. We default to central
          (with P2P optimization possible
          later).
        </HighlightBlock>

        <h3>Awareness state in CRDT vs separate</h3>
        <HighlightBlock as="p" tier="important">
          Yjs has an &ldquo;awareness&rdquo;
          channel for ephemeral state (cursors,
          presence) separate from document
          state. This is the right pattern —
          presence shouldn&rsquo;t persist with
          the document.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">End-to-end encryption with CRDT
          on encrypted state. P2P sync as an</HighlightBlock>
<HighlightBlock as="p" tier="important">optimization. Smart conflict
          resolution UIs for semantic
          conflicts.</HighlightBlock>
<HighlightBlock as="p" tier="important">AI-suggested merges.
          Cross-document linking with live
          updates.</HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Keep durable document operations separate from ephemeral awareness and local render projection.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/real-time-collaborative-editor-recovery.svg" alt="Design a Real-time Collaborative Editor recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Server locking is simple but blocks collaboration; CRDT or OT complexity is justified for concurrent editing.</p><p>Merged document state is authoritative under the selected algorithm. Awareness is lossy TTL state and never enters document history. Scale pressure comes from concurrent edits, offline work, large logs, reconnect replay, undo semantics, schema migration, and malicious operations. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: document operations, offline queue, and compaction</h3><p>Apply validated operations against a document clock, isolate awareness from durable content, queue offline edits, replay missing operations before local flush, compact snapshots, and reject malicious or schema-incompatible operations.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, validate operations, snapshot compactly, replay missing ops, preserve offline queue, isolate awareness, and bound history.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep durable document operations separate from ephemeral awareness and local render projection.</p><h3>What breaks at scale?</h3><p>concurrent edits, offline work, large logs, reconnect replay, undo semantics, schema migration, and malicious operations.</p><h3>What consistency applies?</h3><p>Merged document state is authoritative under the selected algorithm. Awareness is lossy TTL state and never enters document history.</p><h3>How do you recover?</h3><p>validate operations, snapshot compactly, replay missing ops, preserve offline queue, isolate awareness, and bound history.</p><h3>Why this architecture?</h3><p>Server locking is simple but blocks collaboration; CRDT or OT complexity is justified for concurrent editing.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}