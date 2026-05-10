"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-live-commenting-annotation-system",
  title: "Design a Live Commenting / Annotation System",
  description:
    "Architecture for inline comments and annotations on documents and media: anchor stability, real-time sync, thread resolution, and scale to millions of annotations.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "live-commenting-annotation-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "annotations", "comments", "anchoring", "real-time", "threads"],
  relatedTopics: ["collaborative-editor", "document-management-system"],
};

export default function LiveCommentingAnnotationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An annotation system allows users to attach comments, highlights, and drawings to specific locations within a document, image, or video. The defining engineering challenge is anchor stability: the annotation must remain positioned at the correct location even as the underlying content changes (text is inserted or deleted, making character offsets shift; the document is reformatted; an image is cropped). A comment anchored to "the word 'contract' at position 347" becomes invalid if 50 characters are inserted before it, shifting the word to position 397. Annotations with unstable anchors "float"—detaching from their intended context and appearing in the wrong location.</p>
        <p>The live aspect adds a second challenge: annotations from multiple users must appear in real-time without page refresh, and the order and position of annotations must be consistent for all viewers. Multiple users commenting on the same paragraph simultaneously must see each other's comments without conflicts, and the thread structure (replies to specific comments) must remain intact as new replies arrive from other users.</p>
        <p><strong>Explicit assumptions:</strong> The annotated content is a rich text document (paragraphs, headings, inline content). Annotations are of three types: highlights (text range selection, with associated comment), margin comments (anchored to a paragraph block), and point annotations (anchored to a specific image region or canvas point). Annotation threads support replies. Annotations can be resolved (marking a discussion as concluded). The system serves documents with up to 10,000 annotations and up to 50 concurrent annotators.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Text highlight annotations:</strong> Users select a text range and add a comment. The selection is highlighted in the document and a comment thread appears in the margin.</li>
          <li><strong>Anchor stability:</strong> Annotation anchors remain stable when the document content is modified by other collaborators (text inserted or deleted around the anchor).</li>
          <li><strong>Real-time annotation delivery:</strong> New annotations from other users appear in the document within 1 second, without requiring a page refresh.</li>
          <li><strong>Threaded replies:</strong> Users can reply to existing annotation comments. Thread replies appear in the annotation panel in chronological order.</li>
          <li><strong>Resolution workflow:</strong> Annotation threads can be marked as resolved. Resolved threads are hidden by default but accessible via a "Show resolved" filter.</li>
          <li><strong>Annotation navigation:</strong> Users can navigate between annotations (previous/next comment buttons), jump to a specific annotation from a comments sidebar, and filter annotations by author, date, or resolution status.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Anchor accuracy:</strong> After 100 document edits, annotation anchors must be accurate to within 10 characters of their intended position (best-effort; extreme document restructuring may require manual re-anchoring).</li>
          <li><strong>Scale:</strong> Support documents with 10,000 annotations. Rendering 10,000 margin comments simultaneously is not required—only visible annotations (within the viewport) need to be rendered.</li>
          <li><strong>History:</strong> The full annotation history (edits, resolutions, re-openings) is preserved for audit purposes.</li>
          <li><strong>Offline resilience:</strong> Users who lose connectivity can read already-loaded annotations. New annotations created offline are queued for sync on reconnect.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The annotation system is layered on top of the document system. Annotations are stored separately from document content (the document is not modified when an annotation is added) and reference the document via stable anchors. The Annotation Service manages CRUD operations for annotations and their replies, delivers real-time updates via WebSocket, and recomputes anchor positions when document edit operations affect the anchor region. The annotation rendering layer in the frontend positions annotation markers over the document text using the current anchor positions, handles viewport culling for large annotation sets, and manages the comment sidebar panel.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/live-commenting-annotation-system-architecture.svg"
          alt="Annotation system architecture showing anchor model (block ID + character offset within block, CRDT-anchored for text annotations), Annotation Service (CRUD, anchor recomputation on document edit, WebSocket broadcast), frontend rendering (viewport-culled marker overlay, margin comment panel, anchor-to-screen position mapping), and thread reply delivery. Annotation store separate from document store."
          caption="Annotation architecture: CRDT-stable anchors, separate annotation store, Annotation Service WebSocket delivery, and viewport-culled rendering"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Anchor Model for Stable Positioning</h3>
        <p>Character offset anchors (position 347 in the document) are unstable: any insertion or deletion before the anchor invalidates it. Three alternatives provide better stability. Block-relative anchors (paragraph N, character offset 23 within that paragraph) are more stable—text edits in one paragraph do not affect anchors in other paragraphs. CRDT-anchored positions (anchored to a specific CRDT item ID, which is immutable regardless of surrounding insertions/deletions) are the most stable for text documents using CRDT-based editors (Yjs, Automerge). XPath anchors (for HTML documents: /html/body/p[3]/text()[1], offset 23) are stable within a document's block structure but break when the block structure changes (paragraph split, merge).</p>
        <p>For a CRDT-based collaborative editor, the natural anchor is the CRDT item ID: the start and end of the annotated text range are each recorded as (clientId, sequenceNumber) Lamport clock values identifying specific character items in the Yjs Y.Text. These IDs are immutable—they do not change when surrounding characters are inserted or deleted. The anchor remains valid even after extensive document edits. The rendering system queries the CRDT document to find the current position (screen coordinate) of the anchor's start and end items, using Y.Text's relativePosition API.</p>
        <p>For non-CRDT documents (HTML, PDF), the block-relative anchor is the practical choice: (blockId, startCharOffset, endCharOffset, startContext, endContext). The startContext and endContext store a window of surrounding characters (e.g., 20 characters before and after the anchor) for fuzzy re-anchoring. When the document is edited, the anchor is recomputed by searching for the context string near the stored block position. This is the approach used by browser extensions (Hypothesis, Readwise Reader): if the exact character position is not found (due to reformatting), the context string is used to locate the anchor approximately. Documents that are completely reformatted may require manual re-anchoring.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Anchor Recomputation on Document Edits</h3>
        <p>When the document is edited (characters inserted or deleted near an annotation anchor), the anchor positions must be updated. For CRDT-anchored annotations, no recomputation is needed (CRDT item IDs are immutable). For block-relative anchors, the Annotation Service listens to document edit events (published to a Kafka topic by the document editor) and applies offset adjustments: insertions before the anchor shift the offset forward by the insertion length; deletions that overlap the anchor either shift the offset backward or, if the deletion removes the anchored text itself, mark the annotation as "orphaned" (the anchored text no longer exists). Orphaned annotations are displayed with a warning indicator ("The annotated text has been deleted") and their anchor is set to the nearest surviving text position.</p>
        <p>Batch recomputation: when a large edit operation affects many annotations simultaneously (a paragraph is deleted that contains 50 annotations), the recomputation is batched. The Annotation Service receives the edit event, queries all annotations anchored within the affected range, and updates their positions in a single database transaction. This batch operation completes in under 1 second for typical annotation densities, and the updated anchor positions are broadcast to connected clients via WebSocket.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Annotation Rendering and Viewport Culling</h3>
        <p>A document with 10,000 annotations cannot render all 10,000 margin comments simultaneously—the DOM cost would be prohibitive and the sidebar would be an unreadable wall of comments. Viewport culling applies: only annotations whose anchor positions are within or near the current viewport are rendered. The implementation uses an IntersectionObserver on invisible anchor markers (zero-size DOM elements positioned at each anchor) to detect which anchors are in the viewport. When an anchor enters the viewport, its annotation comment panel is rendered; when it exits, the panel is unmounted.</p>
        <p>Text highlight overlays (the colored background over the annotated text range) are a separate rendering concern from the margin comment panels. Highlights are rendered using the document editor's native selection highlight API (ProseMirror's decoration system, or a custom overlay for HTML documents), not as DOM elements positioned over the text. Using native decorations ensures highlights reflow correctly when the document reflows (window resize, font size change) without requiring position recalculation in JavaScript.</p>
        <p>Margin comment panel positioning: comment panels are positioned adjacent to their anchor on the right margin. When multiple annotations are in the same paragraph, their panels are vertically stacked in anchor order, with a minimum gap of 16px between panels. If many annotations cluster in a single area, panels are compacted (overlapping slightly and expanding on hover/click). The panel positions are recomputed on every document scroll, reflow, and annotation addition—this is done in a single requestAnimationFrame callback to batch all position changes into one layout cycle.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Annotation Delivery</h3>
        <p>When a user creates an annotation, the Annotation Service persists it to the database and broadcasts a new_annotation event via WebSocket to all connected clients viewing the same document. The event payload includes the full annotation object (id, anchor, content, authorId, createdAt). Receiving clients apply the new annotation optimistically to their local state and render it without waiting for any further confirmation. Since annotations are independent entities (creating an annotation never conflicts with another user creating an annotation at the same or different location), the optimistic application is always correct.</p>
        <p>Replies to annotation threads are delivered the same way: the new_reply event includes the annotationId (to locate the thread) and the reply object. All clients with the annotation's thread open receive the reply and render it in the thread panel. For large documents with many concurrent annotators, the WebSocket delivers only the annotations that are currently loaded by the client—the server scopes the subscription to the annotations within the client's current viewport range (plus a buffer above and below) rather than all annotations in the document. This subscription scoping reduces the event volume for large documents.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resolution Workflow</h3>
        <p>Thread resolution marks a discussion as concluded: the resolver clicks "Resolve," which sends a resolve_annotation request to the Annotation Service. The service updates the annotation's resolved field (true), records the resolverId and resolvedAt, and broadcasts a annotation_resolved event. Resolved annotations are hidden from the document (highlights removed, margin comments hidden) but accessible via the "Show resolved" toggle in the annotations sidebar. Reopening a resolved annotation creates a new "reopened" audit event and shows the annotation again in the document.</p>
        <p>The resolution workflow interacts with unread counts: unread annotations (those created or replied to since the user's last visit) are indicated by a notification badge. The unread count is tracked per user per document, using the same lastReadAnnotationId pattern as the chat system's read receipts. When the user opens the annotations sidebar, all annotations are marked as read (the lastReadAnnotationId is updated to the most recent annotation in the document). The unread indicator on the document tab shows the count of unread annotations.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/live-commenting-annotation-system-anchoring.svg"
          alt="Annotation anchor stability showing three anchor types: CRDT item ID (immutable, reflows with document edits), block-relative offset with context string (recomputed on edit using fuzzy context matching), and orphan detection (anchor text deleted, warning indicator). Offset adjustment on insert/delete: insertions before anchor shift offset forward, deletions overlapping anchor orphan the annotation."
          caption="Anchor stability: CRDT item ID anchors (immutable), block-relative with context fuzzy-matching, and orphan detection for deleted text"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>CRDT-anchored versus character-offset anchoring: CRDT anchors provide perfect stability but require the document editor to use a CRDT data model (Yjs, Automerge). For documents stored in a traditional database (HTML content in PostgreSQL), CRDT anchoring is not applicable—block-relative anchors with context string matching must be used instead. The context-string approach is robust for typical document edits (adding or removing paragraphs, editing text) but fails for complete document replacements (when the entire content is overwritten, all context strings become invalid). The annotation system should detect this case (all anchors orphaned simultaneously) and prompt the document owner to re-anchor annotations manually.</p>
        <p>Annotation density and performance: a document with 10,000 annotations and 50 concurrent annotators receiving WebSocket events for all 10,000 annotations would be impractical. The viewport subscription scoping described above (the server only delivers events for annotations in the client's current viewport range) reduces the event volume significantly. The subscription must be updated when the user scrolls: as the viewport moves, the client sends a viewport_changed event to the server with the new anchor range, and the server updates the subscription accordingly. This dynamic subscription management is the key to scaling annotations to large document counts without overwhelming clients with irrelevant events.</p>
        <p>PDF versus rich text annotations: PDF annotation has a standardized format (PDF specification's annotation layer), which allows annotations created in the browser to be saved within the PDF file itself (compatible with Acrobat, Preview, etc.). Rich text document annotations (Google Docs, Notion) are stored separately in the application database and are not embedded in the document format. Storing annotations in the PDF is simpler for interoperability but limits annotation features to what the PDF specification supports. Storing annotations in the application database enables richer features (threading, resolution workflows, real-time sync) but ties annotations to the application and is not exportable to other PDF readers.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A live commenting and annotation system anchors comments to document positions using stable anchors—CRDT item IDs for CRDT-based editors (immutable, perfectly stable), or block-relative offsets with context strings for traditional HTML documents (recomputed on edit via fuzzy matching, with orphan detection for deleted text). Annotations are stored separately from document content in an Annotation Service that manages CRUD, anchor recomputation on edit events, and WebSocket delivery. Real-time annotation delivery via WebSocket uses viewport-scoped subscriptions (only annotations in the client's current viewport range trigger events, updated dynamically on scroll). Margin comment rendering uses viewport culling (IntersectionObserver) to render only visible annotation panels. Highlight overlays use the document editor's native decoration API for correct document reflow. Thread resolution tracks resolverId, resolvedAt, and hides resolved annotations with a toggle to show them. The defining anchor challenge—keeping comments attached to the right text despite document edits—requires choosing the appropriate anchor model for the underlying document storage system.</p>
      </section>
    </ArticleLayout>
  );
}
