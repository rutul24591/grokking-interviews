"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-block-storage-complete",
  title: "Block Storage",
  description:
    "Comprehensive guide to block storage: block device model, volume types, attachment model, and when to use EBS or similar services for databases and low-latency workloads.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "block-storage",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "block-storage", "ebs", "cloud-storage"],
  relatedTopics: [
    "object-storage",
    "blob-storage",
    "file-systems",
    "database-indexes",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Block Storage</h1>
        <p className="lead">
          Block storage is a storage architecture that presents raw storage volumes as block
          devices—similar to physical hard drives. Unlike object storage (flat namespace, HTTP
          access) or file storage (hierarchical, POSIX semantics), block storage provides
          low-level access to fixed-size blocks (typically 512 bytes to 4KB). The operating
          system formats block volumes with a file system (ext4, NTFS, XFS) and manages file
          operations. This raw access enables sub-millisecond latency and random read/write,
          making block storage ideal for databases, boot volumes, and latency-sensitive
          workloads.
        </p>

        <p>
          Consider a database server. The database needs to read and write data pages at random
          offsets—row 1000 might be at block 50000, row 2000 at block 75000. Block storage
          enables this: the database issues read/write commands at specific block addresses
          (Logical Block Addresses, LBA), and the storage returns data in milliseconds. Object
          storage would require downloading entire objects; file storage adds file system
          overhead. Block storage provides the raw performance databases need.
        </p>

        <p>
          Block storage services (Amazon EBS, Azure Disk Storage, Google Persistent Disk) power
          cloud infrastructure: database storage (RDS, self-managed), boot volumes for VMs
          (EC2 root volumes), file systems for applications, and any workload requiring
          low-latency random I/O. These workloads share characteristics: random access patterns,
          low-latency requirements, file system needs, and single-instance attachment.
        </p>

        <p>
          This article provides a comprehensive examination of block storage: the architecture
          (block device model, volumes, attachment), volume types (SSD, HDD, provisioned IOPS),
          performance characteristics (IOPS, throughput, latency), and real-world use cases.
          We'll explore when block storage excels (databases, boot volumes, file systems) and
          when it struggles (unstructured data at scale, HTTP access, multi-region). We'll also
          compare block storage with object storage and file storage to help you choose the
          right storage type for your use case.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/block-storage-architecture.svg`}
          caption="Figure 1: Block Storage Architecture showing block device model. Fixed-size blocks (typically 512B - 4KB) addressed by block number (LBA). Random read/write at block level. Raw storage: no file system, no hierarchy—OS formats with file system (ext4, NTFS). Volume types: SSD volumes (high IOPS, low latency, higher cost), HDD volumes (lower IOPS, higher latency, lower cost), Provisioned IOPS (guaranteed IOPS, predictable performance). Volume attachment model: EC2 instance attaches to EBS volume (single-AZ, volume tied to AZ, multi-attach limited support). Key characteristics: block-level access, random read/write, low latency, single-AZ, file system required."
          alt="Block storage architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Block Devices &amp; Volumes</h2>

        <h3>The Block Device Model</h3>
        <p>
          Block storage presents storage as a <strong>block device</strong>—an array of
          fixed-size blocks, each addressable by Logical Block Address (LBA). The OS reads/writes
          blocks directly: "read block 50000" returns 512 bytes (or 4KB) of data. There is no
          file system, no hierarchy—just raw blocks. The OS formats the volume with a file
          system (ext4, NTFS, XFS), which organizes blocks into files and directories.
        </p>

        <p>
          This model differs fundamentally from object storage. Object storage stores discrete
          objects (files) with metadata, accessed via HTTP. Block storage stores raw blocks,
          accessed via block-level commands (SCSI, NVMe). Object storage is for files; block
          storage is for file systems.
        </p>

        <h3>Volume Types</h3>
        <p>
          Block storage offers multiple volume types optimized for different workloads.
          <strong>SSD volumes</strong> (gp2/gp3 in AWS, Premium SSD in Azure) provide high IOPS
          (thousands to tens of thousands), low latency (sub-millisecond), and higher cost per
          GB. Use for: databases, boot volumes, latency-sensitive applications.
          <strong>HDD volumes</strong> (st1 in AWS, Standard HDD in Azure) provide lower IOPS
          (hundreds to low thousands), higher latency (milliseconds), and lower cost per GB.
          Use for: throughput-intensive workloads, sequential access (big data, log processing),
          cost-sensitive storage.
        </p>

        <p>
          <strong>Provisioned IOPS volumes</strong> (io1/io2 in AWS, Ultra Disk in Azure)
          guarantee specific IOPS levels (up to hundreds of thousands). You pay for provisioned
          IOPS, not just storage. Use for: mission-critical databases with predictable
          performance requirements, workloads sensitive to IOPS variability.
        </p>

        <h3>Attachment Model</h3>
        <p>
          Block volumes attach to compute instances (VMs, containers). A volume is typically
          attached to <strong>one instance at a time</strong> (single-attach). The instance
          sees the volume as a block device (/dev/sda1, /dev/nvme0n1), formats it with a file
          system, and mounts it. Multi-attach (one volume, multiple instances) is limited and
          requires cluster-aware file systems (GFS2, OCFS2) to prevent corruption.
        </p>

        <p>
          Volumes are <strong>tied to availability zones</strong> (AZ). An EBS volume in us-east-1a
          can only attach to instances in us-east-1a. Cross-AZ attachment is not supported
          (latency, data locality). For multi-AZ deployments, replicate data at the application
          level (database replication) or use file/object storage.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/block-storage-comparison.svg`}
          caption="Figure 2: Block vs Object vs File Storage comparison matrix. Block Storage: block-level (LBA) access, random read/write, sub-millisecond latency, best for databases/boot volumes/file systems/VMs, examples: EBS, Azure Disk. File Storage: file-level (POSIX) access, hierarchical access, milliseconds latency, best for shared files/legacy/home directories, examples: EFS, NFS, SMB. Object Storage: object-level (HTTP) access, whole object access, ~100ms latency, best for media/backups/archives/data lakes, examples: S3, GCS, Blob. When to use block storage: low-latency random access needed, database workloads (OLTP), boot volumes for VMs, file system required, single instance attachment. When NOT to use: unstructured data at scale, HTTP-based access needed, multi-region access, archival/cold storage, cost-sensitive large storage. Performance comparison: Block (sub-ms latency, 10K-100K IOPS), File (1-10ms latency, shared access), Object (~100ms latency, high throughput)."
          alt="Block vs object vs file storage"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Performance &amp; Durability</h2>

        <h3>Performance Characteristics</h3>
        <p>
          Block storage performance is measured in three metrics: <strong>IOPS</strong>
          (Input/Output Operations Per Second)—how many read/write operations per second.
          <strong>Throughput</strong> (MB/s)—how much data transferred per second.
          <strong>Latency</strong> (ms)—how long each operation takes. These metrics are
          interrelated: high IOPS with large block sizes = high throughput; low latency
          enables high IOPS.
        </p>

        <p>
          SSD volumes typically provide: 3,000-16,000 IOPS (burst to higher), 125-1,000 MB/s
          throughput, sub-millisecond latency. HDD volumes provide: 500-2,000 IOPS, 500 MB/s
          throughput, 5-10ms latency. Provisioned IOPS volumes provide: 10,000-256,000 IOPS
          (guaranteed), 1,000-4,000 MB/s throughput, sub-millisecond latency.
        </p>

        <h3>Durability and Availability</h3>
        <p>
          Block storage provides high durability through replication. EBS volumes replicate
          data within an availability zone (AZ)—multiple copies protect against hardware
          failure. Durability is 99.8-99.9% (0.2-0.1% annual failure rate)—lower than object
          storage (99.999999999%) because block storage prioritizes performance over durability.
        </p>

        <p>
          <strong>Snapshots</strong> provide point-in-time backups. A snapshot copies volume
          data to object storage (S3), which is more durable (11 nines). Snapshots are
          incremental (only changed blocks copied), reducing storage cost and snapshot time.
          Restore snapshots to create new volumes (same AZ or different AZ) or copy snapshots
          across regions for disaster recovery.
        </p>

        <h3>Encryption</h3>
        <p>
          Block storage supports <strong>encryption at rest</strong>. Data is encrypted before
          writing to disk, decrypted on read. Encryption is transparent to the OS and
          applications—no performance impact. Keys are managed by KMS (Key Management Service).
          Enable encryption for compliance (HIPAA, PCI-DSS) and security best practices.
        </p>

        <p>
          <strong>In-transit encryption</strong> protects data between instance and storage.
          NVMe-based EBS volumes support encryption in transit. Enable for sensitive workloads
          and compliance requirements.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/block-storage-use-cases.svg`}
          caption="Figure 3: Block Storage Use Cases & Patterns. Primary use cases: Databases (OLTP databases MySQL/PostgreSQL, NoSQL databases MongoDB/Cassandra, data warehouses Redshift/Snowflake, low-latency random I/O, transaction logs, high IOPS requirements), Boot Volumes (OS disk for VMs/EC2, application installation, system files and binaries, persistent across reboots, snapshot for backup), File Systems (formatted volumes ext4/NTFS, application scratch space, temporary storage, swap space, container persistent volumes). Common patterns: Snapshots (point-in-time backup), RAID arrays (combine volumes), Encryption (at-rest encryption), Striping (performance boost). Anti-patterns: unstructured data at scale (use object storage), HTTP access needed (use object storage), multi-region access (use object/file storage), cost-sensitive archival (use object storage). Best for: databases, boot volumes, file systems, low-latency random I/O workloads."
          alt="Block storage use cases and patterns"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Block vs Object vs File</h2>

        <p>
          Storage types occupy different niches. Understanding the trade-offs helps you choose
          the right storage for your workload.
        </p>

        <h3>Block Storage Strengths</h3>
        <p>
          <strong>Low latency</strong> is the primary advantage. Sub-millisecond latency enables
          database workloads, boot volumes, and any latency-sensitive application. Object
          storage (~100ms) and file storage (1-10ms) cannot match this.
        </p>

        <p>
          <strong>Random read/write</strong> at block level enables databases to access data
          pages at arbitrary offsets efficiently. Object storage requires whole-object access;
          block storage reads only needed blocks.
        </p>

        <p>
          <strong>File system support</strong> is essential for many applications. Databases,
          operating systems, and legacy applications require file systems. Block storage
          provides raw volumes that OS formats with file systems.
        </p>

        <p>
          <strong>High IOPS</strong> (thousands to hundreds of thousands) supports demanding
          workloads. Provisioned IOPS volumes guarantee performance for mission-critical
          databases.
        </p>

        <h3>Block Storage Limitations</h3>
        <p>
          <strong>Single-instance attachment</strong> limits use cases. A volume attaches to
          one instance at a time (typically). Sharing requires cluster file systems or
          application-level coordination. Object and file storage support concurrent access.
        </p>

        <p>
          <strong>Single-AZ scope</strong> limits availability. Volumes are tied to one AZ;
          cross-AZ attachment is not supported. For multi-AZ deployments, replicate at the
          application level (database replication) or use object/file storage.
        </p>

        <p>
          <strong>Cost at scale</strong> is higher than object storage. Block storage costs
          $0.08-0.12/GB/month (SSD); object storage costs $0.023/GB/month (Standard). For
          large-scale unstructured data, object storage is far more cost-effective.
        </p>

        <p>
          <strong>No HTTP access</strong> means block storage is not directly accessible from
          web applications. Access requires mounting on an instance. Object storage provides
          HTTP APIs for direct access.
        </p>

        <h3>When to Use Block Storage</h3>
        <p>
          Use block storage for: <strong>Databases</strong> (OLTP, NoSQL, data warehouses),
          <strong>Boot volumes</strong> (VM/EC2 root disks), <strong>File systems</strong>
          (application scratch, temporary storage), <strong>Low-latency workloads</strong>
          (real-time analytics, high-frequency trading).
        </p>

        <p>
          Avoid block storage for: <strong>Unstructured data at scale</strong> (use object
          storage), <strong>HTTP access</strong> (use object storage), <strong>Multi-region
          access</strong> (use object/file storage), <strong>Archival</strong> (use object
          storage archive tier), <strong>Shared file access</strong> (use file storage).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Block Storage</h2>

        <p>
          <strong>Choose the right volume type.</strong> SSD for databases and boot volumes,
          HDD for throughput-intensive sequential workloads, Provisioned IOPS for
          mission-critical databases. Don't over-provision (waste money) or under-provision
          (poor performance).
        </p>

        <p>
          <strong>Enable encryption.</strong> Encrypt volumes at rest for security and
          compliance. Performance impact is negligible with modern hardware encryption. Use
          KMS-managed keys for key rotation and access control.
        </p>

        <p>
          <strong>Use snapshots for backup.</strong> Schedule regular snapshots (daily for
          production, weekly for non-production). Retain snapshots per compliance requirements
          (30 days typical). Copy snapshots to other regions for disaster recovery.
        </p>

        <p>
          <strong>Monitor performance metrics.</strong> Track IOPS, throughput, latency, and
          burst balance (for gp2 volumes). Alert on sustained high latency (more than 5ms for SSD) or
          depleted burst balance. Right-size volumes based on actual usage.
        </p>

        <p>
          <strong>Use RAID for performance.</strong> Stripe multiple volumes (RAID 0) for
          higher throughput and IOPS. Mirror volumes (RAID 1) for redundancy. Note: RAID is
          at your own risk—cloud providers don't support RAID configurations.
        </p>

        <p>
          <strong>Optimize file system.</strong> Use appropriate file system (ext4 for
          general purpose, XFS for large files, NTFS for Windows). Tune file system parameters
          (block size, journaling) for workload. Regularly run file system checks.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Using HDD for databases.</strong> HDD volumes have high latency (5-10ms) and
          low IOPS (hundreds). Databases need sub-millisecond latency and thousands of IOPS.
          Solution: Use SSD or Provisioned IOPS for databases.
        </p>

        <p>
          <strong>Not monitoring burst balance.</strong> gp2 volumes accumulate burst credits
          when idle, spend credits when busy. If burst balance depletes, performance drops to
          baseline (3 IOPS/GB). Solution: Monitor burst balance, use gp3 (no burst credits) or
          provisioned IOPS for consistent performance.
        </p>

        <p>
          <strong>Ignoring single-AZ limitation.</strong> Volumes are AZ-specific. If AZ fails,
          volumes are unavailable. Solution: Use multi-AZ database deployments (replication),
          replicate snapshots to other AZs, or use object/file storage for cross-AZ access.
        </p>

        <p>
          <strong>Not encrypting sensitive data.</strong> Unencrypted volumes expose data if
          disks are compromised. Solution: Enable encryption at rest for all volumes containing
          sensitive data. Use KMS for key management.
        </p>

        <p>
          <strong>Over-provisioning IOPS.</strong> Paying for unused IOPS wastes money.
          Solution: Monitor actual IOPS usage, right-size volumes, use gp3 (pay for what you
          use) instead of gp2 (tied to volume size).
        </p>

        <p>
          <strong>Not testing restore procedures.</strong> Snapshots are useless if you can't
          restore. Solution: Regularly test restore from snapshots (quarterly). Document
          restore procedures. Measure restore time (RTO).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Database Storage (RDS, Self-Managed)</h3>
        <p>
          Databases are the primary use case for block storage. MySQL, PostgreSQL, MongoDB,
          and other databases store data files, transaction logs, and indexes on block volumes.
          SSD volumes provide the low latency and high IOPS databases need. Provisioned IOPS
          volumes guarantee performance for mission-critical databases.
        </p>

        <p>
          This pattern works because databases need random read/write at low latency. Block
          storage provides block-level access with sub-millisecond latency—essential for
          database performance.
        </p>

        <h3>Boot Volumes (EC2 Root Disks)</h3>
        <p>
          Every EC2 instance has a root volume (boot disk) containing the OS and application
          files. This is a block volume (gp2/gp3 SSD). The instance boots from the volume,
          reads/writes system files, and runs applications.
        </p>

        <p>
          Snapshots of boot volumes enable backup and recovery. If an instance fails, launch
          a new instance from the snapshot. AMIs (Amazon Machine Images) are built from
          boot volume snapshots.
        </p>

        <h3>File Systems for Applications</h3>
        <p>
          Applications need file systems for temporary storage, scratch space, and application
          data. Block volumes are formatted (ext4, XFS) and mounted at mount points (/data,
          /scratch). Applications read/write files normally.
        </p>

        <p>
          This pattern works because applications expect POSIX file semantics. Block storage
          provides raw volumes that OS formats with file systems, enabling standard file
          operations.
        </p>

        <h3>Container Persistent Volumes (Kubernetes)</h3>
        <p>
          Kubernetes pods need persistent storage that survives pod restarts. Persistent
          Volumes (PV) backed by block storage (EBS, Persistent Disk) provide this. Pods
          claim PVs via Persistent Volume Claims (PVC), mount them, and store data persistently.
        </p>

        <p>
          This pattern works because containers are ephemeral, but data needs to persist.
          Block volumes provide persistent storage that outlives containers.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose block storage over object or file storage? Give a
              concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose block storage for low-latency random access
              workloads. Example: MySQL database. Databases need to read/write data pages at
              random offsets with sub-millisecond latency. Block storage provides block-level
              access (LBA), enabling databases to fetch specific pages efficiently. Object
              storage would require downloading entire objects (inefficient); file storage
              adds file system overhead. Block storage is the only choice for databases.
              Choose object for: media, backups, archives. Choose file for: shared files,
              legacy apps. Choose block for: databases, boot volumes, file systems.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need shared access to the database?
              Answer: Block storage doesn't support multi-instance attachment (typically).
              Use database replication (primary-replica) for high availability, or use a
              managed database service (RDS) that handles replication automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain the difference between IOPS, throughput, and latency. How do they
              relate?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> IOPS (Input/Output Operations Per Second) measures how
              many read/write operations per second. Throughput (MB/s) measures how much data
              transferred per second. Latency (ms) measures how long each operation takes.
              Relationship: Throughput = IOPS × block size. High IOPS with large blocks = high
              throughput. Low latency enables high IOPS (faster operations = more operations
              per second). For databases, latency is critical (sub-millisecond). For big data,
              throughput is critical (MB/s). For mixed workloads, balance all three.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you improve IOPS? Answer: Use SSD volumes
              (higher IOPS than HDD), provision more IOPS (io1/io2 volumes), stripe multiple
              volumes (RAID 0), or increase volume size (gp2 IOPS tied to size).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What are snapshots? How do they work and what are they used for?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Snapshots are point-in-time copies of block volumes.
              Snapshot copies volume data to object storage (S3), which is more durable.
              Snapshots are incremental—only changed blocks are copied, reducing storage cost
              and snapshot time. Uses: (1) Backup—restore volume from snapshot after data loss.
              (2) Clone—create new volume from snapshot (same data, different volume). (3)
              Migration—copy snapshot to another region, launch instance there. (4) Compliance—
              retain snapshots for audit requirements.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you ensure consistent snapshots for databases?
              Answer: Flush database buffers to disk before snapshot (fsync), or stop database
              briefly during snapshot. For running databases, use database-native backup tools
              (mysqldump, pg_dump) or use RDS automated backups.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Your database is experiencing high latency. How do you diagnose if it's a
              storage issue?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check CloudWatch metrics—volume queue
              length (high = saturated), read/write latency (high = storage bottleneck), IOPS
              (hitting limit?), throughput (hitting limit?), burst balance (depleted for gp2?).
              (2) Check OS-level metrics (iostat)—wait time, I/O wait %. (3) Check database
              metrics—slow queries, lock waits. If storage metrics show high latency, high
              queue length, or depleted burst balance, it's a storage issue. Fix: (1) Upgrade
              volume type (gp2 → gp3 → io1). (2) Increase volume size (gp2 IOPS tied to size).
              (3) Stripe multiple volumes (RAID 0). (4) Optimize database queries (reduce I/O).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is burst balance? Answer: gp2 volumes accumulate
              burst credits when idle (3 IOPS/GB baseline), spend credits when busy (up to
              3,000 IOPS). If burst balance depletes, performance drops to baseline. Monitor
              burst balance, use gp3 (no burst credits) for consistent performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you backup and restore a block volume? What are best practices?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Backup: Create snapshots (manual or automated via Data
              Lifecycle Manager). Snapshots are incremental (only changed blocks), stored in
              S3 (durable). Best practices: (1) Schedule regular snapshots (daily for
              production). (2) Retain per compliance (30 days typical). (3) Copy snapshots to
              other regions for DR. (4) Encrypt snapshots for security. (5) Test restore
              procedures regularly. Restore: Create new volume from snapshot, attach to
              instance, mount file system. For boot volumes, launch new instance from snapshot
              (AMI). For data volumes, attach and mount.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How long does restore take? Answer: Snapshot restore
              is lazy—blocks load on-demand. Volume is available immediately, but first access
              to each block triggers load from S3 (higher latency initially). Pre-warm volume
              by reading all blocks (dd read) for consistent performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: What is the difference between gp2 and gp3 volumes? When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> gp2 (general purpose SSD): IOPS tied to volume size
              (3 IOPS/GB, baseline 100, max 16,000). Burst credits for higher IOPS. Cost:
              $0.10/GB-month. gp3 (general purpose SSD): IOPS independent of volume size
              (3,000 baseline, provision up to 16,000). No burst credits. Cost: $0.08/GB-month
              + $0.005/IOPS-month above 3,000. Use gp2 for: simple workloads, bursty I/O,
              small volumes. Use gp3 for: consistent performance, cost optimization (pay for
              what you use), large volumes (cheaper per GB). gp3 is generally better—more
              flexible, often cheaper.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you migrate from gp2 to gp3? Answer: Modify
              volume type in AWS Console or CLI (no downtime). Volume remains attached,
              application continues running. Migration is online and non-disruptive.
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
              href="https://docs.aws.amazon.com/ebs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon EBS Documentation — Volume Types, Snapshots, Encryption
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Azure Disk Storage Documentation — Disk Types, Snapshots
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/compute/docs/disks"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Persistent Disk Documentation — Disk Types, Snapshots
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
              href="https://aws.amazon.com/ebs/volume-types/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Whitepaper — Amazon EBS Volume Types
            </a>
          </li>
          <li>
            <a
              href="https://azure.microsoft.com/en-us/services/storage/disks/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Azure — Azure Managed Disks
            </a>
          </li>
          <li>
            <a
              href="https://www.backblaze.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Backblaze — B2 Cloud Storage vs Block Storage
            </a>
          </li>
          <li>
            <a
              href="https://docs.ceph.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ceph Documentation — RBD (RADOS Block Device)
            </a>
          </li>
          <li>
            <a
              href="https://www.kernel.org/doc/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linux Kernel Documentation — Block Devices, File Systems
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
