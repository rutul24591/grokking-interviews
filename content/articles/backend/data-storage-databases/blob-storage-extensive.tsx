"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blob-storage-extensive",
  title: "Blob Storage",
  description:
    "Deep guide to blob storage, durability models, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "blob-storage",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "blob-storage"],
  relatedTopics: [
    "object-storage",
    "file-systems",
    "cdn-edge-storage",
  ],
};

export default function BlobStorageExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Blob storage</strong> stores large unstructured data (blobs)
          such as images, videos, archives, and backups. Blobs are addressed by
          keys in a flat namespace and accessed via HTTP APIs.
        </p>
        <p>
          Like object storage, blob storage is optimized for scale and
          durability rather than low-latency random access. It is ideal for
          write-once, read-many content.
        </p>
        <p>
          Typical systems provide replication, versioning, and lifecycle
          management for cost efficiency.
        </p>
      </section>

      <section>
        <h2>Blob Model</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/blob-model.svg"
          alt="Blob model"
          caption="Blobs are stored by key with metadata and content"
        />
        <p>
          Blobs are treated as opaque objects with metadata. There are no
          in-place updates; updates replace the entire blob or use multipart
          uploads for large files.
        </p>
      </section>

      <section>
        <h2>Durability and Tiering</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/blob-tiering.svg"
          alt="Blob tiering"
          caption="Hot, cool, and archive tiers optimize storage cost"
        />
        <p>
          Blob storage services offer multiple tiers. Hot tiers provide low
          latency; archive tiers reduce cost but increase retrieval time.
        </p>
        <p>
          Lifecycle policies automate movement between tiers to control cost.
        </p>
      </section>

      <section>
        <h2>Example: Versioning and Lifecycle</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`await blob.enableVersioning("media");
await blob.setLifecycle({
  rule: "archive after 90 days"
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Blob storage is simple but comes with constraints:
        </p>
        <ul className="space-y-2">
          <li>Higher latency than block or file systems.</li>
          <li>No random updates inside blobs.</li>
          <li>Consistency model may be eventual for listings.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Use for large, immutable or append-only objects.</li>
          <li>Enable versioning for recovery.</li>
          <li>Define lifecycle tiers to control cost.</li>
          <li>Use CDN for global delivery.</li>
          <li>Avoid for low-latency random updates.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
