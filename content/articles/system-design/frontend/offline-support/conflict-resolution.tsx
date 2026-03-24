"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-conflict-resolution-concise",
  title: "Conflict Resolution for Offline Changes",
  description:
    "Deep dive into conflict resolution strategies for offline-capable applications covering CRDTs, operational transformation, last-write-wins, version vectors, merge functions, and user-facing conflict UI.",
  category: "frontend",
  subcategory: "offline-support",
  slug: "conflict-resolution",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "conflict-resolution",
    "CRDTs",
    "OT",
    "offline",
    "sync",
    "distributed-systems",
  ],
  relatedTopics: [
    "offline-first-architecture",
    "background-sync",
    "service-workers",
    "network-status-detection",
  ],
};

export default function ConflictResolutionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Conflict resolution</strong> in the context of offline web
          applications refers to the set of strategies and algorithms used to
          reconcile divergent changes when two or more clients modify the same
          data independently — either while offline or during network partitions
          — and those changes must be merged when connectivity is restored. The
          fundamental challenge is that without a central coordinator available
          at write time, clients inevitably produce conflicting versions of
          shared state.
        </p>
        <p>
          The theoretical roots trace back to Leslie Lamport&apos;s 1978 paper
          on logical clocks, which established that distributed systems cannot
          rely on physical time for ordering events. This led to the development
          of vector clocks (Fidge/Mattern, 1988) for detecting causal
          relationships and concurrency between distributed events. The Bayou
          system at Xerox PARC (1995) was among the first to tackle
          application-level conflict resolution for mobile disconnected clients,
          introducing the concept of dependency checks and merge procedures that
          modern offline-first frameworks still build upon.
        </p>
        <p>
          From a staff/principal engineer perspective, the critical insight is
          rooted in the CAP theorem: offline-first applications fundamentally
          choose <strong>Availability</strong> and{" "}
          <strong>Partition tolerance</strong>, sacrificing strong{" "}
          <strong>Consistency</strong>. Every client can read and write locally
          regardless of network state (availability), and the system continues
          to function when the network is partitioned. This means the system
          must embrace eventual consistency and have a well-defined strategy for
          what happens when partitions heal. The choice of conflict resolution
          strategy directly impacts data integrity, user experience, system
          complexity, and operational cost.
        </p>
        <p>
          Major production systems illustrate the spectrum of approaches. Google
          Docs pioneered Operational Transformation (OT) for real-time
          collaborative text editing, relying on a central server to serialize
          operations. Figma adopted CRDTs for their design canvas, enabling true
          peer-to-peer convergence without a central authority. Linear uses a
          custom sync engine with server-authoritative conflict resolution,
          optimized for their specific data model. Apple Notes employs a
          three-way merge with CloudKit as the coordination layer. Each approach
          reflects different tradeoffs between complexity, correctness, latency,
          and the nature of the data being synchronized.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding conflict resolution requires internalizing six
          foundational strategies, each with distinct guarantees, complexity
          profiles, and appropriate use cases:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Last-Write-Wins (LWW):</strong> The simplest conflict
            resolution strategy. Each write is tagged with a timestamp, and when
            conflicts are detected, the write with the latest timestamp is
            accepted and all others are discarded. LWW is trivial to implement
            and reason about, but carries inherent data loss risk: a user&apos;s
            carefully crafted edit can be silently overwritten by another
            user&apos;s minor change that happened to have a later timestamp.
            Clock skew between devices compounds this problem — a device with a
            fast clock will systematically &quot;win&quot; conflicts regardless
            of actual event ordering. LWW is appropriate only for data where the
            latest value is genuinely the most correct (e.g., a user&apos;s
            last-known GPS location, a preference toggle, a read/unread status).
          </li>
          <li>
            <strong>Version Vectors / Vector Clocks:</strong> A mechanism for
            detecting concurrent modifications without relying on physical
            timestamps. Each participant maintains a vector of logical counters,
            one per known participant. When a client writes, it increments its
            own counter. By comparing version vectors, the system can determine
            if one version causally happened-after another (one vector dominates
            the other) or if they are truly concurrent (neither dominates).
            Version vectors do not resolve conflicts — they detect them. Once a
            true conflict is identified, a separate resolution strategy (manual
            merge, application-specific logic, or CRDT semantics) must be
            applied. The space overhead grows linearly with the number of
            participants, which can be managed through pruning and compaction
            strategies.
          </li>
          <li>
            <strong>Operational Transformation (OT):</strong> A family of
            algorithms that resolve conflicts by transforming operations against
            each other. When two clients concurrently apply operations O1 and O2
            to the same document state, OT computes transformed operations
            O1&apos; and O2&apos; such that applying O1 then O2&apos; yields the
            same result as applying O2 then O1&apos;. This is the approach
            behind Google Docs. OT requires a central server to establish a
            total order of operations and is notoriously difficult to implement
            correctly — the transformation functions must satisfy convergence
            properties (TP1, TP2) that are hard to verify for complex operation
            types. OT works well for linear data structures like text but
            becomes exponentially complex for tree or graph structures.
          </li>
          <li>
            <strong>CRDTs (Conflict-free Replicated Data Types):</strong> Data
            structures mathematically designed to always converge to the same
            state across all replicas, regardless of the order in which
            operations are received, without requiring any central coordination.
            This is achieved by constraining operations to be commutative,
            associative, and idempotent (for operation-based CRDTs) or by
            defining a merge function that forms a join-semilattice (for
            state-based CRDTs). Common CRDT types include G-Counter (grow-only
            counter), PN-Counter (positive-negative counter), G-Set (grow-only
            set), OR-Set (observed-remove set), LWW-Register, and sequence CRDTs
            like RGA and LSEQ for collaborative text editing. Libraries like Yjs
            and Automerge provide production-ready CRDT implementations for
            JavaScript. The tradeoff is increased storage (tombstones for
            deleted elements, metadata per operation) and the constraint that
            not all business logic maps naturally to CRDT semantics.
          </li>
          <li>
            <strong>Three-Way Merge:</strong> A conflict resolution technique
            that compares three versions of data: the common ancestor (the last
            version both parties agreed on), the local version (client changes),
            and the remote version (server/other client changes). By diffing
            each modified version against the ancestor, the algorithm can
            determine which fields or regions were changed by each party.
            Non-overlapping changes are merged automatically; overlapping
            changes are flagged as conflicts requiring resolution. This is the
            approach used by Git for source code merging. Three-way merge is
            powerful for structured data where independent fields can be merged
            independently, but requires maintaining ancestor versions, which
            adds storage overhead and complexity to the sync protocol.
          </li>
          <li>
            <strong>Manual/User Resolution:</strong> When automatic resolution
            is either unsafe or would violate user intent, the system presents
            conflicting versions to the user and lets them choose or merge
            manually. This is the approach Git takes for merge conflicts in
            overlapping code regions. In a web application context, this means
            designing conflict resolution UI that clearly shows divergent
            versions, highlights differences, and provides intuitive controls
            for accepting, rejecting, or combining changes. Manual resolution
            preserves user agency and avoids data loss, but introduces UX
            complexity, requires the user to understand the conflict, and blocks
            progress until resolved. It is best used as a fallback when
            automatic strategies cannot guarantee correctness.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust conflict detection and resolution system operates across the
          write path, the sync path, and the resolution path. Understanding the
          end-to-end flow is essential for designing systems that handle offline
          changes gracefully.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Write Path (Local)</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Local Edit:</strong> User modifies data while online or
              offline. The application captures the edit as either a new state
              snapshot or a discrete operation (insert, update, delete).
            </li>
            <li>
              <strong>2. Version Assignment:</strong> The client assigns a
              version identifier — a logical timestamp (Lamport clock), a vector
              clock increment, or an operation ID (typically a combination of
              client ID + sequence number).
            </li>
            <li>
              <strong>3. Local Persistence:</strong> The change is written to
              local storage (IndexedDB, SQLite via WASM, or an in-memory store
              with persistence). The change log or operation log is appended,
              preserving the full history of unsynced changes.
            </li>
            <li>
              <strong>4. Optimistic UI Update:</strong> The UI immediately
              reflects the change, providing instant feedback regardless of
              network state. The change is marked as &quot;pending sync&quot; in
              the local store.
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Sync Path (Client to Server)
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Connectivity Restored:</strong> The client detects
              network availability (via navigator.onLine, periodic health
              checks, or WebSocket reconnection).
            </li>
            <li>
              <strong>2. Push Pending Changes:</strong> The client sends its
              unsynced operations or state snapshots to the server, including
              version metadata (vector clock, base version, operation IDs).
            </li>
            <li>
              <strong>3. Server Receives:</strong> The server compares the
              client&apos;s base version against the current server version. If
              no other client has modified the data since the client&apos;s base
              version, the change is applied cleanly (fast-forward).
            </li>
            <li>
              <strong>4. Conflict Detection:</strong> If another client has
              modified the data (the server version has advanced beyond the
              client&apos;s base version), a conflict is detected. The server
              identifies the common ancestor, the server&apos;s current state,
              and the client&apos;s proposed state.
            </li>
            <li>
              <strong>5. Resolution Strategy Applied:</strong> Depending on the
              configured strategy — LWW discards the loser, CRDTs merge
              automatically, OT transforms operations, three-way merge
              identifies non-conflicting and conflicting regions, or the
              conflict is queued for manual resolution.
            </li>
            <li>
              <strong>6. Result Propagation:</strong> The resolved state is sent
              back to the originating client and broadcast to all other
              connected clients. Each client updates its local state and version
              vector to reflect the resolved state.
            </li>
          </ol>
        </div>

        <p>
          The key insight for CRDT convergence is that all replicas that have
          received the same set of operations will deterministically arrive at
          the same state, regardless of the order in which those operations were
          received or applied. This is guaranteed by the mathematical properties
          of the CRDT — commutativity ensures order independence, associativity
          ensures grouping independence, and idempotency ensures that duplicate
          delivery is harmless. This eliminates the need for a central
          coordinator and makes CRDTs the strongest choice for true
          offline-first architectures where network partitions are expected and
          prolonged.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/conflict-detection-flow.svg"
          alt="Conflict Detection and Resolution Flow"
          caption="End-to-end conflict detection flow: two clients edit while offline, server detects conflict on sync, resolution strategy produces merged state"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/crdt-convergence.svg"
          alt="CRDT Convergence Across Replicas"
          caption="CRDT convergence: three replicas receive operations in different orders but converge to the same final state"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Correctness</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Data Loss Risk</th>
              <th className="p-3 text-left">Latency</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>LWW</strong>
              </td>
              <td className="p-3">Low — silently discards losing writes</td>
              <td className="p-3">Trivial</td>
              <td className="p-3">
                High — systematic data loss for concurrent edits
              </td>
              <td className="p-3">Minimal — instant resolution</td>
              <td className="p-3">
                Non-critical metadata, presence indicators, last-known location
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Version Vectors + Manual Merge</strong>
              </td>
              <td className="p-3">High — user decides resolution</td>
              <td className="p-3">Medium (detection) + High (UI)</td>
              <td className="p-3">
                None — all versions preserved until resolved
              </td>
              <td className="p-3">Variable — blocked on user action</td>
              <td className="p-3">
                Document editing, CMS, content where intent matters
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>OT</strong>
              </td>
              <td className="p-3">
                High — preserves all user intent when correctly implemented
              </td>
              <td className="p-3">
                Very High — transformation functions are error-prone
              </td>
              <td className="p-3">
                Low — operations are transformed, not discarded
              </td>
              <td className="p-3">Low — real-time with server coordination</td>
              <td className="p-3">
                Real-time collaborative text editing (Google Docs model)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>CRDTs (State-based)</strong>
              </td>
              <td className="p-3">
                High — mathematically guaranteed convergence
              </td>
              <td className="p-3">Medium — well-understood merge semantics</td>
              <td className="p-3">
                None — all state is merged, not overwritten
              </td>
              <td className="p-3">Medium — full state transfer on sync</td>
              <td className="p-3">
                Infrequent sync, large partition durations, simple data types
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>CRDTs (Operation-based)</strong>
              </td>
              <td className="p-3">
                High — guaranteed convergence with exactly-once delivery
              </td>
              <td className="p-3">
                Medium-High — requires reliable causal broadcast
              </td>
              <td className="p-3">None — all operations applied</td>
              <td className="p-3">
                Low — incremental operations, smaller payloads
              </td>
              <td className="p-3">
                Real-time collaboration, text editing (Yjs, Automerge)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Three-Way Merge</strong>
              </td>
              <td className="p-3">
                High for non-overlapping changes; requires fallback for overlaps
              </td>
              <td className="p-3">Medium — requires ancestor tracking</td>
              <td className="p-3">
                Low — non-overlapping changes auto-merged, overlaps flagged
              </td>
              <td className="p-3">Medium — diffing and merge computation</td>
              <td className="p-3">
                Structured data with independent fields, Git-style workflows
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/conflict-strategies-comparison.svg"
          alt="Conflict Resolution Strategies Comparison Matrix"
          caption="Visual comparison of conflict resolution strategies across complexity, data safety, real-time capability, offline capability, and storage overhead"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices are distilled from production systems handling offline
          conflict resolution at scale:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the Right Conflict Granularity:</strong>{" "}
            Document-level conflicts force users to reconcile entire documents
            even when changes are in different sections. Field-level conflicts
            allow independent fields to merge automatically, only flagging true
            overlaps. For a to-do app, field-level (title vs. completion status)
            almost eliminates user-facing conflicts. For rich text,
            character-level CRDTs provide the finest granularity. Match
            granularity to your data model and expected edit patterns.
          </li>
          <li>
            <strong>Use CRDTs for Collaborative Real-time Features:</strong>{" "}
            When multiple users edit simultaneously, CRDTs provide the strongest
            convergence guarantees without central coordination. Libraries like
            Yjs and Automerge have matured significantly and handle text,
            JSON-like structures, and arrays efficiently. Evaluate whether your
            data model maps naturally to existing CRDT types before building
            custom solutions.
          </li>
          <li>
            <strong>Implement LWW Only for Non-critical Data:</strong> Reserve
            last-write-wins for data where the latest value is genuinely the
            most correct and data loss is acceptable: user presence, cursor
            positions, read/unread flags, last-accessed timestamps. Never use
            LWW for user-generated content, financial data, or any data where
            losing a write would frustrate or harm the user.
          </li>
          <li>
            <strong>Always Preserve Conflicting Versions:</strong> Never
            silently discard a conflicting version. Even when applying automatic
            resolution, store the &quot;losing&quot; version in a conflict log
            or revision history. This enables audit trails, undo, and manual
            recovery. CouchDB&apos;s approach of storing all conflicting
            revisions as a revision tree is a strong pattern to emulate.
          </li>
          <li>
            <strong>Design Data Structures to Minimize Conflicts:</strong>{" "}
            Structural choices dramatically reduce conflict frequency. Use
            append-only logs instead of mutable fields. Prefer sets over
            counters (adding items to a set rarely conflicts; incrementing a
            counter always does). Decompose documents into
            independently-mergeable sub-documents. Use unique IDs per item
            rather than positional indices.
          </li>
          <li>
            <strong>Test with Network Partition Simulators:</strong> Conflicts
            are inherently timing-dependent and non-deterministic, making them
            hard to reproduce manually. Use tools like Toxiproxy, Chrome
            DevTools network throttling, or custom middleware to simulate
            extended offline periods, partial connectivity, and reconnection
            storms. Build automated test suites that generate concurrent
            conflicting edits and verify convergence.
          </li>
          <li>
            <strong>
              Provide Clear Conflict UI When Manual Resolution Is Needed:
            </strong>{" "}
            When automatic resolution cannot guarantee correctness, design a
            conflict resolution interface that shows both versions side-by-side,
            highlights differences visually, offers one-click &quot;accept
            mine&quot; / &quot;accept theirs&quot; / &quot;merge&quot; actions,
            and explains the conflict context (who changed what, when). Avoid
            forcing users to understand version vectors or technical details —
            present conflicts in domain terms.
          </li>
          <li>
            <strong>Use Hybrid Approaches:</strong> Production systems rarely
            use a single strategy. Use CRDTs for collaborative text content, LWW
            for metadata (last-modified timestamp, last-editor), three-way merge
            for structured settings objects, and manual resolution as a fallback
            for irreconcilable conflicts. Define a resolution hierarchy per data
            type in your schema.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These pitfalls have tripped up experienced engineering teams building
          offline-capable applications:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Using Wall-clock Timestamps for LWW:</strong> Physical
            clocks on different devices are never perfectly synchronized. Clock
            skew, NTP drift, timezone misconfigurations, and users manually
            adjusting device time all corrupt LWW ordering. A device with a
            clock 5 seconds ahead will systematically win conflicts. Use Hybrid
            Logical Clocks (HLC) which combine physical timestamps with logical
            counters, providing causal ordering guarantees while remaining
            human-readable. At minimum, use server-assigned timestamps rather
            than client timestamps.
          </li>
          <li>
            <strong>
              Implementing CRDTs Without Understanding Space Growth:
            </strong>{" "}
            CRDTs accumulate metadata over time. Deleted elements become
            tombstones that remain in the data structure to prevent resurrection
            during out-of-order merges. Without garbage collection, a CRDT
            document can grow to many times the size of the visible content.
            Implement compaction strategies: prune tombstones after all replicas
            have observed the deletion, use causal stability thresholds, or
            periodically checkpoint and reset. Yjs handles this internally with
            its &quot;GC&quot; configuration, but custom CRDT implementations
            must address it explicitly.
          </li>
          <li>
            <strong>Ignoring the &quot;Delete vs. Edit&quot; Conflict:</strong>{" "}
            One of the most semantically ambiguous conflicts: User A deletes an
            item while User B edits the same item offline. Should the edit win
            (resurrecting the deleted item with new content)? Should the delete
            win (discarding User B&apos;s work)? There is no universally correct
            answer — it depends on the domain. A chat message deleted by a
            moderator should stay deleted. A collaboratively edited document
            should probably preserve User B&apos;s edits. Define explicit
            policies per entity type and communicate them to users.
          </li>
          <li>
            <strong>Not Testing Concurrent Edit Scenarios:</strong> Developers
            typically test the happy path — sequential edits that merge cleanly.
            Production systems face concurrent edits from multiple clients,
            rapid edit-delete sequences, edits during sync, and edits arriving
            out of causal order. Build property-based tests that generate random
            concurrent operation sequences and verify that all replicas converge
            to the same state (convergence testing). Use fuzzing to discover
            edge cases in merge logic.
          </li>
          <li>
            <strong>Building Custom OT/CRDT From Scratch:</strong> Implementing
            correct OT transformation functions or CRDT merge logic is
            deceptively difficult. Academic papers describe algorithms at a
            theoretical level that omits critical implementation details
            (undo/redo, cursor preservation, rich text formatting). Use
            battle-tested libraries: Yjs (CRDT, ~50KB, excellent performance),
            Automerge (CRDT, Rust core with JS bindings), or ShareDB (OT).
            Custom implementations are justified only when your data model
            fundamentally cannot be expressed with existing CRDT types.
          </li>
          <li>
            <strong>Assuming Conflicts Are Rare:</strong> In server-first
            applications, conflicts may indeed be uncommon. In offline-first
            applications, they are the norm. Users working on a train, in a
            building with spotty Wi-Fi, or in regions with unreliable
            connectivity will accumulate many offline changes. When they
            reconnect, every pending change is a potential conflict. Design your
            sync architecture to handle batch conflicts efficiently, not as
            exceptional cases.
          </li>
          <li>
            <strong>Not Handling the Reconnection Storm:</strong> When a network
            partition heals, many clients may reconnect simultaneously, each
            pushing accumulated offline changes. This can overwhelm the server
            with concurrent sync requests, each potentially triggering conflict
            resolution. Implement exponential backoff with jitter for
            reconnection, rate-limit sync requests, process conflict resolution
            asynchronously (queue-based), and design the sync protocol to handle
            partial progress (resume sync from where it left off rather than
            restarting).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Understanding how production systems implement conflict resolution
          provides actionable patterns:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Google Docs (Operational Transformation):</strong> Uses OT
            with a central server that serializes all operations into a total
            order. Each client sends operations to the server, which transforms
            them against any concurrent operations that arrived first. The
            server acts as the single source of truth for operation ordering.
            This works well because text is a linear data structure, operations
            are simple (insert, delete at position), and the always-online
            server provides low-latency coordination. The tradeoff is full
            server dependency — Google Docs does not work offline for
            collaborative editing.
          </li>
          <li>
            <strong>Figma (CRDTs):</strong> Uses a custom CRDT implementation
            for their design canvas. Each object on the canvas (frame, shape,
            text) is a CRDT that can be independently modified and merged. This
            enables real-time collaboration with multiple cursors and true
            offline editing. Figma&apos;s CRDT handles the unique challenges of
            2D spatial data, z-ordering, and object hierarchies. Their custom
            implementation is optimized for the specific operations designers
            perform (move, resize, recolor).
          </li>
          <li>
            <strong>Apple Notes (Three-Way Merge):</strong> Uses CloudKit as the
            sync backend with a three-way merge approach. When a conflict is
            detected, the system compares the local version, remote version, and
            their common ancestor stored in CloudKit. Non-overlapping changes
            merge automatically. For overlapping changes, Apple Notes creates a
            &quot;conflict copy&quot; — a separate note containing the
            alternative version — preserving both versions for the user to
            reconcile manually.
          </li>
          <li>
            <strong>Git (Three-Way Merge + Manual Resolution):</strong> The gold
            standard for three-way merge in practice. Git identifies the common
            ancestor (merge base), computes diffs from ancestor to each branch
            tip, auto-merges non-overlapping changes, and marks overlapping
            changes as conflicts for manual resolution. Git&apos;s approach is
            instructive for any offline-first app: automatic where safe, manual
            where ambiguous, and always preserving all versions until explicitly
            resolved.
          </li>
          <li>
            <strong>CouchDB/PouchDB (Revision Trees with LWW):</strong> CouchDB
            maintains a revision tree for each document, preserving all
            conflicting versions. It uses a deterministic algorithm (comparing
            revision hashes) to pick a &quot;winning&quot; revision, but
            crucially does not discard the losing revisions. Applications can
            query for conflicts and implement custom resolution logic. PouchDB
            brings this model to the browser, enabling full offline-first
            applications with CouchDB-compatible sync. This &quot;LWW with
            conflict tracking&quot; approach is a pragmatic middle ground
            between simple LWW and full CRDT complexity.
          </li>
          <li>
            <strong>Notion (Custom Sync with Server Authority):</strong> Uses a
            custom sync protocol where the server is authoritative. Clients send
            operations to the server, which applies them in order. When
            conflicts occur, the server applies its own resolution logic
            (typically last-write-wins at the block level) and sends the
            resolved state back to clients. This server-authoritative model
            simplifies conflict resolution at the cost of requiring connectivity
            for guaranteed consistency. Offline edits are replayed against the
            server state when reconnecting.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            When NOT to Use Complex Resolution
          </h3>
          <p>
            Not every application needs sophisticated conflict resolution. Skip
            the complexity when:
          </p>
          <ul className="mt-2 space-y-2">
            <li>
              {"•"} Single-writer systems where only one user ever modifies a
              given piece of data
            </li>
            <li>
              {"•"} Server-authoritative state where the server&apos;s version
              is always correct (e.g., bank balances, inventory counts)
            </li>
            <li>
              {"•"} Non-collaborative apps where data is scoped to a single user
              and single device
            </li>
            <li>
              {"•"} Always-online requirements where the app intentionally
              blocks writes without connectivity
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the difference between OT and CRDTs. When would you
              choose one over the other?
            </p>
            <p className="mt-2 text-sm">
              A: OT and CRDTs both solve the concurrent editing problem but with
              fundamentally different architectures. OT transforms operations
              against concurrent operations, requiring a central server to
              establish a total order — Client A&apos;s &quot;insert
              &apos;x&apos; at position 3&quot; is transformed against Client
              B&apos;s &quot;delete at position 1&quot; to become &quot;insert
              &apos;x&apos; at position 2.&quot; CRDTs are data structures where
              operations are designed to commute — the result is the same
              regardless of application order, with no central coordinator
              needed. Choose OT when you have a reliable, always-available
              server and need real-time collaboration on linear data (text
              editors). Choose CRDTs when you need true offline-first
              capability, peer-to-peer sync, or decentralized architectures.
              CRDTs are increasingly preferred in modern systems because
              libraries like Yjs have solved the practical challenges
              (performance, garbage collection, rich text support) that
              historically made CRDTs less practical than OT.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle the case where User A deletes a document
              while User B edits it offline?
            </p>
            <p className="mt-2 text-sm">
              A: This is the &quot;delete-edit&quot; conflict, and the correct
              approach depends on domain semantics. I would implement a
              configurable policy per entity type. For a collaborative document:
              treat deletion as a soft-delete (mark as deleted, preserve
              content), and when User B syncs their edit, detect the conflict by
              checking the deleted flag, then either (a) resurrect the document
              with User B&apos;s changes and notify User A, or (b) present a
              conflict UI showing &quot;This document was deleted by User A, but
              you made edits — keep your version or discard?&quot; For a
              moderated chat: deletion is authoritative and User B&apos;s edit
              is discarded with a notification. The key architectural pattern is
              using soft deletes with a &quot;deleted_at&quot; timestamp and a
              &quot;deletion_policy&quot; field on each entity type, combined
              with a conflict resolver that checks the policy before applying
              resolution logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Design a conflict resolution system for a collaborative to-do
              list app with offline support.
            </p>
            <p className="mt-2 text-sm">
              A: I would use a hybrid approach with three layers. Layer 1 — Data
              Model: each to-do item has an ID (UUID), title (LWW-Register
              CRDT), completed status (LWW-Register), and position (fractional
              indexing for ordering). The to-do list itself is an OR-Set CRDT
              (add/remove items converge without conflicts). Layer 2 — Sync
              Protocol: use operation-based sync where each edit (add item,
              toggle complete, rename, reorder, delete) is captured as an
              operation with a Hybrid Logical Clock timestamp and causal
              dependencies. Operations are stored in IndexedDB and synced to the
              server via a WebSocket connection (or batch HTTP when
              reconnecting). Layer 3 — Resolution: most conflicts resolve
              automatically via CRDT semantics. Adding the same item on two
              devices is idempotent (OR-Set). Editing different fields of the
              same item merges cleanly (independent LWW-Registers per field).
              Concurrent title edits on the same item use LWW since to-do titles
              are short and the latest version is generally acceptable.
              Delete-edit conflicts use soft-delete with resurrection. For the
              sync infrastructure, I would use Yjs with a y-indexeddb provider
              for local persistence and a y-websocket provider for server sync,
              which handles all CRDT mechanics, garbage collection, and
              awareness (cursors, presence) out of the box.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://martin.kleppmann.com/papers/convergence-sqla15.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann — A Conflict-Free Replicated JSON Datatype (2017)
            </a>
          </li>
          <li>
            <a
              href="https://www.inkandswitch.com/local-first/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ink & Switch — Local-first Software: You Own Your Data, in Spite
              of the Cloud
            </a>
          </li>
          <li>
            <a
              href="https://docs.yjs.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yjs Documentation — Shared Editing with CRDTs
            </a>
          </li>
          <li>
            <a
              href="https://automerge.org/docs/hello/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Automerge Documentation — A JSON-like Data Structure for Building
              Local-first Applications
            </a>
          </li>
          <li>
            <a
              href="https://svn.apache.org/repos/asf/incubator/wave/whitepapers/operational-transform/operational-transform.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Wave — Operational Transformation Whitepaper
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
