"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-graph-databases-concise",
  title: "Graph Databases",
  description:
    "Concise guide to graph databases, graph modeling, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "graph-databases",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "graph"],
  relatedTopics: [
    "query-optimization-techniques",
    "cap-theorem",
    "base-properties",
  ],
};

export default function GraphDatabasesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Graph databases</strong> store data as nodes and edges,
          optimized for relationship-heavy queries. They are ideal for
          social graphs, recommendation engines, fraud detection, and network
          analysis where traversals are frequent and complex.
        </p>
        <p>
          Examples include Neo4j and Neptune. Graph databases prioritize
          relationship traversal efficiency over simple key-based access.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Nodes:</strong> Entities like users or products.</li>
          <li><strong>Edges:</strong> Relationships between nodes.</li>
          <li><strong>Properties:</strong> Attributes stored on nodes and edges.</li>
          <li><strong>Traversals:</strong> Query by walking relationships.</li>
          <li><strong>Graph queries:</strong> Cypher, Gremlin, SPARQL.</li>
          <li><strong>Indexing:</strong> Typically on node properties, not edges.</li>
        </ul>
        <p className="mt-4">
          Graph data models are best when relationships are first-class and
          queries depend on multi-hop traversals.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cypher-style query
MATCH (u:User {id: "u1"})-[:FRIEND_OF]->(f:User)
RETURN f.name;`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Fast relationship traversals<br />
                ✓ Natural modeling of networks<br />
                ✓ Flexible schema for evolving graphs<br />
                ✓ Powerful graph queries
              </td>
              <td className="p-3">
                ✗ Not ideal for simple key lookups<br />
                ✗ Scaling horizontally can be hard<br />
                ✗ Smaller ecosystem vs SQL<br />
                ✗ Learning curve for graph query languages
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use graph databases when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Relationship queries are central</li>
          <li>• You need multi-hop traversals</li>
          <li>• Data is naturally graph-shaped</li>
        </ul>
        <p><strong>Use other databases when:</strong></p>
        <ul className="space-y-1">
          <li>• Data is mostly tabular</li>
          <li>• Queries are simple aggregates or joins</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain why joins are expensive and graphs avoid them.</li>
          <li>Highlight traversal performance benefits.</li>
          <li>Mention common use cases like recommendations or fraud.</li>
          <li>Discuss trade-offs in horizontal scaling.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are graph databases good for recommendations?</p>
            <p className="mt-2 text-sm">
              A: Recommendations often require multi-hop traversals (friends of
              friends, similar products), which graph databases optimize.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a traversal?</p>
            <p className="mt-2 text-sm">
              A: A query that walks relationships across nodes to discover
              connected data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you avoid a graph database?</p>
            <p className="mt-2 text-sm">
              A: When data is mostly tabular and queries are simple joins or
              aggregates, SQL may be simpler and faster.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do graph databases scale?</p>
            <p className="mt-2 text-sm">
              A: Many scale vertically or with careful sharding, but distributed
              graph partitioning is complex due to cross-partition traversals.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
