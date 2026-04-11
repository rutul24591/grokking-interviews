"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-conflict-resolution-ux",
  title: "Conflict Resolution UX",
  description:
    "Comprehensive guide to handling data conflicts in offline-capable apps: conflict detection, resolution strategies, merge UI patterns, and CRDTs.",
  category: "frontend",
  subcategory: "nfr",
  slug: "conflict-resolution-ux",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "conflict-resolution",
    "offline",
    "sync",
    "crdt",
    "ux",
  ],
  relatedTopics: ["offline-support", "multi-tab-sync", "client-persistence"],
};

export default function ConflictResolutionUXArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Conflict Resolution UX</strong> addresses how applications
          handle situations where the same data has been modified in multiple
          places — different browser tabs, different devices, or by different
          users — and those modifications conflict with each other. Conflicts
          occur in offline-first applications where users edit data without
          connectivity, in collaborative editing scenarios where multiple users
          modify the same document simultaneously, in multi-device sync when
          changes made on a phone and a tablet diverge, and in queue replay
          scenarios where queued mutations conflict with current server state
          after reconnection.
        </p>
        <p>
          For staff engineers, conflict resolution is both a technical and user
          experience challenge. Technically, you need detection mechanisms
          (version vectors, timestamps, field-level tracking) and resolution
          algorithms (last-write-wins, field-level merging, operational
          transformation, CRDTs). From a UX perspective, you need to handle
          conflicts gracefully without confusing or frustrating users —
          presenting conflicts clearly, providing intuitive comparison and merge
          interfaces, and ensuring that user work is never silently lost. The
          right approach depends on the application domain — a collaborative
          document editor requires automatic convergence (CRDTs), while a
          financial transaction system requires manual review of every conflict.
        </p>
        <p>
          The cost of poor conflict resolution is severe. Silent data loss
          destroys user trust and generates support tickets. Overly aggressive
          conflict prompts interrupt workflow and frustrate users who rarely
          experience conflicts. The goal is to resolve conflicts automatically
          when safe and involve the user only when automatic resolution is
          risky or impossible. This requires sophisticated detection logic,
          well-designed merge algorithms, and clear, actionable conflict
          notification UIs.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Conflict detection is the foundation of any resolution strategy.
          Version vectors track a version number per node (device, user, or
          tab), incrementing the local version on each change. When syncing,
          nodes exchange version vectors — if one vector dominates the other
          (all version numbers are equal or greater), the dominating version
          represents the latest state. If neither dominates (each has higher
          versions for different nodes), the changes are concurrent and a
          conflict exists. This approach is used in distributed databases like
          DynamoDB and Riak and provides precise conflict detection without
          relying on clock accuracy.
        </p>
        <p>
          Timestamps offer a simpler detection mechanism but introduce clock
          skew challenges. Last-write-wins based on timestamp is straightforward
          to implement but silently loses data when concurrent modifications
          occur. Logical timestamps (Lamport clocks) address clock skew by using
          counters rather than wall-clock time, but they still lose concurrent
          modification data. Field-level tracking improves granularity by
          tracking changes per field rather than per document — if User A
          modifies the title and User B modifies the content, both changes are
          kept automatically, and a conflict is only raised when the same field
          is modified by both parties. This is the approach used by Google Docs
          and Firebase.
        </p>
        <p>
          Operation logs record each mutation as an operation (not just the
          resulting state), enabling conflict detection at the operation level.
          By replaying operations from both sources, the system can detect
          conflicting operations and apply transformation rules to resolve them.
          This is the foundation of Operational Transformation (OT) and
          Conflict-Free Replicated Data Types (CRDTs), which enable real-time
          collaborative editing by transforming operations to maintain
          consistency across all replicas.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/conflict-detection-methods.svg"
          alt="Conflict Detection Methods"
          caption="Conflict detection approaches — version vectors, timestamps, field-level tracking, and operation logs with their accuracy and complexity trade-offs"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The conflict resolution architecture flows through detection,
          classification, resolution, and notification stages. When a sync event
          occurs (coming back online, tab synchronization, or periodic pull),
          the system first detects conflicts by comparing version vectors,
          timestamps, or field-level change tracking data between the local and
          remote states. If no conflict exists (one version dominates or changes
          are to different fields), the merge proceeds automatically. If a
          conflict is detected, it is classified by severity — field-level
          conflicts in non-critical data may be auto-resolved with last-write
          wins, while conflicts in critical data (financial records, legal
          documents) require manual user review.
        </p>
        <p>
          The resolution strategy determines how conflicts are handled.
          Last-write-wins is the simplest approach — the most recent timestamp
          wins and the older change is discarded. This is appropriate for
          ephemeral data where conflicts are rare and the cost of data loss is
          low. Field-level merging keeps non-conflicting changes from both
          versions and only raises conflicts when the same field is modified by
          both parties. This automatic merge handles the majority of real-world
          conflicts without user involvement. Operational Transformation
          transforms conflicting operations to produce a consistent result — for
          example, if User A inserts text at position 5 and User B inserts text
          at position 3, OT adjusts User A&apos;s insertion position to
          account for User B&apos;s insertion.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/conflict-resolution-strategies.svg"
          alt="Conflict Resolution Strategies"
          caption="Conflict resolution approaches — last-write-wins, field-level merge, manual resolution, operational transformation, and CRDTs"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/crdt-convergence-flow.svg"
          alt="CRDT Convergence Flow"
          caption="CRDT convergence — concurrent operations from multiple users are transformed to produce the same final state on all nodes, with mathematical guarantee regardless of operation order"
        />

        <p>
          CRDTs (Conflict-Free Replicated Data Types) represent the most
          sophisticated approach — data structures designed with mathematical
          guarantees that any order of operations produces the same final state.
          Unlike OT, which requires a central server to transform operations,
          CRDTs converge automatically in peer-to-peer and offline scenarios.
          Common CRDT types include G-Counter (grow-only counter), PN-Counter
          (increment and decrement), LWW-Register (last-write-wins register),
          OR-Set (observed-remove set for adding and removing elements), and
          RGA (Replicated Growable Array for text editing). Popular libraries
          include Yjs (widely used for collaborative editing), Automerge (JSON
          API for documents), and GunDB (real-time database with built-in
          CRDTs).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Resolution strategy selection involves balancing complexity, data
          safety, and user experience. Last-write-wins is trivially simple to
          implement and works well for low-conflict scenarios (settings
          preferences, read markers), but silently discards user work when
          conflicts occur — an unacceptable outcome for documents, financial
          data, or any information users invest effort in creating. Field-level
          merging adds implementation complexity but automatically resolves the
          majority of conflicts while preserving all non-conflicting changes. It
          is the sweet spot for most applications with multi-device sync.
        </p>
        <p>
          Operational Transformation enables real-time collaboration with
          sub-second latency but requires a central coordination server, making
          it unsuitable for peer-to-peer or fully offline scenarios. Google Docs
          uses OT with a central server that receives, transforms, and
          broadcasts operations to all connected clients. The algorithm is
          complex to implement correctly — Google invested years in developing
          and refining their OT implementation. CRDTs offer the same real-time
          collaboration capability without central coordination, converging
          automatically regardless of operation order. The trade-off is higher
          memory usage (CRDTs store metadata for each operation) and more
          complex data structures.
        </p>
        <p>
          The UX approach to conflict presentation also involves trade-offs.
          Showing a conflict dialog with side-by-side comparison gives users
          full control but interrupts workflow and requires users to understand
          the nature of the conflict. Automatic merging with a notification
          (&quot;We merged your changes with changes from another device&quot;)
          is less disruptive but may produce unexpected results that users
          discover later. Preserving both versions as separate documents
          (Dropbox&apos;s &quot;conflicted copy&quot; approach) is the safest
          option but creates duplicate content that users must manually
          reconcile. The right choice depends on the application domain and user
          technical sophistication.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Design conflict detection to be as granular as possible. Field-level
          tracking is significantly better than document-level tracking because
          it automatically merges non-conflicting changes and only raises
          conflicts when the same field is modified. For collaborative text
          editing, character-level tracking (via CRDTs) is even better, allowing
          multiple users to edit different parts of the same paragraph
          simultaneously without any conflict. The granularity of detection
          directly impacts the frequency of user-facing conflicts — finer
          granularity means fewer conflicts requiring manual resolution.
        </p>
        <p>
          When manual resolution is required, provide a clear, intuitive
          comparison interface. Show both versions side by side with differences
          highlighted using color coding (green for additions, red for
          deletions, yellow for modifications). Include attribution information
          showing who made each change and when. Allow users to select
          individual changes from each version to create a hybrid result, rather
          than forcing an all-or-nothing choice. Provide a preview of the merged
          result before confirming. Google Docs&apos;s version history and
          Git&apos;s merge conflict interface are exemplary models.
        </p>
        <p>
          Never silently lose user data. When in doubt, preserve both versions
          and let the user decide later. Create a &quot;conflicted copy&quot;
          document, notify the user of the conflict, and provide a clear path
          to resolution. This approach, used by Dropbox and Google Drive,
          prioritizes data safety over convenience — it is better to have
          duplicate documents that users can merge than to lose work
          permanently. Log all conflicts with metadata (conflicting versions,
          timestamps, user IDs) for debugging and audit purposes.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most dangerous pitfall is relying on wall-clock timestamps for
          conflict detection without accounting for clock skew. Different
          devices have different clock times, and even a few seconds of skew can
          cause the wrong version to win in a last-write-wins scenario. A user
          edits a document on their phone (clock 30 seconds behind), saves, then
          edits on their laptop (correct clock) and saves — the phone&apos;s
          change is incorrectly considered newer and overwrites the laptop&apos;s
          change. The solution is to use server timestamps (the time the server
          receives the change) rather than client timestamps, or to use version
          vectors that do not depend on clock accuracy.
        </p>
        <p>
          Another common error is failing to prevent infinite rebroadcast loops
          in multi-tab synchronization. When Tab A receives a change from Tab
          B, it must not rebroadcast that change back to Tab B, which would then
          rebroadcast it back to Tab A, creating an infinite loop. Each tab must
          track the source of received messages and avoid echoing them back.
          Include a source tab ID or message sequence number in the broadcast
          protocol to detect and discard duplicate messages.
        </p>
        <p>
          Implementing CRDTs without understanding their memory overhead is a
          frequent mistake. CRDTs store metadata for every operation to enable
          automatic convergence — a simple text document with 1000 edits may
          store 1000 operation records, each with vector clock data. This
          metadata grows unboundedly unless garbage collection is implemented
          (which requires all nodes to have seen all operations). For
          long-running collaborative documents, implement periodic compaction
          that collapses the operation history into a snapshot while preserving
          the convergence guarantee. Libraries like Yjs handle this
          automatically, but custom CRDT implementations must address it
          explicitly.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Collaborative document editing is the canonical conflict resolution
          use case. Google Docs uses Operational Transformation with a central
          server that receives every keystroke, transforms it against concurrent
          operations, and broadcasts the result to all connected clients. This
          enables sub-second collaborative editing with automatic conflict
          resolution — users rarely see conflicts because OT handles them
          transparently. Competing products like Figma (design collaboration)
          and Notion (workspace collaboration) use CRDTs for the same purpose,
          enabling offline editing with automatic convergence when connectivity
          returns. The key insight is that for real-time collaboration, the
          conflict resolution must be automatic and invisible to users.
        </p>
        <p>
          Mobile-first note-taking applications face different conflict
          challenges. Users frequently edit notes on their phone while offline,
          then sync when connectivity returns — potentially after making
          different edits to the same note on their tablet. Apps like Evernote
          and Bear use field-level merging for automatic conflict resolution
          (different sections of the note can be merged) with manual conflict
          presentation when the same section is edited on both devices. The
          conflict UI shows both versions side by side with highlighted
          differences and allows the user to choose one version or create a
          hybrid.
        </p>
        <p>
          Distributed version control systems like Git handle conflicts at the
          file level during merge operations. When two branches modify the same
          lines of the same file, Git marks the conflict with markers
          (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>,
          <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) and requires manual
          resolution. While this approach is too coarse-grained for real-time
          collaboration, it is appropriate for code where every change must be
          intentional and reviewed. The Git merge conflict resolution workflow —
          showing both versions with highlighted differences, allowing
          three-way merge with a common ancestor — has influenced conflict UX
          design across many domains.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you detect conflicts in offline-first applications?
            </p>
            <p className="mt-2 text-sm">
              A: Version vectors track a version number per device — if neither
              vector dominates the other, the changes are concurrent and a
              conflict exists. Timestamps provide simpler detection but suffer
              from clock skew issues. Field-level tracking detects conflicts
              only when the same field is modified by both parties, allowing
              automatic merge of non-conflicting changes. Operation logs record
              each mutation for transformation-based resolution. Choose the
              approach based on complexity needs — timestamps for simple apps,
              version vectors for distributed systems, CRDTs for real-time
              collaboration.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are CRDTs and when would you use them?
            </p>
            <p className="mt-2 text-sm">
              A: CRDTs (Conflict-Free Replicated Data Types) are data structures
              with a mathematical guarantee that any order of operations
              produces the same final state — they automatically converge
              without central coordination. Use them for real-time collaborative
              editing, offline-first applications with complex merge needs, and
              peer-to-peer synchronization. Popular libraries include Yjs
              (collaborative editing), Automerge (JSON documents), and GunDB
              (real-time database). They are overkill for simple apps where
              last-write-wins or field-level merging is sufficient, and they
              carry higher memory overhead due to operation metadata storage.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you design UX for conflict resolution?
            </p>
            <p className="mt-2 text-sm">
              A: Notify the user clearly that a conflict exists — never hide
              conflicts. Show a side-by-side comparison with differences
              highlighted (additions in green, deletions in red, modifications
              in yellow). Include attribution showing who made each change and
              when. Allow the user to select individual changes from each
              version to create a hybrid result, rather than forcing an
              all-or-nothing choice. Provide a preview of the merged result
              before confirming. When in doubt, preserve both versions and let
              the user decide later — never silently lose user work.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between OT and CRDTs?
            </p>
            <p className="mt-2 text-sm">
              A: Operational Transformation (OT) transforms operations to
              maintain consistency — it requires a central server to receive,
              transform, and broadcast operations. Used by Google Docs. CRDTs
              are data structures that automatically converge regardless of
              operation order — no central coordination needed, better for
              peer-to-peer and offline scenarios. Both enable real-time
              collaboration. CRDTs are more mathematically elegant but carry
              higher memory overhead. OT is more mature for text editing but
              harder to implement correctly.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle conflicts in a multi-tab application?
            </p>
            <p className="mt-2 text-sm">
              A: Use BroadcastChannel or localStorage events for cross-tab
              communication. Detect conflicts when syncing state between tabs —
              compare version vectors or timestamps. For simple data, use
              last-write-wins with a notification to other tabs. For form data,
              show a conflict dialog before submitting if another tab has
              modified the same data. For collaborative editing, use CRDTs (Yjs)
              for automatic merge. Always inform users of conflicts — never
              silently overwrite another tab&apos;s changes. Prevent infinite
              rebroadcast loops by tracking message sources.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://crdt.tech/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CRDT.tech — CRDT Resources and Research
            </a>
          </li>
          <li>
            <a
              href="https://docs.yjs.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yjs Documentation — Collaborative Editing Framework
            </a>
          </li>
          <li>
            <a
              href="https://automerge.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Automerge — CRDT-Based Document Library
            </a>
          </li>
          <li>
            <a
              href="https://martin.kleppmann.com/papers/beatopia-dissertation.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann — CRDTs and Operational Transformation Research
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — Conflict-Free Replicated Data Types
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
