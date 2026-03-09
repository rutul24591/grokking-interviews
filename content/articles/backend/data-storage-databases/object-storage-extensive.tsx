"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-object-storage-extensive",
  title: "Object Storage",
  description:
    "Deep guide to object storage, durability models, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "object-storage",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "object-storage"],
  relatedTopics: [
    "file-systems",
    "block-storage",
    "data-backups-archival",
  ],
};

export default function ObjectStorageExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Object storage</strong> stores data as immutable objects with
          metadata and unique keys in a flat namespace. It is built for scale,
          high durability, and low cost, making it ideal for media, backups,
          data lakes, and logs.
        </p>
        <p>
          Object storage is accessed over HTTP and typically offers eventual
          consistency for some operations. It trades low-latency random access
          for massive scale and resilience.
        </p>
        <p>
          The core design goal is durability at scale with simplified semantics.
        </p>
      </section>

      <section>
        <h2>Object Model</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/object-model.svg"
          alt="Object model"
          caption="Objects combine data, metadata, and a key"
        />
        <p>
          Each object includes binary data, metadata, and a unique key. There
          are no real directories; “folders” are logical prefixes in keys.
        </p>
        <p>
          Updates are typically implemented as full object replacements.
        </p>
      </section>

      <section>
        <h2>Durability and Redundancy</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/object-durability.svg"
          alt="Object durability"
          caption="Replication or erasure coding for durability"
        />
        <p>
          Object storage provides very high durability using multi-zone
          replication or erasure coding. This makes it suitable for backup and
          archival workloads.
        </p>
        <p>
          The trade-off is higher latency compared to block or file systems.
        </p>
      </section>

      <section>
        <h2>Lifecycle Management</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/object-lifecycle.svg"
          alt="Object lifecycle"
          caption="Lifecycle rules move data across storage tiers"
        />
        <p>
          Lifecycle policies automate tiering: objects can be moved from hot
          storage to cold archival tiers, or deleted after a retention period.
        </p>
        <p>
          This helps manage cost while retaining required data.
        </p>
      </section>

      <section>
        <h2>Example: Upload and Versioning</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`await storage.putObject({
  bucket: "media",
  key: "avatars/user_1.png",
  body: fileStream
});

// Enable versioning for rollback
await storage.enableVersioning({ bucket: "media" });`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Object storage is powerful but not universal:
        </p>
        <ul className="space-y-2">
          <li>Not suited for random writes or frequent updates.</li>
          <li>Higher latency than block or file systems.</li>
          <li>Consistency semantics can be eventual for listings.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Use object storage for large, immutable blobs.</li>
          <li>Enable versioning for rollback and audit.</li>
          <li>Define lifecycle policies for cost optimization.</li>
          <li>Do not use object storage for low-latency random I/O.</li>
          <li>Plan for prefix-based organization for efficient listing.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
