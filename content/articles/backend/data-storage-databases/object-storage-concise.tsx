"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-object-storage-concise",
  title: "Object Storage",
  description:
    "Concise guide to object storage, access patterns, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "object-storage",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "object-storage"],
  relatedTopics: [
    "file-systems",
    "block-storage",
    "data-backups-archival",
  ],
};

export default function ObjectStorageConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Object storage</strong> stores data as immutable objects in a
          flat namespace, accessed by unique keys. It is optimized for scale,
          durability, and cost-effective storage of large blobs like images,
          videos, backups, and logs.
        </p>
        <p>
          Common systems include S3-compatible storage. Object storage trades
          low-latency random I/O for massive scalability and durability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Objects:</strong> Data + metadata + unique key.</li>
          <li><strong>Flat namespace:</strong> No true directories.</li>
          <li><strong>Immutability:</strong> Updates are replace operations.</li>
          <li><strong>Versioning:</strong> Keep multiple object versions.</li>
          <li><strong>Lifecycle rules:</strong> Tiering and expiration policies.</li>
          <li><strong>Event notifications:</strong> Trigger actions on object changes.</li>
        </ul>
        <p className="mt-4">
          Object storage is ideal for large, write-once-read-many workloads.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Upload a file to object storage
await storage.putObject({
  bucket: "media",
  key: "videos/intro.mp4",
  body: fileStream
});`}</code>
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
                ✓ Massive scalability<br />
                ✓ High durability and availability<br />
                ✓ Cost-effective storage<br />
                ✓ Simple HTTP-based access
              </td>
              <td className="p-3">
                ✗ Higher latency than block storage<br />
                ✗ Not suitable for random writes<br />
                ✗ No POSIX file semantics<br />
                ✗ Eventual consistency in some systems
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use object storage when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Storing large unstructured blobs</li>
          <li>• You need durable, low-cost storage</li>
          <li>• Access patterns are read-heavy or write-once</li>
        </ul>
        <p><strong>Use block/file storage when:</strong></p>
        <ul className="space-y-1">
          <li>• Low-latency random access is required</li>
          <li>• You need POSIX semantics for apps</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how objects differ from files and blocks.</li>
          <li>Discuss immutability and versioning.</li>
          <li>Mention lifecycle rules for cost optimization.</li>
          <li>Highlight durability with multi-zone replication.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is object storage cheap and durable?</p>
            <p className="mt-2 text-sm">
              A: It uses distributed replication/erasure coding and targets
              large, sequential access patterns rather than low latency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not store a database on object storage?</p>
            <p className="mt-2 text-sm">
              A: Databases require low-latency random I/O and POSIX semantics,
              which object storage does not provide.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is object versioning?</p>
            <p className="mt-2 text-sm">
              A: Keeping multiple versions of the same object key for recovery
              or audit.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do lifecycle rules help?</p>
            <p className="mt-2 text-sm">
              A: They automatically move objects to cheaper tiers or delete them.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
