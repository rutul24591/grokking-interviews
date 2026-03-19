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
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-15",
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
        <h2>Definition & Context</h2>
        <p>
          <strong>Conflict Resolution UX</strong> addresses how applications
          handle situations where the same data has been modified in multiple
          places — different tabs, different devices, or by different users —
          and those modifications conflict with each other. Conflicts occur in
          offline-first apps, collaborative editing, multi-device sync, and
          distributed systems.
        </p>
        <p>
          For staff engineers, conflict resolution is both a technical and UX
          challenge. Technically, you need detection mechanisms and resolution
          algorithms. From a UX perspective, you need to handle conflicts
          gracefully without confusing or frustrating users.
        </p>
        <p>
          <strong>When conflicts occur:</strong>
        </p>
        <ul>
          <li>
            <strong>Offline editing:</strong> User edits document offline, same
            document edited on another device
          </li>
          <li>
            <strong>Multi-tab editing:</strong> Same form open in multiple tabs,
            both submitted
          </li>
          <li>
            <strong>Collaborative editing:</strong> Multiple users edit same
            document simultaneously
          </li>
          <li>
            <strong>Mobile sync:</strong> Phone and tablet both modified contact
            list while offline
          </li>
          <li>
            <strong>Queue replay:</strong> Queued actions conflict with current
            server state
          </li>
        </ul>
      </section>

      <section>
        <h2>Conflict Detection</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Vectors</h3>
        <ul className="space-y-2">
          <li>Track version per node (device, user, tab)</li>
          <li>Each change increments local version</li>
          <li>Sync includes version vector</li>
          <li>Conflict if versions are concurrent (neither dominates)</li>
          <li>Used in: DynamoDB, Riak, distributed databases</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Timestamps</h3>
        <ul className="space-y-2">
          <li>Last-write-wins based on timestamp</li>
          <li>Simple but can lose data</li>
          <li>Clock skew issues (devices have different times)</li>
          <li>
            Use logical timestamps (Lamport clocks) for distributed systems
          </li>
          <li>Server timestamp preferred over client timestamp</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Field-Level Tracking
        </h3>
        <ul className="space-y-2">
          <li>Track changes per field, not per document</li>
          <li>Conflicts only when same field modified</li>
          <li>Allows automatic merge of non-conflicting changes</li>
          <li>More complex but better UX</li>
          <li>Used in: Google Docs, Firebase, modern sync libraries</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operation Logs</h3>
        <ul className="space-y-2">
          <li>Record each operation (not just state)</li>
          <li>Replay operations to detect conflicts</li>
          <li>Can transform operations to resolve conflicts</li>
          <li>Used in: Operational Transformation, CRDTs</li>
          <li>Enables real-time collaboration</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/conflict-detection-methods.svg"
          alt="Conflict Detection Methods"
          caption="Conflict detection approaches — version vectors, timestamps, field-level tracking, and operation logs"
        />
      </section>

      <section>
        <h2>Resolution Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Last-Write-Wins (LWW)
        </h3>
        <ul className="space-y-2">
          <li>Most recent timestamp wins</li>
          <li>Simple to implement</li>
          <li>Can lose user data silently</li>
          <li>Use when: Conflicts are rare, data is ephemeral</li>
          <li>Avoid when: User work is valuable, conflicts are common</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Field-Level Merging</h3>
        <ul className="space-y-2">
          <li>Merge changes at field level</li>
          <li>
            If user A changes title and user B changes content, both changes
            kept
          </li>
          <li>Only conflict when same field modified</li>
          <li>Use when: Documents have multiple independent fields</li>
          <li>Implementation: Track changed fields, merge non-conflicting</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manual Resolution</h3>
        <ul className="space-y-2">
          <li>Show conflicts to user for decision</li>
          <li>Side-by-side comparison UI</li>
          <li>User chooses which version or creates hybrid</li>
          <li>Use when: Data is critical, automatic merge is risky</li>
          <li>UX challenge: Make comparison clear and actionable</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operational Transformation (OT)
        </h3>
        <ul className="space-y-2">
          <li>Transform operations to maintain consistency</li>
          <li>Used by Google Docs</li>
          <li>Complex algorithm, requires central server</li>
          <li>Enables real-time collaborative editing</li>
          <li>Library: ShareDB, ot.js</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          CRDTs (Conflict-Free Replicated Data Types)
        </h3>
        <ul className="space-y-2">
          <li>Data structures designed for automatic convergence</li>
          <li>No central coordination needed</li>
          <li>Mathematical guarantee of eventual consistency</li>
          <li>Types: G-Counter, PN-Counter, LWW-Register, OR-Set</li>
          <li>Libraries: Yjs, Automerge, CRDTs</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/conflict-resolution-strategies.svg"
          alt="Conflict Resolution Strategies"
          caption="Conflict resolution approaches — LWW, field-level merge, manual resolution, OT, and CRDTs"
        />
      </section>

      <section>
        <h2>UX Patterns for Conflict Resolution</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Conflict Notification
        </h3>
        <ul className="space-y-2">
          <li>Alert user that conflict exists</li>
          <li>Don&apos;t hide conflicts — users need to know</li>
          <li>Explain what happened clearly</li>
          <li>Provide clear next steps</li>
          <li>
            Example: &quot;This document was modified on another device. Review
            changes and choose which to keep.&quot;
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Side-by-Side Comparison
        </h3>
        <ul className="space-y-2">
          <li>Show both versions side by side</li>
          <li>Highlight differences clearly</li>
          <li>Allow selecting parts from each version</li>
          <li>Preview merged result</li>
          <li>Used by: Git merge tools, Google Docs version history</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Change Attribution</h3>
        <ul className="space-y-2">
          <li>Show who made each change</li>
          <li>Include timestamp for context</li>
          <li>Color-code by user</li>
          <li>Helps user make informed decision</li>
          <li>Used in: Google Docs, Figma, Notion</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Preserve Both Versions
        </h3>
        <ul className="space-y-2">
          <li>When in doubt, don&apos;t delete data</li>
          <li>Create &quot;Copy (conflicted)&quot; document</li>
          <li>Let user decide later</li>
          <li>Better to have duplicate than lost work</li>
          <li>Dropbox, Google Drive use this pattern</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Automatic Merge with Review
        </h3>
        <ul className="space-y-2">
          <li>Auto-merge non-conflicting changes</li>
          <li>Highlight merged changes for review</li>
          <li>User can accept or revert</li>
          <li>Best of both worlds: automation + control</li>
          <li>Used in: Modern code editors, collaborative tools</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/conflict-ux-patterns.svg"
          alt="Conflict UX Patterns"
          caption="UX patterns for conflict resolution — notification, comparison, attribution, and merge review"
        />
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Resolve</h3>
        <ul className="space-y-2">
          <li>
            <strong>On sync:</strong> Detect and resolve when coming back online
          </li>
          <li>
            <strong>On save:</strong> Check for conflicts before committing
          </li>
          <li>
            <strong>On open:</strong> Check for conflicts when opening document
          </li>
          <li>
            <strong>Real-time:</strong> Resolve as changes arrive (collaborative
            editing)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conflict Metadata</h3>
        <ul className="space-y-2">
          <li>Store conflict information with data</li>
          <li>Include: conflicting versions, timestamps, user IDs</li>
          <li>Track resolution status</li>
          <li>Enable undo of resolution</li>
          <li>Log conflicts for debugging</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Conflicts</h3>
        <ul className="space-y-2">
          <li>Simulate offline scenarios</li>
          <li>Test concurrent modifications</li>
          <li>Verify conflict detection works</li>
          <li>Test resolution UI thoroughly</li>
          <li>Edge cases: network flakiness, multiple conflicts</li>
        </ul>
      </section>

      <section>
        <h2>CRDTs for Automatic Resolution</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What are CRDTs</h3>
        <ul className="space-y-2">
          <li>Conflict-Free Replicated Data Types</li>
          <li>Data structures with mathematical convergence guarantee</li>
          <li>Any order of operations produces same result</li>
          <li>No central coordination needed</li>
          <li>Perfect for offline-first, peer-to-peer</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common CRDT Types</h3>
        <ul className="space-y-2">
          <li>
            <strong>G-Counter:</strong> Grow-only counter (only increments)
          </li>
          <li>
            <strong>PN-Counter:</strong> Positive-negative counter (increment
            and decrement)
          </li>
          <li>
            <strong>LWW-Register:</strong> Last-write-wins register
          </li>
          <li>
            <strong>OR-Set:</strong> Observed-remove set (add/remove elements)
          </li>
          <li>
            <strong>RGA:</strong> Replicated Growable Array (for text editing)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CRDT Libraries</h3>
        <ul className="space-y-2">
          <li>
            <strong>Yjs:</strong> Popular, well-documented, many bindings
          </li>
          <li>
            <strong>Automerge:</strong> JSON-like API, good for documents
          </li>
          <li>
            <strong>Crdts:</strong> Rust implementation with WASM bindings
          </li>
          <li>
            <strong>GunDB:</strong> Real-time database with CRDTs
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Use CRDTs</h3>
        <ul className="space-y-2">
          <li>Real-time collaborative editing</li>
          <li>Offline-first with complex merge needs</li>
          <li>Peer-to-peer applications</li>
          <li>When automatic convergence is critical</li>
          <li>
            Avoid when: Simple LWW is sufficient, complexity not justified
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you detect conflicts in offline-first apps?
            </p>
            <p className="mt-2 text-sm">
              A: Version vectors track version per device — conflict if versions
              are concurrent. Timestamps for last-write-wins (but can lose
              data). Field-level tracking detects conflicts only when same field
              modified. Operation logs record each change for transformation.
              Choose based on complexity needs — timestamps for simple, CRDTs
              for collaborative.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are CRDTs and when would you use them?
            </p>
            <p className="mt-2 text-sm">
              A: CRDTs (Conflict-Free Replicated Data Types) are data structures
              with mathematical guarantee that any order of operations produces
              same result. No central coordination needed. Use for real-time
              collaborative editing, offline-first with complex merge needs,
              peer-to-peer apps. Libraries: Yjs, Automerge. Overkill for simple
              apps where LWW is sufficient.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you design UX for conflict resolution?
            </p>
            <p className="mt-2 text-sm">
              A: Notify user clearly that conflict exists. Show side-by-side
              comparison with differences highlighted. Include attribution (who
              changed what, when). Allow selecting parts from each version.
              Preserve both versions if unsure. Auto-merge non-conflicting
              changes, ask user about conflicts. Never silently lose user data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between OT and CRDTs?
            </p>
            <p className="mt-2 text-sm">
              A: OT (Operational Transformation) transforms operations to
              maintain consistency — requires central server, used by Google
              Docs. CRDTs are data structures that automatically converge — no
              central coordination needed, better for peer-to-peer. Both enable
              real-time collaboration. CRDTs are more mathematically elegant, OT
              is more mature for text editing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle conflicts in a multi-tab app?
            </p>
            <p className="mt-2 text-sm">
              A: Use BroadcastChannel or localStorage events for cross-tab
              communication. Detect conflicts when syncing state. For simple
              data, last-write-wins with notification. For forms, show conflict
              dialog before submitting. For collaborative editing, use CRDTs
              (Yjs) for automatic merge. Always inform user of conflicts — never
              silently overwrite.
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
              CRDT.tech — CRDT Resources
            </a>
          </li>
          <li>
            <a
              href="https://docs.yjs.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yjs Documentation
            </a>
          </li>
          <li>
            <a
              href="https://automerge.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Automerge — CRDT Library
            </a>
          </li>
          <li>
            <a
              href="https://martin.kleppmann.com/papers/beatopia-dissertation.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Kleppmann — CRDTs and OT Research
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
