"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blob-storage-concise",
  title: "Blob Storage",
  description:
    "Concise guide to blob storage, access patterns, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "blob-storage",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "blob-storage"],
  relatedTopics: [
    "object-storage",
    "file-systems",
    "cdn-edge-storage",
  ],
};

export default function BlobStorageConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Blob storage</strong> stores unstructured binary data such as
          images, videos, and backups. It is optimized for large objects and
          simple access patterns, often accessed via HTTP APIs.
        </p>
        <p>
          Blob storage is similar to object storage in practice: data is
          stored as immutable blobs identified by keys. It trades low-latency
          random I/O for massive scale and durability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Blob:</strong> Binary large object with metadata.</li>
          <li><strong>Flat namespace:</strong> Objects are keyed, not hierarchical.</li>
          <li><strong>Immutability:</strong> Updates replace entire blobs.</li>
          <li><strong>Access tiers:</strong> Hot, cool, archive storage.</li>
          <li><strong>Lifecycle rules:</strong> Auto-tiering and retention.</li>
        </ul>
        <p className="mt-4">
          Blob storage works best for write-once, read-many workloads.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Upload a blob
await blob.put("media/banner.png", fileStream);`}</code>
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
                ✓ Scales to huge data volumes<br />
                ✓ High durability<br />
                ✓ Cost-effective for large files<br />
                ✓ Simple API access
              </td>
              <td className="p-3">
                ✗ Higher latency than block storage<br />
                ✗ No random updates within blobs<br />
                ✗ Eventual consistency for listings<br />
                ✗ Not ideal for transactional data
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use blob storage when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Storing large media files or backups</li>
          <li>• Data is immutable or append-only</li>
          <li>• You need low-cost, durable storage</li>
        </ul>
        <p><strong>Use block/file storage when:</strong></p>
        <ul className="space-y-1">
          <li>• Low-latency random I/O is required</li>
          <li>• Applications need POSIX semantics</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Compare blob storage with block and file storage.</li>
          <li>Explain immutability and replace semantics.</li>
          <li>Discuss storage tiers for cost control.</li>
          <li>Highlight CDN usage with blob storage.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How is blob storage different from block storage?</p>
            <p className="mt-2 text-sm">
              A: Blob storage stores large objects with higher latency, while
              block storage provides low-latency random access to blocks.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is blob storage cost-effective?</p>
            <p className="mt-2 text-sm">
              A: It uses distributed storage optimized for large sequential
              access, reducing per-GB costs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you update part of a blob?</p>
            <p className="mt-2 text-sm">
              A: Typically no. Updates replace the entire blob or use multipart
              uploads for large objects.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you use a CDN with blob storage?</p>
            <p className="mt-2 text-sm">
              A: For global delivery of media or static assets to reduce latency.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
