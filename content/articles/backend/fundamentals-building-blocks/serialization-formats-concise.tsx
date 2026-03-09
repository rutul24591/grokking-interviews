"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-serialization-formats-concise",
  title: "Serialization Formats",
  description: "Quick overview of JSON, Protobuf, Avro, and other serialization formats.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "serialization-formats",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "serialization", "formats"],
  relatedTopics: ["character-encoding", "compression", "request-response-lifecycle"],
};

export default function SerializationFormatsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Serialization converts in-memory data into a transferable format.
          JSON is human-readable, while Protobuf and Avro are compact binary
          formats optimized for performance and schema evolution.
        </p>
        <p>
          The choice of format affects latency, bandwidth cost, and how safely
          you can evolve schemas over time. At scale, this becomes a major
          architecture decision, not just a serialization detail.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>JSON:</strong> Simple and readable, larger payloads.</li>
          <li><strong>Protobuf:</strong> Compact, strict schema, fast parsing.</li>
          <li><strong>Avro/Thrift:</strong> Schema-based, good for data pipelines.</li>
          <li><strong>Schema Evolution:</strong> Add fields safely, keep backward compatibility.</li>
          <li><strong>Binary vs Text:</strong> Binary is smaller/faster; text is easier to debug.</li>
        </ul>
        <p className="mt-4">
          A good rule: use JSON for external APIs and interoperability, use
          binary formats for internal high-throughput services.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// JSON encode/decode
const json = JSON.stringify({ id: 1, name: 'Ada' });
const obj = JSON.parse(json);`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain trade-offs between readability and efficiency.</li>
          <li>Discuss schema evolution and backward compatibility.</li>
          <li>Call out versioning strategies for message contracts.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use Protobuf instead of JSON?</p>
            <p className="mt-2 text-sm">A: Smaller payloads and faster parsing at scale.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is schema evolution?</p>
            <p className="mt-2 text-sm">A: Updating schemas while maintaining compatibility.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you avoid JSON?</p>
            <p className="mt-2 text-sm">
              A: High-throughput internal services where payload size and CPU matter.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
