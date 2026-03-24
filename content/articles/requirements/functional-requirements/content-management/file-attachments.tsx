"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-file-attachments",
  title: "File Attachments",
  description:
    "Comprehensive guide to implementing file attachments covering upload patterns (drag-drop, file picker, progress indicators), download management (direct download, batch download, time-limited links), versioning, access control, virus scanning, security patterns, and storage efficiency for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "file-attachments",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "attachments",
    "files",
    "frontend",
    "security",
  ],
  relatedTopics: ["media-upload", "content-storage", "access-control"],
};

export default function FileAttachmentsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>File Attachments</strong> enable users to attach documents, spreadsheets, and
          other files to content extending content beyond text and media to include downloadable
          resources. File attachments are critical for collaboration — users need to share PDFs,
          spreadsheets, presentations, and other documents alongside their content. Without proper
          attachment handling, users resort to external file sharing services creating security
          risks and fragmented workflows.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/attachment-flow.svg"
          alt="Attachment Flow"
          caption="Attachment Flow — showing upload with progress, virus scanning, storage with access control, and download with time-limited links"
        />

        <p>
          For staff and principal engineers, implementing file attachments requires deep
          understanding of upload patterns including drag-drop for intuitive file selection, file
          picker dialog as fallback, multiple file upload for batch operations, and progress
          indicators showing per-file upload progress with retry on failure. Download management
          encompasses direct download with one-click access, batch download as ZIP for multiple
          files, time-limited download links for secure sharing with expiration, and download
          tracking for audit and analytics. Versioning maintains file versions enabling recovery
          from accidental changes with version history and restore capability. Access control
          ensures only authorized users can view or download attachments through permission checks
          and signed URLs. Virus scanning protects users from malware through automated scanning on
          upload with quarantine for infected files. Security patterns include file type validation
          by magic bytes not extension, size limits preventing storage abuse, storage encryption at
          rest and in transit, and access logging for audit trails. The implementation must balance
          ease of use with security and storage efficiency.
        </p>

        <p>
          Modern file attachment systems have evolved from simple upload/download to sophisticated
          platforms with virus scanning, version control, and granular access control. Platforms
          like Google Drive provide real-time collaboration on attachments with version history,
          Dropbox offers smart sync with local caching, and Slack provides threaded file sharing
          with search. Security requirements have driven standardized virus scanning, file type
          validation, and access control through signed URLs with expiration.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          File attachments are built on fundamental concepts that determine how files are uploaded,
          stored, accessed, and secured. Understanding these concepts is essential for designing
          effective attachment systems.
        </p>

        <p>
          <strong>Upload Patterns:</strong> Drag-drop provides intuitive file selection by dragging
          files to upload area with visual feedback on drag over and drop to initiate upload. File
          picker dialog serves as fallback through click to open system file dialog supporting all
          browsers. Multiple file upload enables batch operations selecting multiple files at once
          with per-file progress tracking. Progress indicators show upload progress per file with
          percentage, speed, and time remaining enabling users to monitor upload status. Retry
          logic handles transient failures with exponential backoff resuming from checkpoint if
          supported.
        </p>

        <p>
          <strong>Download Management:</strong> Direct download provides one-click access downloading
          file to user device with appropriate filename and content-type. Batch download enables
          downloading multiple files as single ZIP archive reducing clicks and organizing related
          files. Time-limited download links generate signed URLs with expiration typically 1-24
          hours for secure sharing preventing unauthorized access after expiration. Download
          tracking logs each download with user identity, timestamp, and file metadata enabling
          audit trails and analytics on file usage.
        </p>

        <p>
          <strong>Versioning:</strong> Maintains file versions enabling recovery from accidental
          changes or corruption. Each upload creates new version with version number, timestamp,
          and uploader identity. Version history shows list of versions with metadata enabling user
          to restore previous version. Version cleanup removes old versions beyond retention
          period typically 10-20 versions or 90 days balancing recovery options with storage costs.
          Storage efficiency through deduplication storing identical files once with references.
        </p>

        <p>
          <strong>Access Control:</strong> Ensures only authorized users can view or download
          attachments. Permission checks verify user has read access before generating download
          link or serving file. Signed URLs include cryptographic signature preventing URL tampering
          and expiration preventing indefinite access. Storage-level access control enforces
          permissions at object storage level providing defense in depth. Access logging records
          each access attempt with user identity, timestamp, and result enabling audit trails and
          security monitoring.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          File attachment architecture separates upload handling, storage, access control, and
          download serving enabling modular implementation with clear security boundaries. This
          architecture is critical for security, performance, and scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/attachment-flow.svg"
          alt="Attachment Flow"
          caption="Attachment Flow — showing upload with progress, virus scanning, storage with access control, and download with time-limited links"
        />

        <p>
          Attachment flow begins with user selecting files through drag-drop or file picker.
          Frontend validates file type by extension and size before upload rejecting invalid files
          immediately. Upload initiates with progress indicator showing per-file progress. Backend
          receives file validating file type by magic bytes not extension preventing extension
          spoofing. Virus scanning runs asynchronously on uploaded file quarantining infected files
          and notifying user. On clean scan, file is stored in object storage with unique key
          including user ID and timestamp for organization. Access control metadata is stored
          including owner ID, permissions, and sharing settings. Download request triggers
          permission check verifying user has read access. On authorized request, backend generates
          signed URL with expiration or streams file directly with appropriate headers. Download is
          logged for audit and analytics.
        </p>

        <p>
          Upload architecture includes client-side validation checking file type and size before
          upload reducing server load. Chunked upload splits large files into chunks typically 5MB
          each enabling resumable upload and progress tracking. Server reassembles chunks validating
          each chunk with checksum. Virus scanning runs asynchronously not blocking upload
          completion with file marked pending until scan completes. Storage uses object storage
          like S3 with lifecycle policies for cost optimization and versioning enabled for recovery.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/file-access-control.svg"
          alt="File Access Control"
          caption="File Access Control — showing permission checks, signed URLs, storage-level access, and access logging"
        />

        <p>
          Access control architecture includes permission checks at API layer verifying user has
          read or write access before operations. Signed URLs include cryptographic signature and
          expiration preventing URL tampering and indefinite access. Storage-level access control
          enforces permissions at object storage level through bucket policies or IAM roles
          providing defense in depth. Access logging records each access attempt with user
          identity, timestamp, file ID, and result enabling audit trails and security monitoring
          for unauthorized access attempts.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing file attachments involves trade-offs between security, usability, performance,
          and storage costs. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <p>
          Direct streaming versus signed URLs for download presents control versus performance
          trade-offs. Direct streaming serves file through application server enabling access
          control, download tracking, and transformation but adds server load and bandwidth costs
          with potential bottleneck at server. Signed URLs grant direct access to object storage
          bypassing application server reducing server load and leveraging CDN but reduces control
          over download tracking and requires careful URL expiration management. The recommendation
          is signed URLs for most downloads with CDN for performance and cost, direct streaming for
          sensitive files requiring strict access control or transformation like virus scanning on
          download.
        </p>

        <p>
          Virus scanning on upload versus on download presents security versus performance
          trade-offs. Scanning on upload catches malware before storage preventing infected files
          from being stored and shared but adds upload latency and requires quarantine for pending
          files. Scanning on download catches malware before reaching user but infected files
          remain in storage potentially spreading if download scanning fails. The recommendation is
          scanning on upload as primary defense with optional scanning on download for defense in
          depth, quarantine infected files with user notification, and maintain malware signature
          database updates.
        </p>

        <p>
          Versioning enabled versus disabled presents recovery versus storage trade-offs. Versioning
          enabled maintains all file versions enabling recovery from accidental changes or
          corruption but accumulates storage costs and may retain sensitive data longer than
          desired. Versioning disabled saves storage costs and simplifies compliance but prevents
          recovery from mistakes and provides no audit trail of file changes. The recommendation is
          versioning enabled for important documents with retention policy (10-20 versions or 90
          days), versioning disabled for temporary or cache files, and lifecycle policies
          automatically cleaning old versions.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing file attachments requires following established best practices to ensure
          security, usability, performance, and storage efficiency.
        </p>

        <p>
          Upload handling provides intuitive file selection with drag-drop and file picker
          fallback. Validate file type by magic bytes not extension preventing extension spoofing
          attacks. Enforce size limits per file and total upload preventing storage abuse. Show
          progress indicators with per-file progress, speed, and time remaining. Implement retry
          logic with exponential backoff for transient failures. Support resumable upload for large
          files enabling recovery from network interruptions.
        </p>

        <p>
          Download management provides one-click direct download with appropriate filename and
          content-type. Enable batch download as ZIP for multiple files reducing clicks. Generate
          time-limited signed URLs with expiration (1-24 hours) for secure sharing preventing
          unauthorized access after expiration. Track downloads logging user identity, timestamp,
          and file metadata for audit and analytics.
        </p>

        <p>
          Versioning maintains file versions enabling recovery from mistakes. Create new version on
          each upload with version number, timestamp, and uploader identity. Provide version
          history interface showing versions with metadata and restore option. Implement retention
          policy (10-20 versions or 90 days) balancing recovery with storage costs. Enable
          deduplication storing identical files once with references saving storage.
        </p>

        <p>
          Access control ensures only authorized users access attachments. Verify permissions before
          generating download link or serving file. Use signed URLs with cryptographic signature
          and expiration preventing URL tampering. Enforce storage-level access control through
          bucket policies or IAM roles. Log all access attempts with user identity, timestamp, and
          result for audit trails.
        </p>

        <p>
          Virus scanning protects users from malware. Scan all uploads asynchronously with
          quarantine for infected files. Notify user of infected file and provide remediation
          options. Maintain malware signature database updates. Optionally scan on download for
          defense in depth. Block known malware types by file signature not extension.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing file attachments to ensure security,
          usability, and storage efficiency.
        </p>

        <p>
          Validating file type by extension only allows extension spoofing attacks. Fix by
          validating file type by magic bytes (file signature) not extension. Block dangerous file
          types by signature (.exe, .bat, .scr) regardless of extension.
        </p>

        <p>
          No file size limits enables storage abuse through large file uploads. Fix by enforcing
          per-file size limits (typically 10-100MB) and total upload limits. Reject oversized files
          before upload with clear error message.
        </p>

        <p>
          No virus scanning allows malware distribution through attachments. Fix by scanning all
          uploads with quarantine for infected files. Notify user of infected file. Maintain
          malware signature database updates.
        </p>

        <p>
          No access control allows unauthorized file access. Fix by verifying permissions before
          serving files. Use signed URLs with expiration. Enforce storage-level access control. Log
          all access attempts.
        </p>

        <p>
          No download tracking prevents audit and usage analytics. Fix by logging each download
          with user identity, timestamp, and file metadata. Provide analytics dashboard showing
          download counts and trends.
        </p>

        <p>
          No versioning prevents recovery from accidental changes. Fix by enabling versioning with
          version history interface. Implement retention policy balancing recovery with storage
          costs. Enable restore from any previous version.
        </p>

        <p>
          No progress indicator leaves users uncertain about upload status. Fix by showing
          per-file progress with percentage, speed, and time remaining. Enable cancellation of
          in-progress uploads.
        </p>

        <p>
          No retry logic fails permanently on transient network errors. Fix by implementing retry
          with exponential backoff. Support resumable upload for large files enabling recovery from
          network interruptions.
        </p>

        <p>
          No storage optimization causes excessive storage costs. Fix by enabling deduplication
          storing identical files once. Implement lifecycle policies moving old files to cheaper
          storage tiers. Clean up orphaned files.
        </p>

        <p>
          No secure sharing allows indefinite file access. Fix by generating time-limited signed
          URLs with expiration (1-24 hours). Revoke access by invalidating URL before expiration if
          needed.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          File attachments are critical for collaboration across different domains. Here are
          real-world implementations from production systems demonstrating different approaches to
          attachment challenges.
        </p>

        <p>
          Google Drive attachment handling addresses file sharing with real-time collaboration. The
          solution uses drag-drop upload with progress indicator, virus scanning on upload with
          quarantine for infected files, version history keeping all versions with restore
          capability, access control through sharing settings (private, link, specific users),
          signed URLs with expiration for external sharing, and real-time collaboration on Office
          documents. The result is seamless file sharing with collaboration, version control, and
          granular access control.
        </p>

        <p>
          Slack file sharing addresses team file sharing with threaded conversations. The solution
          uses drag-drop upload with progress, automatic virus scanning, file preview for supported
          formats (images, PDFs, documents), threaded file sharing linking files to conversations,
          search indexing for file content, and access control through channel permissions. The
          result is integrated file sharing within team conversations with search and preview.
        </p>

        <p>
          Dropbox attachment handling addresses sync across devices with smart caching. The solution
          uses background sync keeping local cache of recent files, selective sync choosing which
          folders to sync locally, version history with 30-day retention (extended with paid plan),
          file recovery from accidental deletion, bandwidth throttling preventing network
          saturation, and LAN sync transferring files locally when devices on same network. The
          result is seamless file access across devices with offline support and bandwidth
          optimization.
        </p>

        <p>
          GitHub attachment handling addresses code repository file attachments. The solution uses
          drag-drop upload in issues and pull requests, virus scanning on upload, version tracking
          through git for code files, access control through repository permissions (public,
          private, organization), LFS (Large File Storage) for large files with bandwidth quotas,
          and download tracking for analytics. The result is integrated file attachments within code
          collaboration workflow.
        </p>

        <p>
          Salesforce attachment handling addresses CRM file attachments with compliance. The solution
          uses file upload with progress, virus scanning, versioning with retention policies,
          access control through role hierarchy and sharing rules, compliance logging for audit
          trails, file encryption at rest and in transit, and integration with content libraries
          for reusable assets. The result is compliant file attachments with granular access
          control and audit trails.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of file attachment design, implementation, and
          security concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle file upload?</p>
            <p className="mt-2 text-sm">
              A: Provide drag-drop and file picker for file selection. Validate file type by magic
              bytes not extension and size before upload. Show progress indicator with per-file
              progress, speed, and time remaining. Implement chunked upload for large files with
              resumable capability. Retry with exponential backoff on transient failures. Scan for
              viruses asynchronously after upload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement secure download?</p>
            <p className="mt-2 text-sm">
              A: Verify user has read permission before generating download link. Generate signed
              URL with cryptographic signature and expiration (1-24 hours) preventing URL tampering
              and indefinite access. Log download for audit with user identity, timestamp, and file
              metadata. Use HTTPS for all transfers. Optionally scan on download for defense in
              depth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement virus scanning?</p>
            <p className="mt-2 text-sm">
              A: Scan all uploads asynchronously not blocking upload completion. Quarantine infected
              files marking as pending until scan completes. Notify user of infected file with
              remediation options. Maintain malware signature database updates. Optionally scan on
              download for defense in depth. Block known malware types by file signature.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement access control?</p>
            <p className="mt-2 text-sm">
              A: Verify permissions at API layer before operations. Use signed URLs with
              cryptographic signature and expiration. Enforce storage-level access control through
              bucket policies or IAM roles. Log all access attempts with user identity, timestamp,
              and result. Implement role-based access with owner, editor, viewer roles.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement file versioning?</p>
            <p className="mt-2 text-sm">
              A: Create new version on each upload with version number, timestamp, and uploader
              identity. Store version metadata in database with reference to object storage key.
              Provide version history interface showing versions with metadata and restore option.
              Implement retention policy (10-20 versions or 90 days). Enable deduplication storing
              identical files once.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large file uploads?</p>
            <p className="mt-2 text-sm">
              A: Implement chunked upload splitting files into chunks (typically 5MB each). Upload
              chunks in parallel with retry per chunk. Reassemble chunks on server validating each
              with checksum. Support resumable upload enabling recovery from network interruptions.
              Show progress per chunk and overall. Use CDN for upload acceleration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize storage costs?</p>
            <p className="mt-2 text-sm">
              A: Enable deduplication storing identical files once with references. Implement
              lifecycle policies moving old files to cheaper storage tiers (S3 Standard → IA →
              Glacier). Clean up orphaned files through scheduled jobs. Compress files before
              storage if applicable. Use appropriate storage class based on access patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement batch download?</p>
            <p className="mt-2 text-sm">
              A: Collect selected files and create ZIP archive on-the-fly or from cache. Stream ZIP
              to user without storing intermediate archive. Show progress during archive creation.
              Name ZIP appropriately (folder name or custom). Log batch download for audit.
              Implement size limits for batch download preventing excessive server load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle file type validation?</p>
            <p className="mt-2 text-sm">
              A: Validate by magic bytes (file signature) not extension preventing extension
              spoofing. Maintain allowlist of permitted file types by signature. Block dangerous
              types (.exe, .bat, .scr, .js) regardless of extension. Check MIME type from file
              content. Validate on client before upload and on server after upload.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP File Upload Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - File API
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP REST Security Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/s3/security/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS S3 Security Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
