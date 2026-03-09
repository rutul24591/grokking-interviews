"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-file-systems-concise",
  title: "File Systems",
  description:
    "Concise guide to file systems, POSIX semantics, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "file-systems",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "file-systems"],
  relatedTopics: [
    "object-storage",
    "block-storage",
    "data-backups-archival",
  ],
};

export default function FileSystemsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>File systems</strong> organize data as files and directories
          with hierarchical paths, typically providing POSIX semantics. They
          are ideal for applications needing low-latency random access and
          standard file operations.
        </p>
        <p>
          Examples include ext4, NTFS, and network file systems like NFS. File
          systems trade massive scale for richer semantics and low-latency I/O.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>POSIX semantics:</strong> Standard file operations and permissions.</li>
          <li><strong>Directories:</strong> Hierarchical organization.</li>
          <li><strong>Random I/O:</strong> Efficient updates within files.</li>
          <li><strong>Metadata:</strong> Permissions, timestamps, ownership.</li>
          <li><strong>Locks:</strong> File and record locking for concurrency.</li>
        </ul>
        <p className="mt-4">
          File systems excel at low-latency access and compatibility with
          existing applications.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Read a file
const data = await fs.promises.readFile("/data/report.csv", "utf8");`}</code>
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
                ✓ Low-latency random access<br />
                ✓ Familiar POSIX API<br />
                ✓ Good for mutable files<br />
                ✓ Strong consistency within a node
              </td>
              <td className="p-3">
                ✗ Scaling across nodes is complex<br />
                ✗ Metadata operations can be bottlenecks<br />
                ✗ Not as durable as object storage by default<br />
                ✗ Limited global scalability
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use file systems when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Applications need POSIX semantics</li>
          <li>• Low-latency random I/O is required</li>
          <li>• Files are frequently updated in place</li>
        </ul>
        <p><strong>Use object storage when:</strong></p>
        <ul className="space-y-1">
          <li>• You need massive scale and durability</li>
          <li>• Data is large and mostly immutable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain POSIX semantics and why they matter.</li>
          <li>Discuss random I/O vs sequential access.</li>
          <li>Highlight scaling challenges in distributed file systems.</li>
          <li>Compare file systems with object storage.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not use object storage for databases?</p>
            <p className="mt-2 text-sm">
              A: Databases need low-latency random I/O and POSIX semantics,
              which object storage does not provide.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is POSIX compliance?</p>
            <p className="mt-2 text-sm">
              A: Standardized file APIs and semantics (open, read, write, locks)
              that applications rely on.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What limits file system scalability?</p>
            <p className="mt-2 text-sm">
              A: Metadata management and locking become bottlenecks at scale,
              especially in distributed file systems.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose NFS?</p>
            <p className="mt-2 text-sm">
              A: When multiple machines need shared access to a file system with
              POSIX semantics and low latency.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
