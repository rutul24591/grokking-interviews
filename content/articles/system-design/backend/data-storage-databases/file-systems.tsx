"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-file-systems-complete",
  title: "File Systems",
  description:
    "Comprehensive guide to file systems: hierarchical namespace, POSIX semantics, NFS/SMB protocols, and when to use EFS or similar services for shared file access.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "file-systems",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "file-systems", "nfs", "cloud-storage"],
  relatedTopics: [
    "object-storage",
    "block-storage",
    "blob-storage",
    "data-lakes",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>File Systems</h1>
        <p className="lead">
          File systems provide hierarchical, file-level storage with POSIX semantics (Portable
          Operating System Interface). Unlike block storage (raw blocks, no hierarchy) or object
          storage (flat namespace, HTTP access), file systems organize data in directories and
          subdirectories, accessed via file paths (/home/user/documents/file.txt). File systems
          support standard file operations (read, write, seek, append) and file locking for
          concurrent access. This makes file systems ideal for shared file access, legacy
          applications, and workloads requiring POSIX semantics.
        </p>

        <p>
          Consider a content management system. Multiple web servers need to access the same
          media files (images, videos, documents). With block storage, each server would have
          its own volume—no sharing. With object storage, applications need HTTP APIs—not
          POSIX file operations. With file storage (NFS, EFS), all servers mount the same
          file system, access files via standard paths, and share data seamlessly.
        </p>

        <p>
          File system services (Amazon EFS, Azure Files, Google Filestore) power shared
          workloads: home directories (user files accessible from any machine), content
          management (shared media libraries), legacy applications (requiring POSIX file
          semantics), and development environments (shared code repositories). These workloads
          share characteristics: hierarchical data, POSIX operations, shared access, and
          moderate latency tolerance (milliseconds vs sub-millisecond for block storage).
        </p>

        <p>
          This article provides a comprehensive examination of file systems: the architecture
          (hierarchical namespace, POSIX semantics, file operations), protocols (NFS, SMB/CIFS),
          cloud file services (EFS, Azure Files, Filestore), and real-world use cases. We'll
          explore when file systems excel (shared files, legacy apps, home directories) and
          when they struggle (low-latency databases, unstructured data at scale, HTTP access).
          We'll also compare file systems with block storage and object storage to help you
          choose the right storage type for your use case.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/file-systems-architecture.svg`}
          caption="Figure 1: File System Architecture showing hierarchical structure. Tree structure with parent-child relationships: root (/) → directories (/home, /var) → subdirectories (/home/user, /home/admin) → files. Paths: /home/user/documents/file.txt. POSIX semantics: read, write, seek, append operations. File system types: Local File Systems (ext4, XFS, NTFS, APFS - single machine), Network File Systems (NFS, SMB/CIFS - shared over network), Distributed File Systems (HDFS, Ceph, GlusterFS - scale-out). Access methods: Sequential (read from start to end), Random (seek to any offset), Memory-Mapped (map file to memory), Direct I/O (bypass cache). Key characteristics: hierarchical namespace, POSIX semantics, file-level access, shared access (network/distributed)."
          alt="File system architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Hierarchy &amp; POSIX Semantics</h2>

        <h3>Hierarchical Namespace</h3>
        <p>
          File systems organize data hierarchically: root directory (/) contains subdirectories,
          which contain files and more subdirectories. Files are accessed via paths:
          /home/user/documents/file.txt. This hierarchy enables organization (files grouped by
          purpose), access control (permissions per directory), and navigation (cd, ls commands).
        </p>

        <p>
          This model differs from object storage (flat namespace, no directories) and block
          storage (no namespace, just blocks). File systems provide familiar file operations
          that applications and users expect.
        </p>

        <h3>POSIX Semantics</h3>
        <p>
          <strong>POSIX</strong> (Portable Operating System Interface) defines standard file
          operations: <strong>read</strong> (read bytes from offset), <strong>write</strong>
          (write bytes at offset), <strong>seek</strong> (move file pointer),
          <strong>append</strong> (write at end), <strong>lock</strong> (exclusive/shared locks
          for concurrent access). POSIX also defines permissions (read/write/execute for
          owner/group/others) and metadata (owner, group, timestamps).
        </p>

        <p>
          POSIX semantics enable <strong>strong consistency</strong>: after a write completes,
          subsequent reads return the new data. This is essential for databases and applications
          that rely on immediate consistency. Network file systems (NFS, SMB) implement POSIX
          semantics over the network, enabling shared access with consistency guarantees.
        </p>

        <h3>File System Types</h3>
        <p>
          <strong>Local file systems</strong> (ext4, XFS, NTFS, APFS) are attached directly to
          a single machine. They provide the lowest latency (direct disk access) but no sharing.
          Use for: boot volumes, application storage, databases.
        </p>

        <p>
          <strong>Network file systems</strong> (NFS, SMB/CIFS) are shared over a network.
          Multiple clients mount the same file system and access files concurrently. NFS is
          common in Linux/Unix environments; SMB/CIFS is common in Windows environments. Use
          for: shared files, home directories, legacy applications.
        </p>

        <p>
          <strong>Distributed file systems</strong> (HDFS, Ceph, GlusterFS) scale across
          multiple servers. Data is distributed (sharded) across nodes, enabling horizontal
          scale. Use for: big data (HDFS), large-scale shared storage (Ceph), scale-out NAS
          (GlusterFS).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/file-systems-comparison.svg`}
          caption="Figure 2: File vs Block vs Object Storage comparison matrix. Block Storage: block-level (LBA) access, random read/write, sub-millisecond latency, best for databases/boot volumes/file systems/VMs, examples: EBS, Azure Disk, cost: $0.08-0.12/GB. File Storage: file-level (POSIX) access, hierarchical access, milliseconds latency, best for shared files/legacy/home directories, examples: EFS, NFS, SMB, cost: $0.30/GB. Object Storage: object-level (HTTP) access, whole object access, ~100ms latency, best for media/backups/archives/data lakes, examples: S3, GCS, Blob, cost: $0.023/GB. When to use file storage: shared file access needed (multi-instance), POSIX semantics required, legacy applications, home directories, content management systems. When NOT to use: low-latency databases (use block), unstructured data at scale (use object), HTTP-based access (use object), cost-sensitive archival (use object), multi-region access (use object)."
          alt="File vs block vs object storage"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Protocols &amp; Cloud Services</h2>

        <h3>NFS (Network File System)</h3>
        <p>
          <strong>NFS</strong> is the standard protocol for Unix/Linux file sharing. NFSv4
          (current version) provides: stateful connections (improved performance), strong
          security (Kerberos authentication), delegations (client-side caching), and compound
          operations (multiple operations in one request). NFS mounts appear as local file
          systems—applications use standard file operations without modification.
        </p>

        <p>
          NFS performance depends on network latency and server capacity. Typical latency:
          1-10ms (vs sub-ms for local storage). Throughput: 100 MB/s to 10 GB/s depending on
          network and server. NFS is suitable for shared files, but not for low-latency
          databases.
        </p>

        <h3>SMB/CIFS (Server Message Block)</h3>
        <p>
          <strong>SMB</strong> (Server Message Block, formerly CIFS) is the standard protocol
          for Windows file sharing. SMB 3.0 (current version) provides: SMB Direct (RDMA for
          low latency), SMB Multichannel (multiple connections for throughput), encryption,
          and continuous availability (failover without disconnect). SMB mounts appear as
          network drives (Z:) in Windows.
        </p>

        <p>
          SMB is essential for Windows environments: Active Directory integration, Windows
          permissions, and Windows application compatibility. Linux clients can mount SMB
          shares (cifs-utils), but POSIX semantics are limited.
        </p>

        <h3>Cloud File Services</h3>
        <p>
          Cloud providers offer managed file storage services. <strong>Amazon EFS</strong>
          (Elastic File System) provides NFSv4 file storage, scalable to petabytes, with
          multiple availability zone support. <strong>Azure Files</strong> provides SMB file
          shares, integrated with Active Directory. <strong>Google Filestore</strong> provides
          NFS file storage for GCP workloads.
        </p>

        <p>
          Cloud file services eliminate operational overhead (no servers to manage), provide
          elastic scaling (storage grows automatically), and integrate with cloud ecosystems
          (IAM, VPC, backups). Trade-off: higher cost than self-managed NFS servers.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/file-systems-use-cases.svg`}
          caption="Figure 3: File Storage Use Cases & Patterns. Primary use cases: Shared Files (team collaboration files, shared project directories, multi-instance access, concurrent read/write, file locking support), Home Directories (user home directories, roaming profiles, persistent user data, multi-session access), Legacy Applications (legacy apps requiring POSIX, content management systems, media processing pipelines, development environments). Common patterns: NFS Mounts (Linux/Unix sharing), SMB/CIFS (Windows file sharing), Cloud File Services (EFS, Azure Files), Backup Targets (network backups). Anti-patterns: low-latency databases (use block storage), unstructured data at scale (use object storage), HTTP access needed (use object storage), cost-sensitive large storage (use object storage). Best for: shared file access, legacy applications, home directories, content management, multi-instance file access."
          alt="File storage use cases and patterns"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: File vs Block vs Object</h2>

        <p>
          Storage types occupy different niches. Understanding the trade-offs helps you choose
          the right storage for your workload.
        </p>

        <h3>File Storage Strengths</h3>
        <p>
          <strong>Shared access</strong> is the primary advantage. Multiple instances mount the
          same file system and access files concurrently. This is essential for content
          management (multiple web servers serving same files), home directories (users access
          from any machine), and collaboration (team shared folders).
        </p>

        <p>
          <strong>POSIX semantics</strong> enable legacy application compatibility. Applications
          expecting file system operations (fopen, fread, fwrite) work without modification.
          Block storage requires formatting with a file system; object storage requires API
          changes.
        </p>

        <p>
          <strong>Hierarchical organization</strong> is familiar and intuitive. Files grouped
          in directories, permissions per directory, easy navigation. This is essential for
          user-facing file systems (home directories) and content management.
        </p>

        <p>
          <strong>File locking</strong> enables safe concurrent access. Exclusive locks prevent
          conflicting writes; shared locks enable concurrent reads. This is essential for
          databases and applications that rely on file locking.
        </p>

        <h3>File Storage Limitations</h3>
        <p>
          <strong>Latency</strong> is higher than block storage. Network file systems add
          network round-trips (1-10ms vs sub-ms for block storage). This makes file storage
          unsuitable for low-latency databases.
        </p>

        <p>
          <strong>Cost</strong> is higher than object storage. File storage costs ~$0.30/GB/month;
          object storage costs ~$0.023/GB/month. For large-scale unstructured data, object
          storage is far more cost-effective.
        </p>

        <p>
          <strong>Scale limitations</strong> exist for single file systems. While cloud file
          services scale to petabytes, performance degrades with millions of files. Object
          storage scales better for massive file counts.
        </p>

        <p>
          <strong>No HTTP access</strong> means file storage is not directly accessible from
          web applications. Access requires mounting on an instance. Object storage provides
          HTTP APIs for direct access.
        </p>

        <h3>When to Use File Storage</h3>
        <p>
          Use file storage for: <strong>Shared files</strong> (multiple instances access same
          files), <strong>Legacy applications</strong> (requiring POSIX semantics),
          <strong>Home directories</strong> (user files accessible from any machine),
          <strong>Content management</strong> (shared media libraries), <strong>Development
          environments</strong> (shared code repositories).
        </p>

        <p>
          Avoid file storage for: <strong>Low-latency databases</strong> (use block storage),
          <strong>Unstructured data at scale</strong> (use object storage), <strong>HTTP
          access</strong> (use object storage), <strong>Archival</strong> (use object storage
          archive tier), <strong>Cost-sensitive large storage</strong> (use object storage).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for File Systems</h2>

        <p>
          <strong>Choose the right protocol.</strong> NFS for Linux/Unix, SMB for Windows.
          Don't mix protocols on the same share (permission conflicts). For mixed environments,
          use NFS with SMB gateway or vice versa.
        </p>

        <p>
          <strong>Optimize mount options.</strong> Use appropriate mount options for workload:
          rsize/wsize (read/write buffer sizes), async/sync (write behavior), noatime (don't
          update access time, reduces writes). Test different options for your workload.
        </p>

        <p>
          <strong>Monitor performance.</strong> Track latency, throughput, and IOPS. Alert on
          sustained high latency (more than 10ms for NFS). Scale up (larger file system) or scale out
          (multiple file systems) based on metrics.
        </p>

        <p>
          <strong>Implement backup strategies.</strong> File systems need backups like any
          storage. Use snapshot-based backups (cloud file services support snapshots), or
          traditional backup tools (rsync, tar). Test restore procedures regularly.
        </p>

        <p>
          <strong>Manage permissions carefully.</strong> Use least-privilege permissions.
          Regularly audit file permissions. For cloud file services, integrate with IAM for
          access control.
        </p>

        <p>
          <strong>Plan for growth.</strong> Cloud file services scale automatically, but
          performance tiers may need adjustment. Monitor capacity and throughput, adjust tier
          before performance degrades.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Using file storage for databases.</strong> File storage latency (1-10ms) is
          too high for databases (need sub-ms). Solution: Use block storage for databases.
        </p>

        <p>
          <strong>Not optimizing mount options.</strong> Default mount options may not be
          optimal. Solution: Test different rsize/wsize values, use noatime for read-heavy
          workloads, use async for better write performance (with data loss risk).
        </p>

        <p>
          <strong>Ignoring network latency.</strong> File storage performance depends on
          network. Solution: Place clients and file storage in same region/AZ, use enhanced
          networking, monitor network latency.
        </p>

        <p>
          <strong>Permission conflicts.</strong> Mixing NFS and SMB on same share causes
          permission conflicts. Solution: Use one protocol per share, or use gateway services
          that translate between protocols.
        </p>

        <p>
          <strong>Not monitoring capacity.</strong> File systems can fill up, causing
          application failures. Solution: Set up capacity alerts (80% full), implement
          lifecycle policies (archive old files), regularly clean up unused files.
        </p>

        <p>
          <strong>Single point of failure.</strong> Single file server is a single point of
          failure. Solution: Use managed cloud file services (multi-AZ), or implement HA for
          self-managed NFS (Pacemaker, DRBD).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Content Management Systems (WordPress, Drupal)</h3>
        <p>
          CMS platforms store media files (images, videos, documents) that multiple web servers
          need to access. File storage (EFS, Azure Files) provides shared access: all web
          servers mount the same file system, serve files from shared storage. This enables
          horizontal scaling (add web servers without copying files) and centralized management
          (one copy of each file).
        </p>

        <p>
          This pattern works because CMS workloads need POSIX file operations (fopen, fread)
          and shared access. Object storage would require application changes; block storage
          doesn't support sharing.
        </p>

        <h3>Home Directories (Enterprise)</h3>
        <p>
          Enterprises store user home directories on file storage. Users access their files
          from any machine (roaming profiles). File storage provides POSIX permissions
          (user/group ownership), quotas (per-user limits), and backup integration.
        </p>

        <p>
          This pattern works because home directories need hierarchical organization, POSIX
          permissions, and shared access (users access from multiple machines).
        </p>

        <h3>Development Environments</h3>
        <p>
          Development teams share code repositories, build artifacts, and test data on file
          storage. Multiple developers access the same files concurrently. File locking
          prevents conflicting edits.
        </p>

        <p>
          This pattern works because development workloads need shared access, POSIX semantics
          (build tools expect file systems), and file locking.
        </p>

        <h3>Media Processing Pipelines</h3>
        <p>
          Media processing (video transcoding, image processing) uses file storage for input
          and output files. Multiple processing nodes read source files, write processed files
          to shared storage. Downstream systems access processed files.
        </p>

        <p>
          This pattern works because media processing needs shared access (multiple nodes),
          large file support (GB files), and sequential I/O (streaming reads/writes).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose file storage over block or object storage? Give a
              concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose file storage for shared file access with POSIX
              semantics. Example: Content management system (WordPress). Multiple web servers
              need to access the same media files (images, themes, plugins). Block storage
              doesn't support sharing (one instance per volume). Object storage requires HTTP
              APIs (application changes). File storage (EFS, NFS) enables all web servers to
              mount the same file system, access files via standard paths, with no application
              changes. Choose block for: databases, boot volumes. Choose object for: media,
              backups, archives. Choose file for: shared files, legacy apps, home directories.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What about performance? Answer: File storage has
              higher latency (1-10ms) than block storage (sub-ms). Not suitable for databases.
              But for file serving (CMS, home directories), latency is acceptable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain the difference between NFS and SMB. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> NFS (Network File System) is the standard for Unix/Linux
              file sharing. NFSv4 provides stateful connections, Kerberos authentication,
              delegations (client caching). SMB (Server Message Block) is the standard for
              Windows file sharing. SMB 3.0 provides SMB Direct (RDMA), Multichannel,
              encryption, continuous availability. Use NFS for: Linux/Unix environments,
              development environments, content management. Use SMB for: Windows environments,
              Active Directory integration, Windows applications. For mixed environments, use
              NFS with SMB gateway or choose based on primary workload.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can Linux mount SMB shares? Answer: Yes, using
              cifs-utils. But POSIX semantics are limited (Windows permissions don't map
              perfectly to Unix permissions). For full POSIX support, use NFS.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: Your application is experiencing slow file access. How do you diagnose if
              it's a file storage issue?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check network latency (ping, traceroute)
              between client and file server. High network latency = file storage issue.
              (2) Check file system metrics (CloudWatch for EFS)—latency, IOPS, throughput.
              High latency or throttling = file storage bottleneck. (3) Check mount options
              (rsize, wsize, async/sync). Suboptimal options = performance issue. (4) Check
              client-side (iostat, nfsstat)—wait time, retransmissions. Fix: (1) Place client
              and file storage in same AZ (reduce network latency). (2) Scale up file system
              (higher performance tier). (3) Optimize mount options (larger rsize/wsize).
              (4) Use multiple mount points (distribute load).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is throughput mode for EFS? Answer: EFS has
              bursting throughput (burst credits based on storage size) and provisioned
              throughput (pay for specific throughput). If burst credits deplete, throughput
              drops. Monitor burst balance, use provisioned throughput for consistent
              performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you backup a file system? What are best practices?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Backup methods: (1) Snapshots (cloud file services)—
              point-in-time copies, incremental (only changed blocks), stored durably.
              (2) Traditional backup (rsync, tar)—copy files to backup location, incremental
              backups. (3) Third-party backup tools (Veeam, Commvault)—enterprise backup with
              deduplication, compression. Best practices: (1) Schedule regular snapshots
              (daily for production). (2) Retain per compliance (30 days typical). (3) Copy
              snapshots to other regions for DR. (4) Test restore procedures regularly.
              (5) Monitor backup success/failure.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you ensure consistent snapshots for active
              file systems? Answer: Quiesce file system before snapshot (flush buffers, pause
              writes), or use application-consistent backup tools. For databases on file
              storage, use database-native backup tools.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What are the performance characteristics of file storage vs block vs object?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Block storage: sub-millisecond latency, 10K-100K IOPS,
              highest performance. File storage: 1-10ms latency, shared access, moderate
              performance. Object storage: ~100ms latency, high throughput, best for large
              sequential access. Cost: Block $0.08-0.12/GB, File $0.30/GB, Object $0.023/GB.
              Choose based on workload: databases need block (low latency), shared files need
              file (POSIX, sharing), media/archives need object (cost, scale).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why is file storage more expensive than object?
              Answer: File storage provides POSIX semantics, file locking, hierarchical
              namespace—more complex than object storage. Object storage is simpler (flat
              namespace, HTTP API), optimized for scale and cost.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: How do you scale file storage for high-throughput workloads?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Scale methods: (1) Scale up (cloud file services)—
              increase performance tier (EFS: General Purpose → Max I/O). (2) Scale out—use
              multiple file systems, distribute load across them. (3) Optimize client—use
              multiple mount points, parallel I/O, larger buffer sizes. (4) Use caching—client-side
              caching (fs-cache), CDN for static files. (5) Use distributed file systems
              (HDFS, Ceph) for massive scale. Best practices: Monitor throughput metrics,
              scale before hitting limits, use provisioned throughput for predictable workloads.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is the difference between EFS General Purpose
              and Max I/O? Answer: General Purpose: lower latency (~3ms), lower throughput
              (scales with storage). Max I/O: higher latency (~10ms), higher throughput
              (10+ GB/s), for high-throughput workloads (big data, media processing).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Amazon EFS Documentation, "How It Works," "Performance," "Security,"
            https://docs.aws.amazon.com/efs/
          </li>
          <li>
            Azure Files Documentation, "Introduction," "Protocols,"
            https://docs.microsoft.com/en-us/azure/storage/files/
          </li>
          <li>
            Google Filestore Documentation, "Overview," "Tiers,"
            https://cloud.google.com/filestore/docs
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 3.
          </li>
          <li>
            NFS Documentation, "NFSv4 Protocol,"
            https://www.rfc-editor.org/rfc/rfc7530.txt
          </li>
          <li>
            SMB Documentation, "SMB Protocol,"
            https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/
          </li>
          <li>
            HDFS Documentation, "HDFS Architecture,"
            https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/
          </li>
          <li>
            Ceph Documentation, "Ceph File System,"
            https://docs.ceph.com/
          </li>
          <li>
            Linux Documentation, "File Systems," "Mount Options,"
            https://www.kernel.org/doc/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
