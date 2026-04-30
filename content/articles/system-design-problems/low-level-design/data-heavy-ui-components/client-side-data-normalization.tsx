"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-client-side-data-normalization",
  title: "Design a Client-side Data Normalization System",
  description:
    "LLD for normalizing nested API data on the client: entity store, references, denormalization for views, optimistic updates, and consistent cross-screen state.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "client-side-data-normalization",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "data-normalization",
    "entity-store",
    "redux",
    "react-query",
    "state-management",
  ],
  relatedTopics: [
    "data-table",
    "real-time-data-dashboard",
    "infinite-scroll-virtualized-list",
  ],
};

export default function ClientSideDataNormalizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a client-side data normalization
          system — the layer that takes nested, denormalized
          server payloads (a list of orders, each containing
          a customer, each containing addresses) and
          restructures them into a flat, normalized store
          keyed by id. The store ensures that the same
          entity referenced from multiple places renders
          consistently: when the customer&rsquo;s name
          updates, every view showing that customer reflects
          the change without each view fetching
          independently. The component is the unsung
          backbone of any non-trivial app where the same
          entity appears in multiple views — orders + order
          detail + customer profile + sidebar — and where
          mutations need to propagate across views without
          fetching round-trips.
        </p>
        <p>
          The hard problems are: a normalization schema that
          declares how nested data flattens; reference
          tracking so denormalization for views is
          efficient; optimistic updates that touch the
          right entities and revert correctly on failure;
          subscription semantics so views re-render only
          when their entities change; cross-screen
          consistency without refetching; and integration
          with React Query or SWR for fetch orchestration
          while owning the state shape ourselves. Done well,
          this becomes the central nervous system of the
          app; done poorly, it becomes a confusing pile of
          duplicate state and stale-data bugs.
        </p>

        <h3>User Context</h3>
        <p>
          End users notice the absence of a normalized
          store via inconsistencies: a name updated on one
          screen but stale on another. Internal users
          (engineers) care about the API: how do I declare
          schemas, query the store, and mutate? Product
          managers care about the perceived quality that
          comes from instant consistent updates across
          views.
        </p>

        <h3>Assumptions</h3>
        <p>
          The app has multiple views over overlapping
          entities. Server returns nested payloads (typical
          REST or GraphQL response). Mutations return the
          updated entity. Modern React; we use external
          stores and selector hooks. We&rsquo;re not
          rebuilding Apollo or Relay from scratch — we&rsquo;re
          building a focused normalization layer that
          integrates with React Query for fetch
          orchestration.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement a full GraphQL client. We do
          not implement persistent local storage of the
          entity store (that&rsquo;s an offline subsystem).
          We do not implement schema-driven UI generation;
          consumers write their own components.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          A schema language for declaring entities and
          their relationships (one-to-one, one-to-many).
          A normalize function: nested payload + schema →
          flat <code>{`{ entityName: { id: entity } }`}</code>{" "}
          map. A denormalize function: id + schema → the
          nested view. An entity store that holds normalized
          data and supports updates by id. Subscription
          API: subscribe to specific entities or specific
          queries. Integration with React Query:
          <code> normalizedQuery(key, fetcher, schema)</code>{" "}
          fetches and normalizes. Optimistic updates that
          mutate the store immediately and revert on
          server failure. Garbage collection of unused
          entities to prevent unbounded growth.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Real-time updates via WebSocket that merge into
          the store. Selective denormalization (load only
          fields the consumer needs). Cross-tab
          synchronization. Time-travel debugging
          (snapshot history). Server-driven schema
          evolution (handle new fields gracefully).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Server-side persistence, a full GraphQL
          implementation, persistent offline storage,
          server-rendered hydration of the store
          (separate Hydration concern).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Normalization of a typical payload (a list of
          100 nested entities) under 10 ms. Denormalization
          for views memoized so subscribers don&rsquo;t pay
          the full denormalize cost on every render.
          Subscription updates fire only for affected
          entities.
        </p>

        <h3>Reliability</h3>
        <p>
          Optimistic updates always have a path back to
          server-state on failure. Concurrent mutations
          serialize via the React Query mutation queue.
          Stale data is bounded by query staleTime; we don&rsquo;t
          accumulate inconsistent state.
        </p>

        <h3>Security</h3>
        <p>
          Entity content renders as text or via consumer
          renderers; the store doesn&rsquo;t inspect or
          interpret content. Cross-user scope is enforced
          server-side; the client doesn&rsquo;t mix
          entities from different users.
        </p>

        <h3>Maintainability</h3>
        <p>
          Schemas are declarative TypeScript objects. New
          entity types are one-file additions. The store
          surface is small (queries, subscriptions,
          mutations).
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is built around three primitives: a
          <strong> schema</strong> (declares entities and
          relationships), a <strong>normalized entity
          store</strong> (flat map of id-keyed entities per
          type), and a <strong>denormalization layer</strong>{" "}
          (rebuilds nested views from the flat store on
          demand, memoized).
        </p>
        <p>
          The <strong>schema</strong> is a TypeScript object:
          for each entity type, declare the
          <code> id</code> field and any nested relationships.
          For example, an <code>order</code> schema declares
          that <code>customer</code> is a
          <code> customer</code> entity (one-to-one) and
          <code> items</code> is a list of
          <code> item</code> entities (one-to-many). The
          normalize function walks the payload, replaces
          nested objects with their ids, and adds the
          extracted entities to the store.
        </p>
        <p>
          The <strong>store</strong> is shaped as
          <code>{` { customers: { id: customer }, orders: { id: order }, items: { id: item } } `}</code>.
          Each entity is keyed by its id. Updates by id
          replace the entity (or merge fields if partial
          update). Subscribers can listen to specific
          entities (<code>useEntity(&quot;customer&quot;,
          id)</code>), specific queries (a query is a
          named selection over the store), or the whole
          store (rare).
        </p>
        <p>
          <strong>Denormalization</strong> rebuilds nested
          views from flat entities. Given a query result&rsquo;s
          shape (e.g. &ldquo;list of order ids&rdquo;) and
          the schema, the denormalize function walks the
          ids and reconstructs the nested view by reading
          referenced entities from the store. Memoization
          is keyed by (query result, store version per
          entity); when an entity hasn&rsquo;t changed, its
          denormalized form reuses the previous result.
          This is what keeps denormalization cheap for
          views that read the same data repeatedly.
        </p>
        <p>
          <strong>React Query integration</strong>: a
          <code> normalizedQuery</code> hook wraps React
          Query&rsquo;s
          <code> useQuery</code>. The fetcher returns the
          server payload; on success, we normalize and
          merge into the store. The query result returned
          to the consumer is the denormalized view, which
          is automatically updated when any of its
          referenced entities update. This means a
          mutation on customer X immediately reflects in
          every query result that includes customer X,
          across the entire app, without refetching.
        </p>
        <p>
          <strong>Mutations</strong>: a
          <code> normalizedMutation</code> hook wraps
          <code> useMutation</code>. The mutation function
          receives an <code>optimisticUpdate(state, vars)</code>{" "}
          that produces the optimistic store state, and a
          server call that returns the updated entity.
          Optimistic update applies immediately: the store
          updates, subscribers re-render, the user sees
          the change. The server call runs; on success,
          the server&rsquo;s response merges into the store
          (potentially correcting any drift between
          optimism and reality). On failure, the store
          rolls back to the pre-optimistic state. This is
          the same pattern React Query uses, but the
          normalized store makes the optimistic update
          surgical (touch one entity, every view that uses
          it updates).
        </p>
        <p>
          <strong>Subscription semantics</strong> use external
          store with selector hooks
          (<code>useSyncExternalStore</code>).
          <code> useEntity(type, id)</code> subscribes to one
          entity by id. <code>useQuery(key)</code>
          subscribes to a query result, which transitively
          subscribes to all entities that result references.
          Subscribers re-render only when their entity
          actually changes; cross-view updates flow
          automatically.
        </p>
        <p>
          <strong>Garbage collection</strong>: entities are
          tracked by reference count (how many active
          queries reference them). When the count drops to
          zero and a TTL passes, the entity is evicted
          from the store. This prevents unbounded growth
          for long-lived sessions where users browse many
          items.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>Schema</strong> is a static declaration
          per entity type. <strong>Normalizer</strong>{" "}
          walks payloads against schemas and produces flat
          entity maps. <strong>EntityStore</strong> holds
          the flat maps with subscription support.
          <strong> Denormalizer</strong> rebuilds nested
          views with memoization.
          <strong> NormalizedQuery</strong> integrates with
          React Query for fetch.
          <strong> NormalizedMutation</strong> integrates
          for optimistic updates.
          <strong> GarbageCollector</strong> evicts unused
          entities.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The entity store is the single source of truth
          for entity data. React Query owns query metadata
          (status, error, fetch timestamps); the entity
          store owns the entities themselves. Selectors
          hide the split — consumers see a unified
          view. Local UI state (form values, drag state)
          stays in components.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Schema:{" "}
          <code>{` { Customer: { name: "customer", idField: "id" }, Order: { name: "order", relationships: { customer: "Customer", items: ["Item"] } } } `}</code>.
          Normalize function:
          <code>{` (payload, schema) => { entities, result } `}</code>.
          Result is the top-level structure with refs;
          entities is the flat map. Denormalize:
          <code>{` (result, store) => nested `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          Normalization is O(payload size) once per fetch.
          Denormalization is memoized by (result, entity
          versions); cache hits are constant-time. Selector
          hooks fire only when their entity changes. The
          store uses structural sharing so unchanged
          entities keep their references, enabling
          referential equality checks for memoization.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Cross-screen consistency is the main UX win:
          updates appear instantly everywhere they&rsquo;re
          visible. Optimistic updates make mutations feel
          instant; server confirmation typically reinforces
          the optimistic state. On rollback, a brief
          banner explains what reverted and why.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          The normalization layer is invisible to a11y; it
          just provides data. Consumer components handle
          their own accessibility. State changes from
          mutations announce via live regions in the
          consumer&rsquo;s UI.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Entity content is data, not code. Schemas are
          declared in code, not loaded from runtime.
          Cross-user scope is server-enforced; the client
          never mixes entities. Sensitive entities can be
          marked in the schema for special handling
          (excluded from logs, encrypted at rest if
          persisted offline).
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for normalization correctness against
          representative payloads, denormalization
          round-trips, garbage collection on reference-
          count drops, optimistic update + rollback flows.
          Integration tests with React Query mocked,
          asserting cross-view consistency. Property tests
          for schema-driven invariants: normalize ∘
          denormalize = identity for valid payloads.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Server returns a partial entity (some fields
          missing): merge fields rather than replace, so
          existing data isn&rsquo;t lost. Two concurrent
          mutations on the same entity: serialize via
          React Query&rsquo;s mutation queue; the second
          builds on the first&rsquo;s optimistic state.
          Schema evolves (new field added server-side):
          old client tolerates it (reads the field if
          present, ignores otherwise). Circular references
          (entity A → B → A): the schema declares them as
          refs; denormalization handles cycles by tracking
          visited ids and not infinite-looping. Garbage
          collection during an active subscription: never
          evict referenced entities. Real-time push
          delivers an entity that doesn&rsquo;t fit any
          active query: store it anyway; future queries
          may use it.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The normalization layer is generic over entity
          types. Schemas are per-app. The same primitives
          power any data domain — orders, posts, files,
          configurations.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Entity content i18n is the consumer&rsquo;s
          concern. Status messages from the
          normalization layer (rare; mostly internal)
          translate via i18n.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Custom layer vs Apollo / Relay</h3>
        <p>
          Apollo and Relay are full GraphQL clients with
          built-in normalization. They&rsquo;re excellent
          for GraphQL apps; they&rsquo;re overkill for REST
          apps and force a GraphQL-shaped mental model.
          Our custom layer integrates with React Query
          (REST or GraphQL) and gives us control over the
          schema representation. The cost is more code to
          maintain; the gain is fit for the app&rsquo;s
          actual API.
        </p>

        <h3>Reference counting vs LRU GC</h3>
        <p>
          Reference counting is precise (we know exactly
          when an entity is unused). LRU is simpler but
          can evict still-needed entities under pressure.
          We use reference counting with a TTL on
          unreferenced entities (so a brief unsubscribe-
          resubscribe doesn&rsquo;t evict).
        </p>

        <h3>Memoized denormalization vs eager</h3>
        <p>
          Eager denormalization re-runs on every store
          change, wasteful. Memoized only re-runs when
          referenced entities change. The cache key is
          (query result, entity versions), which gives
          surgical re-renders.
        </p>

        <h3>External store vs Redux</h3>
        <p>
          Redux is a popular choice but has more
          boilerplate. A focused external store with
          selector hooks (Zustand-like) is lighter and
          composes cleanly with React Query. Either works;
          we use Zustand-like for simpler integration.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Persistent offline store via IndexedDB.
          Real-time WebSocket integration with
          server-pushed entity updates. Schema-driven
          TypeScript type generation for entities.
          Time-travel debugging UI. Smart prefetching
          based on observed query patterns.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why normalize on the client?</strong>{" "}
          Cross-view consistency without refetching. The
          same entity referenced from multiple views
          updates everywhere when one view mutates it,
          eliminating stale-data bugs.
        </p>

        <p>
          <strong>2. How does denormalization stay
          fast?</strong> Memoization keyed by (query result,
          entity versions). Unchanged entities reuse the
          prior denormalized form via referential
          equality.
        </p>

        <p>
          <strong>3. How do optimistic updates
          work?</strong> The mutation function specifies
          how to optimistically update the store. The
          update applies immediately; the server call
          runs; on success, the server response merges
          (correcting drift); on failure, the store
          rolls back.
        </p>

        <p>
          <strong>4. How is garbage collection
          implemented?</strong> Reference counting plus
          TTL: unreferenced entities are evicted after a
          short delay (so brief unsubscribe-resubscribe
          doesn&rsquo;t lose them).
        </p>

        <p>
          <strong>5. What about concurrent mutations on
          the same entity?</strong> React Query&rsquo;s
          mutation queue serializes them. The second
          mutation sees the first&rsquo;s optimistic state
          as its starting point.
        </p>

        <p>
          <strong>6. How does this differ from Apollo or
          Relay?</strong> Those are full GraphQL clients
          with built-in normalization. Our layer is
          REST-friendly, lighter, integrates with React
          Query, and gives explicit control over schema.
        </p>

        <p>
          <strong>7. What happens when the schema
          evolves?</strong> Server adds new fields →
          client tolerates (reads if present, ignores
          otherwise). Server removes fields → client
          handles missing values gracefully. Schema
          versioning at the edges keeps clients
          compatible across deploys.
        </p>

        <p>
          <strong>8. How do real-time updates fit
          in?</strong> A WebSocket connection emits entity
          updates; we merge them into the store via the
          same path mutations use. Subscriptions to
          affected entities fire automatically.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          Client-side data normalization is a{" "}
          <strong>flat entity store</strong> keyed by id,
          built up from nested server payloads via a
          declarative schema, with denormalization
          rebuilding nested views on demand and
          subscriptions firing only for affected
          entities. Integration with React Query handles
          fetch and mutation orchestration; the
          normalization layer handles state shape and
          cross-view consistency. Optimistic updates feel
          instant; cross-screen consistency happens
          automatically. The layer becomes the central
          nervous system of any non-trivial app.
        </p>
      </section>
    </ArticleLayout>
  );
}
