"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-block-storage-extensive",
  title: "Block Storage",
  description:
    "Deep guide to block storage, performance characteristics, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "block-storage",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "storage", "block-storage"],
  relatedTopics: [
    "file-systems",
    "object-storage",
    "data-backups-archival",
  ],
};

export default function BlockStorageExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Block storage</strong> exposes raw block devices, similar to
          physical disks. Applications can format them with file systems or let
          databases manage blocks directly for optimal performance.
        </p>
        <p>
          Block storage is designed for low-latency random I/O and high IOPS,
          making it ideal for transactional databases, VM disks, and workloads
          with frequent updates.
        </p>
        <p>
          Unlike object storage, block storage is usually attached to a single
          host at a time, which limits sharing but improves performance.
        </p>
      </section>

      <section>
        <h2>Block Model</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/block-model.svg"
          alt="Block storage model"
          caption="Blocks are addressed by offset and size"
        />
        <p>
          Data is stored in fixed-size blocks and addressed by offset. The
          application or file system decides how to organize these blocks into
          files or records.
        </p>
      </section>

      <section>
        <h2>Performance Characteristics</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/block-performance.svg"
          alt="Block storage performance"
          caption="IOPS and throughput define performance"
        />
        <p>
          Block storage is measured by IOPS (random read/write operations) and
          throughput (MB/s). Different workloads favor different metrics.
        </p>
        <p>
          SSD-based block storage provides high IOPS for transactional workloads,
          while HDD-based storage is cheaper but slower.
        </p>
      </section>

      <section>
        <h2>Example: Mounting a Volume</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`mkfs.ext4 /dev/nvme1n1
mount /dev/nvme1n1 /data
df -h /data`}</code>
        </pre>
        <p>
          Once mounted, the block device behaves like any other file system.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Block storage provides performance but requires careful management:
        </p>
        <ul className="space-y-2">
          <li>Volumes often attach to one host, limiting sharing.</li>
          <li>Backup and snapshot management is required.</li>
          <li>Scaling requires adding and migrating volumes.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Use block storage for low-latency random I/O.</li>
          <li>Select volume types based on IOPS vs throughput needs.</li>
          <li>Plan for snapshots and backups.</li>
          <li>Avoid block storage for massive immutable blob storage.</li>
          <li>Monitor I/O saturation and latency.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
