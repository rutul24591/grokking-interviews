"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-search-service-extensive",
  title: "Search Service",
  description:
    "Build search systems that are fast and correct enough: indexing pipelines, relevance and ranking, filtering and facets, consistency trade-offs, and operational playbooks for reindexing and incidents.",
  category: "backend",
  subcategory: "system-components-services",
  slug: "search-service",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "services", "search", "performance"],
  relatedTopics: ["job-scheduler", "analytics-service", "caching-strategies"],
};

export default function SearchServiceConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What a Search Service Does</h2>
        <p>
          A <strong>search service</strong> provides fast retrieval over large datasets with features that typical
          databases do not optimize for: text relevance, tokenization, fuzzy matching, synonyms, faceting, and ranking.
          It usually separates query serving from the system of record by building an index that is optimized for reads.
        </p>
        <p>
          The core trade-off is consistency versus performance. The index is often eventually consistent with the source
          database, and search results can be stale. Strong systems make that staleness visible and manageable rather
          than pretending the index is always perfectly synchronized.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/search-service-diagram-1.svg"
          alt="Search service architecture showing indexer, search cluster, query API, and source-of-truth database"
          caption="Search systems split into two planes: indexing and query serving. Most operational complexity lives in the indexing pipeline and schema evolution."
        />
      </section>

      <section>
        <h2>Indexing Pipeline: From Source of Truth to Queryable Index</h2>
        <p>
          Indexing is a continuous ingestion problem. Data changes in the source system must be reflected in the search
          index, usually through a mix of streaming updates and periodic backfills. The pipeline must handle duplicates,
          reordering, and partial failures without creating permanent divergence.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Ingestion Patterns</h3>
          <ul className="space-y-2">
            <li>
              <strong>Change events:</strong> stream updates and deletes to the index quickly.
            </li>
            <li>
              <strong>Backfills:</strong> periodic full rebuilds or partial rebuilds to repair drift and introduce new fields.
            </li>
            <li>
              <strong>Compaction:</strong> clean up tombstones and old versions so storage and query performance remain stable.
            </li>
            <li>
              <strong>Validation:</strong> sampling checks that compare index documents to source records for correctness.
            </li>
          </ul>
        </div>
        <p>
          The system should define latency expectations for indexing. Some use cases can tolerate minutes of staleness.
          Others (inventory, availability, security data) may require much tighter bounds and additional controls.
        </p>
      </section>

      <section>
        <h2>Query Serving: Relevance, Filters, and Latency Budgets</h2>
        <p>
          Search queries often combine text relevance with structured filtering: category, price range, location,
          permissions, availability, and personalization signals. This drives a key design choice: how much of the
          filtering should happen in the search engine vs in application code or a database.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/search-service-diagram-2.svg"
          alt="Search control points: query parsing, ranking, caching, filtering, and faceting"
          caption="Search performance depends on query shape: tokenization, ranking, faceting, and filters all contribute to CPU and memory cost and to tail latency."
        />
        <p>
          Ranking is a product surface and an operational cost. More complex ranking uses more signals and more compute,
          which increases tail latency. High-quality systems enforce query budgets and expose performance controls, such
          as limiting expensive facets, bounding fuzzy matching, and caching common query results.
        </p>
        <p>
          Permissions are a common trap. If access control is applied after search, results can leak and then be filtered
          out, harming performance and correctness. Many systems encode permission constraints in the index itself or
          require a query-time filter that guarantees no unauthorized documents are returned.
        </p>
      </section>

      <section>
        <h2>Schema Evolution and Reindexing</h2>
        <p>
          Search schema changes are operationally expensive. Adding a field is often easy; changing tokenization,
          analyzers, or field types can require reindexing. Reindexing is a batch job that can saturate storage and
          compute and can destabilize search performance if not controlled.
        </p>
        <p>
          Mature systems treat reindexing as a first-class workflow: build a new index version in parallel, validate it,
          then cut over traffic gradually. Keeping the old index until the new one is proven provides a rollback path.
        </p>
      </section>

      <section>
        <h2>Consistency and Correctness Expectations</h2>
        <p>
          The search index is typically not the system of record. If users need strongly consistent answers (for example,
          a payment state), search should not be the only source. A robust product experience uses search for discovery
          and uses the source of truth for final actions and critical reads.
        </p>
        <p>
          The platform should provide tools to measure index freshness and drift. When a customer reports missing
          results, engineers should be able to answer: is the document absent, stale, filtered by permissions, or
          filtered by ranking logic?
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Search incidents are often multi-layer incidents: indexing falls behind, query latency spikes, or schema
          changes cause partial data loss. The mitigations are mostly about observability, backpressure, and safe
          evolution.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/search-service-diagram-3.svg"
          alt="Search failure modes: indexing lag, stale results, reindex overload, and hot queries causing tail latency"
          caption="Search failures often start as pipeline or query-shape issues: lag grows, caches miss, heavy queries dominate, and tail latency collapses. Controls and budgets prevent cascades."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Indexing lag</h3>
            <p className="mt-2 text-sm text-muted">
              Updates fall behind and users see stale or missing results, especially after bulk edits or backfills.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> backpressure, scaling indexers, and explicit freshness monitoring with alerting.
              </li>
              <li>
                <strong>Signal:</strong> rising age of latest indexed change and increasing backlog depth.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Hot queries and tail latency</h3>
            <p className="mt-2 text-sm text-muted">
              A small number of heavy queries dominate CPU and memory and push p99 latency beyond acceptable bounds.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> query budgets, caching, limiting expensive facets, and circuit breakers for worst offenders.
              </li>
              <li>
                <strong>Signal:</strong> latency spikes correlated with specific query shapes or high-cardinality facets.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Reindex overload</h3>
            <p className="mt-2 text-sm text-muted">
              Reindexing saturates the cluster, harming user queries and increasing error rates.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> throttle reindex jobs, isolate resources, and cut over gradually with validation.
              </li>
              <li>
                <strong>Signal:</strong> resource saturation and query error spikes aligned with reindex job start times.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Permission leakage</h3>
            <p className="mt-2 text-sm text-muted">
              Search returns documents a user should not see because permission filters are incomplete or inconsistent.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> enforce permissions at query time or encode them into index documents and validate with audits.
              </li>
              <li>
                <strong>Signal:</strong> security reports of unauthorized results or mismatch between search and source-of-truth access checks.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>
          Search operations aim to keep freshness and latency bounded while enabling controlled evolution.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Monitor freshness:</strong> track indexing lag and drift metrics, not only cluster health.
          </li>
          <li>
            <strong>Enforce query budgets:</strong> protect p99 latency by limiting heavy query features and caching common results.
          </li>
          <li>
            <strong>Operate reindexing:</strong> treat it as a planned change with throttling, validation, and rollback via parallel indices.
          </li>
          <li>
            <strong>Validate permissions:</strong> run audits and sampling to ensure the index never leaks unauthorized documents.
          </li>
          <li>
            <strong>Backfill safely:</strong> large data rebuilds run with quotas and do not starve user-facing indexing.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario: Introducing a New Facet Field</h2>
        <p>
          A marketplace adds a new facet for filtering. This change requires indexing a new field for millions of
          documents. A safe rollout builds the field in a new index version, validates that query latency remains within
          budget, and then gradually turns on the facet with a flag. If performance regresses, the system can disable
          the facet without a full rollback.
        </p>
        <p>
          This scenario highlights the operational nature of search: new features are not just product changes, they are
          cluster behavior changes.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Indexing pipeline is replayable and observable, with clear freshness targets and drift detection.
          </li>
          <li>
            Query serving enforces budgets for expensive features and tracks tail latency by query shape.
          </li>
          <li>
            Schema evolution is controlled via parallel indices, validation, and gradual cutovers.
          </li>
          <li>
            Permissions are enforced consistently and validated to prevent leakage.
          </li>
          <li>
            Reindexing and backfills are operated as budgeted workflows that do not destabilize the cluster.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use a separate search index instead of a database query?</p>
            <p className="mt-2 text-sm text-muted">
              A: Search engines optimize for text relevance, tokenization, and fast filtering and faceting at scale. They trade off strong consistency for query performance and features.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest operational risk in search systems?</p>
            <p className="mt-2 text-sm text-muted">
              A: Indexing drift and lag combined with heavy query shapes that blow up tail latency. You need freshness monitoring and query budgets to keep behavior predictable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you roll out schema changes that require reindexing?</p>
            <p className="mt-2 text-sm text-muted">
              A: Build a new index version in parallel, validate correctness and performance, and cut over gradually with a rollback path to the old index.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

