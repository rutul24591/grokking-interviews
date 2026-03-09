"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-block-storage-concise",
  title: "Block Storage",
  description:
    "Concise guide to block storage, performance characteristics, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "block-storage",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "block-storage"],
  relatedTopics: [
    "file-systems",
    "object-storage",
    "data-backups-archival",
  ],
};

export default function BlockStorageConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Block storage</strong> provides raw block devices that behave
          like virtual disks. Applications or file systems manage how blocks
          are organized. Block storage is optimized for low-latency random I/O
          and is commonly used for databases and VM disks.
        </p>
        <p>
          Examples include EBS, SAN, and iSCSI. Block storage trades simplicity
          for performance and flexibility.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Blocks:</strong> Fixed-size chunks addressed by offset.</li>
          <li><strong>Low latency:</strong> Optimized for random reads/writes.</li>
          <li><strong>Attachable volumes:</strong> Mounted to servers or VMs.</li>
          <li><strong>File system required:</strong> Blocks need a FS or DB engine.</li>
          <li><strong>IOPS/throughput:</strong> Performance metrics to tune.</li>
        </ul>
        <p className="mt-4">
          Block storage is ideal for transactional databases and VM workloads.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Linux: format and mount block volume
mkfs.ext4 /dev/nvme1n1
mount /dev/nvme1n1 /data`}</code>
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
                ✓ Low-latency random I/O<br />
                ✓ High IOPS performance<br />
                ✓ Flexible file system choice<br />
                ✓ Suitable for databases
              </td>
              <td className="p-3">
                ✗ Limited to single host attach (often)<br />
                ✗ Requires file system management<br />
                ✗ Not as scalable as object storage<br />
                ✗ Higher cost per GB
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use block storage when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Databases need low-latency I/O</li>
          <li>• You need VM or container volumes</li>
          <li>• You need consistent performance</li>
        </ul>
        <p><strong>Use object storage when:</strong></p>
        <ul className="space-y-1">
          <li>• Data is large and mostly immutable</li>
          <li>• Cost and durability are the priority</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain block vs file vs object storage.</li>
          <li>Discuss IOPS and throughput trade-offs.</li>
          <li>Note that block storage is often single-attach.</li>
          <li>Highlight database workload suitability.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is block storage good for databases?</p>
            <p className="mt-2 text-sm">
              A: It provides low-latency random access and predictable IOPS,
              which databases rely on.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does block storage differ from file storage?</p>
            <p className="mt-2 text-sm">
              A: Block storage exposes raw blocks; file systems add directories
              and file semantics on top.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is IOPS?</p>
            <p className="mt-2 text-sm">
              A: Input/Output Operations Per Second, a measure of random I/O
              performance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not use block storage for backups?</p>
            <p className="mt-2 text-sm">
              A: Object storage is cheaper and more durable for large backup
              data, while block storage is optimized for low-latency I/O.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
