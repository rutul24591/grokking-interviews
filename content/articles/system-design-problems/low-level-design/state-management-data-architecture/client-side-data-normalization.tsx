"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-client-data-normalization",
  title: "Client-Side Data Normalization for GraphQL & REST",
  description:
    "Production-grade client-side data normalization — REST response flattening, GraphQL cache normalization, schema mapping, and unified entity store.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "client-side-data-normalization",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "data-normalization", "graphql", "rest", "entity-cache", "schema-mapping"],
  relatedTopics: ["normalized-state-design", "api-versioning-frontend"],
};

export default function ClientSideDataNormalizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Applications consume data from both REST and GraphQL APIs with different
          response shapes. REST returns nested objects, GraphQL returns exactly
          what&apos;s queried but with different shapes per query. The client needs a
          unified normalized entity store regardless of API type — same user data
          from REST /api/users/1 and GraphQL query should map to
          the same normalized entity. We need a normalization layer that handles
          both API types, maps disparate schemas to a unified entity model, and
          keeps the entity store consistent.
        </p>
        <p><strong>Assumptions:</strong> React 19+, mixed REST + GraphQL APIs, 5+ entity types.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>REST Normalizer:</strong> Flattens nested REST responses into entity tables. Handles pagination, embedded resources.</li>
          <li><strong>GraphQL Cache Normalizer:</strong> Normalizes GraphQL responses using __typename + id as entity keys. Handles interfaces and unions.</li>
          <li><strong>Schema Mapper:</strong> Maps API-specific field names to unified entity field names (api.user_name → entity.displayName).</li>
          <li><strong>Unified Entity Store:</strong> Single store for all entities regardless of source. REST and GraphQL updates merge into same tables.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>REST and GraphQL return conflicting data for same entity — merge strategy (GraphQL wins as it&apos;s more recent).</li>
          <li>GraphQL query returns partial entity — merge with existing, don&apos;t replace.</li>
          <li>REST API uses different ID format (numeric) than GraphQL (global IDs) — ID mapping layer.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          API-agnostic normalization: both REST and GraphQL responses pass through
          a normalizer that extracts entities into a unified store. The schema
          mapper translates API field names to canonical entity field names. GraphQL
          uses __typename + id for entity identification. REST uses configurable
          type paths. The entity store merges data from both sources — partial
          updates deep-merge with existing entities.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. REST Normalizer (<code>lib/rest-normalizer.ts</code>)</h4>
          <p>Configurable normalizer for REST responses. Maps response paths to entity types. Extracts embedded resources. Handles pagination metadata.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. GraphQL Cache Normalizer (<code>lib/graphql-normalizer.ts</code>)</h4>
          <p>Uses __typename + id for entity keys. Handles nested selections, interfaces (__typename determines type), unions. Apollo-cache-inspired design.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Schema Mapper (<code>lib/schema-mapper.ts</code>)</h4>
          <p>Maps API field names to canonical names. REST maps underscore fields to camelCase. GraphQL maps camelCase to canonical. Bidirectional for read/write.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. ID Resolver (<code>lib/id-resolver.ts</code>)</h4>
          <p>Maps between REST IDs (numeric: 123) and GraphQL global IDs (base64: VXNlcjoxMjM). Maintains bidirectional mapping.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Merge Strategy (<code>lib/entity-merge-strategy.ts</code>)</h4>
          <p>Deep-merges partial entities. Configurable per entity type: field-level merge, replace-all, or custom merge function.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/useNormalizedEntity.ts</code>)</h4>
          <p>Hook that fetches from either REST or GraphQL, normalizes, and returns denormalized entity. Transparent to component.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/client-side-data-normalization-architecture.svg"
          alt="Client-side data normalization showing REST and GraphQL normalizers mapping to unified entity store"
          caption="Client-Side Data Normalization Pipeline"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>API response → type-specific normalizer (REST or GraphQL) → schema mapper → ID resolver → entity merge → unified store. Components query unified store via denormalized selectors — API type is transparent.</p>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: REST normalizer, GraphQL normalizer, schema mapper, ID resolver, merge strategy, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">REST normalization</td><td className="p-2">O(e) — e entities in response</td></tr>
              <tr><td className="p-2">GraphQL normalization</td><td className="p-2">O(e) — e entities in response</td></tr>
              <tr><td className="p-2">Entity merge</td><td className="p-2">O(f) — f fields in partial entity</td></tr>
              <tr><td className="p-2">ID mapping</td><td className="p-2">O(1) — Map lookup</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Schema mapper validates field names — no arbitrary field injection. Normalized entities validated against canonical schema. Test: REST and GraphQL responses normalize to same entity, partial merge preserves existing fields, ID mapping bidirectional correctness, conflicting data resolution.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Separate stores for REST and GraphQL:</strong> Duplicate entity data, inconsistency. Fix: unified store, API-type-agnostic normalization.</li>
          <li><strong>Replacing instead of merging:</strong> GraphQL partial response overwrites full entity, losing fields. Fix: deep merge, not replace.</li>
          <li><strong>No ID mapping:</strong> REST ID 123 and GraphQL ID &quot;User:123&quot; treated as different entities. Fix: ID resolver maps between formats.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle real-time updates (WebSocket) in the normalized store?</p>
            <p className="mt-2 text-sm">
              A: WebSocket messages contain entity updates (type, id, changes).
              Pass through the same normalizer → merge pipeline. The entity store
              updates, and subscribed components re-render. For deletions, remove
              entity from table, clean up references. For creations, add to table.
              The normalization layer ensures WebSocket data (which may have
              different shape) maps to the same canonical entity model.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://www.apollographql.com/docs/react/caching/cache-configuration/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Apollo Client — Cache Normalization</a></li>
          <li><a href="https://tanstack.com/query/latest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">TanStack Query — Server State Management</a></li>
          <li><a href="https://graphql.org/learn/caching/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">GraphQL — Caching & Normalization</a></li>
          <li><a href="https://redux.js.org/usage/structuring-reducers/normalizing-state-shape" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Redux — Normalizing State Shape</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
