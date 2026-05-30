"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-explorer-ui",
  title: "Design a File Explorer UI",
  description:
    "LLD for a file explorer: thumbnails, list/grid views, context menus, multi-select, drag-and-drop, bulk operations, search and filter, keyboard navigation.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "file-explorer-ui",
  wordCount: 6700,
  readingTime: 35,
  lastUpdated: "2026-04-29",
  tags: ["lld", "file-explorer", "thumbnails", "drag-and-drop", "multi-select", "react"],
  relatedTopics: [
    "tree-view-folder-explorer",
    "file-upload-system",
    "image-gallery-lightbox",
  ],
};

export default function FileExplorerUIArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a File Explorer UI</h1><h2>Definition &amp; Context</h2><p>Design a File Explorer UI is an implementation-heavy low-level design problem covering lazy directory loading, stable node identity, breadcrumbs, selection, keyboard traversal, rename, move validation, upload integration, and conflict recovery. A principal-level answer must explain state ownership, browser or worker boundaries, scale limits, consistency, rollback, privacy, cost, and observability.</p><p>Model nodes by stable id, not mutable path. Expansion, selection, and mutation journals remain separate so rename or move does not invalidate descendant identity. The core structures are node map, parent-child index, loaded cursors, expanded set, selection anchor, breadcrumb projection, mutation journal, version etag, and pending requests.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/file-explorer-ui-runtime.svg" alt="Design a File Explorer UI runtime" caption="Topic-specific runtime from source intake through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a file explorer UI — the
          familiar Finder/Windows Explorer/Google Drive
          view that lets users browse folders, see file
          thumbnails, select multiple items, drag to
          move, right-click for actions, and execute bulk
          operations (delete, share, download). The
          component sits next to the Tree View (folder
          hierarchy) as the main content area where users
          actually interact with files. It must handle
          large folders smoothly (hundreds to thousands
          of items), generate thumbnails efficiently,
          provide multiple view modes (list, grid,
          gallery), and remain accessible.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: virtualizing a grid of
          thumbnails with variable thumbnail aspect
          ratios; lazy-loading thumbnails as items scroll
          into view; multi-selection with click,
          shift-click, ctrl-click and rubber-band
          selection; drag-and-drop into nested folders
          with auto-expand on hover; context menus that
          adapt to the selection (single vs multi); bulk
          operations with progress and partial-failure
          handling; and search/filter over the current
          folder.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users browse, organize, and act on files.
          They expect parity with desktop file managers:
          drag-to-move, right-click menus, multi-select
          with rubber-band, view-mode toggles, sort by
          column. Internal users (engineers integrate the
          explorer): provide a file source adapter, a
          set of supported actions, and the explorer
          handles UI mechanics.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Folder content is paginated by the backend
          (typically cursor-based for large folders).
          Thumbnails are server-generated (we display
          them) or client-generated for image files.
          Modern browsers; we use IntersectionObserver
          for thumbnail lazy-load, ResizeObserver for
          responsive grids, the HTML5 drag-and-drop API
          with custom layer for accessibility.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the folder hierarchy
          navigator (Tree View). We do not implement file
          upload (separate). We do not implement file
          preview/lightbox (separate). Server-side
          operations (move, copy, delete) are consumed
          via APIs we don&rsquo;t implement.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Render folder contents in list, grid, or
          gallery view. Thumbnails for images (and
          previews for documents where supported). Lazy-
          load thumbnails on scroll. Multi-select via
          click, shift-click, ctrl-click; rubber-band
          selection on drag in empty space. Sort by name,
          date, size, type. Drag-and-drop to move into
          another folder; auto-expand folders on hover-
          during-drag. Context menu (right-click) with
          actions appropriate to selection. Bulk
          operations: delete, share, download as zip,
          move. Search/filter within the current folder.
          Keyboard navigation: arrow keys, Page Up/Down,
          Home/End, Enter to open, Space to select.
          Empty state, loading state, error state.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Recent files surfaced at the top. Pinned/
          favorited items. Inline rename via F2 or slow
          double-click. Quick-look preview on Space key.
          Drag-and-drop from external source (desktop)
          to upload. Server-side bulk operations with
          progress. Shareable selection URLs (a URL
          that, when opened, selects the same items).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          File content rendering (the consumer&rsquo;s
          responsibility on row activation). The
          underlying file storage system. Preview
          generation pipelines.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Smooth scroll at 60 fps even with 1000+ items.
          Thumbnails lazy-load and don&rsquo;t block
          rendering of metadata. Sort and filter under
          50 ms locally; server-side for very large
          folders. View mode switch under 100 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Selection state survives sort and filter.
          Drag-and-drop is transactional with optimistic
          UI. Bulk operations report partial failures
          clearly.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Filenames render as text; HTML opt-in via
          sanitizer. Server enforces authorization on
          actions. Drag-and-drop respects permission
          (some files are read-only).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Full keyboard navigation. Screen-reader-
          announceable selection state. Context menu
          accessible via keyboard (Shift-F10 or context
          menu key). Drag-and-drop has keyboard
          equivalent (Cut/Paste).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          File source adapter pattern. Action registry
          (declare actions, the explorer renders them
          in context menus and toolbars). View modes are
          plugins.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <p>
          The explorer composes <strong>folder source
          adapter</strong>, <strong>view renderer</strong>{" "}
          (list, grid, gallery — each handles its own
          virtualization), <strong>selection model</strong>{" "}
          (single, range, multi), <strong>drag-and-drop
          plugin</strong> (with valid-target detection),
          <strong> context menu and action registry</strong>,
          and <strong>thumbnail loader</strong>.
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>folder source adapter</strong> exposes
          <code> getItems(folder, cursor, sort, filter)</code>{" "}
          returning paginated items plus next cursor.
          Items have id, name, type, size, modified date,
          thumbnail URL, permissions. The adapter caches
          loaded items per folder for fast back-navigation.
        </HighlightBlock>
        <p>
          <strong>View modes</strong> render the same item
          list differently. List view: virtualized rows
          with metadata columns (name, size, modified).
          Grid view: virtualized rows of square thumbnail
          tiles. Gallery view: virtualized rows of larger
          tiles with image previews. Each mode uses 1D
          row virtualization but the row content varies.
          Switching modes preserves selection and scroll
          position.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Thumbnail loading</strong> uses
          IntersectionObserver per item: when an item
          enters the viewport, its thumbnail URL becomes
          the image src; the browser fetches and caches.
          Until then, we show a placeholder icon based
          on file type. For images, we use
          <code> loading=&quot;lazy&quot;</code> as a
          fallback. Failed thumbnails show the type icon
          instead.
        </HighlightBlock>
        <p>
          <strong>Selection</strong>: tracked by id Set.
          Click replaces; ctrl-click toggles; shift-click
          selects a range from the last anchor through
          the current item in visible (sorted) order.
          Rubber-band selection: pointer-down on empty
          space, drag draws a selection box, items
          intersecting the box are selected. The
          rubber-band uses absolute positioning over the
          grid; we compute intersections by item bounding
          rect.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Drag-and-drop</strong>: starting a drag
          on a selected item drags the entire selection
          (or just that item if not selected). As the
          user drags over folder targets in the
          breadcrumb or tree view, valid targets
          highlight. Hovering over a folder for ~500 ms
          auto-expands it (if the user is hovering, they
          probably want to navigate into it). On drop,
          optimistic UI shows the move; server confirms;
          on failure, revert with error.
        </HighlightBlock>
        <p>
          <strong>Context menu</strong>: right-click opens
          a menu with actions appropriate to the current
          selection. Single selection: open, rename,
          download, share, delete. Multi-selection: open
          (if all openable), download as zip, move,
          delete. Permissions filter actions: read-only
          items hide rename/delete. Actions are
          registered in a registry; the menu reads from
          the registry filtered by selection context.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Bulk operations</strong>: delete a
          selection of 50 files. The action issues per-
          item or batch-API requests. Progress shows
          per-item completion. Partial failures (some
          deleted, some not) surface a summary
          (&ldquo;Deleted 47 of 50; 3 failed&rdquo;)
          with the failures listed and an option to
          retry.
        </HighlightBlock>
        <p>
          <strong>Search / filter</strong>: an input filters
          the current folder by name. For small folders,
          filter is client-side; for large folders, the
          adapter issues a server search. Results
          highlight matching characters.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Keyboard navigation</strong>: arrow keys
          move the focus; in grid view, arrow keys move
          within the grid (down/right move forward,
          up/left back). Enter activates (open file,
          enter folder). Space toggles selection. Tab
          moves focus out of the explorer to the next
          interactive region.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> SelectionModel</strong> tracks selected
          ids. <strong>DragDropPlugin</strong> handles
          drag mechanics. <strong>ContextMenu</strong>{" "}
          renders right-click actions.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> ActionRegistry</strong></Highlight> declares
          available actions. <strong>ThumbnailLoader</strong>{" "}
          handles lazy loading. <strong>SearchBar</strong>{" "}
          handles in-folder search.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Folder content cache, selection state, view
          mode, sort, filter, drag</HighlightBlock>
<HighlightBlock as="p" tier="important">state — all in
          external store. Subscribers (item cards) read</HighlightBlock>
<HighlightBlock as="p" tier="important">via selectors; selection changes only re-render
          affected items.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Folder source contract:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { getItems, move, copy, delete, rename, search, supportsThumbnails } `}</code>
          </Highlight>
          . Item shape:{" "}
          <code>{` { id, name, type, size, modifiedAt, thumbnailUrl?, permissions } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="crucial">Virtualization scopes mounted DOM. Memoized
          item cards. Thumbnail lazy load with</HighlightBlock>
<HighlightBlock as="p" tier="important">IntersectionObserver; failed thumbnails fall
          back to type icons without retrying.</HighlightBlock>
<HighlightBlock as="p" tier="important">Search
          debounced; client-side for small folders,
          server-side for large.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Drag preview shows a stack of
          thumbnails for multi-select drags. Empty
          folder state with</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">helpful text and an Upload
          button. Loading state with skeletons matching
          the view mode.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Items render as a list or grid with proper
          roles. Selection state via</HighlightBlock>
<HighlightBlock as="p" tier="important"><code> aria-selected</code>. Context menu
          accessible via keyboard (Shift-F10).</HighlightBlock>
<HighlightBlock as="p" tier="important">Drag-and-
          drop has Cut/Paste keyboard equivalent. Live
          region announces selection counts and bulk
          operation results.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server-enforced permissions; UI reflects.
          Filenames <Highlight tier="important">render as text. Bulk operations
          rate-limited.</Highlight> Audit log on destructive actions.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for selection model (range, multi,
          rubber-band intersection math). Integration</HighlightBlock>
<HighlightBlock as="p" tier="important">tests: drag a multi-selection, verify all
          move; bulk delete with partial failure;
          keyboard</HighlightBlock>
<HighlightBlock as="p" tier="important">navigation across grid; context menu
          adapts to selection. Performance tests on
          1000-item folders.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Concurrent edits (another user moves an item
          out from under you): refresh banner and
          re-fetch. Item with very long name: truncate
          with</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">tooltip on hover. Rapid selection
          toggling: state stays consistent. Drag from
          desktop: the drop triggers an upload via the
          File Upload System.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over folder source. The explorer powers
          <Highlight tier="important">internal file managers, customer-facing file
          UIs,</Highlight> asset libraries, anywhere file-explorer
          mental models apply.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. Filenames as <Highlight tier="important">text.
          File sizes via Intl. Sort</Highlight> uses
          </Highlight><code> Intl.Collator</code> for locale-aware
          string ordering.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>List vs grid vs gallery views</h3>
        <HighlightBlock as="p" tier="important">
          Each fits different use cases — list for
          metadata-heavy browsing, grid for visual
          scanning, gallery for image-heavy folders. We
          support all three; the user picks per
          preference.
        </HighlightBlock>

        <h3>Client-side vs server-side filter</h3>
        <HighlightBlock as="p" tier="important">
          Client-side is fast for small folders; server-
          side handles large ones. We adapt: if the
          folder is small enough to load fully, filter
          locally; otherwise server search. Threshold
          configurable.
        </HighlightBlock>

        <h3>Auto-expand on hover during drag</h3>
        <HighlightBlock as="p" tier="crucial">
          Auto-expand mimics OS file managers and feels
          natural; the cost is occasional accidental
          expansions. We delay slightly (~500 ms) so a
          quick fly-over doesn&rsquo;t expand
          everything.
        </HighlightBlock>

        <h3>Rubber-band vs only click-to-select</h3>
        <HighlightBlock as="p" tier="important">
          Rubber-band is essential for power users who
          select many items. Click-only is simpler but
          loses a key affordance. We support both.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Smart folders (saved searches with
          auto-update). Tagging and tag-based filters.
          Recent files surface.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Cross-folder
          multi-select via a dragged-out tray.
          Offline mode with sync. AI-suggested
          organization (auto-rename, auto-tag).</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable source data, transient interaction state, derived render state, remote or worker effects, and bounded telemetry. Every object URL, request, worker, listener, timer, cache entry, and decoder task needs an explicit owner and cleanup path.</p><p>Model nodes by stable id, not mutable path. Expansion, selection, and mutation journals remain separate so rename or move does not invalidate descendant identity. Commit durable changes only after policy validation and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/file-explorer-ui-recovery.svg" alt="Design a File Explorer UI recovery" caption="Recovery flow: classify failure, preserve stable state, and degrade predictably." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>A flat file list is simple for shallow storage; a lazy explorer is justified for hierarchy, bulk actions, and repeated management.</p><p>The server file model is authoritative. Local mutations are optimistic only with stable ids, versions, and deterministic rollback. Scale pressure comes from deep trees, huge directories, path changes, recursive moves, permission drift, partial loading, and concurrent rename. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only when rollback is deterministic and visible. Keep authorization, validation, and destructive actions server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed states, generation guards, bounded queues, abortable effects, semantic HTML, and idempotent cleanup. Test accessibility, stale work, retries, unmount, constrained devices, large files, and corrupted input.</p><p>Measure latency, memory, queue pressure, stale drops, retries, fallbacks, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating rendered output as durable truth, leaking resources, accepting stale worker completion, unbounded prefetch, and hiding degraded behavior.</p><p>For this topic, dedupe child loads, reject recursive moves, rollback failed rename, refresh affected branches, retain focus by id, and hide restricted nodes. Validate untrusted content, authorize durable mutations, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to content-heavy product surfaces where browser APIs, workers, networks, and remote policy fail independently. Reuse the controller boundary while injecting product-specific fallback and retention policy.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Model nodes by stable id, not mutable path. Expansion, selection, and mutation journals remain separate so rename or move does not invalidate descendant identity.</p><h3>What breaks at scale?</h3><p>deep trees, huge directories, path changes, recursive moves, permission drift, partial loading, and concurrent rename. I would bound work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>The server file model is authoritative. Local mutations are optimistic only with stable ids, versions, and deterministic rollback.</p><h3>How do you recover?</h3><p>I would dedupe child loads, reject recursive moves, rollback failed rename, refresh affected branches, retain focus by id, and hide restricted nodes.</p><h3>Why this architecture?</h3><p>A flat file list is simple for shallow storage; a lazy explorer is justified for hierarchy, bulk actions, and repeated management.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" rel="noreferrer">MDN Web Workers API</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
