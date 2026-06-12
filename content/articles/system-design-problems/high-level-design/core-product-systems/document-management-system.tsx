"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-document-management-system",
  title: "Design a Document Management System (Preview, Versioning, Annotations)",
  description:
    "Architecture for an enterprise document management system: secure storage, in-browser preview, version history, collaborative annotations, and access control.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "document-management-system",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "document-management", "versioning", "annotations", "preview", "RBAC"],
  relatedTopics: ["version-history-system", "audit-log-viewer-ui"],
};

export default function DocumentManagementSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Document Management System (Preview, Versioning, Annotations) around product-critical path, data ownership, user trust, latency SLOs, and safe degradation. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          An enterprise document management system is the authoritative repository for contracts, engineering specs,
          legal briefs, financial reports, design documents, security evidence, and operational runbooks. It is not
          just "upload files to object storage." The system must preserve immutable history, render documents safely
          in the browser, support annotation and review workflows, enforce granular permissions, index text for
          discovery, and produce audit evidence that stands up to compliance and incident investigations.
        </HighlightBlock>
        <p>
          The core product promise is trust. Users must believe that the version they are viewing is the right version,
          that comments are anchored to the correct page and revision, that unauthorized users cannot access a file by
          guessing a URL, and that a rollback or permission change leaves an explainable trail. In interviews, this is
          a strong problem because it combines object storage, asynchronous processing, search, real-time collaboration,
          authorization, data retention, and browser performance into one system.
        </p>
        <p>
          A practical scope is PDF, DOCX, XLSX, and PPTX uploads up to 100 MB, with server-side conversion to PDF for a
          unified preview pipeline. The first page should be visible within roughly two seconds after processing is
          complete. Annotation updates should reach active viewers within two seconds. Every view, download, share,
          permission change, version upload, and export should be recorded. The system should support 10,000
          concurrent users and a permission model based on users, groups, folders, and document-level overrides.
        </p>
        <p>
          A principal-level design should explicitly separate documents, versions, renditions, annotations, search
          indexes, permission state, and audit events. These entities evolve at different rates and have different
          consistency needs. The original uploaded binary should be immutable. A rendered PDF is a derived artifact.
          Text extraction and thumbnails are rebuildable. Annotations are collaborative metadata tied to a specific
          version. Audit events are append-only evidence. Mixing these concerns into one mutable record creates weak
          history, brittle recovery, and dangerous authorization shortcuts.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the user must see a consistent product state even when derived artifacts, personalization, search, upload, or collaboration subsystems lag behind.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Document Management System (Preview, Versioning, Annotations), the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Immutable Versions and Derived Renditions</h3>
        <p>
          Each upload creates a new version record with a stable document ID, a unique version ID, storage key,
          content hash, uploader, upload timestamp, version number, and previous version pointer. Rollback should not
          mutate history. Rolling back version 7 to version 4 creates version 8 with metadata that says it was copied
          from version 4. This append-only model preserves causality and lets compliance reviewers see what happened
          instead of only seeing the final state.
        </p>
        <p>
          Derived renditions are separate from original files. A DOCX may produce a preview PDF, page thumbnails,
          extracted text, table metadata, and searchable OCR output. These artifacts can fail independently, be
          regenerated when converter versions change, and be stored with their own processing status. The user may be
          allowed to download the original file even while preview conversion is still pending, depending on policy.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Preview as a Secure, Progressive Read Path</h3>
        <p>
          Browser preview is a performance and security feature. Users should inspect documents without downloading
          sensitive files to unmanaged devices. Server-side conversion gives a consistent preview format and avoids
          relying on incomplete client-side Office renderers. PDF.js can render the final PDF progressively using
          range requests, which lets the browser fetch the cross-reference table and visible pages instead of the
          entire file.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Annotations Are Versioned Overlays</h3>
        <p>
          Annotations should be stored separately from document binaries. A highlight, note, drawing, approval stamp,
          or threaded comment references document ID, version ID, page number, normalized page coordinates, author,
          creation time, visibility scope, and resolution state. Normalized coordinates keep overlays stable when a
          user zooms, rotates, or views the page on a different device. Version-specific annotations avoid the common
          bug where a note on page three of an old contract appears on the wrong paragraph after a new version changes
          pagination.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Authorization Must Sit on Every Boundary</h3>
        <p>
          A DMS has many access paths: metadata APIs, preview PDFs, original downloads, thumbnails, OCR text, search
          snippets, annotation streams, export jobs, audit logs, and shared links. Every boundary needs authorization.
          Short-lived pre-signed URLs are useful for object storage delivery, but they are not a replacement for
          permission checks. The application should mint them only after evaluating the user's effective permission,
          and the URL should be scoped to the exact object, rendition, action, and TTL.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: API shape, read/write model, async workflow, permission boundary, cache policy, realtime update strategy, and rollback behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/document-management-system-architecture.svg"
          alt="Document management architecture showing upload API, object storage, conversion workers, preview service, search indexing, annotation service, permission service, and audit log"
          caption="Architecture: immutable uploads feed asynchronous conversion, search, thumbnails, preview delivery, annotation sync, RBAC checks, and audit logging."
        />
        <p>
          The upload path starts at the Document API. The API authenticates the user, checks write permission for the
          target folder, reserves a document or version record, and issues an upload target. For large documents, the
          client should use multipart upload directly to object storage through scoped credentials or pre-signed part
          URLs. After upload completion, the API verifies size, checksum, content type, malware scan status, and
          tenant limits before marking the version as accepted.
        </p>
        <p>
          Accepted versions enqueue asynchronous processing jobs. A conversion worker turns Office files into PDF
          using a sandboxed converter such as LibreOffice or a managed service. A text extraction worker extracts
          searchable text and page-level offsets. A thumbnail worker renders page previews for grids and sidebars. An
          OCR worker may run for scanned documents. Each job writes status back to the version record. The UI can show
          "uploaded," "scanning," "converting," "indexing," and "ready" states instead of pretending the upload is
          immediately previewable.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/document-management-system-workflow.svg"
          alt="Document upload workflow from permission check to multipart upload, malware scan, conversion, text extraction, thumbnail generation, indexing, and preview readiness"
          caption="Workflow: upload acceptance and preview readiness are separate milestones, which keeps the UI honest and the processing path retryable."
        />
        <p>
          The preview path resolves metadata first, not bytes. The client asks the Document API for a preview session.
          The API checks read permission, records an audit event, chooses the correct rendition, and returns a
          short-lived signed URL or a streaming proxy token. PDF.js then performs range requests against the PDF
          rendition so the first page can render quickly. The frontend should virtualize pages and evict distant
          canvases because a 300-page PDF can exhaust browser memory if every page remains rendered.
        </p>
        <p>
          The annotation path is write-through to the Annotation Service. Creating a note is an HTTP write that checks
          comment permission, validates page and coordinate bounds, persists the annotation, records an audit event,
          and broadcasts a small event to subscribers on the document-version channel. Active viewers receive the
          event through WebSocket or Server-Sent Events and add the overlay. Because annotations are independent rows,
          concurrent creation is much simpler than collaborative text editing; the hard parts are ordering, deletion,
          visibility, and anchoring to the correct version.
        </p>
        <p>
          Search has two phases. Ingestion indexes extracted text and metadata after processing. Query execution must
          apply permissions before returning titles, snippets, or thumbnails. For users with a small accessible corpus,
          the search service can filter by accessible document IDs. For admins or broad-access groups, it may use
          folder or tenant-level filters plus post-checks. Search snippets are sensitive because they can leak content
          even when the document itself is blocked, so permission filtering must happen before snippets leave the
          service boundary.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Server-side conversion gives better fidelity and consistent rendering for Office documents, but it adds
          compute cost, processing delay, converter vulnerabilities, and operational complexity. Client-side rendering
          reduces backend work but has weaker fidelity for legal and financial documents, inconsistent font handling,
          and unpredictable performance on low-end devices. Enterprise systems usually prefer server-side conversion
          because correctness of the preview matters more than immediate rendering of every format.
        </p>
        <p>
          Serving previews directly from object storage through short-lived signed URLs is efficient and scalable.
          The trade-off is that access control is front-loaded: once the URL is minted, object storage will serve it
          until expiration. A proxy service can enforce authorization on every range request and revoke access
          instantly, but it adds cost and can become a bandwidth bottleneck. Many systems use signed URLs for normal
          documents and a proxy path for highly sensitive repositories, watermarking, data rooms, or legal holds.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/document-management-system-permissions.svg"
          alt="Document management permission model with folder inheritance, document overrides, permission cache invalidation, and permission-aware search"
          caption="Permission model: inherited folder grants, document overrides, cache invalidation, and search filtering must agree on the same effective access rules."
        />
        <p>
          Annotation storage outside the PDF keeps original files immutable and supports rich collaboration features
          such as threads, mentions, resolution, visibility scopes, and audit metadata. The cost is export complexity:
          "download with annotations" requires a server-side composition job. Embedding annotations into the PDF makes
          export simple but mutates the document artifact, complicates content hashes, and weakens the version model.
          For enterprise DMS products, overlays are usually the safer primary model, with composed PDFs generated as
          derived exports.
        </p>
        <p>
          Permission inheritance can be evaluated at request time or materialized into effective ACLs. Request-time
          evaluation is simpler to keep correct when folder permissions change, but it can be expensive for deep folder
          trees and high-QPS preview traffic. Materialized ACLs make reads fast but make permission updates costly and
          risky. A pragmatic approach is request-time evaluation with short-lived caching and explicit invalidation by
          folder tags, plus materialized search filters only where query performance demands it.
        </p>
        <p>
          Full-text search can over-index or under-index. Indexing all extracted text maximizes recall but increases
          storage cost and leak impact if permissions are wrong. Indexing only metadata is safer but makes the DMS much
          less useful. A principal-level answer should mention document-level security boundaries, encrypted indexes
          where appropriate, snippet authorization, and re-indexing after permission model changes or content
          extraction improvements.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The strongest interview framing is to separate normal documents, regulated documents, and legal-hold
          documents into different serving policies. Normal documents can use signed URLs, cached permission decisions,
          and asynchronous processing. Regulated repositories may require proxy-mediated previews, watermarking,
          just-in-time permission checks, download prevention, and stricter audit trails. Legal-hold documents may
          require immutable retention and reprocessing controls. A principal answer should not force one policy on all
          tenants; it should define risk tiers and make the expensive controls opt-in or policy-driven.
        </p>
        <p>
          Capacity planning should also be explicit. Preview conversion is CPU and memory heavy, OCR can dominate cost,
          and search indexing can lag during large imports. The architecture should expose separate SLOs for upload
          acknowledgement, preview availability, search availability, and permission propagation. This lets the system
          preserve fast uploads while admitting that derived artifacts may take minutes for very large files or bulk
          migrations.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: activation, completion rate, p95 interaction latency, stale-state duration, conversion lag, error rate, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Treat processing as a durable workflow with idempotent jobs. Conversion, OCR, thumbnailing, and indexing
          should be retryable without creating duplicate versions or corrupting metadata. Store processing attempts,
          converter version, input hash, output hash, failure reason, and final artifact keys. This lets the system
          reprocess affected documents after a converter bug or security patch while keeping the original upload
          unchanged.
        </p>
        <p>
          Make authorization a shared service or library with one effective-permission contract. The preview API,
          download API, annotation API, search service, sharing workflow, and audit viewer should not each implement
          slightly different permission logic. The contract should define inherited permissions, explicit denies,
          group membership, document overrides, shared links, legal holds, tenant policy, and admin bypass rules. Cache
          decisions only with clear invalidation semantics.
        </p>
        <p>
          Build document security controls into the main flow. Scan uploads for malware, enforce file type allowlists,
          isolate conversion workers, strip active content from previews, block external references during conversion,
          and watermark sensitive previews when required. Conversion services process untrusted files, so they should
          run in hardened sandboxes with restricted network access, resource limits, and short-lived working
          directories.
        </p>
        <p>
          Design the frontend previewer around memory and latency budgets. Render only visible pages and a small
          buffer. Keep text layers and annotation layers aligned with the canvas. Preload thumbnails and adjacent page
          metadata, not every page bitmap. Preserve scroll position, zoom level, annotation selection, and search
          highlights when refreshing signed URLs. Large documents should degrade gracefully rather than freezing the
          browser.
        </p>
        <p>
          Keep audit events append-only and queryable by compliance dimensions. Store actor, action, resource,
          version, IP/device context where allowed, timestamp, permission decision, and correlation ID. The audit path
          should not block every user action on a slow analytics pipeline, but it should be durable enough that access
          and mutation events are not silently lost. A common design is transactional audit records for critical
          actions and asynchronous enrichment for analytics views.
        </p>
        <p>
          Prepare reprocessing and migration tooling before it is needed. Converter bugs, OCR improvements, malware
          signature updates, permission-model changes, and tenant exports all require replaying derived artifact
          pipelines. Keep original uploads immutable, version derived artifacts, and support controlled backfills with
          rate limits so operational fixes do not starve live uploads.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: partial data, stale projections, duplicate writes, permission drift, missing audit trail, and UI states that hide backend uncertainty.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          The most dangerous pitfall is authorization drift. Metadata APIs may enforce folder inheritance while preview
          URLs, thumbnails, OCR text, or search snippets accidentally skip it. This creates partial leaks that are hard
          to notice because the main document page appears secure. Every derived artifact should be treated as
          sensitive and tied back to the same effective permission decision as the source document.
        </p>
        <p>
          Another common mistake is making annotations version-agnostic. Page numbers and coordinates are meaningful
          only for a particular rendition of a particular version. If a new version inserts a cover page, old page
          three annotations should not silently move to page four of the new document. The product can offer migration
          or "view annotations from prior version," but it should be explicit.
        </p>
        <p>
          Teams often underbuild the processing state model. A user uploads a file and sees only "processing" forever
          because conversion failed, OCR timed out, or indexing rejected malformed text. Processing should have visible
          states, retry controls, support diagnostics, and fallback behavior. If preview conversion fails but download
          is allowed, the UI should explain the difference rather than hiding the document.
        </p>
        <p>
          Pre-signed URLs also create subtle bugs. Long TTLs make leaked URLs dangerous. Very short TTLs interrupt
          reading sessions unless refresh is seamless. URLs should be scoped to exact objects, never folder prefixes,
          and preview refresh should preserve PDF.js state. Permission revocation should invalidate future URL minting
          immediately, and highly sensitive documents may require proxy delivery to enforce revocation mid-session.
        </p>
        <p>
          Finally, search result paging can become incorrect after permission filtering. If the system asks the search
          index for 20 hits and then removes 15 unauthorized hits, the user sees sparse pages and inconsistent totals.
          The search service should either pre-filter by accessible corpus or over-fetch and continue filtering until
          it has enough authorized results, while making total counts approximate if exact permission-aware counts are
          too expensive.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Legal and procurement teams use a DMS for contracts, redlines, approvals, and executed agreements. They care
          about immutable history, exact preview fidelity, restricted sharing, and audit trails. Annotation threads may
          represent negotiation comments, so version anchoring and export-with-annotations become important product
          requirements.
        </p>
        <p>
          Engineering organizations use document repositories for design docs, architecture reviews, runbooks, and
          incident evidence. Search relevance and permission-aware discovery are critical because users often know the
          concept but not the file name. Integration with identity groups and project folders reduces manual sharing
          errors, while audit logs help investigate access to sensitive security documents.
        </p>
        <p>
          Finance, healthcare, and regulated enterprises use DMS platforms for reports, policies, claims, patient or
          customer documentation, and compliance evidence. These environments require retention policies, legal holds,
          watermarking, download restrictions, regional storage controls, and separation between ordinary read access
          and administrative access to audit logs.
        </p>
        <p>
          Customer-facing SaaS products also embed document management into workflows such as onboarding, claims,
          loan applications, support cases, and vendor portals. In those systems, the DMS is not a standalone product
          but a shared platform capability. The design must support tenant isolation, externally shared links,
          asynchronous virus scanning, lifecycle policies, and clear status for documents that are uploaded but not
          yet safe or ready to preview.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you model document versions and rollback?
        </h3>
        <p>
          I would keep a stable document ID and create a new immutable version ID for every accepted upload. Each
          version stores object keys, hashes, uploader, timestamp, version number, processing status, and a pointer to
          the previous version. Rollback creates another new version copied from the target historical version rather
          than mutating current state. That preserves the audit trail and lets users see that a rollback occurred,
          who triggered it, and which version became current afterward.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you deliver secure browser preview for large documents?
        </h3>
        <p>
          I would convert supported formats to PDF server-side, store the PDF rendition separately, and use PDF.js with
          HTTP range requests so the browser fetches only needed page ranges. The client first asks the Document API
          for a preview session; the API checks permission, records an audit event, and returns a short-lived signed
          URL or proxy token. The viewer virtualizes pages, evicts distant canvases, refreshes expiring URLs before
          they break the session, and never assumes the signed URL itself is proof of permission.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you design collaborative annotations?
        </h3>
        <p>
          I would store annotations as separate version-specific records with normalized coordinates. Creating an
          annotation is an authenticated write that checks comment permission, validates bounds, persists the row, and
          broadcasts the new annotation to active viewers on a document-version channel. Because annotations are
          independent entities, concurrent creates do not need OT or CRDT. I would still handle ordering, deletes,
          edits, visibility, replies, and migration across versions explicitly.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make search permission-aware?
        </h3>
        <p>
          Search must not return unauthorized titles, snippets, thumbnails, or counts. For narrow-access users, I
          would pre-filter the query by accessible document or folder IDs from the permission service. For broad-access
          users, I may use tenant or folder filters plus post-checking, over-fetching enough results to fill the page.
          Permission changes need cache invalidation and possibly re-indexing of materialized ACL fields. I would treat
          snippets as sensitive content and enforce authorization before snippet generation leaves the search service.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What failure modes should the system expose to users?
        </h3>
        <p>
          The UI should distinguish upload failure, malware scan pending or rejected, conversion failure, preview not
          ready, indexing pending, annotation write failure, and permission denial. These states imply different user
          actions. A conversion failure may still allow original download. A malware rejection should block download
          and notify administrators. An indexing delay should not block preview. A permission denial should not reveal
          metadata beyond what policy allows.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What are the most important operational metrics?
        </h3>
        <p>
          I would track upload success rate, conversion latency and failure rate by file type, malware scan time,
          preview first-page latency, PDF range request error rate, annotation broadcast latency, permission check
          latency, cache hit rate, search indexing lag, unauthorized access denials, signed URL refresh failures, and
          audit write failures. These metrics separate user-facing preview problems from backend processing problems
          and permission-system problems.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://mozilla.github.io/pdf.js/" target="_blank" rel="noreferrer">
              PDF.js project documentation
            </a>
            , browser PDF rendering and range-loading behavior.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" target="_blank" rel="noreferrer">
              Amazon S3 presigned URL documentation
            </a>
            , scoped object access and expiration behavior.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html" target="_blank" rel="noreferrer">
              Amazon S3 multipart upload API
            </a>
            , large-object upload mechanics.
          </li>
          <li>
            <a href="https://opensearch.org/docs/latest/security/access-control/document-level-security/" target="_blank" rel="noreferrer">
              OpenSearch document-level security documentation
            </a>
            , permission-aware search considerations.
          </li>
          <li>
            <a href="https://tika.apache.org/" target="_blank" rel="noreferrer">
              Apache Tika
            </a>
            , document text and metadata extraction.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
