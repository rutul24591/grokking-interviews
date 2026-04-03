"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blob-storage-complete",
  title: "Blob Storage",
  description:
    "Comprehensive guide to blob storage: block/page/append blobs, access tiers, snapshots, and when to use Azure Blob Storage or similar services for unstructured data.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "blob-storage",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "blob-storage", "azure", "cloud-storage"],
  relatedTopics: [
    "object-storage",
    "block-storage",
    "file-systems",
    "data-lakes",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Blob Storage</h1>
        <p className="lead">
          Blob (Binary Large Object) storage is a cloud storage service optimized for storing
          massive amounts of unstructured data. Like object storage, blob storage uses a flat
          namespace where data is stored as discrete units with metadata and unique identifiers.
          Blob storage (Azure Blob Storage) differentiates itself with specialized blob types:
          block blobs for general files, page blobs for random read/write (VM disks), and append
          blobs for append-only workloads (logs). This specialization enables blob storage to
          serve diverse workloads from media files to VM disks to streaming logs.
        </p>

        <p>
          Consider a cloud-native application. User-uploaded documents (PDFs, images) are stored
          as block blobs—uploaded in blocks, reassembled, accessed via HTTP. VM disks are stored
          as page blobs—random read/write at 512-byte offsets, optimized for VHD format.
          Application logs stream to append blobs—each log entry appended efficiently without
          rewriting the entire file. One storage service, three optimized data types.
        </p>

        <p>
          Blob storage services (Azure Blob Storage, Google Cloud Storage blobs) power cloud
          applications: media storage (user uploads), backup systems (VHD snapshots), log
          aggregation (append blobs), and data lakes (analytics input). These workloads share
          characteristics: unstructured data, HTTP-based access, massive scale, and tiered
          access patterns (hot, cool, archive).
        </p>

        <p>
          This article provides a comprehensive examination of blob storage: the architecture
          (block/page/append blobs, containers, metadata), access tiers and lifecycle management
          (hot, cool, cold, archive), specialized features (snapshots, leases, SAS tokens), and
          real-world use cases. We'll explore when blob storage excels (VM disks, append-only
          logs, general unstructured data) and compare it with object storage (S3). We'll also
          cover common patterns (SAS tokens for secure access, snapshots for point-in-time
          copies, CDN integration for edge caching).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/blob-storage-architecture.svg`}
          caption="Figure 1: Blob Storage Architecture showing three blob types. Block Blobs (up to 4.75 TB, optimized for upload/download): upload in blocks, reassemble. Page Blobs (up to 8 TB, random read/write): 512-byte offset access, used for VHD/VM disks. Append Blobs (up to 195 GB, append-only): optimized for append operations, used for logs. Blob structure: Container (similar to bucket, e.g., 'images'), Blob (file within container, e.g., 'photo.jpg'), Metadata (name-value pairs: content-type, custom). Access tiers: Hot (frequent access), Cool (infrequent access 30+ days), Cold (rare access 90+ days), Archive (long-term 180+ days). Key characteristics: block/page/append blobs, containers, access tiers, snapshot support, lease mechanism."
          alt="Blob storage architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Blob Types &amp; Containers</h2>

        <h3>Blob Types</h3>
        <p>
          Blob storage offers three blob types optimized for different workloads. <strong>Block
          blobs</strong> are for general file storage (up to 4.75 TB). Data is uploaded as blocks
          (up to 4,000 blocks), each block uploaded independently and in parallel, then committed
          (reassembled). This enables efficient uploads (parallel, resumable) and is ideal for
          documents, media files, backups, and distribution packages.
        </p>

        <p>
          <strong>Page blobs</strong> are for random read/write workloads (up to 8 TB). Data is
          organized as pages (512 bytes each), and you can read/write at any page offset. This is
          essential for VM disks (VHD format), where the VM needs random access to disk sectors.
          Page blobs are not optimized for sequential uploads—use block blobs for that.
        </p>

        <p>
          <strong>Append blobs</strong> are for append-only workloads (up to 195 GB). Data is
          appended in blocks (up to 50,000 blocks), each block appended to the end. You cannot
          modify existing blocks—only append new ones. This is ideal for logs, audit trails, and
          telemetry where data is written once and never modified.
        </p>

        <h3>Containers and Organization</h3>
        <p>
          <strong>Containers</strong> organize blobs within a storage account. A container is
          similar to an S3 bucket—a flat namespace for blobs. Blob names can include "/"
          characters to simulate folders (e.g., "images/2024/vacation.jpg"), but the namespace
          is flat—there are no actual folders. Containers provide access control boundaries
          (different containers can have different access policies) and lifecycle management
          scopes (different retention policies per container).
        </p>

        <p>
          <strong>Metadata</strong> is name-value pairs attached to blobs. System metadata
          includes content-type, content-length, and last-modified. Custom metadata enables
          application-specific tags (e.g., "user-id=123", "project=alpha"). Metadata is stored
          separately from blob data and can be queried without downloading the blob—useful for
          filtering and organization.
        </p>

        <h3>Access Tiers</h3>
        <p>
          Blob storage offers four access tiers optimized for different access patterns.
          <strong>Hot tier</strong> is for frequently accessed data—highest storage cost, lowest
          access cost, lowest latency. <strong>Cool tier</strong> is for infrequently accessed
          data (30+ days)—lower storage cost, higher access cost, slightly higher latency.
          <strong>Cold tier</strong> is for rarely accessed data (90+ days)—even lower storage
          cost, higher access cost, higher latency. <strong>Archive tier</strong> is for
          long-term archives (180+ days)—lowest storage cost, highest access cost, highest
          latency (hours to retrieve, rehydration required).
        </p>

        <p>
          <strong>Lifecycle management policies</strong> automatically transition blobs between
          tiers based on age or access patterns. Example: upload to Hot tier, transition to Cool
          after 30 days, transition to Archive after 1 year, delete after 7 years. This optimizes
          costs automatically without manual intervention.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/blob-storage-comparison.svg`}
          caption="Figure 2: Blob Storage vs Object Storage comparison. Similarities (often used interchangeably): flat namespace, HTTP API access, metadata support, high durability. Key differences: Blob Storage (Azure) has specialized blob types (block blobs for files/media, page blobs for VHD/VMs, append blobs for logs), features include snapshots (read-only versions), leases (exclusive access), incremental snapshots. Object Storage (S3, GCS) has standard objects only, features include versioning (multiple versions), Object Lambda (transform on read), intelligent tiering. Use cases: Blob Storage for Azure ecosystem, VM disks, append-only logs; Object Storage for AWS/GCP ecosystem, general unstructured data, data lakes. In practice, both serve similar purposes—choice often depends on cloud provider."
          alt="Blob storage vs object storage"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Specialized Features</h2>

        <h3>Snapshots</h3>
        <p>
          <strong>Snapshots</strong> are read-only, point-in-time copies of blobs. Creating a
          snapshot captures the blob state at that moment. The snapshot is stored efficiently
          (only changed blocks are stored, not full copy). Snapshots enable: <strong>Backup</strong>
          (capture state before changes), <strong>Recovery</strong> (restore from snapshot after
          accidental modification), <strong>Testing</strong> (test against snapshot without
          affecting production data).
        </p>

        <p>
          <strong>Incremental snapshots</strong> (page blobs only) store only changes since the
          previous snapshot. This is far more efficient than full snapshots for frequently-changing
          data (VM disks). Restore any snapshot to recover a previous state.
        </p>

        <h3>Leases</h3>
        <p>
          <strong>Leases</strong> provide exclusive access to blobs. Acquiring a lease grants
          exclusive write/delete rights for a duration (15-60 seconds, renewable). While a lease
          is held, other clients cannot modify or delete the blob. This prevents concurrent write
          conflicts and enables distributed coordination (e.g., leader election using blob leases).
        </p>

        <p>
          Lease pattern: Client A acquires lease (60 seconds), writes to blob, renews lease if
          work continues, releases lease when done. If Client A crashes without releasing, lease
          expires and Client B can acquire. This is a distributed lock mechanism built into blob
          storage.
        </p>

        <h3>SAS Tokens</h3>
        <p>
          <strong>Shared Access Signature (SAS) tokens</strong> provide time-limited,
          permission-scoped access to blobs without sharing storage account keys. A SAS token
          is a URL query string granting specific permissions (read, write, delete) for a
          specific duration. Use cases: <strong>Secure downloads</strong> (grant read access
          for 1 hour), <strong>Secure uploads</strong> (grant write access for upload only),
          <strong>Delegated access</strong> (grant access to specific container, not entire
          account).
        </p>

        <p>
          SAS tokens are signed with storage account keys (or Azure AD credentials). Revoking
          access requires changing the key or waiting for token expiration. Use short-lived
          tokens (minutes to hours) for security.
        </p>

        <h3>CDN Integration</h3>
        <p>
          Blob storage integrates with CDN (Content Delivery Network) for edge caching. Popular
          blobs are cached at edge locations worldwide, reducing latency for global users. CDN
          pulls from blob storage on cache miss, serves from cache on cache hit. This is essential
          for media delivery (videos, images) where low latency is critical.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/blob-storage-use-cases.svg`}
          caption="Figure 3: Blob Storage Use Cases & Patterns by blob type. Block Blobs: document storage, media files (images, video), backup files, distribution packages, data files for analytics, web assets (CSS, JS). Page Blobs: VM disk storage (VHD), random read/write workloads, database files (rare), 512-byte offset access. Append Blobs: application logs, audit trails, IoT telemetry, event streaming, write-once append-many workloads. Common patterns: SAS tokens (time-limited access), snapshots (point-in-time copies), leases (exclusive write access), CDN integration (edge caching). Anti-patterns: frequent random writes (use page blobs or block storage), small files <1KB (metadata overhead), low-latency databases (use block storage). Best for: large unstructured files, append-only logs, VM disks, backup/archival."
          alt="Blob storage use cases and patterns"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Blob vs Object Storage</h2>

        <p>
          Blob storage and object storage (S3) are often used interchangeably—both store
          unstructured data in flat namespaces with HTTP access. But there are differences.
        </p>

        <h3>Blob Storage Strengths</h3>
        <p>
          <strong>Specialized blob types</strong> are the primary advantage. Page blobs enable
          VM disk storage (random read/write at 512-byte offsets)—object storage cannot do this.
          Append blobs optimize for append-only workloads (logs)—more efficient than object
          storage's overwrite model. Block blobs are comparable to S3 objects.
        </p>

        <p>
          <strong>Snapshots</strong> are built-in and efficient. Incremental snapshots (page
          blobs) store only changes, enabling frequent backups with minimal storage overhead.
          Object storage requires versioning (full copies) or custom backup solutions.
        </p>

        <p>
          <strong>Leases</strong> provide distributed locking. This enables coordination
          patterns (leader election, exclusive processing) without external services. Object
          storage lacks this feature.
        </p>

        <p>
          <strong>Azure ecosystem integration</strong> is seamless. Blob storage integrates
          with Azure VMs (page blobs for disks), Azure Functions (trigger on blob upload),
          Azure Data Lake (analytics), and Azure Backup. If you're on Azure, blob storage is
          the natural choice.
        </p>

        <h3>Object Storage Strengths</h3>
        <p>
          <strong>Mature ecosystem</strong> (S3) has more integrations, tools, and third-party
          support. S3 is the de facto standard for object storage—most tools support S3 APIs.
          Blob storage has fewer integrations outside Azure ecosystem.
        </p>

        <p>
          <strong>Versioning</strong> is more flexible in S3. S3 versioning retains all versions
          automatically; blob storage requires explicit snapshots. S3 also offers Object Lambda
          (transform objects on read) and Intelligent Tiering (automatic tier optimization).
        </p>

        <p>
          <strong>Multi-cloud portability</strong> is better with S3. S3 APIs are widely
          supported (MinIO, Ceph, other S3-compatible stores). Blob storage APIs are
          Azure-specific.
        </p>

        <h3>When to Use Blob Storage</h3>
        <p>
          Use blob storage for: <strong>VM disks</strong> (page blobs for VHD), <strong>Append-only
          logs</strong> (append blobs for telemetry), <strong>Azure ecosystem</strong> (seamless
          integration), <strong>Snapshots required</strong> (built-in, efficient),
          <strong>Distributed locking</strong> (leases for coordination).
        </p>

        <p>
          Use object storage for: <strong>Multi-cloud</strong> (S3 compatibility), <strong>General
          unstructured data</strong> (block blobs vs S3 objects are comparable), <strong>Data
          lakes</strong> (both work, S3 more common), <strong>Third-party integrations</strong>
          (S3 has more support).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Blob Storage</h2>

        <p>
          <strong>Choose the right blob type.</strong> Block blobs for general files, page blobs
          for VM disks/random access, append blobs for logs. Using the wrong type causes
          inefficiency (e.g., appending to block blobs requires rewriting the entire blob).
        </p>

        <p>
          <strong>Use lifecycle management.</strong> Define tier transitions and expiration
          rules when creating containers. Don't wait until storage costs explode. Typical
          policy: Hot → Cool (30 days) → Archive (1 year) → Delete (7 years).
        </p>

        <p>
          <strong>Use SAS tokens for access.</strong> Don't share storage account keys. Generate
          SAS tokens with minimal permissions (read-only for downloads, write-only for uploads)
          and short expiration (hours, not days). Rotate keys regularly.
        </p>

        <p>
          <strong>Enable soft delete.</strong> Soft delete retains deleted blobs for a retention
          period (7-365 days). This protects against accidental deletes. Combine with snapshots
          for comprehensive data protection.
        </p>

        <p>
          <strong>Use CDN for frequently accessed blobs.</strong> If blobs are accessed globally,
          integrate with CDN. Cache hit rates of 90%+ are common for static assets, dramatically
          reducing latency and blob storage egress costs.
        </p>

        <p>
          <strong>Monitor storage metrics.</strong> Track storage consumption per container,
          access tier distribution, transaction counts, and egress bandwidth. Set alerts for
          unexpected growth (potential leaks or attacks).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Using block blobs for random access.</strong> Block blobs don't support random
          read/write—use page blobs for VM disks. Attempting random access to block blobs requires
          downloading entire blob, modifying, re-uploading (inefficient).
        </p>

        <p>
          <strong>Not setting lifecycle policies.</strong> Data accumulates in expensive Hot
          tier. Solution: Define lifecycle policies from day one. Transition data to cooler
          tiers based on age.
        </p>

        <p>
          <strong>Sharing storage account keys.</strong> Keys grant full access to entire storage
          account. Solution: Use SAS tokens with minimal permissions and short expiration. Use
          Azure AD authentication where possible.
        </p>

        <p>
          <strong>Ignoring egress costs.</strong> Blob storage ingress (uploads) is free, but
          egress (downloads) costs money. High egress can be expensive. Solution: Use CDN for
          frequently accessed blobs (lower egress costs), compress data before download, cache
          locally.
        </p>

        <p>
          <strong>Not enabling soft delete.</strong> Accidental deletes are permanent without
          soft delete. Solution: Enable soft delete with appropriate retention period (30-90
          days typical).
        </p>

        <p>
          <strong>Storing small files inefficiently.</strong> Each blob has metadata overhead.
          Storing millions of 1KB files is inefficient. Solution: Aggregate small files into
          larger archives (ZIP, TAR), or use databases/key-value stores for small data.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>VM Disk Storage (Azure VMs)</h3>
        <p>
          Azure VMs use page blobs for OS and data disks. VHD files are stored as page blobs,
          enabling random read/write at 512-byte offsets (required for disk I/O). Snapshots
          capture VM state for backup. Incremental snapshots minimize storage costs (only
          changed blocks stored). This is the primary use case for page blobs.
        </p>

        <h3>Log Aggregation (Application Logs)</h3>
        <p>
          Applications stream logs to append blobs. Each log entry is appended efficiently
          (no rewrite). Multiple instances can append to the same blob (with coordination).
          Lifecycle policies transition old logs to cooler tiers, then delete after retention
          period. This is more efficient than block blobs for append-only workloads.
        </p>

        <h3>Media Upload Platform (User-Generated Content)</h3>
        <p>
          User-uploaded photos and videos are stored as block blobs. Multipart uploads enable
          parallel uploads (faster, resumable). SAS tokens grant time-limited upload access
          (users upload directly from browser, not through application server). CDN caches
          popular content for low-latency delivery. Lifecycle policies transition old content
          to cooler tiers.
        </p>

        <h3>Backup and Disaster Recovery</h3>
        <p>
          Backup software writes to blob storage (block blobs for backup files, page blobs
          for VM snapshots). Snapshots provide point-in-time recovery. Geo-redundant storage
          replicates to secondary region for disaster recovery. Archive tier stores long-term
          backups at lowest cost.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose blob storage over object storage? Give a concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose blob storage when you need specialized blob types
              or Azure ecosystem integration. Example: VM disk storage for Azure VMs. Page blobs
              support random read/write at 512-byte offsets—required for VHD format. Object
              storage (S3) cannot do this. Another example: append-only logs. Append blobs are
              optimized for append operations—more efficient than object storage's overwrite
              model. If you're on Azure, blob storage integrates seamlessly with Azure services
              (VMs, Functions, Data Lake). Choose object storage for: multi-cloud, S3
              compatibility, broader third-party support.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need both random access and append? Answer:
              Use different blob types for different workloads. Page blobs for random access (VM
              disks), append blobs for append-only (logs). Don't try to use one blob type for
              everything.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain the three blob types and when to use each.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Block blobs (up to 4.75 TB): upload in blocks, reassemble.
              Use for: documents, media files, backups, distribution packages. Optimized for
              sequential upload/download. Page blobs (up to 8 TB): random read/write at 512-byte
              offsets. Use for: VM disks (VHD), random access workloads. Optimized for random
              I/O. Append blobs (up to 195 GB): append-only, blocks appended to end. Use for:
              logs, audit trails, telemetry. Optimized for append operations. Choosing wrong
              type causes inefficiency (e.g., appending to block blobs requires full rewrite).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are the size limits? Answer: Block blobs 4.75 TB,
              page blobs 8 TB, append blobs 195 GB. For larger data, split into multiple blobs
              or use different storage (data lake, distributed file system).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are SAS tokens? How do you use them securely?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> SAS (Shared Access Signature) tokens provide time-limited,
              permission-scoped access to blobs without sharing storage account keys. A SAS token
              is a URL query string granting specific permissions (read, write, delete) for a
              specific duration. Secure usage: (1) Minimal permissions—grant only what's needed
              (read-only for downloads, write-only for uploads). (2) Short expiration—hours, not
              days. (3) Use HTTPS—SAS tokens in URLs can be intercepted. (4) Don't share account
              keys—generate SAS tokens instead. (5) Revoke by rotating keys if compromised.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you generate SAS tokens? Answer: Use Azure SDK
              or Azure Portal. Specify resource (blob/container), permissions (r/w/d), start time,
              expiry time, and sign with storage account key or Azure AD credentials.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a log aggregation system using blob storage. How do you ensure efficiency
              and manage costs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use append blobs for log storage. Each application instance
              appends log entries to a blob (e.g., "logs/app-instance-id/date.log"). Append blobs
              are optimized for append operations—efficient, no rewrite. For cost management:
              lifecycle policies transition logs to Cool tier after 30 days, Archive after 90
              days, delete after 1 year (compliance). Use compression (gzip) before appending to
              reduce storage. Aggregate logs periodically (daily) into larger blobs for analytics.
              Monitor storage growth with alerts.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle concurrent appends from multiple
              instances? Answer: Each instance writes to its own blob (no contention), or use
              block IDs to coordinate appends. For high-volume logs, consider Event Hubs or
              Kafka for ingestion, then batch-write to append blobs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What are snapshots? How do they differ from versioning?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Snapshots are read-only, point-in-time copies of blobs.
              Creating a snapshot captures blob state at that moment. Incremental snapshots
              (page blobs) store only changes since previous snapshot—efficient for frequent
              backups. Versioning (S3) automatically retains all versions of an object when
              modified. Differences: Snapshots are explicit (you create them), versioning is
              automatic (every change creates version). Snapshots can be deleted independently;
              versions are managed by versioning policy. Snapshots are Azure-specific; versioning
              is S3 feature.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you use snapshots vs versioning? Answer:
              Snapshots for explicit backup points (before deployment, before migration).
              Versioning for automatic retention of all changes (audit trail, recovery from
              accidental overwrites).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your blob storage costs are growing unexpectedly. How do you diagnose and
              reduce costs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Use Azure Storage Explorer or portal to
              identify cost drivers (which containers, which tiers). (2) Check storage metrics—
              total blobs, storage per tier. (3) Review lifecycle policies—are they configured?
              (4) Check for orphaned snapshots (accumulating over time). (5) Analyze access
              patterns—are blobs in appropriate tiers? Reduce costs: (1) Configure lifecycle
              policies to transition data to cooler tiers. (2) Delete old snapshots after
              retention period. (3) Set expiration rules for temporary data. (4) Use compression
              before upload. (5) Delete unused containers. (6) Set up cost alerts for future
              monitoring. (7) Consider Archive tier for long-term data.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is the cost difference between tiers? Answer:
              Hot tier is most expensive (~$0.018/GB/month), Cool is ~50% cheaper, Cold is ~70%
              cheaper, Archive is ~90% cheaper but has retrieval costs and latency.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.microsoft.com/en-us/azure/storage/blobs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Azure Blob Storage Documentation — Blob Types, Access Tiers, Security
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/s3/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon S3 Documentation — Storage Classes, Versioning
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/storage/docs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Storage Documentation — Storage Classes, Object Lifecycle
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019. Chapter 3.
          </li>
          <li>
            <a
              href="https://azure.microsoft.com/en-us/services/storage/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Azure — Azure Storage Documentation
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/s3/storage-classes/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Amazon S3 Storage Classes
            </a>
          </li>
          <li>
            <a
              href="https://www.backblaze.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Backblaze — B2 Cloud Storage vs S3 vs Azure Blob
            </a>
          </li>
          <li>
            <a
              href="https://min.io/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MinIO Documentation — Object Storage Architecture
            </a>
          </li>
          <li>
            <a
              href="https://docs.ceph.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ceph Documentation — RADOS and Object Storage
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
