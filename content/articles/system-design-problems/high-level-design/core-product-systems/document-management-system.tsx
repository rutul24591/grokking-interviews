"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-document-management-system",
  title: "Design a Document Management System (Preview, Versioning, Annotations)",
  description:
    "Architecture for an enterprise document management system: secure storage, in-browser preview, version history, collaborative annotations, and access control.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "document-management-system",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "document-management", "versioning", "annotations", "preview", "RBAC"],
  relatedTopics: ["version-history-system", "audit-log-viewer-ui"],
};

export default function DocumentManagementSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An enterprise document management system (DMS) is the authoritative repository for organizational knowledge: contracts, engineering specs, legal briefs, financial reports. The requirements that distinguish an enterprise DMS from a simple file storage system are version history (every change is preserved; documents can be rolled back), in-browser preview (users can view PDFs, Word documents, and presentations without downloading them or installing software), collaborative annotations (multiple users can annotate a document simultaneously without overwriting each other's notes), and granular access control (specific users or groups can read, comment, edit, or administer specific documents, with inheritance from folder-level permissions).</p>
        <p>The technical complexity concentrates in two areas. Preview rendering: a PDF viewer can be implemented in the browser using PDF.js, but rendering large PDFs (200-page contracts) performantly requires progressive page loading, thumbnail generation, and text layer extraction for search. Annotations: overlaying annotations on a document preview requires coordinate systems that remain stable as the document is zoomed, scrolled, and annotated by multiple simultaneous users—a problem with similarities to collaborative editing but with the constraint that the underlying document is immutable (annotations are overlaid on the document, not embedded in it).</p>
        <p><strong>Explicit assumptions:</strong> Documents are primarily PDFs, Word documents (DOCX), Excel spreadsheets (XLSX), and PowerPoint presentations (PPTX). All document formats are converted to PDF server-side for preview rendering (using LibreOffice or a managed conversion service), ensuring a single preview rendering pipeline. Maximum document size is 100MB. Annotations are stored separately from documents (documents are immutable once uploaded; annotation data is a separate database entity). The system serves up to 10,000 concurrent users.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Document storage and versioning:</strong> Upload documents; each upload creates a new version. Version history is preserved indefinitely (or per retention policy). Users can download or preview any historical version.</li>
          <li><strong>In-browser preview:</strong> View PDF, DOCX, XLSX, PPTX documents in the browser without downloading. Preview loads the first page within 2 seconds.</li>
          <li><strong>Annotations:</strong> Add text annotations, highlights, and drawing annotations to document pages. Annotations are user-attributed, timestamped, and visible to all users with document access. Multiple users can annotate simultaneously without conflicts.</li>
          <li><strong>Search:</strong> Full-text search across document content (requires text extraction from PDFs and Office documents). Metadata search (file name, uploader, date, tags).</li>
          <li><strong>Access control:</strong> Documents and folders have configurable permissions (read, comment, edit, admin) per user or group. Folder permissions inherit to contained documents unless explicitly overridden.</li>
          <li><strong>Audit trail:</strong> Every access (view, download, edit, share) is logged with user, timestamp, and action. Audit logs are immutable.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Preview latency:</strong> First page visible within 2 seconds. Subsequent pages load on demand as the user scrolls.</li>
          <li><strong>Storage durability:</strong> 99.999999999% (11 nines) durability via S3-compatible object storage.</li>
          <li><strong>Access control enforcement:</strong> Document access must be authorized on every request; no document is accessible without a valid permission check. Pre-signed URLs must be short-lived (15 minutes maximum).</li>
          <li><strong>Annotation consistency:</strong> Annotations from multiple simultaneous users must not overwrite each other. All users viewing the same document see the same annotation state within 2 seconds of a new annotation being created.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The DMS has four primary subsystems: document storage (S3 for raw files and generated PDFs, with a Document Service managing metadata and versioning), preview rendering (server-side PDF generation from Office formats, progressive PDF delivery to the browser, PDF.js for rendering), annotation service (stores and delivers annotation data, handles concurrent annotation events), and access control (an RBAC service that evaluates permissions on every document and folder operation). These subsystems are connected by a Document API that the frontend interacts with for all operations.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/document-management-system-architecture.svg"
          alt="Document management system architecture showing upload pipeline (S3 storage → Office-to-PDF conversion → text extraction for search → thumbnail generation), preview delivery (pre-signed S3 URL → PDF.js progressive page loading), annotation service (PostgreSQL annotation store → WebSocket delivery for real-time sync), RBAC permission evaluation, and version chain management."
          caption="DMS architecture: upload → conversion pipeline, PDF.js preview, annotation WebSocket sync, RBAC permission chain, and S3 versioned storage"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Document Upload and Version Management</h3>
        <p>Each document upload creates a new version in the version chain. The version chain is a linked list: each version record has a documentId (stable across all versions), versionId (unique per version), storageKey (the S3 object key for this version's file), contentHash (SHA-256 of the file content for deduplication), uploadedBy, uploadedAt, versionNumber (monotonically increasing integer), and previousVersionId. If a document is uploaded with the same contentHash as an existing version, the system can create a version record pointing to the same S3 object (deduplication at the storage level) or reject the upload with "This file is identical to the current version."</p>
        <p>The document's canonical display version is always the highest-numbered version. The Document Service tracks this in a documents table (current_version_id field). Version rollback creates a new version (not a mutation of history): rolling back to version 3 creates version 5 as a copy of version 3's content with a rolledBackFromVersionId annotation. This append-only approach ensures the full history is always preserved—you can always see that a rollback occurred and what triggered it.</p>
        <p>Post-upload processing runs asynchronously: the Document Service queues a conversion job, text extraction job, and thumbnail generation job. The conversion job (LibreOffice in headless mode, or a managed service like Gotenberg) converts DOCX/XLSX/PPTX to PDF and stores the result as a separate S3 object referenced from the version record. The text extraction job extracts the document's text for full-text search indexing (Elasticsearch). The thumbnail job renders the first page as a JPEG for use in file browser thumbnail views. All three jobs complete within 30–60 seconds for typical documents; the preview remains unavailable until the conversion job completes (the UI shows a "Processing..." state for freshly uploaded documents).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progressive PDF Preview</h3>
        <p>PDF.js is an open-source JavaScript PDF rendering library that renders PDFs in the browser using HTML canvas. For large PDFs (100+ pages), loading and rendering the entire document at once would be prohibitively slow. Progressive loading renders pages on demand: the first page renders immediately using the first chunk of the PDF file; subsequent pages render as the user scrolls. PDF.js's PDFDocumentProxy.getPage() fetches individual page data; the viewer maintains a pool of rendered canvases and evicts pages far from the current viewport to control memory usage.</p>
        <p>The PDF is not served directly from S3 to the browser for large documents. Instead, the Document Service generates a pre-signed S3 URL with a 15-minute TTL and returns it to the browser. The browser fetches the PDF from S3 using range requests (HTTP Range header), allowing PDF.js to fetch only the pages needed for the current viewport. S3 supports range requests natively. The first range request fetches the PDF's cross-reference table (the last 1–2KB of the PDF file, which indexes all page positions), enabling PDF.js to calculate the byte ranges for specific pages without downloading the entire file. Subsequent requests fetch individual page data as needed. A 50-page, 10MB PDF can render the first page with only a few hundred KB of downloaded data.</p>
        <p>Thumbnail generation for the document browser view: the server renders the first page of each document to a JPEG thumbnail (stored in S3 alongside the PDF) during the post-upload processing pipeline. The browser displays these thumbnails in list and grid views without needing to load the full PDF. Thumbnails are generated at 200×260px for grid view and 80×104px for list view, using LibreOffice's headless export or a PDF-to-image library.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Annotation System</h3>
        <p>Annotations are stored in a relational database (PostgreSQL) as separate entities from the document. The annotation schema: annotationId, documentId, versionId (annotations are version-specific—an annotation on page 3 of version 2 may not be meaningful on version 3 if the page count changed), authorId, createdAt, type (highlight, text-note, drawing, stamp), page (1-indexed page number), coordinates (normalized to the page's coordinate space: x and y as fractions of page width and height, width and height as fractions for region annotations), content (text for text-note type), color, resolved (boolean, for comment resolution workflows), and parentAnnotationId (for reply threads).</p>
        <p>Normalized coordinates (0.0–1.0 fractions of page dimensions) rather than pixel coordinates are critical: the user may view the document at different zoom levels on different devices. An annotation at (x=0.5, y=0.25) is always at the center-top of the page regardless of the zoom level. The PDF.js viewer converts between normalized document coordinates and pixel coordinates for rendering annotation overlays on the canvas.</p>
        <p>Concurrent annotation delivery uses WebSocket. When the user opens a document, a WebSocket connection is established to the Annotation Service, subscribed to the documentId + versionId channel. Creating a new annotation triggers an HTTP POST to the Annotation API, which saves the annotation and broadcasts it to all WebSocket subscribers for the document. All other users viewing the same document see the new annotation within 1–2 seconds. This is much simpler than collaborative document editing (no OT/CRDT needed) because annotations are independent entities—two users creating annotations simultaneously do not conflict. Each annotation is a separate database row; there is no shared mutable state to reconcile.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RBAC and Permission Inheritance</h3>
        <p>The permission model has two layers: folder-level permissions (inherited by all documents within the folder unless overridden) and document-level permissions (explicit overrides for specific documents). Each permission record associates a principal (userId or groupId) with a resource (folderId or documentId) and a permission level (read, comment, edit, admin). The permission evaluation algorithm: for a given user and document, check for an explicit document-level permission first; if none, check the parent folder; then the grandparent folder; continue up the hierarchy to the root. The most specific (deepest) permission wins.</p>
        <p>Permission inheritance is evaluated at request time, not precomputed (precomputation would require re-evaluating all documents' effective permissions every time a folder permission changes, which is impractical at scale). For performance, permission evaluations are cached in Redis with a short TTL (60 seconds): the cache key is (userId, documentId), the value is the effective permission level. When permissions change (a new permission is added, an existing one is removed), the affected cache entries are invalidated. Cache invalidation scope: when a folder's permission changes, all documents within that folder must have their cached permissions invalidated—the cache uses folder tags for this purpose (all cache entries for documents in a folder are tagged with the folderId; clearing the tag invalidates all related entries).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Full-Text Search</h3>
        <p>Full-text search indexes the text extracted from documents during post-upload processing. The search index (Elasticsearch) stores: documentId, versionId, a content field containing the extracted text, and metadata fields (filename, uploadedBy, uploadedAt, tags). The permission-aware search challenge: users should only see documents they have access to in search results. Two approaches: post-filter (search Elasticsearch, then check permissions on each result, discarding unauthorized ones—simple but potentially returns fewer results than the requested page size when many are filtered out) or per-document permission storage in the index with a must_match clause on allowed documents (accurate but requires keeping the index updated when permissions change).</p>
        <p>The pragmatic solution for most DMS implementations: query Elasticsearch with the user's accessible documentIds as a filter. Before executing the search, the RBAC service returns all documentIds the user can access (read or higher). This list is passed to Elasticsearch as a terms filter. For users with broad access (admins), this list may be too long to use as a terms filter; in that case, the query runs without the filter and post-filtering is applied on the results, accepting a potential reduction in result accuracy for page boundaries. For most users with limited access (specific project folders), the list is small and the terms filter is efficient.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/document-management-system-permissions.svg"
          alt="DMS permission model showing folder hierarchy with inherited permissions, explicit document-level permission overrides, permission evaluation algorithm (deepest wins), Redis permission cache with folder tag invalidation, and permission-aware search (accessible documentIds as Elasticsearch terms filter)"
          caption="DMS permission model: folder hierarchy inheritance, explicit document overrides, Redis caching with tag invalidation, and permission-aware Elasticsearch search"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Server-side PDF conversion versus client-side rendering: converting all document formats to PDF server-side creates a uniform preview pipeline (one renderer, PDF.js, for all formats) but adds processing latency and requires server-side conversion infrastructure. Rendering Office documents directly in the browser (using libraries like SheetJS for Excel or DOCX.js for Word) would eliminate the server-side conversion step, but client-side Office rendering libraries have lower fidelity than LibreOffice's conversion (formatting differences, unsupported features) and varying performance characteristics. For enterprise use where document fidelity is critical (contracts, legal briefs), server-side conversion to PDF provides the most accurate preview.</p>
        <p>Annotation storage as database records versus embedded in the PDF: storing annotations in the database (separate from the document) keeps the document immutable—an annotation does not change the document file. This is important for legal and compliance contexts where the original document must remain tamper-evident. The trade-off is that exporting a document "with annotations" requires re-rendering the document with annotations overlaid (a server-side PDF composition step). Embedding annotations in the PDF (using PDF annotation APIs) makes export trivial but makes the document mutable every time an annotation is added, complicating the version history model and breaking content hash-based deduplication.</p>
        <p>Pre-signed URL duration: 15-minute pre-signed URLs balance usability (users need enough time to view the document) against security (compromised URLs are valid for only 15 minutes). For documents in active review sessions (a user annotating for 2 hours), the URL will expire mid-session. The viewer must request a new pre-signed URL before the current one expires: the frontend fetches a fresh URL from the Document API every 10 minutes (before the 15-minute TTL expires) and updates the PDF.js document source. This URL refresh happens transparently to the user, without reloading the document or losing scroll position.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An enterprise document management system is built around five technical pillars: versioned document storage (append-only version chain in PostgreSQL + S3, with content hash deduplication), server-side document conversion (LibreOffice converts Office formats to PDF, text is extracted for search, thumbnails are generated), progressive PDF preview (PDF.js with range requests fetches only visible pages, normalized coordinates enable zoom-stable annotation overlays), annotation service (independent annotation entities in PostgreSQL, WebSocket delivery for real-time multi-user annotation synchronization), and RBAC with inheritance (folder-level permissions inherited by documents, Redis-cached permission evaluations with tag-based invalidation). Pre-signed S3 URLs with 15-minute TTLs enforce access control at the storage level. Full-text search uses Elasticsearch with accessible documentIds as a permission-aware filter. The defining architecture choice is treating documents as immutable objects—annotations, versions, and audit events are all separate entities that reference documents, never modifying them.</p>
      </section>
    </ArticleLayout>
  );
}
