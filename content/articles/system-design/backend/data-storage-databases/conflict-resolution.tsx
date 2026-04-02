"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-conflict-resolution-complete",
  title: "Conflict Resolution",
  description:
    "Comprehensive guide to conflict resolution: write-write conflicts, last-write-wins, vector clocks, CRDTs, application merge, and handling conflicts in multi-leader and offline-first systems.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "conflict-resolution",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "conflict-resolution", "distributed-systems", "replication"],
  relatedTopics: [
    "replication-in-nosql",
    "consistency-models",
    "read-replicas",
    "sharding-strategies",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Conflict Resolution</h1>
        <p className="lead">
          Conflict resolution handles concurrent writes to the same data in distributed systems.
          When multiple nodes accept writes independently (multi-leader replication, offline-first
          apps), conflicts occur: two writes to same key, different values. Resolution strategies:
          <strong>Last Write Wins (LWW)</strong> (highest timestamp wins),
          <strong>Vector Clocks</strong> (track causality, detect conflicts),
          <strong>Application Merge</strong> (custom merge logic), <strong>CRDTs</strong>
          (conflict-free replicated data types, automatic merge). Choice depends on consistency
          requirements, data types, and acceptable data loss.
        </p>

        <p>
          Consider a collaborative document. User A edits paragraph 1 (value: "Hello"), User B
          edits same paragraph concurrently (value: "Hi"). Both changes replicate to other nodes.
          Conflict! Resolution: LWW (one wins based on timestamp - data loss), vector clocks
          (detect conflict, prompt user to merge), CRDTs (automatically merge - "Hello" + "Hi"
          → combined result).
        </p>

        <p>
          Conflicts occur in: <strong>Multi-leader replication</strong> (leaders in different
          regions accept writes independently), <strong>Offline-first apps</strong> (mobile
          app works offline, syncs when online), <strong>Collaborative editing</strong>
          (multiple users edit same document). Without conflict resolution: data corruption
          (silent overwrites), lost updates (one write overwrites another), inconsistency
          (different nodes have different values).
        </p>

        <p>
          This article provides a comprehensive examination of conflict resolution: conflict
          types (write-write, read-write, lost updates), resolution strategies (LWW, vector
          clocks, application merge, CRDTs), and real-world use cases (multi-leader replication,
          offline-first apps, collaborative editing). We'll explore when each strategy excels
          (LWW for simplicity, vector clocks for detection, CRDTs for automatic merge) and
          trade-offs (data loss vs complexity vs storage overhead). We'll also cover best
          practices (choose strategy per data type, test conflict scenarios) and common
          pitfalls (clock skew, no merge strategy, assuming single leader).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/conflict-resolution-strategies.svg`}
          caption="Figure 1: Conflict Resolution Strategies showing Conflict Scenarios: Write-Write Conflict (Two writes to same key concurrently), Read-Write Conflict (Read sees uncommitted write), Lost Update (Second write overwrites first). Common in: Multi-leader replication, offline-first apps. Resolution Strategies: Last Write Wins/LWW (Highest timestamp wins), Vector Clocks (Track causality, detect conflicts), Application Merge (Custom merge logic), CRDTs (Conflict-free data types). Key Components: Timestamps (Order events), Version Vectors (Track per-node versions), Merge Functions (Resolve conflicts), Quorum (Consensus for writes). Key characteristics: Write-write conflicts, read-write conflicts, lost updates, LWW, vector clocks, application merge, CRDTs."
          alt="Conflict resolution strategies"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Conflict Types &amp; Resolution</h2>

        <h3>Conflict Types</h3>
        <p>
          <strong>Write-write conflict</strong>: Two concurrent writes to same key, different
          values. Example: Node A writes <code className="inline-code">x = 5</code>, Node B
          writes <code className="inline-code">x = 10</code> (same time). Which value is
          correct? Resolution needed.
        </p>

        <p>
          <strong>Read-write conflict</strong>: Read sees uncommitted write (dirty read), or
          write overwrites value that was read (non-repeatable read). Handled by isolation
          levels (read committed, repeatable read, serializable).
        </p>

        <p>
          <strong>Lost update</strong>: Second write overwrites first write (first update
          lost). Example: A reads <code className="inline-code">x = 5</code>, B reads
          <code className="inline-code">x = 5</code>, A writes <code className="inline-code">
          x = 6</code>, B writes <code className="inline-code">x = 7</code>. A's update lost
          (B overwrites). Resolution: optimistic locking (version check), pessimistic locking
          (lock before read).
        </p>

        <h3>Last Write Wins (LWW)</h3>
        <p>
          <strong>LWW</strong> resolves conflicts by timestamp: highest timestamp wins.
          Example: A writes <code className="inline-code">x = 5</code> (timestamp 100),
          B writes <code className="inline-code">x = 10</code> (timestamp 101). B wins
          (101 &gt; 100), final value <code className="inline-code">x = 10</code>.
        </p>

        <p>
          Benefits: <strong>Simple</strong> (compare timestamps), <strong>Fast</strong>
          (no coordination), <strong>Deterministic</strong> (same result on all nodes).
          Trade-offs: <strong>Data loss</strong> (concurrent writes lost), <strong>Clock
          sync required</strong> (timestamps must be comparable), <strong>No causality</strong>
          (may violate cause-effect).
        </p>

        <p>
          Use for: Non-critical data (cache, session data), where some data loss is acceptable,
          simple systems (single conflict type).
        </p>

        <h3>Vector Clocks</h3>
        <p>
          <strong>Vector clocks</strong> track causality using vector of counters (one per
          node). Example: 3 nodes (A, B, C). Vector clock: <code className="inline-code">
          [A=2, B=1, C=0]</code> means: A has processed 2 events, B has processed 1, C has
          processed 0.
        </p>

        <p>
          Compare vector clocks: <strong>Equal</strong> (same events), <strong>Before</strong>
          (happened-before), <strong>After</strong> (happened-after), <strong>Concurrent</strong>
          (neither before nor after - conflict!). Example: <code className="inline-code">
          [2,1,0]</code> vs <code className="inline-code">[1,2,0]</code> = concurrent
          (A has more, B has more - conflict!).
        </p>

        <p>
          Benefits: <strong>Detect conflicts</strong> (concurrent events), <strong>Track
          causality</strong> (happened-before relationships), <strong>No data loss</strong>
          (detect, don't overwrite). Trade-offs: <strong>Storage overhead</strong> (vector
          per key), <strong>Complexity</strong> (compare vectors), <strong>Still need
          resolution</strong> (detect conflict, but still need to resolve).
        </p>

        <p>
          Use for: Critical data (can't lose updates), systems needing causality tracking,
          conflict detection (resolve later).
        </p>

        <h3>Application Merge</h3>
        <p>
          <strong>Application merge</strong>: Custom merge logic defined by application.
          Example: shopping cart - merge by union of items (A adds item 1, B adds item 2 -
          merged cart has both). Counter - merge by sum (A increments by 1, B increments
          by 2 - merged counter increments by 3).
        </p>

        <p>
          Benefits: <strong>Flexible</strong> (custom logic per data type), <strong>Business
          logic</strong> (merge makes sense for domain), <strong>No data loss</strong>
          (merge both values). Trade-offs: <strong>Complex</strong> (define merge for each
          type), <strong>Application burden</strong> (app must handle merge), <strong>May
          not be possible</strong> (some conflicts can't merge meaningfully).
        </p>

        <p>
          Use for: Domain-specific data (shopping carts, counters), when merge logic is clear,
          critical data (can't lose updates).
        </p>

        <h3>CRDTs (Conflict-Free Replicated Data Types)</h3>
        <p>
          <strong>CRDTs</strong> are data types with mathematical guarantees: concurrent
          operations commute (order doesn't matter), always converge to same state. Examples:
          <strong>G-Counter</strong> (grow-only counter - only increment),
          <strong>PN-Counter</strong> (positive-negative counter - increment/decrement),
          <strong>OR-Set</strong> (observed-remove set - add/remove elements),
          <strong>LWW-Register</strong> (last-write-wins register - LWW for single value).
        </p>

        <p>
          Benefits: <strong>Automatic merge</strong> (no coordination), <strong>Guaranteed
          convergence</strong> (all nodes same state), <strong>No data loss</strong> (merge
          both values). Trade-offs: <strong>Limited types</strong> (only specific data types),
          <strong>Storage overhead</strong> (track per-node state), <strong>Complexity</strong>
          (implement CRDT operations).
        </p>

        <p>
          Use for: Collaborative editing (Google Docs), counters (likes, views), sets
          (tags, followers), when automatic merge is needed.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/conflict-resolution-comparison.svg`}
          caption="Figure 2: LWW vs Vector Clocks vs CRDTs comparing Last Write Wins/LWW (Compare timestamps, Highest wins, Simple to implement, Data loss risk, Clock sync required), Vector Clocks (Vector of counters, Track causality, Detect conflicts, No data loss, More storage overhead), CRDTs (Conflict-free types, Automatic merge, No coordination, Guaranteed convergence, Limited data types). Strategy Comparison: LWW (Simple, data loss), Vector Clocks (Detect conflicts), CRDTs (Auto-merge, limited), App Merge (Custom logic). Key takeaway: LWW is simple but loses data. Vector clocks detect conflicts but need resolution. CRDTs auto-merge but limited types. Choose based on consistency needs and data types."
          alt="LWW vs vector clocks vs CRDTs comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Multi-Leader &amp; Offline-First</h2>

        <h3>Multi-Leader Replication</h3>
        <p>
          Multi-leader replication: multiple nodes accept writes independently (leaders in
          different regions). Writes replicate asynchronously to other leaders. Conflicts
          occur when same key written on different leaders (concurrent writes).
        </p>

        <p>
          Resolution: <strong>LWW</strong> (timestamp comparison - simple, data loss),
          <strong>Vector clocks</strong> (detect conflicts, replicate all versions, resolve
          on read), <strong>Application merge</strong> (define merge per data type).
          Example: Cassandra uses LWW (configurable per column), Riak uses vector clocks
          (detect conflicts, return all versions).
        </p>

        <p>
          Implementation: Add metadata to each write (timestamp, vector clock), compare on
          replication, resolve conflicts (LWW, merge, or return all versions). Trade-offs:
          LWW (fast, data loss), vector clocks (detect conflicts, more storage), merge
          (no data loss, complex).
        </p>

        <h3>Offline-First Applications</h3>
        <p>
          Offline-first apps: mobile app works offline (local database), syncs when online
          (merge with server). Conflicts occur when same data modified offline and on server.
        </p>

        <p>
          Resolution: <strong>LWW</strong> (server wins or client wins - simple),
          <strong>Vector clocks</strong> (detect conflicts, prompt user to merge),
          <strong>Application merge</strong> (automatic merge per data type). Example:
          CouchDB uses vector clocks (detect conflicts, return all versions), mobile apps
          use application merge (sync logic per data type).
        </p>

        <p>
          Implementation: Store metadata with local changes (timestamp, version), on sync
          compare with server version, resolve conflicts (LWW, merge, or prompt user).
          Trade-offs: LWW (simple, data loss), vector clocks (detect conflicts, user
          intervention), merge (automatic, complex logic).
        </p>

        <h3>Collaborative Editing</h3>
        <p>
          Collaborative editing: multiple users edit same document simultaneously. Conflicts
          occur when same text edited concurrently.
        </p>

        <p>
          Resolution: <strong>Operational Transform (OT)</strong> (Google Docs - transform
          operations to preserve intent), <strong>CRDTs</strong> (automatically merge -
          no coordination). Example: Google Docs uses OT (transform insert/delete operations),
          CRDT-based editors use CRDTs (automatically merge text).
        </p>

        <p>
          Implementation: Track operations (insert, delete), transform operations (OT) or
          use CRDT operations (automatically commute), apply to document. Trade-offs: OT
          (complex transformation logic), CRDTs (limited to specific operations, storage
          overhead).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/conflict-resolution-use-cases.svg`}
          caption="Figure 3: Conflict Resolution Use Cases and Best Practices. Primary Use Cases: Multi-Leader Replication (Regional leaders, Concurrent writes, Async replication, Conflict on merge, Example: Cassandra), Offline-First Apps (Mobile apps offline, Local changes, Sync when online, Merge conflicts, Example: CouchDB), Collaborative Editing (Google Docs, Multiple editors, Real-time merge, Operational transform, CRDTs for text). Best Practices: Use LWW for Simple (Non-critical data), Vector Clocks (Detect conflicts), CRDTs for Text (Collaborative editing), App Merge (Business logic). Anti-patterns: LWW for critical data (data loss), no conflict detection (silent corruption), ignoring clock skew (wrong winner), no merge strategy (manual resolution needed), assuming single leader (multi-leader needs resolution)."
          alt="Conflict resolution use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Resolution Strategies</h2>

        <p>
          Different conflict resolution strategies have trade-offs. Understanding them helps
          you choose the right strategy for each use case.
        </p>

        <h3>Last Write Wins (LWW)</h3>
        <p>
          <strong>Strengths</strong>: Simple (compare timestamps), fast (no coordination),
          deterministic (same result on all nodes), low storage (single timestamp per key).
        </p>

        <p>
          <strong>Limitations</strong>: Data loss (concurrent writes lost), clock sync required
          (timestamps must be comparable), no causality (may violate cause-effect relationships).
        </p>

        <p>
          <strong>Use for</strong>: Non-critical data (cache, session data), simple systems
          (single conflict type), where some data loss is acceptable.
        </p>

        <h3>Vector Clocks</h3>
        <p>
          <strong>Strengths</strong>: Detect conflicts (concurrent events), track causality
          (happened-before relationships), no data loss (detect, don't overwrite).
        </p>

        <p>
          <strong>Limitations</strong>: Storage overhead (vector per key - grows with nodes),
          complexity (compare vectors), still need resolution (detect conflict, but still
          need to resolve).
        </p>

        <p>
          <strong>Use for</strong>: Critical data (can't lose updates), systems needing
          causality tracking, conflict detection (resolve later).
        </p>

        <h3>Application Merge</h3>
        <p>
          <strong>Strengths</strong>: Flexible (custom logic per data type), business logic
          (merge makes sense for domain), no data loss (merge both values).
        </p>

        <p>
          <strong>Limitations</strong>: Complex (define merge for each type), application
          burden (app must handle merge), may not be possible (some conflicts can't merge
          meaningfully).
        </p>

        <p>
          <strong>Use for</strong>: Domain-specific data (shopping carts, counters), when
          merge logic is clear, critical data (can't lose updates).
        </p>

        <h3>CRDTs</h3>
        <p>
          <strong>Strengths</strong>: Automatic merge (no coordination), guaranteed convergence
          (all nodes same state), no data loss (merge both values), no coordination needed
          (fully distributed).
        </p>

        <p>
          <strong>Limitations</strong>: Limited types (only specific data types - counters,
          sets, registers), storage overhead (track per-node state), complexity (implement
          CRDT operations).
        </p>

        <p>
          <strong>Use for</strong>: Collaborative editing (Google Docs), counters (likes,
          views), sets (tags, followers), when automatic merge is needed.
        </p>

        <h3>Combined Approach</h3>
        <p>
          Use <strong>multiple strategies</strong> based on data type:
        </p>

        <p>
          <strong>LWW</strong> for: Session data, cache, non-critical data (some loss OK).
          <strong>Vector clocks</strong> for: Critical data (detect conflicts, resolve later).
          <strong>Application merge</strong> for: Domain-specific data (shopping carts,
          counters). <strong>CRDTs</strong> for: Collaborative editing, counters, sets
          (automatic merge needed).
        </p>

        <p>
          Example: E-commerce application. Session data: LWW (simple, loss OK). Shopping
          cart: Application merge (union of items). Inventory counter: CRDT (PN-Counter -
          automatic merge). Order data: Vector clocks (detect conflicts, resolve manually).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Conflict Resolution</h2>

        <p>
          <strong>Choose strategy per data type.</strong> Not one-size-fits-all. LWW for
          non-critical, vector clocks for critical, CRDTs for counters/sets, application
          merge for domain-specific. Benefits: appropriate resolution per data type.
        </p>

        <p>
          <strong>Use synchronized clocks.</strong> For LWW, clocks must be comparable.
          Use NTP (network time protocol), logical timestamps (vector clocks, hybrid
          logical clocks). Benefits: correct conflict resolution (right winner).
        </p>

        <p>
          <strong>Test conflict scenarios.</strong> Simulate concurrent writes, verify
          resolution works correctly. Test: LWW (correct timestamp comparison), vector
          clocks (correct conflict detection), merge (correct merge logic). Benefits:
          catch bugs before production.
        </p>

        <p>
          <strong>Log conflicts.</strong> Log all conflicts (which keys, which values,
          resolution). Analyze patterns (frequent conflicts? same keys?). Benefits:
          identify problematic patterns, improve resolution strategy.
        </p>

        <p>
          <strong>Consider user intervention.</strong> For critical conflicts, prompt
          user to resolve (show both versions, let user choose). Benefits: user control
          (critical data), no data loss. Trade-offs: user burden (must resolve).
        </p>

        <p>
          <strong>Use quorum for critical writes.</strong> For critical data, use quorum
          writes (W + R &gt; N). Ensures reads see latest write. Benefits: consistency
          (read latest), fewer conflicts. Trade-offs: higher latency (wait for quorum).
        </p>

        <p>
          <strong>Document resolution strategy.</strong> Document which strategy for which
          data type, why chosen, how it works. Benefits: team understanding (consistent
          implementation), easier debugging (know expected behavior).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>LWW for critical data.</strong> LWW loses concurrent writes. Using LWW
          for critical data (financial transactions, inventory) causes data loss. Solution:
          use vector clocks (detect conflicts) or application merge (merge both values).
        </p>

        <p>
          <strong>No conflict detection.</strong> Assuming no conflicts (single leader
          assumption). Multi-leader systems always have conflicts. Solution: implement
          conflict detection (vector clocks), handle conflicts (merge or resolve).
        </p>

        <p>
          <strong>Ignoring clock skew.</strong> Clocks on different nodes drift (different
          times). LWW may choose wrong winner (earlier timestamp appears later). Solution:
          use logical timestamps (vector clocks, hybrid logical clocks), sync clocks (NTP).
        </p>

        <p>
          <strong>No merge strategy.</strong> Detecting conflicts but no resolution (manual
          intervention needed). Solution: define merge strategy per data type (application
          merge, CRDTs), or prompt user to resolve.
        </p>

        <p>
          <strong>Assuming single leader.</strong> Designing for single leader, then adding
          multi-leader (conflicts appear). Solution: design for conflicts from start
          (multi-leader assumption), choose resolution strategy early.
        </p>

        <p>
          <strong>Over-engineering resolution.</strong> Using complex resolution (CRDTs)
          for simple data (session data). Solution: choose simplest strategy that works
          (LWW for non-critical, vector clocks for critical).
        </p>

        <p>
          <strong>Not testing conflicts.</strong> Assuming resolution works without testing.
          Solution: test conflict scenarios (concurrent writes), verify resolution correct
          (expected winner, correct merge).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Multi-Leader Database (Cassandra)</h3>
        <p>
          Cassandra uses LWW per column (configurable). Each write has timestamp, conflicts
          resolved by highest timestamp. Benefits: simple, fast, deterministic. Trade-offs:
          data loss (concurrent writes lost). Configuration: per-column resolution (some
          columns use LWW, others use custom merge).
        </p>

        <h3>Offline-First Database (CouchDB)</h3>
        <p>
          CouchDB uses vector clocks (revision history). Detects conflicts, returns all
          conflicting versions. Application resolves (merge or choose). Benefits: no data
          loss (detect conflicts), flexible resolution. Trade-offs: application burden
          (must resolve), storage overhead (revision history).
        </p>

        <h3>Collaborative Editing (Google Docs)</h3>
        <p>
          Google Docs uses Operational Transform (OT). Operations (insert, delete)
          transformed to preserve intent. Example: A inserts "Hello" at position 0, B
          inserts "World" at position 0. OT transforms operations (both inserts preserved).
          Benefits: automatic merge (no user intervention), preserves intent. Trade-offs:
          complex transformation logic.
        </p>

        <h3>Shopping Cart (E-Commerce)</h3>
        <p>
          Shopping cart uses application merge (union of items). User A adds item 1, User B
          adds item 2 (same cart, different devices). Merged cart has both items. Benefits:
          no data loss (both items preserved), makes sense for domain (union is correct
          merge). Trade-offs: custom logic per data type.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What are the common conflict resolution strategies? Compare LWW, vector
              clocks, and CRDTs.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> LWW (Last Write Wins): Compare timestamps, highest
              wins. Simple, fast, but data loss (concurrent writes lost). Vector clocks:
              Vector of counters (one per node), track causality, detect conflicts. No
              data loss, but storage overhead, still need resolution. CRDTs (Conflict-Free
              Replicated Data Types): Data types with mathematical guarantees (operations
              commute), automatic merge. No coordination, guaranteed convergence, but
              limited types (counters, sets, registers). Choose: LWW for non-critical,
              vector clocks for critical (detect), CRDTs for automatic merge (counters,
              collaborative editing).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you use each? Answer: LWW: Session
              data, cache (loss OK). Vector clocks: Critical data (detect conflicts,
              resolve later). CRDTs: Counters (likes, views), sets (tags), collaborative
              editing (automatic merge needed).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do vector clocks detect conflicts?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Vector clock: vector of counters (one per node).
              Example: 3 nodes (A, B, C), vector <code className="inline-code">[A=2,
              B=1, C=0]</code> means A processed 2 events, B processed 1, C processed 0.
              Compare: Equal (same events), Before (happened-before), After (happened-after),
              Concurrent (neither - conflict!). Example: <code className="inline-code">
              [2,1,0]</code> vs <code className="inline-code">[1,2,0]</code> = concurrent
              (A has more, B has more - conflict!). On conflict: return all versions,
              prompt resolution (merge or choose).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the storage overhead? Answer: Vector per
              key (size = number of nodes). 100 nodes = 100 counters per key. Can grow
              large. Optimization: prune old entries, use dotted version vectors (more
              compact).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are CRDTs? Give examples.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> CRDTs (Conflict-Free Replicated Data Types): Data
              types with mathematical guarantees (concurrent operations commute, always
              converge). Examples: G-Counter (grow-only counter - only increment),
              PN-Counter (positive-negative counter - increment/decrement), OR-Set
              (observed-remove set - add/remove elements), LWW-Register (last-write-wins
              register - LWW for single value). Benefits: automatic merge (no coordination),
              guaranteed convergence (all nodes same state). Trade-offs: limited types
              (only specific data types), storage overhead (track per-node state).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How does PN-Counter work? Answer: Two G-Counters
              (positive, negative). Value = positive - negative. Increment: increment
              positive. Decrement: increment negative. Merge: element-wise max (both
              counters). Example: A increments by 1 (P=1, N=0), B decrements by 2 (P=0,
              N=2). Merge: P=max(1,0)=1, N=max(0,2)=2. Value = 1-2 = -1.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you handle conflicts in offline-first mobile apps?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Offline-first: app works offline (local database),
              syncs when online. Conflicts: same data modified offline and on server.
              Resolution: (1) LWW (server wins or client wins - simple, data loss),
              (2) Vector clocks (detect conflicts, return all versions, prompt user),
              (3) Application merge (automatic merge per data type). Implementation:
              Store metadata with local changes (timestamp, version), on sync compare
              with server version, resolve conflicts. Example: Shopping cart (merge by
              union), Notes (prompt user to choose), Counters (CRDT - automatic merge).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When do you prompt user vs auto-merge? Answer:
              Prompt user: critical data (can't decide automatically - user notes,
              important settings). Auto-merge: non-critical data (shopping cart union,
              counter increments), clear merge logic (union, sum).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What is operational transform? How does it differ from CRDTs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Operational Transform (OT): Transform operations
              to preserve intent. Example: A inserts "Hello" at position 0, B inserts
              "World" at position 0. OT transforms B's operation (insert at position 5
              instead of 0, after A's insert). Both inserts preserved. Used by: Google
              Docs. CRDTs: Data types with mathematical guarantees (operations commute).
              No transformation needed (operations automatically commute). Difference:
              OT transforms operations (complex logic), CRDTs use special data types
              (limited types, but simpler merge). Both achieve: automatic merge, no
              coordination.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Which is better? Answer: Depends. OT: More
              flexible (any operation), but complex transformation logic. CRDTs: Simpler
              (no transformation), but limited to specific data types. Google Docs uses
              OT (flexible for text editing), CRDT-based editors use CRDTs (simpler
              implementation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your multi-leader database has frequent conflicts. How do you reduce
              them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Reduce conflicts: (1) Use quorum writes (W + R &gt;
              N - ensures reads see latest, fewer conflicts), (2) Partition by key (same
              key always goes to same leader - no concurrent writes), (3) Use single
              leader for hot keys (route hot keys to single leader - no conflicts),
              (4) Shorten replication lag (faster replication - smaller conflict window),
              (5) Use application logic (route related writes to same leader). Trade-offs:
              Quorum (higher latency), Partitioning (may imbalance load), Single leader
              for hot keys (reduces availability). Choose based on consistency vs
              availability needs.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if conflicts are unavoidable? Answer:
              Accept conflicts, handle gracefully: (1) Detect conflicts (vector clocks),
              (2) Resolve automatically (merge logic, CRDTs), (3) Log conflicts (analyze
              patterns), (4) Prompt user for critical conflicts (manual resolution).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 5.
          </li>
          <li>
            Shapiro et al., "Conflict-Free Replicated Data Types (CRDTs),"
            https://hal.inria.fr/inria-00609289/
          </li>
          <li>
            Lamport, "Time, Clocks, and the Ordering of Events,"
            https://lamport.azurewebsites.net/pubs/time-clocks.pdf
          </li>
          <li>
            Cassandra Documentation, "Conflict Resolution,"
            https://cassandra.apache.org/doc/
          </li>
          <li>
            CouchDB Documentation, "Conflict Resolution,"
            https://docs.couchdb.org/en/stable/
          </li>
          <li>
            Riak Documentation, "Vector Clocks,"
            https://riak.com/product/
          </li>
          <li>
            Google Docs, "Operational Transform,"
            https://en.wikipedia.org/wiki/Operational_transformation
          </li>
          <li>
            CRDTs Website, "Introduction to CRDTs,"
            https://crdt.tech/
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 11.
          </li>
          <li>
            Percona Blog, "Conflict Resolution in Multi-Master,"
            https://www.percona.com/blog/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
