"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-state-normalization-concise",
  title: "State Normalization",
  description: "Deep dive into state normalization patterns including entity-based stores, normalizr, createEntityAdapter, and flattening nested API responses for predictable state management.",
  category: "frontend",
  subcategory: "state-management",
  slug: "state-normalization",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "state management", "normalization", "entities", "Redux", "data modeling"],
  relatedTopics: ["global-state-management", "derived-state", "immutable-state-updates"],
};

export default function StateNormalizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>State normalization</strong> is the practice of structuring client-side state like a relational
          database: flat entity tables keyed by unique ID, with relationships expressed through references rather
          than nesting. Just as database normalization eliminates data redundancy by decomposing tables into
          canonical forms, state normalization eliminates duplicate objects in your store by maintaining a single
          source of truth for every entity.
        </p>
        <p>
          The problem normalization solves becomes obvious when you consider how REST APIs typically return data.
          A <code>/api/posts</code> endpoint might return an array of posts, each with an embedded author object
          and an array of comment objects, each comment also embedding its own author object. If the same user
          authored a post and three comments, that user object is duplicated four times in the response. Store
          this response as-is and you inherit every headache of denormalized data: when the user updates their
          avatar, you must hunt through every nested copy to apply the change, and any copy you miss creates an
          inconsistency visible to users.
        </p>
        <p>
          The mental model is <strong>"a database in your browser."</strong> Each entity type (users, posts,
          comments) gets its own table represented as a <code>byId</code> lookup map and an <code>allIds</code>{" "}
          ordered array. Components never hold entity data directly; they hold entity IDs and look up current
          values from the canonical table at render time. This is the same principle behind Redux's recommended
          state shape, Apollo Client's automatic cache normalization, and Relay's record-based store.
        </p>
        <p>
          At the staff/principal level, understanding normalization isn't optional. It determines how gracefully
          your application handles real-time updates, optimistic mutations, cache invalidation, and offline
          sync. A poorly shaped store creates bugs that are subtle, hard to reproduce, and expensive to fix in
          production.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Normalization revolves around a small set of principles that, when applied consistently, produce
          state that is predictable, efficient, and easy to update.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Entity Tables (byId + allIds):</strong> Each entity type is stored as an object mapping
            IDs to entity objects (<code>{"{ [id: string]: Entity }"}</code>) paired with an array of IDs that
            preserves ordering. The byId map gives O(1) lookup; the allIds array lets you iterate in order,
            filter, or paginate without scanning the map.
          </li>
          <li>
            <strong>normalizr Library:</strong> The <code>normalizr</code> library (created by Dan Abramov)
            defines schemas that describe entity relationships. Given a nested API response and a schema,{" "}
            <code>normalize()</code> returns a flat <code>entities</code> map and a <code>result</code> field
            containing root-level IDs. Schemas support nested entities, arrays, unions, and custom merge
            strategies for handling updates.
          </li>
          <li>
            <strong>Redux Toolkit createEntityAdapter:</strong> RTK's <code>createEntityAdapter</code> provides
            a standardized way to manage normalized state within slices. It generates prebuilt reducers
            (<code>addOne</code>, <code>addMany</code>, <code>updateOne</code>, <code>upsertMany</code>,{" "}
            <code>removeOne</code>) and selectors (<code>selectAll</code>, <code>selectById</code>,{" "}
            <code>selectIds</code>). It handles ID extraction, sorting, and deduplication automatically, which
            eliminates an entire class of boilerplate bugs.
          </li>
          <li>
            <strong>Apollo Client Automatic Normalization:</strong> Apollo Client normalizes GraphQL responses
            automatically by combining <code>__typename</code> and <code>id</code> fields to create cache keys
            (e.g., <code>User:42</code>). When a mutation returns an updated entity, Apollo merges it into the
            cache and every query referencing that entity re-renders with fresh data. No manual normalization
            code needed, though understanding the mechanism is critical for debugging cache issues.
          </li>
          <li>
            <strong>Single Source of Truth Per Entity:</strong> Every entity instance exists exactly once in the
            store. All references to that entity use its ID. This guarantees that updating the entity in one
            place propagates everywhere automatically. Violating this principle is the root cause of most
            "stale data on screen" bugs in frontend applications.
          </li>
          <li>
            <strong>Relationships via IDs:</strong> Instead of nesting a full author object inside a post,
            the post stores <code>authorId: "user-7"</code>. The author lives in <code>users.byId["user-7"]</code>.
            This mirrors foreign keys in relational databases and eliminates duplication entirely.
          </li>
          <li>
            <strong>Denormalization for UI (Selectors):</strong> Components need assembled data, not raw IDs.
            Selectors (or derived state hooks) re-assemble normalized entities into the shape components expect.
            Memoized selectors (via <code>createSelector</code> / <code>reselect</code>) ensure this
            denormalization only recomputes when underlying entities change, keeping performance tight even
            with complex joins.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The normalization pipeline transforms data through four distinct phases: ingestion from the API,
          normalization into flat entity tables, storage in the state tree, and denormalization back into
          component-friendly shapes via selectors.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Normalization Pipeline</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. API Response (Nested):</strong> Backend returns denormalized JSON with embedded
              related entities. A single post response might contain the author object, an array of comments,
              each with their own author objects, category objects, and tag arrays.
            </li>
            <li>
              <strong>2. Normalize:</strong> The response is passed through a normalization function (normalizr,
              custom transformer, or automatic via Apollo). This extracts each entity type into its own
              collection and replaces nested objects with ID references.
            </li>
            <li>
              <strong>3. Merge into Store:</strong> Normalized entities are merged into the existing state using
              entity adapters or reducer logic. New entities are added, existing entities are updated (with
              configurable merge strategies for conflicts), and the allIds array is updated to reflect ordering.
            </li>
            <li>
              <strong>4. Select & Denormalize:</strong> When a component needs a "post with author and comments,"
              a selector reads the post by ID, looks up the author by authorId, collects comments by filtering
              commentIds, and assembles the full object. Memoization ensures this only runs when inputs change.
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/normalization-transform.svg"
          alt="State normalization transformation from nested API response to flat entity tables"
          caption="Normalization Transform - Nested API response with duplicated authors is flattened into separate entity tables with ID-based references"
        />

        <p>
          The key insight is that normalization and denormalization are inverse operations. The store holds
          data in its most canonical, update-friendly form (normalized). Views consume data in whatever
          shape they need (denormalized). Selectors bridge the gap without duplicating data in the store.
        </p>

        <p>
          This architecture also enables efficient partial updates. When a WebSocket event notifies you that
          a user changed their display name, you update exactly one record in <code>users.byId</code>. Every
          component that depends on that user (post author labels, comment author labels, profile cards)
          re-renders automatically because they all derive from the same source.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/entity-update-consistency.svg"
          alt="Comparison of update consistency between nested and normalized state"
          caption="Update Consistency - Normalized state requires a single update that propagates everywhere, while nested state requires finding and updating every copy"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Normalized (Entity Tables)</th>
              <th className="p-3 text-left">Nested (As-Received)</th>
              <th className="p-3 text-left">Query-Key-Based (React Query)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Update Consistency</strong></td>
              <td className="p-3">Excellent - single source of truth, one update propagates everywhere</td>
              <td className="p-3">Poor - must find and patch every nested copy manually</td>
              <td className="p-3">Moderate - stale data until refetch; can use query invalidation</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Memory Usage</strong></td>
              <td className="p-3">Optimal - no duplicate entity objects in memory</td>
              <td className="p-3">High - same entity stored multiple times across responses</td>
              <td className="p-3">High - each query key holds its own copy of response data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Lookup Speed</strong></td>
              <td className="p-3">O(1) by ID via byId map</td>
              <td className="p-3">O(n) scan through arrays to find by ID</td>
              <td className="p-3">O(1) per query key, but O(n) to find entity across queries</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Implementation Complexity</strong></td>
              <td className="p-3">High - requires schemas, selectors, merge logic</td>
              <td className="p-3">Low - store response as-is, no transformation needed</td>
              <td className="p-3">Low - library handles caching and refetching automatically</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Stale Data Risk</strong></td>
              <td className="p-3">Low - updates are atomic and single-sourced</td>
              <td className="p-3">High - forgotten copies create visible inconsistencies</td>
              <td className="p-3">Moderate - depends on staleTime config and invalidation discipline</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Implementation Effort</strong></td>
              <td className="p-3">Significant upfront investment, pays off at scale</td>
              <td className="p-3">Minimal - direct mapping from API to state</td>
              <td className="p-3">Minimal - library abstracts caching and state management</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          A nuanced take: React Query and normalized stores are not mutually exclusive. In many mature
          applications, React Query manages server state lifecycle (fetching, caching, background refetching)
          while a normalized client store handles entities that need cross-query consistency. The decision
          depends on how many components share overlapping entity data and how frequently entities are updated
          from multiple sources (WebSockets, optimistic updates, offline sync).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>These practices ensure normalization adds value without introducing unnecessary complexity:</p>
        <ol className="space-y-3">
          <li>
            <strong>Normalize at the API Boundary:</strong> Transform responses immediately when they arrive,
            not scattered throughout reducers. Create a dedicated normalization layer (middleware or utility)
            that every API response passes through before reaching the store.
          </li>
          <li>
            <strong>Use Entity Adapters:</strong> Don't hand-write CRUD operations for normalized state.
            Redux Toolkit's <code>createEntityAdapter</code> or equivalent libraries eliminate an entire class
            of off-by-one, missing-ID, and stale-reference bugs.
          </li>
          <li>
            <strong>Define Merge Strategies Explicitly:</strong> When an entity arrives from multiple
            endpoints (a post summary from a list endpoint, full post from a detail endpoint), define how
            fields merge. Shallow merge loses nested data; deep merge can overwrite intentional nulls. Be
            explicit about precedence.
          </li>
          <li>
            <strong>Memoize Denormalization Selectors:</strong> Selectors that join across entity tables can
            be expensive. Use <code>createSelector</code> (reselect) or <code>useMemo</code> to cache results.
            Structure selectors in layers: base selectors extract slices, composed selectors join entities.
          </li>
          <li>
            <strong>Keep IDs Stable and Globally Unique:</strong> Prefer server-generated UUIDs over
            auto-increment integers. If two entity types can share numeric IDs (user 5 and post 5), prefix
            IDs by type in the client or use separate entity tables (which you should be doing anyway).
          </li>
          <li>
            <strong>Normalize Only Shared Entities:</strong> Not every piece of API data needs normalization.
            Form state, UI state, and data that only appears in one place can stay denormalized. Normalize
            entities that appear in multiple views or are updated from multiple sources.
          </li>
          <li>
            <strong>Handle Deletions Carefully:</strong> When an entity is deleted, remove it from its byId
            map and allIds array, but also clean up all references. A post deletion should also remove its
            comment IDs from the comments table (or mark them as orphaned). Entity adapters handle the
            primary deletion but not cascading references.
          </li>
          <li>
            <strong>Version Your Schema Definitions:</strong> As your API evolves, schema definitions must
            evolve too. Track schema changes in version control and consider migration logic for persisted
            stores (localStorage, IndexedDB) to avoid hydration crashes after deploys.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these mistakes that undermine the benefits of normalization:</p>
        <ul className="space-y-3">
          <li>
            <strong>Over-Normalizing Simple Data:</strong> Normalizing a dropdown options list or a static
            configuration object adds complexity with zero benefit. Only normalize entities that are referenced
            from multiple places or updated independently. A rule of thumb: if an entity appears in only one
            component and is never updated, leave it nested.
          </li>
          <li>
            <strong>Forgetting to Update All References:</strong> When you add a comment to a post, you must
            add the comment entity to <code>comments.byId</code>, push its ID to <code>comments.allIds</code>,
            AND add the comment ID to <code>posts.byId[postId].commentIds</code>. Missing any step creates
            silent inconsistencies. Entity adapters handle the entity's own table but not cross-entity
            references.
          </li>
          <li>
            <strong>Denormalization Performance in Hot Paths:</strong> A selector that joins 500 comments
            with their authors on every keystroke will kill performance. Profile denormalization selectors in
            components that re-render frequently. Use pagination or virtualization to limit the number of
            entities denormalized at once.
          </li>
          <li>
            <strong>Stale References After Deletion:</strong> Deleting a user from <code>users.byId</code>{" "}
            without cleaning up references means components reading <code>posts.byId[x].authorId</code> will
            try to look up a nonexistent user, causing undefined errors or blank renders. Implement cascading
            cleanup or null-safe selectors that handle missing references gracefully.
          </li>
          <li>
            <strong>Mixing Normalized and Denormalized Data:</strong> Storing some entities normalized and
            others nested in the same slice creates confusion about where to find data. Adopt a consistent
            convention per slice: either fully normalized with entity adapters, or fully denormalized with
            query keys. Don't hybridize within a single state domain.
          </li>
          <li>
            <strong>Ignoring Optimistic Update Rollback:</strong> Optimistic updates in normalized stores
            require careful rollback logic. If you optimistically add a comment and the API fails, you must
            remove the comment from <code>comments.byId</code>, <code>comments.allIds</code>, and the
            parent post's <code>commentIds</code> array. Without a snapshot-and-restore pattern, partial
            rollbacks leave the store in an inconsistent state.
          </li>
          <li>
            <strong>Not Handling Partial Entities:</strong> A list endpoint returns{" "}
            <code>{"{ id, title, authorId }"}</code> while the detail endpoint returns 20 more fields.
            Naive normalization overwrites the full entity with the partial one, losing fields. Implement
            merge strategies that only overwrite fields present in the incoming data, not the entire entity.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Normalization proves its value in applications with complex, interconnected entity relationships:</p>
        <ul className="space-y-3">
          <li>
            <strong>Social Media Feeds:</strong> A Twitter/X-style feed contains posts, each with an author,
            likes (with user references), retweets (referencing original posts and users), and reply threads.
            The same user can appear as a post author, commenter, liker, and retweeter across hundreds of
            items in the feed. Without normalization, updating a user's profile picture requires scanning
            every feed item and its nested objects. With normalized <code>users.byId</code>, one update
            reflects everywhere instantly.
          </li>
          <li>
            <strong>E-Commerce Product Catalogs:</strong> Products reference categories, brands, sellers,
            reviews (with reviewer users), and related products. A category page, search results, product
            detail page, and cart all reference the same product entity. Price updates, stock changes, and
            review additions must be consistent across all views. Normalized product and review entities
            ensure the cart always reflects the latest price without manual synchronization.
          </li>
          <li>
            <strong>Collaborative Project Management:</strong> Tools like Linear or Jira manage issues,
            projects, sprints, users, labels, and comments with deep cross-references. An issue appears
            in a board view, a list view, a sprint view, and a user's assigned issues view. Drag-and-drop
            between columns, real-time updates from collaborators, and optimistic mutations all require
            a single source of truth per entity to avoid visual inconsistencies.
          </li>
          <li>
            <strong>Real-Time Chat Applications:</strong> Messages reference authors, channels, threads,
            reactions (with user references), and mentioned users. Users can appear across hundreds of
            messages. Presence updates (online/offline) must propagate to every message and channel member
            list simultaneously. Normalized user entities make presence management trivial.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Normalize</h3>
          <p>Normalization adds complexity that isn't always justified:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • <strong>Simple CRUD apps</strong> with minimal cross-referencing between entities
            </li>
            <li>
              • <strong>Server-state-first architectures</strong> using React Query/SWR where the server is
              the source of truth and stale-while-revalidate handles consistency
            </li>
            <li>
              • <strong>Short-lived data</strong> like form wizard state, search results viewed once, or
              ephemeral notifications
            </li>
            <li>
              • <strong>Small datasets</strong> where duplicated data costs less than normalization overhead
              (a settings page with 10 items doesn't need entity adapters)
            </li>
            <li>
              • <strong>Prototypes and MVPs</strong> where shipping speed matters more than data consistency
              (you can normalize later when patterns stabilize)
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why would you normalize frontend state instead of storing API responses directly?</p>
            <p className="mt-2 text-sm">
              A: Storing API responses directly creates denormalized data where the same entity (e.g., a user)
              is duplicated across multiple response objects. When that entity changes, you must find and update
              every copy, which is error-prone and leads to inconsistent UI. Normalization stores each entity
              exactly once (keyed by ID), so updates happen in one place and propagate everywhere via selectors.
              It also provides O(1) lookup by ID instead of O(n) array scanning, reduces memory usage by
              eliminating duplicates, and makes optimistic updates and cache invalidation predictable. The
              trade-off is upfront complexity in schemas and selectors, which is justified when entities are
              shared across multiple views or updated frequently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Apollo Client handle normalization differently from Redux-based approaches?</p>
            <p className="mt-2 text-sm">
              A: Apollo Client normalizes automatically using the combination of <code>__typename</code> and{" "}
              <code>id</code> fields from GraphQL responses. Each object is stored with a cache key like{" "}
              <code>User:42</code>, and relationships are stored as references. When a mutation returns an
              updated object, Apollo merges it by matching the cache key, and all queries referencing that
              entity re-render. Redux-based normalization is manual: you define schemas (normalizr), write
              normalization logic in reducers or middleware, and build selectors to denormalize. Apollo's
              approach requires less code but gives less control. You can't easily customize merge behavior,
              handle partial updates, or compose entities that span multiple GraphQL types. Redux normalization
              is more work but more flexible, especially for complex merges, optimistic updates with rollback,
              and offline-first architectures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: You're building a social feed where posts contain authors, comments, and likes. How would you structure the normalized state?</p>
            <p className="mt-2 text-sm">
              A: I'd create four entity tables: <code>users</code>, <code>posts</code>, <code>comments</code>,
              and <code>likes</code>. Each table has a <code>byId</code> map and <code>allIds</code> array.
              A post entity stores <code>authorId</code> (string), <code>commentIds</code> (string array),
              and <code>likeIds</code> (string array) instead of nested objects. A comment stores{" "}
              <code>postId</code> and <code>authorId</code>. A like stores <code>postId</code> and{" "}
              <code>userId</code>. When the API returns a nested post, I'd use normalizr schemas to flatten
              it: <code>postSchema</code> defines author as <code>userSchema</code>, comments as an array
              of <code>commentSchema</code> (which itself defines author as <code>userSchema</code>).
              For the feed view, a memoized selector takes a post ID, looks up the post, resolves its author
              from users.byId, maps commentIds to comment entities and resolves each comment's author.
              If a user updates their name, I update one record in users.byId and every post and comment
              by that user reflects the change on the next render cycle.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://redux.js.org/usage/structuring-reducers/normalizing-state-shape" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Documentation - Normalizing State Shape
            </a>
          </li>
          <li>
            <a href="https://redux-toolkit.js.org/api/createEntityAdapter" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Toolkit - createEntityAdapter API Reference
            </a>
          </li>
          <li>
            <a href="https://github.com/paularmstrong/normalizr" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              normalizr - Normalize nested JSON according to a schema
            </a>
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/caching/overview/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apollo Client - Caching and Normalization Overview
            </a>
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/application-state-management-with-react" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds - Application State Management with React
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
