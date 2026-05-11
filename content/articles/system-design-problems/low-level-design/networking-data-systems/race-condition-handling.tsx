"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-race-condition-handling-system",
  title: "Design a Race Condition Handling System",
  description:
    "Production-grade patterns for detecting and preventing race conditions in concurrent state updates, optimistic updates, and data synchronization.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "race-condition-handling",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "race-conditions",
    "concurrency",
    "mutation-ordering",
    "versioning",
    "optimistic-updates",
  ],
  relatedTopics: [
    "optimistic-ui-system",
    "request-deduplication-system",
    "token-refresh-system",
  ],
};

export default function RaceConditionHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Two users edit same post simultaneously. User A edits title ("Post" → "Post Updated"). User B edits description. A's request sent, then B's request sent. B's request arrives first (faster network). Server updates post, sets version 2. A's request arrives. Server sees version 1, but post is version 2 (conflict!). Which edit wins? User A loses their title edit. Inconsistent state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Solutions: (1) Last-Write-Wins (LWW): later edit overwrites. Simple, fast. Con: early edit lost. (2) Optimistic Locking: version numbers. Client sends version (e.g., "you're editing v1"). Server checks: if v1 matches current, update. If not (v2 exists), reject conflict. Client receives error, fetches latest, retries. (3) Operational Transformation (OT): preserve both edits by transforming them. Complex but preserves intent. (4) Conflict Resolution UI: show user both versions, let them choose.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key insight: out-of-order delivery can cause lost updates (A's request arrives after B's, even though sent first). Must detect and handle. Server should be source of truth. Client mutations optimistic (show immediately), but must reconcile with server on conflict.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Multiple users/tabs may modify same resource. Mutations may arrive out of order. Some conflicts acceptable, others not. Server is authority. Conflict detection possible (version numbers, timestamps).
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Conflict Detection:</strong> Identify when mutations conflict
            (modify same fields).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Version Tracking:</strong> Each resource version tracked. Mutations
            include version.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Conflict Resolution:</strong> Resolve conflicts consistently (last-write-wins,
            merge, user choice).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>State Consistency:</strong> All clients eventually converge to same
            state.
          </HighlightBlock>
          <li>
            <strong>Lost Update Prevention:</strong> No updates silently lost.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Conflict detection does not block mutations.
          </li>
          <li>
            <strong>Causality:</strong> Mutations respect causal order when possible.
          </li>
          <li>
            <strong>User Experience:</strong> Conflicts resolved transparently or with
            minimal user action.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Same field modified by two mutations simultaneously → conflict, resolve via
            version check.
          </li>
          <li>
            Stale mutation arrives after fresher mutation → reject or reapply.
          </li>
          <HighlightBlock as="li" tier="important">
            Optimistic update loses data → rollback and retry.
          </HighlightBlock>
          <li>
            Conflict in offline mode → queue mutations, replay on sync.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Each resource has a version number (timestamp, logical clock, or hash).
          Mutations include the version they&apos;re based on. Server checks if
          version matches current. If match, apply mutation and increment version.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">If mismatch, conflict detected. Resolve via last-write-wins, merge, or
          user choice. Return result to client. Client updates state with result
          version to prevent subsequent conflicts.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Tracking</h3>
        <p>
          Every resource has a version to detect stale mutations.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timestamp:</strong> Last modification time. Simple but vulnerable
            to clock skew.
          </li>
          <li>
            <strong>Logical Clock:</strong> Incrementing counter (1, 2, 3...).
            Fair-ordered.
          </li>
          <li>
            <strong>Hash:</strong> Hash of content. Changes when content changes.
          </li>
          <li>
            <strong>ETag:</strong> HTTP standard for versioning. Server provides,
            client echoes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Locking</h3>
        <p>
          Client includes version in mutation. Server verifies version matches.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Flow:</strong> Client reads resource (gets version V). Mutation
            includes V. Server checks if current version still V. If yes, apply.
          </li>
          <li>
            <strong>Conflict:</strong> If version changed, reject (409 Conflict).
          </li>
          <li>
            <strong>Retry:</strong> Client reads fresh version, retries mutation.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Resolution Strategies</h3>
        <p>
          Different strategies for different use cases.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Last-Write-Wins:</strong> Later mutation overwrites earlier.
            Simple, lossy.
          </li>
          <li>
            <strong>First-Write-Wins:</strong> Earlier mutation succeeds, later fails.
            Preserves first edit.
          </li>
          <li>
            <strong>Three-Way Merge:</strong> Merge base, my mutation, their mutation.
            Preserves both edits if non-overlapping.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Operational Transformation:</strong> Adjust operations to maintain
            consistency. Complex.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>User Choice:</strong> Present conflict to user, let them choose.
            Slow but safe.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mutation Ordering</h3>
        <HighlightBlock as="p" tier="important">
          Ensure mutations applied in consistent order across replicas.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Total Ordering:</strong> All mutations ordered globally. Requires
            central authority (leader).
          </HighlightBlock>
          <li>
            <strong>Causal Ordering:</strong> Dependent mutations ordered. Non-dependent
            may be unordered.
          </li>
          <li>
            <strong>Lamport Timestamps:</strong> Assign monotonic IDs to mutations.
            Order by ID.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Updates with Rollback</h3>
        <p>
          Update UI immediately, rollback if server rejects.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Flow:</strong> Update local state optimistically. Send to server.
          </li>
          <li>
            <strong>Success:</strong> Server confirms with new version. Update local
            version.
          </li>
          <li>
            <strong>Conflict:</strong> Server rejects (409). Rollback local state.
            Fetch fresh version.
          </li>
          <li>
            <strong>Retry:</strong> Retry mutation with fresh version.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Mutations</h3>
        <p>
          Handle mutations made offline that may conflict on sync.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Queue Mutations:</strong> Store mutations locally while offline.
          </li>
          <li>
            <strong>Replay:</strong> On reconnect, replay mutations to server.
          </li>
          <li>
            <strong>Conflict Detection:</strong> Server detects conflicts during
            replay. Resolve per strategy.
          </li>
          <li>
            <strong>Conflict Notification:</strong> Notify user if mutations conflict
            with server updates.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Vector Clocks</h3>
        <p>
          Advanced: use vector clocks to detect causal ordering.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Vector:</strong> Array of logical clocks, one per replica.
          </li>
          <li>
            <strong>Comparison:</strong> Compare vectors to determine if mutations are
            ordered or concurrent.
          </li>
          <li>
            <strong>Conflict:</strong> Concurrent mutations (neither strictly before
            other) conflict.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <p>
          Track race condition frequency and resolution.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Conflict Rate:</strong> % of mutations that encounter conflicts.
          </li>
          <li>
            <strong>Resolution Rate:</strong> % resolved via last-write-wins vs merge
            vs user choice.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Latency Impact:</strong> How much do retries add to mutation
            latency.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Field-Level Conflicts</h3>
        <HighlightBlock as="p" tier="important">
          Detect conflicts at field level, not whole record. Two mutations to
          different fields don&apos;t conflict.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Serialization</h3>
        <HighlightBlock as="p" tier="important">
          Some databases (PostgreSQL, MySQL) provide built-in optimistic locking via
          version columns.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Machines</h3>
        <HighlightBlock as="p" tier="crucial">
          For complex workflows, use state machines to prevent invalid transitions due
          to concurrent mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="important">
          Simulate concurrent mutations, verify conflict detection and resolution.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CRDT & Conflict-Free Replicated Data Types</h3>
        <HighlightBlock as="p" tier="important">
          For collaborative systems, CRDTs allow concurrent mutations to converge
          automatically. No explicit conflict resolution needed. Trade: complexity
          and memory overhead. Solutions exist: Yjs, Automerge. Right choice for
          collaborative editors (Google Docs style).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Vector Clocks & Causal Ordering</h3>
        <p>
          Advanced: vector clocks track causality. Compare vectors to determine if
          mutations causally related or concurrent. Concurrent mutations conflict.
          Causal mutations ordered. More sophisticated than timestamps.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operational Transformation</h3>
        <HighlightBlock as="p" tier="important">
          Another approach: transform operations to maintain consistency. A inserts
          "x" at position 0, B inserts "y" at position 0 simultaneously. Transform
          one relative to other. Google Docs uses this. Complex but powerful.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Conflict Scenarios</h3>
        <HighlightBlock as="p" tier="important">
          Generate concurrent mutation sequences. Verify final state deterministic.
          Use property-based testing (fast-check) to find edge cases. Test all
          conflict resolution strategies under various timing patterns.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring Conflict Rates</h3>
        <p>
          Track: conflict rate (% of mutations conflicting), resolution strategy
          used (last-write vs merge), user data loss rate. High conflict rate
          indicates contention—consider UI/UX changes or sharding.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Conflict Replay</h3>
        <p>
          Mutations made offline may conflict on sync. Store local mutations with
          timestamps. On sync, replay against latest server version. Conflicts
          detected, resolved per strategy. Notify user if data loss possible.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Field-Level Conflicts</h3>
        <p>
          Detect conflicts at field level, not whole record. Two mutations to
          different fields don't conflict. Requires tracking which fields each
          mutation touched. More granular, better UX.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Lessons</h3>
        <HighlightBlock as="p" tier="crucial">
          Common: last-write-wins loses data silently. Users realize too late.
          Always notify on conflict. Another: optimistic update assumes success
          then fails—rollback and retry, but show user. Another: distributed
          systems consensus hard—accept eventual consistency, handle conflicts.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response & Debugging</h3>
        <HighlightBlock as="p" tier="important">
          If users report lost data, likely conflict resolution issue. Trace
          mutation order, version history. Implement audit log: every mutation
          recorded with version, timestamp, user. Critical for post-mortems.
        </HighlightBlock>
      </section>

      <section>
        <h2>Race Condition Patterns & Solutions</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/race-condition-patterns.svg"
          alt="Race condition patterns: out-of-order responses and unmount-while-fetching mitigation diagram"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: correctness needs a monotonic notion of &ldquo;newer&rdquo; (request ids, versions, timestamps). Without it, out-of-order responses and concurrent mutations silently overwrite fresh state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          For fetches: use AbortController on unmount and ignore late responses via a request token check. For mutations: use optimistic locking (version columns) or server-side ordering guarantees.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Prefer explicit state machines for complex flows to make invalid transitions impossible (loading → success → stale-update is a bug; model it and prevent it).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Correctness vs Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Last-write-wins is fast but lossy. Three-way merge is correct but slow.
          Choose based on use case.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Experience</h3>
        <HighlightBlock as="p" tier="important">
          Automatic conflict resolution is seamless but risky (data loss). User choice
          is safe but requires action.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Scalability</h3>
        <HighlightBlock as="p" tier="important">
          Central leader for total ordering doesn't scale. Distributed systems use
          vector clocks or causal ordering.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">At 1M concurrent users, conflicts common—implement sophisticated resolution. Real-world systems must handle offline mutations with replay and conflict</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">detection on sync. Testing with property-based generators finds edge cases. Audit logs (every mutation with version, timestamp) essential for debugging data loss incidents. Integration with optimistic updates, caching, and error handling complex. Understanding these patterns prevents silent data loss—worst type of bug.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
