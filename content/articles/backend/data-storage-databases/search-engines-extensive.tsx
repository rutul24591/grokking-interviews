"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-search-engines-extensive",
  title: "Search Engines",
  description:
    "Deep guide to search engines, inverted indexes, relevance ranking, and scalability trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "search-engines",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "search", "databases", "indexing"],
  relatedTopics: [
    "query-optimization-techniques",
    "serialization-formats",
    "caching-performance",
  ],
};

export default function SearchEnginesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Search engines</strong> are specialized systems optimized for
          full-text search, relevance ranking, and fast retrieval across large
          document collections. They typically use inverted indexes that map
          terms to document IDs, enabling fast lookups and ranking.
        </p>
        <p>
          Search engines complement databases rather than replace them. The
          primary database is the source of truth; search engines provide
          fast, flexible search and analytics capabilities.
        </p>
        <p>
          Common systems include Elasticsearch, OpenSearch, and Solr.
        </p>
      </section>

      <section>
        <h2>Inverted Index</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/inverted-index.svg"
          alt="Inverted index"
          caption="Terms map to document lists for fast search"
        />
        <p>
          The inverted index is the core of search. Instead of scanning all
          documents, the engine looks up terms in the index and retrieves a list
          of matching documents.
        </p>
        <p>
          Indexing adds write overhead but enables fast read performance.
        </p>
      </section>

      <section>
        <h2>Tokenization and Analysis</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/text-analysis.svg"
          alt="Text analysis"
          caption="Text is tokenized and normalized for indexing"
        />
        <p>
          Search engines analyze text by tokenizing it into terms, normalizing
          case, removing stop words, and applying stemming. This creates a
          consistent representation for matching queries.
        </p>
        <p>
          Analysis pipelines can be customized for specific languages or
          domains, and can include synonym expansion.
        </p>
      </section>

      <section>
        <h2>Relevance Ranking</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/relevance-ranking.svg"
          alt="Relevance ranking"
          caption="Ranking scores results based on term frequency and importance"
        />
        <p>
          Search engines rank results by relevance using algorithms such as
          BM25 or TF-IDF. They consider term frequency, field boosts, and
          document length.
        </p>
        <p>
          Relevance tuning is an iterative process: adjust analyzers, boosts,
          and ranking factors based on user feedback and click data.
        </p>
      </section>

      <section>
        <h2>Sharding and Replication</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/search-sharding.svg"
          alt="Search sharding"
          caption="Indexes are partitioned into shards for scale"
        />
        <p>
          Search engines scale by sharding indexes across nodes. Queries are
          broadcast to shards in parallel and results are merged.
        </p>
        <p>
          Replicas improve availability and increase read throughput, but add
          write cost.
        </p>
      </section>

      <section>
        <h2>Example: Full-Text Search Query</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "wireless headset",
      "fields": ["title^2", "description"]
    }
  }
}`}</code>
        </pre>
        <p>
          This query boosts matches in the title field and returns ranked
          results based on relevance.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Search engines require dedicated operational effort:
        </p>
        <ul className="space-y-2">
          <li>Indexing pipelines must stay consistent with source data.</li>
          <li>Schema changes require reindexing.</li>
          <li>Clusters must be tuned for shard size and memory.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Define analyzers and tokenizers for your domain.</li>
          <li>Pick shard counts based on expected index size.</li>
          <li>Plan reindexing strategies for schema updates.</li>
          <li>Monitor indexing lag and query latency.</li>
          <li>Keep the database as the source of truth.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
