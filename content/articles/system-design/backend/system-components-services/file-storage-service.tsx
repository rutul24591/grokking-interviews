"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-file-storage-service",
  title: "File Storage Service",
  description:
    "Design and operate distributed file storage systems: upload pipelines, multipart transfers, CDN integration, metadata management, consistency models, and failure recovery at production scale.",
  category: "backend",
  subcategory: "system-components-services",
  slug: "file-storage-service",
  wordCount: 5500,
  readingTime: 28,
  lastUpdated: "2026-04-06",
  tags: ["backend", "storage", "file-upload", "cdn", "object-storage", "distributed-systems"],
  relatedTopics: ["media-processing-service", "cdn-architecture", "data-lifecycle-management"],
};

export default function FileStorageServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>file storage service</strong> is a distributed system that provides durable, scalable, and highly
          available storage for binary objects (files) of arbitrary size and type. It serves as the backbone for
          user-generated content, document management, media libraries, backup systems, and data lake architectures. At
          its core, a file storage service must guarantee durability (the file will not be lost), availability (the file
          can be retrieved when needed), and integrity (the file retrieved is identical to the file stored). These three
          guarantees form the foundation of trust between the storage service and its consumers.
        </p>
        <p>
          File storage services operate at multiple scales. For small applications, a simple object storage bucket with
          presigned URLs may suffice. For enterprise-scale systems serving millions of users with petabytes of data, the
          architecture must encompass multipart upload coordination, content distribution networks, metadata indexing,
          access control enforcement, lifecycle management, and cross-region replication. Each layer adds complexity but
          enables the system to handle production-scale workloads with predictable performance and strong durability
          guarantees.
        </p>
        <p>
          The fundamental architectural challenge in file storage is balancing the read-heavy access patterns typical of
          content delivery against the write-heavy ingestion patterns of user uploads. Most file storage systems exhibit
          a skewed ratio where reads outnumber writes by an order of magnitude, but the write path carries the highest
          risk: a failed upload corrupts user trust, a lost file is irrecoverable without backups, and a slow upload
          experience drives user abandonment. The design must therefore optimize the read path for throughput and
          latency while ensuring the write path is resilient to network failures and produces verifiably correct results.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/file-storage-architecture.svg"
          alt="File storage service architecture showing client layer, API gateway, upload pipeline, download pipeline, object storage, metadata store, and CDN"
          caption="File storage architecture &#8212; clients upload through presigned URLs, objects are stored durably in object storage, metadata is tracked separately, and CDN caches serve downloads."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Object storage versus block storage</strong> defines the fundamental data model. Object storage
          treats each file as an immutable blob identified by a unique key, stored in a flat namespace organized into
          buckets. This model provides simplicity, unlimited scalability per bucket, and built-in versioning. Block
          storage presents a raw disk interface with byte-level read and write operations, suitable for databases and
          file systems but not for serving files to end users. Modern file storage services are built on object storage
          (Amazon S3, Google Cloud Storage, Azure Blob Storage) because the object model aligns with the access patterns
          of file upload and download: write once, read many, with no need for in-place modification.
        </p>
        <p>
          <strong>Multipart upload</strong> is the mechanism for reliably transferring large files by dividing them into
          chunks (typically five megabytes each) that are uploaded independently and in parallel. The client initiates a
          multipart upload session, receives an upload identifier, uploads each part independently, and then signals
          completion. The storage service assembles the parts into a single object. Multipart upload provides three
          critical benefits: resilience to network failures (only failed parts need retransmission), parallelism
          (multiple parts upload simultaneously, utilizing available bandwidth), and the ability to upload files larger
          than the single-request size limit of the storage API. The minimum part size is typically five megabytes, with
          a maximum of ten thousand parts per upload, enabling files up to five terabytes.
        </p>
        <p>
          <strong>Presigned URLs</strong> are time-limited, cryptographically signed URLs that grant direct access to a
          specific storage object without exposing the storage service credentials. The application server generates a
          presigned URL after validating the user&apos;s authorization, and the client uses this URL to upload or
          download directly from object storage. This pattern eliminates the application server from the data transfer
          path, reducing latency and server load while maintaining security through scoped, time-bound access tokens. The
          presigned URL encodes the HTTP method, the object key, the expiration timestamp, and a signature computed
          with the server&apos;s credentials, making it tamper-proof and self-authenticating.
        </p>
        <p>
          <strong>Metadata management</strong> separates the concerns of file content from file attributes. The object
          storage system stores the binary content, while a separate metadata store (typically a relational database or
          distributed key-value store) tracks file attributes such as name, size, content type, owner, access control
          list, version history, and custom tags. This separation enables rich querying (find all files owned by user X
          larger than Y megabytes) that object storage alone cannot support efficiently. The metadata store must be
          consistent with the object store: when a file is uploaded, the metadata record must be created; when a file is
          deleted, the metadata record must be removed. Distributed transactions or sagas ensure this consistency.
        </p>
        <p>
          <strong>Content delivery network integration</strong> is essential for read-heavy workloads. A CDN caches
          frequently accessed objects at edge locations close to users, reducing latency and origin load. The CDN is
          configured with a TTL (time-to-live) for each object type: static assets like images and videos may have TTLs
          of hours or days, while user-generated content with frequent updates may have TTLs of minutes. Cache
          invalidation is triggered when objects are updated or deleted, using CDN purge APIs that remove cached copies
          across all edge locations. The CDN acts as a shield, absorbing the vast majority of read requests and only
          forwarding cache misses to the origin storage system.
        </p>
        <p>
          <strong>Access control and security</strong> operate at multiple layers. At the storage layer, bucket policies
          and object ACLs control which identities can read, write, or delete objects. At the application layer, the
          service enforces business-logic access rules (a user can only access their own files, or files shared with
          them). At the network layer, TLS encryption protects data in transit, and server-side encryption (SSE-S3,
          SSE-KMS, or customer-managed keys) protects data at rest. For regulated industries, additional controls such
          as WORM (write once, read many) compliance, retention policies, and audit logging ensure that files cannot be
          altered or deleted before their retention period expires.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/file-upload-flow.svg"
          alt="File upload flow showing initiate upload, generate presigned URL, upload parts in parallel, complete multipart, and verify checksum"
          caption="Multipart upload with presigned URLs &#8212; clients upload chunks directly to object storage in parallel, then signal completion for assembly with checksum verification."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The file storage service architecture consists of an API gateway layer for request routing and
          authentication, an upload pipeline for processing incoming files, a download pipeline for serving files to
          consumers, the underlying object storage for durable content persistence, a metadata store for file attribute
          tracking, and a CDN edge cache for low-latency content delivery. The API gateway handles rate limiting,
          authentication, authorization, SSL termination, and request routing to the appropriate backend service. It
          also implements circuit breaking to protect downstream services during degradation.
        </p>
        <p>
          The upload pipeline begins when a client requests a presigned URL from the API server. The server validates
          the user&apos;s authentication and authorization, checks storage quota limits, generates a unique object key,
          and returns a presigned URL with a configurable time-to-live, typically fifteen minutes. The client then
          uploads the file directly to object storage using the presigned URL. For large files, the client uses multipart
          upload, dividing the file into chunks and uploading them in parallel. During upload, the pipeline performs
          virus scanning on the incoming content, detects the content type from the file signature (not just the
          extension), and extracts metadata such as image dimensions, video duration, or document page count.
        </p>
        <p>
          The download pipeline handles access control checks, CDN cache lookups, range request support for partial
          content retrieval, streaming responses for large files, bandwidth throttling to prevent a single user from
          consuming excessive resources, and ETag generation for cache validation. When a download request arrives, the
          CDN first checks its edge cache. On a cache hit, the object is served directly from the edge with sub-fifty-millisecond
          latency. On a cache miss, the request is forwarded to the origin, which validates access permissions, retrieves
          the object from storage, and streams it back through the CDN for caching and delivery.
        </p>
        <p>
          The metadata store tracks file attributes, access control lists, version history, and custom tags. It is
          typically a relational database for strong consistency or a distributed key-value store for high throughput.
          The metadata store is sharded by tenant or user identifier to enable horizontal scaling, and read replicas
          handle the read-heavy query load. Write operations to the metadata store (creating a file record, updating
          attributes, deleting a record) are performed through the primary database instance and replicated to read
          replicas with eventual consistency.
        </p>
        <p>
          The object storage layer provides the durability foundation. Modern object storage systems like Amazon S3
          achieve eleven nines of durability by storing each object redundantly across multiple availability zones,
          using checksums to detect bit rot, and automatically repairing corrupted copies from healthy replicas. The
          storage system is horizontally scalable with no practical limit on the number of objects or total storage
          capacity per account. Objects are immutable: updating a file creates a new version, and the previous version
          is retained if versioning is enabled.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/file-storage-scaling.svg"
          alt="File storage scaling strategies showing horizontal API scaling, object storage auto-partitioning, CDN edge network scaling, and metadata database read replicas with sharding"
          caption="Scaling strategies &#8212; horizontal API scaling, auto-partitioning object storage, CDN edge distribution, and sharded metadata databases with read replicas."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <p>
          The primary trade-off in file storage architecture is between consistency and availability in the metadata
          layer. When a file is uploaded, the metadata record must be created before the file is considered visible to
          the user. In a strongly consistent metadata store, the upload operation blocks until the metadata is
          committed, ensuring that the file is immediately visible but adding latency to the upload path. In an
          eventually consistent metadata store, the upload returns quickly and the metadata propagates asynchronously,
          but the file may not appear in listing queries for a brief period. Most production systems choose strong
          consistency for the metadata store because user experience demands immediate visibility of uploaded files,
          and the latency cost of a single database write is negligible compared to the upload transfer time.
        </p>
        <p>
          Direct-to-storage uploads via presigned URLs versus proxying uploads through the application server present a
          fundamental architectural choice. Direct uploads eliminate the application server from the data transfer path,
          reducing server CPU and bandwidth costs, enabling parallel multipart uploads without server-side coordination,
          and scaling to arbitrarily large files. The trade-off is that the application server loses visibility into the
          upload progress and cannot perform server-side validation of the uploaded content before it reaches storage.
          Proxy uploads give the server full control over the upload process, enabling validation, transformation, and
          virus scanning before persistence, but they consume server resources and create a bottleneck for large files.
          The recommended approach is direct uploads with presigned URLs for large files and proxy uploads for small
          files that require server-side processing.
        </p>
        <p>
          CDN caching versus direct origin serving involves a trade-off between performance and freshness. Caching
          objects at the CDN edge dramatically reduces latency for end users and protects the origin from read load, but
          it introduces a staleness window between an object update and cache invalidation propagation. Direct origin
          serving always returns the latest version but incurs higher latency and origin load. Most systems use CDN
          caching with appropriate TTLs based on content type: static assets have long TTLs with cache busting via
          filename versioning, user-generated content has moderate TTLs with invalidation on update, and private content
          uses short TTLs or no caching with signed URLs for each request.
        </p>
        <p>
          Versioning policies affect both storage cost and user safety. Enabling versioning on the object storage bucket
          retains every version of every object, providing protection against accidental deletion and enabling rollback
          to previous versions. The cost is increased storage consumption and the need for lifecycle policies to clean up
          old versions. Disabling versioning saves storage cost but makes accidental deletion irreversible. The
          recommended approach is to enable versioning for production buckets with lifecycle policies that transition
          old versions to cheaper storage tiers after a configurable period and permanently delete them after a longer
          retention window.
        </p>
        <p>
          The choice between a unified storage bucket versus per-tenant buckets affects isolation and operational
          complexity. A single bucket with tenant-prefixed keys is simpler to manage and enables cross-tenant analytics,
          but it requires careful access control enforcement and creates a single point of failure for all tenants.
          Per-tenant buckets provide strong isolation, independent lifecycle policies, and the ability to apply
          tenant-specific storage classes, but they increase operational overhead and complicate cross-tenant queries.
          Most systems use a hybrid approach: separate buckets for large enterprise tenants with specific compliance
          requirements, and shared buckets with tenant-prefixed keys for smaller tenants.
        </p>
        <p>
          Storage class selection (standard, infrequent access, archival) involves a trade-off between access cost and
          storage cost. Standard storage provides the lowest access latency and highest throughput but at the highest
          per-gigabyte cost. Infrequent access storage is cheaper for storage but charges more per retrieval, making it
          suitable for data accessed less than once per month. Archival storage (such as Glacier) offers the lowest
          storage cost but with retrieval times of hours, suitable for compliance archives and long-term backups.
          Intelligent tiering policies automatically move objects between storage classes based on access patterns,
          optimizing cost without manual intervention.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always use presigned URLs for client-side uploads to eliminate the application server from the data transfer
          path. The presigned URL should be scoped to the specific object key, HTTP method, and a short time-to-live of
          fifteen minutes or less. Generate the presigned URL server-side after validating the user&apos;s authorization
          and checking storage quota limits. For multipart uploads, generate presigned URLs for each part individually
          or use a session token that authorizes all parts within a single multipart upload session.
        </p>
        <p>
          Implement lifecycle policies from the beginning to manage storage costs and prevent unbounded growth. Define
          rules for transitioning objects to cheaper storage classes based on access patterns, expiring incomplete
          multipart uploads after seven days to reclaim storage from abandoned uploads, and permanently deleting old
          versions after the retention period. Lifecycle policies are a cost control mechanism that prevents storage
          costs from growing linearly with time.
        </p>
        <p>
          Enable server-side encryption for all objects at rest. Use SSE-KMS (server-side encryption with key management
          service) for objects that require audit logging of key usage and the ability to rotate encryption keys. Use
          SSE-S3 for objects where managed key rotation is sufficient without per-object key audit trails. For highly
          sensitive data, use customer-managed keys through a hardware security module or cloud KMS with customer-provided
          encryption keys. Encryption should be transparent to the application and enforced at the storage layer.
        </p>
        <p>
          Use CDN caching aggressively for public content with appropriate TTLs based on content type. Set long TTLs
          for static assets with cache-busting filenames, moderate TTLs for user-generated content with invalidation on
          update, and short TTLs for content that changes frequently. Configure the CDN to forward authentication
          headers for private content and use signed URLs or signed cookies for access control. Monitor cache hit ratios
          and adjust TTLs to optimize the balance between freshness and origin load reduction.
        </p>
        <p>
          Validate uploaded content on both the client and server side. Client-side validation provides immediate
          feedback to users about file size limits, allowed content types, and format requirements. Server-side
          validation is essential for security: verify the content type from the file signature, scan for malware,
          enforce size limits, and check for prohibited content. The server-side validation should happen before the
          object is made publicly accessible, either during the upload pipeline or through an asynchronous processing
          step that reviews newly uploaded content.
        </p>
        <p>
          Monitor storage metrics continuously: total storage consumption, number of objects, upload and download
          request rates, error rates, latency percentiles, CDN cache hit ratios, and lifecycle policy execution counts.
          Set alerts for anomalous patterns such as sudden spikes in storage consumption (potential abuse or runaway
          upload), increased error rates (storage service degradation), and declining cache hit ratios (CDN
          misconfiguration or content changes). Storage metrics are leading indicators of operational issues that, if
          unaddressed, can cascade into user-facing problems.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Failing to clean up incomplete multipart uploads is one of the most common and costly mistakes. When a client
          initiates a multipart upload but never completes it, the uploaded parts remain in storage indefinitely,
          consuming space and incurring costs. Without a lifecycle policy to abort incomplete uploads after a
          configurable period, these orphaned parts accumulate over time and become a significant hidden cost. The fix
          is straightforward: configure a lifecycle rule that aborts incomplete multipart uploads after seven days, and
          regularly audit storage for orphaned parts from before the rule was enabled.
        </p>
        <p>
          Storing file metadata in the same database as application data creates a scalability bottleneck. As the number
          of files grows, the metadata table becomes large and slow to query, impacting application performance. The
          metadata store should be a dedicated database optimized for file attribute queries, with its own scaling
          strategy and indexing plan. Separating file metadata from application data enables independent scaling and
          prevents file operations from impacting core application performance.
        </p>
        <p>
          Not implementing rate limiting on upload endpoints allows a single user or tenant to consume disproportionate
          storage and bandwidth resources. Rate limits should be enforced at multiple levels: per-user upload rate
          (files per minute), per-user bandwidth (megabytes per minute), per-tenant total storage quota, and per-file
          size limit. Without these limits, a misconfigured client or malicious user can exhaust storage capacity,
          saturate network bandwidth, and degrade the experience for all other users.
        </p>
        <p>
          Ignoring content-type detection and relying solely on file extensions creates security and compatibility
          issues. A user can upload a file with a dot-j-p-g extension that actually contains executable code, and if the
          service serves it with the image slash-jpeg content type based on the extension, browsers may execute the
          malicious content. The service should detect the actual content type from the file signature using libraries
          like libmagic or cloud provider content detection APIs, and serve the file with the detected content type, not
          the user-provided extension.
        </p>
        <p>
          Not planning for cross-region replication when building a globally distributed service leads to high latency
          for users far from the storage region. If the storage bucket is in us-east-1, users in Asia and Europe will
          experience significantly higher upload and download latencies. Cross-region replication asynchronously copies
          objects to buckets in other regions, enabling users to read from the nearest region. The replication lag
          (typically seconds to minutes) means that recently uploaded files may not be available in replica regions
          immediately, but this is acceptable for read-heavy workloads where the read latency improvement outweighs the
          brief replication delay.
        </p>
        <p>
          Overlooking the cost impact of frequent small files is a subtle but significant issue. Object storage charges
          per request in addition to per-gigabyte storage. A workload with millions of small files incurs high request
          costs that can exceed the storage costs. Where possible, batch small files into archives (tar, zip) before
          uploading, or use a different storage model for small objects. This optimization is particularly important for
          workloads like log storage, telemetry data, and message archives where the individual objects are small but
          numerous.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Dropbox built its entire product on a file storage architecture with a custom block-level synchronization
          protocol that transfers only the changed blocks of files rather than entire files. This differential sync
          approach dramatically reduces bandwidth consumption for large files with small changes, such as documents and
          virtual machine images. Dropbox&apos;s storage backend uses Amazon S3 for durable object storage with a custom
          metadata layer that tracks file versions, sync state, and sharing permissions across billions of files.
        </p>
        <p>
          Google Photos serves billions of users with a file storage architecture that combines object storage for
          original-quality photos, compressed storage for storage-saver quality, and a metadata layer for facial
          recognition, object detection, and search indexing. Google Photos uses intelligent storage tiering to move
          rarely accessed photos to cheaper storage while keeping frequently viewed photos in high-performance tiers,
          optimizing cost at petabyte scale.
        </p>
        <p>
          GitHub stores all repository data, including Git objects, LFS (large file storage) objects, and release
          artifacts, in a file storage architecture backed by Azure Blob Storage. GitHub&apos;s LFS service uses
          pointer files in the repository that reference large objects stored separately, enabling efficient cloning of
          repositories with large binary assets. The LFS service uses presigned URLs for direct upload and download,
          CDN caching for frequently accessed artifacts, and lifecycle policies to manage storage costs.
        </p>
        <p>
          Slack uses file storage for message attachments, shared images, and exported workspace data. Slack&apos;s
          storage architecture handles the challenge of files shared in conversations with varying access controls: some
          files are visible to the entire workspace, some to specific channels, and some to individual users through
          direct messages. The access control layer integrates with Slack&apos;s permission model, and the CDN is
          configured to cache public files aggressively while using signed URLs for private files with short TTLs.
        </p>
        <p>
          Netflix uses file storage for its entire content library, including master video files, encoded variants at
          multiple resolutions and bitrates, subtitle files, and thumbnail images. Netflix&apos;s storage architecture
          uses Amazon S3 as the source of truth for all content, with automated encoding pipelines that process master
          files into hundreds of encoded variants. The encoded files are distributed through Netflix&apos;s own CDN
          (Open Connect), which caches content at internet exchange points close to end users, enabling high-quality
          video streaming with minimal buffering.
        </p>
      </section>

      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How would you design a file upload system that supports files up to five terabytes with resumable uploads?
          </h3>
          <p>
            The system would use multipart upload with presigned URLs. The client initiates the upload by requesting a
            presigned URL from the server, which validates authorization, generates a unique object key, and returns the
            URL. The client divides the file into five-megabyte chunks and uploads each chunk directly to object storage
            using the presigned URL. Each part upload returns an ETag that the client tracks. If a part upload fails due
            to a network error, the client retries only that part using exponential backoff. After all parts are
            uploaded, the client sends a completion request with the list of part numbers and ETags, and the storage
            service assembles them into a single object. The server must also handle the case where the client never
            completes the upload: a lifecycle policy aborts incomplete multipart uploads after seven days, cleaning up
            orphaned parts. For resume capability, the client stores its upload state locally and, on restart, queries
            the server for the list of already-uploaded parts to determine which parts need retransmission.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you ensure that a file uploaded by a user is not malicious (e.g., contains malware)?
          </h3>
          <p>
            Malware detection in uploaded files requires a multi-layered approach. First, the server validates the
            content type from the file signature, not the user-provided extension, to prevent content-type spoofing.
            Second, the file is scanned using an antivirus engine (such as ClamAV or a cloud provider malware detection
            service) before it is made accessible to other users. For large files, the scan can happen asynchronously
            after the upload completes, with the file quarantined until the scan passes. Third, the system enforces
            strict content-type restrictions: only allowed file types are accepted, and executable files are rejected.
            Fourth, files served through the CDN include security headers such as Content-Disposition set to attachment
            for non-image types to prevent browser execution, X-Content-Type-Options set to nosniff to prevent MIME-type
            sniffing, and Content-Security-Policy to restrict script execution. Finally, for user-generated content
            platforms, the system can integrate with content moderation services that scan images and documents for
            prohibited content using machine learning models.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: How would you handle the scenario where a file is deleted but is still cached in the CDN?
          </h3>
          <p>
            When a file is deleted, the system must invalidate the CDN cache to prevent serving stale content. The
            invalidation process sends a purge request to the CDN API with the object key, and the CDN removes the
            cached copy from all edge locations. However, CDN invalidation is not instantaneous: it can take several
            minutes for the purge to propagate globally. During this window, some edge locations may still serve the
            deleted file. To mitigate this, the system uses versioned object keys: when a file is updated, it is stored
            under a new key with a version identifier, and the CDN cache for the old key is left to expire naturally.
            When a file is deleted, the metadata record is removed, and any subsequent request for the file returns a
            four-zero-four from the origin. If the CDN serves a stale cached copy during the invalidation window, the
            next cache refresh will return the four-zero-four. For highly sensitive deletions requiring immediate
            unavailability, the system can use signed URLs with short TTLs: when the URL expires, the file cannot be
            accessed even if cached.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you design the metadata store to support efficient file listing and search across billions of files?
          </h3>
          <p>
            The metadata store should be sharded by tenant or user identifier to enable horizontal scaling. Each shard
            handles the metadata for a subset of tenants, and the sharding key ensures that all files for a given tenant
            are co-located. The metadata schema includes the file identifier, object key, owner, size, content type,
            creation time, last access time, version number, and custom tags. Indexes are created on the columns most
            frequently queried: owner for listing a user&apos;s files, creation time for time-range queries, and content
            type for filtering. For full-text search on file names and tags, a separate search index (Elasticsearch or
            OpenSearch) is maintained through change data capture from the metadata database. Read replicas handle the
            read-heavy query load, with the primary instance handling writes. The metadata store is decoupled from the
            object storage: file uploads create metadata records through a saga pattern that ensures eventual consistency
            between the two systems.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: What happens when the object storage service experiences a regional outage? How do you maintain availability?
          </h3>
          <p>
            Regional outage resilience requires cross-region replication of objects. The primary region stores all
            objects, and an asynchronous replication process copies each object to one or more secondary regions. When
            the primary region becomes unavailable, the system switches to reading from the secondary region. The
            replication lag means that recently uploaded objects may not be available in the secondary region, but
            objects uploaded before the replication lag window are consistent. For writes during the outage, the system
            queues upload requests and retries them when the primary region recovers, or it accepts writes in the
            secondary region and performs conflict resolution when the primary recovers. The failover process is
            automated through health checks that monitor the primary region&apos;s availability and trigger DNS updates
            to redirect traffic to the secondary region. The metadata store is also replicated across regions with the
            same failover mechanism. This architecture ensures that file reads remain available during regional outages,
            though with a brief period of potential staleness for recently uploaded objects.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            <strong>Amazon S3 Developer Guide</strong> &#8212; Comprehensive documentation on multipart upload,
            presigned URLs, lifecycle policies, and cross-region replication.
            <span className="block text-sm text-muted">docs.aws.amazon.com/AmazonS3/latest/userguide</span>
          </li>
          <li>
            <strong>Google Cloud Storage Architecture</strong> &#8212; Deep dive into Google&apos;s distributed file
            storage system design and consistency model.
            <span className="block text-sm text-muted">cloud.google.com/storage/docs</span>
          </li>
          <li>
            <strong>Dropbox: Moving 500 PB to Object Storage</strong> &#8212; How Dropbox migrated its storage backend
            and built a custom sync protocol.
            <span className="block text-sm text-muted">dropbox.tech/infrastructure</span>
          </li>
          <li>
            <strong>Netflix Open Connect CDN</strong> &#8212; Netflix&apos;s custom CDN architecture for video content
            delivery at global scale.
            <span className="block text-sm text-muted">netflixtechblog.com/open-connect</span>
          </li>
          <li>
            <strong>Cloudflare R2 Storage</strong> &#8212; S3-compatible object storage with zero egress fees and
            integrated CDN caching.
            <span className="block text-sm text-muted">developers.cloudflare.com/r2</span>
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}