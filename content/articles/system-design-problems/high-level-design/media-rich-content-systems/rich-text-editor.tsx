"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-rich-text-editor",
  title: "Design a Rich Text Editor (Google Docs / Notion Style)",
  description:
    "Architecture for a collaborative rich text editor: immutable document model with ProseMirror, Operational Transform for concurrent edits, plugin system for slash commands and @mentions, auto-save with IndexedDB draft, and real-time presence with remote cursors.",
  category: "high-level-design",
  subcategory: "media-rich-content-systems",
  slug: "rich-text-editor",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "editor", "prosemirror", "ot", "crdt", "collab", "websocket", "mentions"],
  relatedTopics: ["pdf-viewer-annotation-system", "content-creation-studio"],
};

export default function RichTextEditorArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A collaborative rich text editor (Google Docs, Notion, Confluence) is one of the most technically demanding UI systems to build. The editor must handle text input with under 16ms latency (one animation frame) so the user's keystrokes never feel sluggish—this means no synchronous blocking operations between keypress and DOM update. It must support rich formatting (headings, lists, tables, code blocks, embeds) using a structured document model, not raw HTML, so the content is consistently structured and can be serialized to multiple output formats. Most critically, it must allow multiple users to edit the same document simultaneously without overwriting each other's changes—requiring a conflict resolution algorithm (Operational Transform or CRDT) that produces consistent convergence across all clients regardless of network conditions or operation ordering.</p>
        <p>The document model is the foundational design decision. Storing content as a raw HTML string (contenteditable's native model) is simple but makes collaborative editing, structured queries, and export unreliable—HTML is a presentation format, not a semantic data model. A structured tree model (ProseMirror's approach: a schema-constrained JSON document with block nodes, inline nodes, and marks) enables reliable serialization, schema validation, and the transaction-based mutations that OT/CRDT requires. Every change to the document is expressed as an atomic, invertible transaction—this is what makes undo/redo and collaborative merging tractable.</p>
        <p><strong>Explicit assumptions:</strong> The editor uses ProseMirror as the document model and rendering layer (it handles contenteditable, IME, and cross-browser text input). Collaboration uses Operational Transform (OT) on the server with client-side rebasing. Real-time sync uses WebSockets. Auto-save uses a debounced 2-second timer with IndexedDB as a local draft store. The server stores documents as a JSON snapshot + append-only operations log.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Rich formatting:</strong> Users can apply block-level formatting (headings h1–h6, paragraphs, ordered/unordered lists, code blocks, blockquotes, tables, callouts, dividers) and inline formatting (bold, italic, underline, strikethrough, code, links) via toolbar buttons, keyboard shortcuts, and Markdown-style input rules.</li>
          <li><strong>Slash command menu:</strong> Typing "/" at the beginning of an empty block opens a searchable command palette for inserting block types (/h1, /table, /image, /code) and common content patterns.</li>
          <li><strong>@ Mentions:</strong> Typing "@" opens a typeahead for mentioning users or documents. Mentions are inline nodes with a user ID, rendered as styled chips with the user's name.</li>
          <li><strong>Media embeds:</strong> Images, files, and videos can be embedded via paste, drag-and-drop, or slash commands. Images are uploaded to S3 via a presigned URL and represented in the document as structured image nodes with CDN URLs.</li>
          <li><strong>Real-time collaboration:</strong> Multiple users can edit simultaneously. Each user sees other users' cursors and selections in real time, colored by user identity. Changes are visible to all editors within 300ms P95.</li>
          <li><strong>Version history:</strong> Users can view the document's edit history, see a diff between any two snapshots, and restore a previous version.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Input latency:</strong> Keystrokes must update the local DOM within 16ms (one animation frame) to feel instantaneous.</li>
          <li><strong>Collaboration latency:</strong> Remote operations must be applied and visible to all clients within 300ms P95 (network round-trip + server transform + broadcast).</li>
          <li><strong>Document load time:</strong> A document with 10,000 words must load and render within 1 second on a mid-range device.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The editor has three layers. The rendering layer (contenteditable surface): ProseMirror intercepts all browser input events (beforeinput, compositionstart/end, keydown) and converts them into transactions before updating the DOM. This bypasses the browser's default contenteditable behavior, giving the editor full control over what content is inserted and how it is represented in the document model. The state layer (document model + history + collab): the editor state is immutable—each transaction produces a new state. The history plugin tracks transactions for undo/redo. The collaboration plugin manages pending operations (sent but not yet acknowledged by the server) and incoming remote operations (to be applied and rebased). The sync layer (WebSocket + server OT engine): the server maintains the authoritative document state and transforms concurrent operations.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/rich-text-editor-architecture.svg"
          alt="Rich text editor architecture showing document model (Document → Block Nodes p h1-h6 ul table → Inline Nodes text link mention emoji → Marks bold italic code link → Transactions immutable + rebasing → OT/CRDT conflict-free merge), editor UI components (toolbar slash commands, contenteditable surface DOM sync via decorations, selection and cursor AnchorNode FocusNode, media embeds image upload video file attach, @ mentions typeahead user/doc lookup, input handling intercept beforeinput events apply transactions update DOM), state and collaboration (editor state doc + selection + history, undo/redo stack transaction history Ctrl+Z/Y, OT/CRDT engine transform concurrent ops, presence awareness remote cursors + user colors, WebSocket collab protocol client sends op delta baseRev server broadcasts op delta rev client rebases), and storage and performance (auto-save debounce 2s IndexedDB draft background sync, document storage JSON ProseMirror version history ops log snapshot every 100 ops export HTML Markdown DOCX, performance virtual rendering decorations IME guard input latency 16ms target)."
          caption="Editor architecture: immutable doc model → transaction-based mutations → OT collaboration (transform concurrent ops) → WebSocket broadcast → remote cursor presence → auto-save (IndexedDB → server)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Document Model and Transactions</h3>
        <p>The document is an immutable tree of nodes. Every change creates a new document state—nothing is mutated in place. A transaction is a description of a change: insert text at position X, delete range [A, B], set marks on range [C, D], replace node at path [E]. Transactions are composable (multiple changes bundled into one), invertible (for undo), and serializable (for transmission to the server). The schema constrains what node types can contain what: a list item can only contain inline content; a table cell can only contain block content. Schema violations are rejected at the transaction level, preventing invalid document states from ever entering the editor.</p>
        <p>Input rules: ProseMirror's inputrules plugin applies Markdown-like shortcuts as the user types. Typing "# " at the start of a paragraph converts it to a heading. Typing "- " creates a list item. Typing "```" creates a code block. These transformations happen at the transaction level—the typed characters are replaced by the appropriate node transformation before the DOM is updated. The user sees the result (the heading, the list item) without the intermediate characters appearing in the document.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operational Transform for Collaboration</h3>
        <p>When two users edit simultaneously, their operations are based on the same document revision but arrive at the server in an arbitrary order. Operational Transform resolves this: the server applies incoming operations in order, transforming later operations to account for earlier ones. For a text insertion conflict: Alice inserts "!" at position 11 in "Hello world" (rev 5). Bob simultaneously inserts "." at position 11. The server receives Alice's op first, applies it (doc becomes "Hello world!" rev 6). Bob's op arrives with base rev 5. The server transforms Bob's op: since Alice's insertion at position 11 shifted all positions after it by 1, Bob's insert-at-11 becomes insert-at-12. The server applies the transformed op (doc becomes "Hello world!." rev 7). Both operations are broadcast to all clients; each client applies the remote ops to converge to the same state.</p>
        <p>Client-side rebasing: when the client sends an operation and later receives a remote operation (from another user) while waiting for the server to acknowledge its own, the client must rebase its pending operations over the received remote operations. This is the client-side complement of the server's transform: it ensures the pending (unacknowledged) operations still apply correctly to the updated document state. The rebase is transparent to the user—their local edits continue to appear immediately (optimistic update), and the rebase adjusts positions to account for concurrent remote edits.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Presence and Remote Cursors</h3>
        <p>Presence information (cursor position and selection of each collaborator) is broadcast via the WebSocket connection every 100ms. The cursor position is expressed as a document position (an integer index into the flattened document, as used by ProseMirror's position system—not a DOM node reference). On receiving a remote cursor update, the client renders a colored cursor line and name label at the corresponding document position using ProseMirror decorations (non-document DOM changes that are applied on top of the rendered document without entering the document model). Decorations are efficiently updated independently of the document state, allowing cursor updates to render in a single paint without triggering a full re-render of the document.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Auto-save and Draft Management</h3>
        <p>The editor saves the document automatically: a debounced 2-second timer fires after the user stops typing, triggering a save to the server. If the user closes the tab or navigates away, a beforeunload listener fires a synchronous save (using navigator.sendBeacon for the XHR, which survives tab close). The current document state is also written to IndexedDB on every meaningful change (every 30 seconds minimum, immediately on focus loss). On next page load, the IndexedDB draft is compared to the server's latest revision: if the draft is newer, the user is prompted ("You have unsaved changes—restore draft or discard?"). This protects against data loss from connectivity failures or browser crashes between the debounced save intervals.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Plugin System</h3>
        <p>The editor's features are implemented as ProseMirror plugins. Each plugin is a self-contained unit that declares: a state (plugin-local state stored alongside the editor state), view update behavior (how the plugin responds to editor state changes), input rules (patterns that trigger transformations), keymap (keyboard shortcut handlers), and node views (custom React/DOM rendering for specific node types). Plugins are composable: the editor is assembled from a list of plugins at initialization. Adding a new feature means writing a new plugin without modifying existing code. The toolbar is implemented as a plugin that reads the current selection from the editor state and activates/deactivates formatting buttons based on the active marks and node type at the cursor.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version History</h3>
        <p>The server stores the document as two artifacts: a snapshot (the full document JSON at a specific revision) and an append-only operations log (each entry is the operation, the author, and the timestamp). The server takes a new snapshot every 100 operations to bound the time needed to reconstruct a document from the ops log. Loading a document at the latest revision uses the most recent snapshot + any subsequent operations. Loading a historical revision replays operations from the nearest snapshot up to the target revision. The version history UI renders a timeline of significant revisions (labeled by author and time), with a diff view showing additions (green) and deletions (red) between any two selected revisions. Restoring a revision creates a new operation that replaces the current document with the historical snapshot, preserving the intervening operations in the log.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/rich-text-editor-ot-collab.svg"
          alt="OT concurrent edit example with 3 lifelines (Alice client A, Server OT engine, Bob client B). Base doc: Hello world rev5. Alice inserts ! at 11 sending op_A insert 11 ! rev5. Bob concurrently inserts . at 11 sending op_B insert 11 . rev5. Server applies op_A → rev6 Hello world!. Server transforms op_B over op_A: ins position shifts to 12. Server applies op_B prime → rev7 Hello world!.. Broadcasts op_B prime to Alice and op_A to Bob. Converged: Hello world!. rev7. Remote cursor rendering note: cursor pos broadcast via presence channel WebSocket every 100ms. Right panel: Plugin architecture (each plugin defines keymap input rules node views commands, composable [BoldPlugin ItalicPlugin ...], state isolated via plugin key). Slash command menu (trigger / at empty block, commands /h1 /table /image /code /callout /divider, fuzzy search /tab matches /table). Image upload flow (paste/drag → presigned S3 URL, upload progress inline placeholder, on complete replace with img node + CDN URL). Export formats HTML Markdown DOCX PDF. Input latency targets keystroke to DOM 16ms op broadcast 100ms remote op applied 300ms P95."
          caption="OT concurrent edit resolution (position shifting to converge), remote cursor presence, plugin architecture, slash command menu, image upload flow, and latency targets"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>OT versus CRDT for collaboration: Operational Transform requires a central server to apply and broadcast operations in a canonical order, which simplifies the convergence proof but creates a single point of coordination. CRDT (Conflict-free Replicated Data Types) like Y.js (used by many modern editors) allows peer-to-peer convergence without a central coordinator—clients can exchange operations directly and still converge. CRDTs are better for offline-first use cases (edits merge automatically when connectivity is restored) and peer-to-peer architectures. OT is simpler to reason about for server-coordinated collaborative editors with a central authority (the server is always the source of truth). For a typical Google Docs-style editor with a server backend, OT is the more proven approach; for an offline-first or p2p editor, Y.js/CRDT is the better choice.</p>
        <p>contenteditable complexity: the browser's native contenteditable behavior is a minefield of cross-browser inconsistencies, IME (Input Method Editor) issues on East Asian languages, and uncontrolled DOM mutations. ProseMirror addresses this by intercepting all input events before the browser processes them, applying the desired change as a transaction, and updating the DOM to reflect the new state—effectively implementing a custom input handling layer on top of contenteditable. This adds complexity (the editor must handle every edge case the browser would have handled) but gives complete control over the document model and prevents invalid states from entering the document.</p>
        <p>Large document performance: for very long documents (500+ pages), rendering all content in a single DOM tree is prohibitively expensive. Virtual rendering (only rendering the visible portion of the document, analogous to virtual lists in a chat UI) is required. ProseMirror supports this via the viewDesc tree and can be extended to skip rendering of off-screen blocks. The practical trade-off: virtual rendering complicates features that depend on the full document DOM (spell-check, browser's built-in find-in-page). Google Docs uses a canvas-based rendering approach for its virtual rendering to bypass these limitations entirely, at the cost of losing native browser text selection behavior.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A collaborative rich text editor centers on an immutable document model (ProseMirror's schema-constrained node tree) where every change is a transaction—invertible, composable, and serializable. The editor intercepts all input events before the browser processes them, converts them to transactions, and updates the DOM to the new state, achieving under 16ms input latency. Collaboration uses OT: each client sends operations with a base revision to the server; the server applies them in order, transforming concurrent operations to adjust positions; broadcast operations are applied by all clients to converge to the same state. Remote cursors are rendered as decorations (non-document DOM overlays), updated every 100ms via the WebSocket presence channel. Auto-save debounces at 2 seconds, writes a local draft to IndexedDB on focus loss, and uses sendBeacon for tab-close saves. Version history stores a snapshot + append-only ops log, with snapshots every 100 ops. The plugin system assembles features (toolbar, slash commands, @mentions, image upload) as composable, state-isolated ProseMirror plugins. The defining design constraint: all document mutations must go through the transaction system—no direct DOM manipulation is ever allowed, because OT convergence depends on every change being expressed as a serializable operation.</p>
      </section>
    </ArticleLayout>
  );
}
