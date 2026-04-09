"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-normalized-state",
  title: "Design Normalized State for Lists and Entities",
  description:
    "Production-grade normalized state design pattern — entity normalization, foreign key relationships, update propagation, and avoiding nested duplication.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "normalized-state-design",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "normalized-state",
    "entity-adapter",
    "foreign-keys",
    "state-structure",
    "denormalization",
    "update-patterns",
  ],
  relatedTopics: [
    "client-side-data-normalization",
    "derived-computed-state-performance",
    "pagination-cursors-state-merging",
  ],
};

export default function NormalizedStateDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a state structure for an application that manages
          collections of related entities (users, posts, comments, tags, projects)
          with relationships between them. A naive nested structure (posts array
          containing full comment arrays containing full user objects) leads to
          data duplication, inconsistent updates (same user appears in multiple
          places with different data), and expensive update operations (finding
          and updating a deeply nested item). We need a normalized state design
          pattern that stores each entity once by ID, references entities via
          foreign keys, and provides efficient update and query operations.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with Zustand for global state management.</li>
          <li>Application manages 5+ entity types with relationships (users → posts → comments → authors).</li>
          <li>Entities are fetched from a REST API with nested responses that need normalization.</li>
          <li>Real-time updates arrive via WebSocket (individual entity patches, not full tree).</li>
          <li>Performance requirement: update any entity in O(1) time, query entity + relations in O(k) where k is relation count.</li>
          <li>State must support optimistic updates with rollback capability.</li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Entity Tables:</strong> Each entity type has a &quot;table&quot; (Record&lt;ID, Entity&gt;) storing entities by ID. No duplicate entity instances.</li>
          <li><strong>Foreign Key References:</strong> Relationships are expressed via ID arrays (post.commentIds) rather than nested entity objects.</li>
          <li><strong>Normalize API Responses:</strong> Incoming nested API responses are flattened into entity tables + ID references via a normalizer function.</li>
          <li><strong>Denormalize for Rendering:</strong> Query-time denormalization reconstructs nested structures by following ID references (select post + join comments + join authors).</li>
          <li><strong>Efficient Updates:</strong> Updating a single entity replaces only that entity&apos;s table entry. All references automatically reflect the change.</li>
          <li><strong>Cascading Deletes:</strong> Deleting an entity removes it from its table and cleans up foreign key references in related entities.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Update Performance:</strong> Entity update is O(1) — direct table key replacement, no array traversal or deep search.</li>
          <li><strong>Memory Efficiency:</strong> Each entity instance stored once. No duplication across multiple parent entities.</li>
          <li><strong>Type Safety:</strong> Full TypeScript for entity schemas, relationships, normalizer input/output types, and denormalized query results.</li>
          <li><strong>Developer Experience:</strong> Normalizer is declarative — engineers define entity schemas and relationships, normalizer handles the flattening automatically.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>API returns partial entity (only some fields) — merge with existing entity data rather than replacing entirely.</li>
          <li>Circular relationships (user → posts → comments → author → user) — normalizer must detect and break cycles to prevent infinite loops.</li>
          <li>Orphaned entities (comment references deleted post) — handle gracefully in denormalization (show placeholder or skip).</li>
          <li>Concurrent updates: WebSocket patch arrives while user is editing the same entity — last-write-wins or merge conflict resolution.</li>
          <li>Large entity tables (10,000+ users) — selectors must not iterate the entire table unless necessary (use indexed lookups).</li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The normalized state design follows a <strong>relational database pattern</strong>
          adapted for client-side state. Each entity type has a table (dictionary
          keyed by ID). Relationships are foreign key references (ID arrays or
          single ID fields). Incoming API responses pass through a normalizer that
          recursively extracts entities, adds them to their tables, and replaces
          nested objects with ID references. Queries use a denormalizer that
          follows ID references to reconstruct nested structures. The store
          provides entity CRUD actions (addOne, addMany, updateOne, removeOne)
          that operate directly on tables — O(1) for single-entity operations.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Nested state (arrays of objects with nested arrays):</strong> Posts array containing comments array containing user objects. Pros: matches API response shape, intuitive to read. Cons: data duplication (same user appears in every comment), expensive updates (find comment in post&apos;s comments array), inconsistency risk (user&apos;s name differs across comments). Interviewers flag this as the anti-pattern for any app with 3+ entity types and relationships.</li>
          <li><strong>Flat arrays (single array per entity type, no ID dictionary):</strong> Users array, posts array, comments array. Pros: simpler than nested. Cons: updates require Array.findIndex (O(n) per update), no referential stability (new array on every update), harder to detect duplicates. ID dictionaries (Record&lt;ID, Entity&gt;) are superior for O(1) lookups and stable references.</li>
          <li><strong>Graph database (nodes + edges):</strong> Entities as nodes, relationships as edge objects with metadata. Pros: handles arbitrary relationship types, rich relationship metadata (since, type, weight). Cons: over-engineered for most UI state, complex query language, harder to type in TypeScript. Best for apps with dynamic, user-defined relationship types — not for fixed schema apps.</li>
        </ul>
        <p>
          <strong>Why relational normalization is optimal:</strong> It matches how
          UIs actually consume data — components need specific entities by ID,
          related entities via ID lists, and efficient updates to individual
          entities. The table-based approach gives O(1) updates, referential
          stability (same ID = same reference unless entity changed), and a clear
          mental model (engineers understand database tables). Redux Toolkit&apos;s
          createEntityAdapter proved this pattern works at scale — we adapt it
          for Zustand with TypeScript-first design.
        </p>
      </section>

      {/* Section 4: System Design */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Entity Schema Definitions (<code>lib/entity-schemas.ts</code>)</h4>
          <p>Defines entity types (User, Post, Comment, Tag) with their fields and relationships. Each entity has an id field, data fields, and relationship definitions (single ID or ID array). Schemas are used by both the normalizer and denormalizer.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Normalizer (<code>lib/normalizer.ts</code>)</h4>
          <p>Takes nested API response, recursively extracts entities by type, adds them to entity tables, and returns an object with entities grouped by type and a result ID. Uses schema definitions to identify entity boundaries and relationship fields. Handles partial entities via deep merge.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Entity Adapter (<code>lib/entity-adapter.ts</code>)</h4>
          <p>Generic CRUD operations for entity tables: addOne, addMany, updateOne, updateMany, removeOne, removeAll. Each operation is O(1) for single-entity ops, O(n) for batch ops. Returns new table reference (immutable) for React change detection.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Denormalizer/Selector Factory (<code>lib/denormalizer.ts</code>)</h4>
          <p>Creates memoized selector functions that follow ID references to reconstruct nested structures. selectPostWithComments(postId) returns post + joined comments + joined comment authors. Uses reselect-style memoization to avoid recalculation when unrelated entities change.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Entity Store (<code>stores/entity-store.ts</code>)</h4>
          <p>Zustand store containing entity tables (users: Record&lt;ID, User&gt;, posts: Record&lt;ID, Post&gt;, etc.). Exposes entity CRUD actions via the entity adapter, normalizer integration for API responses, and denormalized selectors for components.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Relationship Integrityity Manager (<code>lib/relationship-manager.ts</code>)</h4>
          <p>Handles cascading deletes and orphan cleanup. When a post is deleted, removes its ID from the user&apos;s postIds array, deletes all its comments, and removes comment IDs from affected users. Maintains referential integrity across entity tables.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Entity Conflict Resolver (<code>lib/conflict-resolver.ts</code>)</h4>
          <p>Handles concurrent updates to the same entity. When a WebSocket patch arrives while the entity has uncommitted local changes, applies merge strategy: field-level merge (non-conflicting fields merged, conflicting fields prefer server), last-write-wins, or custom merge function per entity type.</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management Architecture</h3>
        <p>
          The store contains entity tables, not nested trees. When an API response
          arrives, it passes through the normalizer which extracts entities into
          tables. The entity adapter applies the normalized entities to the store
          via immutable table updates (new object references for changed entities
          only). Components use denormalized selectors that follow ID references
          to reconstruct the nested shape they need. The relationship manager
          ensures referential integrity on deletes. The conflict resolver handles
          concurrent updates from WebSocket patches.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/normalized-state-design-architecture.svg"
          alt="Normalized state architecture showing entity tables, normalizer, denormalizer, and relationship management"
          caption="Normalized State Architecture"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>API returns nested response with post containing embedded author object and comments array with embedded authors.</li>
          <li>Normalizer extracts: users table (author from post + authors from comments), posts table (post with authorId replacing author object), comments table (comments with postId and authorId).</li>
          <li>Entity adapter merges extracted entities into store tables: new entities added, existing entities deep-merged with partial data.</li>
          <li>Store updates only the affected table entries. Unchanged entities keep their references — no unnecessary re-renders.</li>
          <li>Component calls selectPostWithComments(postId). Denormalizer: looks up post in posts table, looks up each commentId in comments table, looks up each comment&apos;s authorId in users table. Returns reconstructed nested object.</li>
          <li>Denormalized result is memoized — recalculation only happens when the post, its comments, or comment authors change. Other entity changes (unrelated posts, users) do not trigger recalculation.</li>
          <li>User edits a comment: updateOne replaces only that comment in the comments table. All components displaying that comment (directly or via denormalized selectors) re-render with the new data.</li>
        </ol>
      </section>

      {/* Section 5: Data Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow is unidirectional: API response → normalizer → entity tables →
          store update → denormalized selectors → component re-renders. WebSocket
          patches follow the same path: patch → normalizer (partial entity) →
          conflict resolver (merge with local changes) → entity table update →
          selectors → re-renders.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Partial entity updates:</strong> API returns partial user object without other fields. Normalizer deep-merges with existing user. Only changed fields (name) create new references. Unchanged fields (email, avatar) keep their references, preventing unnecessary re-renders in components that only use unchanged fields.</li>
          <li><strong>Circular relationships:</strong> User A&apos;s posts contain comments authored by User A. Normalizer detects the cycle by tracking visited entity IDs during normalization. When it encounters user A again (as comment author), it inserts the ID reference without re-processing User A&apos;s data. This prevents infinite recursion and ensures each entity is processed exactly once.</li>
          <li><strong>Orphaned entities after delete:</strong> Deleting a post removes it from the posts table. The relationship manager then: (1) removes the postId from the author&apos;s postIds array, (2) deletes all comments with that postId, (3) for each deleted comment, removes the commentId from any entity referencing it. Orphaned users (whose only comments were deleted) remain in the users table — they are cleaned up by a periodic garbage collection pass that removes entities with no incoming references.</li>
          <li><strong>Concurrent WebSocket + local edit:</strong> User edits a comment locally (optimistic update), then a WebSocket patch arrives for the same comment. Conflict resolver checks if the local edit has been confirmed by the server. If not, it merges: server fields overwrite server-owned fields (status, timestamps), local fields are preserved for user-owned fields (text, formatting). If fields conflict (both changed the same field), server wins and local edit is rolled back with a notification to the user.</li>
          <li><strong>Large entity table queries:</strong> Querying 10,000 users with a filter (role = &apos;admin&apos;) requires iterating the entire table. Mitigation: maintain secondary indexes (Map&lt;role, userId[]&gt;) updated on every entity change. Filtered queries use the index (O(1) lookup) instead of full table scan (O(n)). Indexes add memory overhead (~5% of table size) but dramatically speed up filtered queries.</li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes:
            entity schema definitions, normalizer with cycle detection,
            entity adapter with CRUD operations, denormalizer with
            memoized selectors, relationship manager for cascading
            deletes, and conflict resolver for concurrent updates.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Entity Schema Definitions</h3>
        <p>
          Each entity type is defined with its fields and relationships. User has
          id, name, email, postIds (array). Post has id, title, content, authorId
          (single), commentIds (array), tagIds (array). Comment has id, text,
          postId, authorId. Tag has id, name, postIds (array). These schemas drive
          the normalizer (knows which fields are entity references) and the
          denormalizer (knows which IDs to follow).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Normalizer</h3>
        <p>
          Recursive function that walks the API response. When it encounters an
          object matching an entity schema (has an id field and matches a known
          entity type), it extracts the entity, replaces nested entity references
          with IDs, and continues walking. Tracks visited entity IDs to detect
          cycles. Returns a normalized result with entities grouped by type and a primary result ID. Partial entities are deep-merged with existing entities on store application.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Entity Adapter</h3>
        <p>
          Generic CRUD for entity tables. addOne inserts or replaces entity by ID. addMany batch inserts. updateOne deep-merges changes into existing entity. removeOne deletes entity by ID. All operations return a new table object (immutable) with only the affected entries replaced — unchanged entries keep their references for React memoization.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Denormalizer/Selector Factory</h3>
        <p>
          Creates memoized selectors that follow ID references.
          createSelectPostWithComments() returns a function (state, postId) that:
          (1) looks up post in posts[postId], (2) maps post.commentIds through
          comments table, (3) maps each comment&apos;s authorId through users table.
          Uses reselect-style memoization — caches input IDs and output, re-computes
          only when any input entity changed (via Object.is comparison on each
          entity reference).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Entity Store</h3>
        <p>
          Zustand store with entity tables for users, posts, comments, and tags. Exposes actions: fetchPost(postId) — API call then normalize then adapter.applyToStore. updateComment, deletePost with cascade delete. Exposes selectors created by the denormalizer factory for component use.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Relationship Integrityity Manager</h3>
        <p>
          Maintains referential integrity on entity deletion. cascadeDelete(entityType,
          entityId) identifies all entities referencing the target entity, removes
          the target&apos;s ID from their reference arrays, and recursively deletes
          dependent entities (post&apos;s comments). Orphaned entities (no incoming
          references) are queued for garbage collection — a periodic cleanup removes
          entities that are no longer reachable from any root entity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Entity Conflict Resolver</h3>
        <p>
          Handles concurrent local + remote updates to the same entity. When a
          WebSocket patch arrives, checks if the entity has pending local changes
          (optimistic updates not yet confirmed by server). If no local changes,
          applies the patch directly. If local changes exist, runs the merge
          strategy: server-owned fields (status, timestamps, computed fields) are
          overwritten by the patch; user-owned fields (text, preferences) preserve
          local changes. Field-level conflicts (both modified same field) default
          to server-wins with a user notification about the overridden local change.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Entity lookup by ID</td>
                <td className="p-2">O(1) — dictionary key access</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Entity update (single)</td>
                <td className="p-2">O(1) — key replacement</td>
                <td className="p-2">O(1) — new entity ref only</td>
              </tr>
              <tr>
                <td className="p-2">Normalize nested response</td>
                <td className="p-2">O(e) — e = total entities in response</td>
                <td className="p-2">O(e) — entity table entries</td>
              </tr>
              <tr>
                <td className="p-2">Denormalize post + comments + authors</td>
                <td className="p-2">O(c × a) — c comments, a authors each</td>
                <td className="p-2">O(c × a) — reconstructed object</td>
              </tr>
              <tr>
                <td className="p-2">Cascade delete</td>
                <td className="p-2">O(r) — r = total related entities</td>
                <td className="p-2">O(r) — cleanup operations</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Denormalization of large relation sets:</strong> A post with 500 comments, each with an author lookup, creates 500 + 500 = 1000 dictionary lookups per denormalization. If this runs on every render, it&apos;s expensive. Mitigation: memoize the denormalized result with input selectors for the post, each comment, and each author. Recalculate only when any input entity changes (Object.is check on each).</li>
          <li><strong>Full table scans for filtered queries:</strong> Finding all users with role=&apos;admin&apos; requires iterating the entire users table. With 10,000 users, this is 10,000 checks per query. Mitigation: maintain secondary indexes (Map&lt;role, userId[]&gt;) updated on every entity change. Filtered queries use the index for O(1) lookup. Index update on entity change is O(1) — remove old role, add new role.</li>
          <li><strong>Normalization of deeply nested responses:</strong> An API response with 100 posts, each with 50 comments, each with an author — 100 × 50 × 1 = 5000 entities to extract. The normalizer recursively processes all of them. Mitigation: API should support pagination and partial responses. Normalize only the entities needed for the current view. Lazy-load related entities (comments) on demand rather than normalizing the full tree upfront.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Referential stability through immutable updates:</strong> Entity adapter returns new table object with only changed entity references replaced. Unchanged entities keep their exact same references. This makes Object.is comparisons in selectors highly effective — selectors return the same result object when underlying entities haven&apos;t changed, preventing re-renders.</li>
          <li><strong>Lazy denormalization:</strong> Instead of denormalizing the full post + comments + authors tree, denormalize in layers. First render: post + comment IDs (no author details). Second render (after paint): comment bodies. Third render: comment authors. This spreads the denormalization cost across multiple frames, keeping each frame under 16ms. Use React&apos;s useDeferredValue for non-critical denormalization layers.</li>
          <li><strong>Entity change tracking:</strong> Maintain a Set of changed entity IDs per store update cycle. Denormalized selectors check if any of their input entity IDs are in the changed set — if not, return cached result immediately without recomputation. This avoids even the Object.is checks for unchanged entities.</li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The normalizer validates incoming API responses against entity schemas
          before extraction. Each entity must have a valid ID (non-empty string),
          and all required fields must be present. Malformed entities are logged
          and skipped rather than corrupting the entity tables. WebSocket patches
          undergo the same validation — a patch missing the entity ID or with an
          invalid entity type is rejected.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Integrity</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Referential Integrity</h4>
          <p>
            The relationship manager ensures that foreign key references always
            point to existing entities. When an entity is deleted, all references
            to it are cleaned up. Orphaned references (pointing to non-existent
            entities) are detected during denormalization — the denormalizer
            returns null for missing entities rather than crashing. Development
            mode logs warnings for any orphaned references detected, helping
            engineers identify data consistency bugs.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Preventing Entity Injection</h4>
          <p>
            WebSocket patches could theoretically inject malicious entity data
            (XSS payloads in user.name, script tags in comment.text). The
            normalizer sanitizes string fields during extraction — HTML entities
            are escaped, script tags are removed. This is a defense-in-depth
            measure; the primary XSS defense is proper escaping at render time,
            but sanitizing at the state layer provides an additional safety net.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Normalization depth limit:</strong> The normalizer has a maximum recursion depth (default: 10). If the API response nests deeper than 10 levels, the normalizer stops and logs a warning. This prevents stack overflow from maliciously crafted deeply-nested responses.</li>
          <li><strong>Entity table size limits:</strong> Each entity table has a maximum size (default: 100,000 entries). When the limit is reached, the oldest un-referenced entities are evicted (LRU eviction based on last access time). This prevents unbounded memory growth from long-running applications that accumulate entities over time.</li>
          <li><strong>Conflict resolver rate limiting:</strong> WebSocket patches for the same entity are rate-limited to 10 per second. Excess patches are coalesced into a single update (keeping the latest). This prevents a buggy server from flooding the client with entity updates and degrading performance.</li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Normalizer:</strong> Test flattening of nested API response into entity tables. Test partial entity merging. Test cycle detection (circular references don&apos;t cause infinite loop). Test malformed entity rejection.</li>
          <li><strong>Entity adapter:</strong> Test addOne (insert new, replace existing), updateOne (deep merge, partial update), removeOne (delete by ID, return unchanged table for missing ID). Test batch operations (addMany, updateMany).</li>
          <li><strong>Denormalizer:</strong> Test reconstruction of nested structure from ID references. Test memoization (same inputs return same output reference). Test recalculation when one input entity changes. Test missing entity handling (returns null for orphaned reference).</li>
          <li><strong>Relationship manager:</strong> Test cascading delete (post deletion removes comments, cleans up author&apos;s postIds). Test orphan detection and cleanup. Test delete of already-deleted entity (no-op, no error).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Full API flow:</strong> Mock API returns nested post data, normalize → apply to store → denormalize → verify component receives correct reconstructed data. Update a comment via store action → verify denormalized selector returns updated comment while unchanged post and author references remain stable.</li>
          <li><strong>WebSocket + optimistic update:</strong> Optimistically update a comment locally, then receive WebSocket patch for the same comment. Verify conflict resolver merges correctly (server fields overwrite, user fields preserved). Verify component shows merged result.</li>
          <li><strong>Large entity table performance:</strong> Populate users table with 10,000 entries. Query for admin users using the secondary index. Verify query completes in under 5ms. Verify updating one user triggers re-render only in components subscribed to that user (not all 10,000).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>Normalizer with deeply nested response (depth 15) — verify depth limit triggers at 10, remaining entities are logged but not processed.</li>
          <li>Entity table reaches 100,001 entries — verify LRU eviction removes the least-recently-accessed entity, table size stays at 100,000.</li>
          <li>Concurrent updates: fire 50 WebSocket patches for the same entity in 1 second — verify rate limiter coalesces to 10 updates, final state is correct.</li>
          <li>Denormalize a post with 500 comments — verify memoization prevents recalculation when unrelated entities change, verify initial denormalization completes in under 50ms.</li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Keeping nested state because &quot;it matches the API&quot;:</strong> Candidates resist normalizing because the API returns nested data. Interviewers push: &quot;What happens when the same user appears in 50 comments with different name spellings?&quot; Candidates must recognize that matching the API shape is not a valid reason to sacrifice data consistency. Normalize on intake, denormalize on output.</li>
          <li><strong>Using arrays instead of ID dictionaries:</strong> Candidates store entities as arrays (users: User[]) and use findIndex for lookups. Interviewers ask: &quot;What&apos;s the cost of updating one user in an array of 10,000?&quot; O(n) for findIndex + O(n) for array splice. The correct answer: ID dictionaries (Record&lt;ID, User&gt;) give O(1) lookup and O(1) update.</li>
          <li><strong>Not memoizing denormalized selectors:</strong> Candidates denormalize on every render without memoization. Interviewers ask: &quot;What happens when an unrelated entity changes?&quot; The denormalizer recalculates unnecessarily. The correct answer: memoize with input selectors for each entity reference — only recalculate when one of the input entities actually changed.</li>
          <li><strong>Ignoring referential integrity on deletes:</strong> Candidates implement entity deletion as simply removing from the table. Interviewers ask: &quot;What about other entities that reference the deleted entity?&quot; Orphaned references cause crashes during denormalization. The correct answer: cascade delete — clean up all foreign key references before or during entity removal.</li>
          <li><strong>Denormalizing everything upfront:</strong> Candidates denormalize the entire entity graph when any entity changes. Interviewers ask: &quot;What if you have 10,000 users and one changes — do you rebuild every post&apos;s comment tree?&quot; The correct answer: denormalize lazily at query time, memoized per query. Only the queries that depend on the changed entity recalculate.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Normalization vs Denormalization Timing</h4>
          <p>
            Normalize on intake (API response → flat tables immediately) and
            denormalize on output (query time reconstruction) is the standard
            pattern. Alternative: denormalize on write (maintain denormalized
            caches that update when entities change). Normalize-on-intake is
            simpler and more predictable — the store always has clean, consistent
            data. Denormalize-on-write is faster at query time (no reconstruction)
            but adds complexity — every entity change must update all cached
            denormalized views that include it. For most UIs, normalize-on-intake
            + memoized denormalize-on-query is the right balance.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Secondary Indexes vs Full Table Scans</h4>
          <p>
            Without indexes, filtered queries (all users with role=&apos;admin&apos;)
            scan the entire table — O(n) per query. With secondary indexes
            (Map&lt;role, userId[]&gt;), filtered queries are O(1). The trade-off:
            indexes add memory overhead (~5% of table size) and write overhead
            (every entity update must update its indexes). For tables under 1,000
            entries, full scans are fast enough. For 1,000+ entries with frequent
            filtered queries, indexes are essential. Build indexes only for fields
            that are actually filtered on — don&apos;t index every field preemptively.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle a scenario where the API returns entities in multiple separate responses (paginated posts, then comments for each post)?</p>
            <p className="mt-2 text-sm">
              A: The normalizer handles each response independently — each response
              is normalized into entity tables and merged with existing data. Posts
              arrive first: normalized into posts table. Comments arrive later:
              normalized into comments table, each with a postId reference. The
              denormalizer for a post checks if its comments are loaded (commentIds
              exist in comments table) — if not, it returns what it has (post with
              partial comments). This supports progressive loading: render the post
              immediately, fill in comments as they arrive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement undo for entity updates?</p>
            <p className="mt-2 text-sm">
              A: Maintain a history stack of entity changes. Before each entity update, push a snapshot of the previous entity state onto the stack with entity type, ID, previous state, and timestamp. Undo pops the stack and applies the previous state via adapter.updateOne. Limit stack depth (100 entries) and implement TTL (entries older than 30 minutes expire). For memory efficiency, store only the changed fields (diff) rather than the full previous entity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you share normalized entity data between multiple stores?</p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) Shared entity store: all domains read from a
              single entity store. Each domain has its own view store that holds
              query state (which posts are visible, active filters) but entity data
              lives in the shared store. (2) Entity replication with sync: each
              domain store has its own entity tables, and a sync middleware keeps
              them consistent via the event bus. Approach (1) is simpler and avoids
              consistency issues. Approach (2) gives domain teams more autonomy but
              requires careful sync logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle entity relationships that change over time (a comment moves from one post to another)?</p>
            <p className="mt-2 text-sm">
              A: Entity relationships are data — updating a comment's postId is just an entity update using the adapter's updateOne method with the comment ID and new postId. The relationship manager handles the cascading effects: remove commentId from the old post's commentIds array, add it to the new post's commentIds array. The denormalizer automatically reflects the change on next query — the comment appears under the new post. No special logic needed — the normalized model makes relationship changes as simple as field updates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist normalized state to IndexedDB for offline support?</p>
            <p className="mt-2 text-sm">
              A: Persist each entity table as a separate IndexedDB object store.
              On store initialization, load entity tables from IndexedDB (fast,
              indexed access). On entity changes, batch-write modified entities to
              IndexedDB (debounced at 1 second). Handle version migration: if the
              IndexedDB schema version differs from the current version, run
              migration scripts before loading. On rehydration, merge IndexedDB
              data with fresh API fetch — server data wins for conflicts, IndexedDB
              data fills in offline-created entities.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://redux.js.org/usage/structuring-reducers/normalizing-state-shape" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux — Normalizing State Shape
            </a>
          </li>
          <li>
            <a href="https://redux-toolkit.js.org/api/createEntityAdapter" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Toolkit — createEntityAdapter
            </a>
          </li>
          <li>
            <a href="https://reselect.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Reselect — Memoized Selector Library
            </a>
          </li>
          <li>
            <a href="https://www.martinfowler.com/bliki/ValueObject.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Value Objects and Entity Patterns
            </a>
          </li>
          <li>
            <a href="https://normalizr.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Normalizr — Normalization Library Reference
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/keeping-components-pure" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — Keeping Components Pure
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
