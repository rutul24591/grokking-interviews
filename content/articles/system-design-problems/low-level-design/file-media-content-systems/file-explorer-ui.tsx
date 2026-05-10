"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function FileExplorerUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          End users browse, organize, and act on files.
          They expect parity with desktop file managers:
          drag-to-move, right-click menus, multi-select
          with rubber-band, view-mode toggles, sort by
          column. Internal users (engineers integrate the
          explorer): provide a file source adapter, a
          set of supported actions, and the explorer
          handles UI mechanics.
        </p>

        <h3>Assumptions</h3>
        <p>
          Folder content is paginated by the backend
          (typically cursor-based for large folders).
          Thumbnails are server-generated (we display
          them) or client-generated for image files.
          Modern browsers; we use IntersectionObserver
          for thumbnail lazy-load, ResizeObserver for
          responsive grids, the HTML5 drag-and-drop API
          with custom layer for accessibility.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the folder hierarchy
          navigator (Tree View). We do not implement file
          upload (separate). We do not implement file
          preview/lightbox (separate). Server-side
          operations (move, copy, delete) are consumed
          via APIs we don&rsquo;t implement.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Recent files surfaced at the top. Pinned/
          favorited items. Inline rename via F2 or slow
          double-click. Quick-look preview on Space key.
          Drag-and-drop from external source (desktop)
          to upload. Server-side bulk operations with
          progress. Shareable selection URLs (a URL
          that, when opened, selects the same items).
        </p>

        <h3>Out of Scope</h3>
        <p>
          File content rendering (the consumer&rsquo;s
          responsibility on row activation). The
          underlying file storage system. Preview
          generation pipelines.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Smooth scroll at 60 fps even with 1000+ items.
          Thumbnails lazy-load and don&rsquo;t block
          rendering of metadata. Sort and filter under
          50 ms locally; server-side for very large
          folders. View mode switch under 100 ms.
        </p>

        <h3>Reliability</h3>
        <p>
          Selection state survives sort and filter.
          Drag-and-drop is transactional with optimistic
          UI. Bulk operations report partial failures
          clearly.
        </p>

        <h3>Security</h3>
        <p>
          Filenames render as text; HTML opt-in via
          sanitizer. Server enforces authorization on
          actions. Drag-and-drop respects permission
          (some files are read-only).
        </p>

        <h3>Accessibility</h3>
        <p>
          Full keyboard navigation. Screen-reader-
          announceable selection state. Context menu
          accessible via keyboard (Shift-F10 or context
          menu key). Drag-and-drop has keyboard
          equivalent (Cut/Paste).
        </p>

        <h3>Maintainability</h3>
        <p>
          File source adapter pattern. Action registry
          (declare actions, the explorer renders them
          in context menus and toolbars). View modes are
          plugins.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/file-explorer-ui-architecture.svg"
        alt="File Explorer UI Architecture"
        caption="Folder source → Item cache → View renderer (list / grid / gallery) with virtualization → Thumbnail loader (IntersectionObserver) → Multi-select model → Drag-and-drop with auto-expand on hover → Context menu with action registry."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <p>
          The <strong>folder source adapter</strong> exposes
          <code> getItems(folder, cursor, sort, filter)</code>{" "}
          returning paginated items plus next cursor.
          Items have id, name, type, size, modified date,
          thumbnail URL, permissions. The adapter caches
          loaded items per folder for fast back-navigation.
        </p>
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
        <p>
          <strong>Thumbnail loading</strong> uses
          IntersectionObserver per item: when an item
          enters the viewport, its thumbnail URL becomes
          the image src; the browser fetches and caches.
          Until then, we show a placeholder icon based
          on file type. For images, we use
          <code> loading=&quot;lazy&quot;</code> as a
          fallback. Failed thumbnails show the type icon
          instead.
        </p>
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
        <p>
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
        </p>
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
        <p>
          <strong>Bulk operations</strong>: delete a
          selection of 50 files. The action issues per-
          item or batch-API requests. Progress shows
          per-item completion. Partial failures (some
          deleted, some not) surface a summary
          (&ldquo;Deleted 47 of 50; 3 failed&rdquo;)
          with the failures listed and an option to
          retry.
        </p>
        <p>
          <strong>Search / filter</strong>: an input filters
          the current folder by name. For small folders,
          filter is client-side; for large folders, the
          adapter issues a server search. Results
          highlight matching characters.
        </p>
        <p>
          <strong>Keyboard navigation</strong>: arrow keys
          move the focus; in grid view, arrow keys move
          within the grid (down/right move forward,
          up/left back). Enter activates (open file,
          enter folder). Space toggles selection. Tab
          moves focus out of the explorer to the next
          interactive region.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ExplorerProvider</strong> instantiates
          source adapter, selection model, drag-drop
          plugin, action registry.
          <strong> FolderSource</strong> is the adapter.
          <strong> ListView</strong>, <strong>GridView</strong>,{" "}
          <strong>GalleryView</strong> are the view
          modes. <strong>ItemCard</strong> renders one
          item.
          <strong> SelectionModel</strong> tracks selected
          ids. <strong>DragDropPlugin</strong> handles
          drag mechanics. <strong>ContextMenu</strong>{" "}
          renders right-click actions.
          <strong> ActionRegistry</strong> declares
          available actions. <strong>ThumbnailLoader</strong>{" "}
          handles lazy loading. <strong>SearchBar</strong>{" "}
          handles in-folder search.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Folder content cache, selection state, view
          mode, sort, filter, drag state — all in
          external store. Subscribers (item cards) read
          via selectors; selection changes only re-render
          affected items.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Folder source contract:
          <code>{` { getItems, move, copy, delete, rename, search, supportsThumbnails } `}</code>.
          Item shape:{" "}
          <code>{` { id, name, type, size, modifiedAt, thumbnailUrl?, permissions } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Virtualization scopes mounted DOM. Memoized
          item cards. Thumbnail lazy load with
          IntersectionObserver; failed thumbnails fall
          back to type icons without retrying. Search
          debounced; client-side for small folders,
          server-side for large.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          View mode toggle in toolbar. Sort options as a
          dropdown or column headers (list view).
          Selection count and bulk actions in a
          contextual toolbar that appears when items are
          selected. Drag preview shows a stack of
          thumbnails for multi-select drags. Empty
          folder state with helpful text and an Upload
          button. Loading state with skeletons matching
          the view mode.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Items render as a list or grid with proper
          roles. Selection state via
          <code> aria-selected</code>. Context menu
          accessible via keyboard (Shift-F10). Drag-and-
          drop has Cut/Paste keyboard equivalent. Live
          region announces selection counts and bulk
          operation results.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server-enforced permissions; UI reflects.
          Filenames render as text. Bulk operations
          rate-limited. Audit log on destructive actions.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for selection model (range, multi,
          rubber-band intersection math). Integration
          tests: drag a multi-selection, verify all
          move; bulk delete with partial failure;
          keyboard navigation across grid; context menu
          adapts to selection. Performance tests on
          1000-item folders.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Drag a folder into itself or its descendant:
          rejected via valid-target detection. Bulk
          delete with some items locked: partial success,
          surface failures. Network failure mid-bulk-op:
          surface progress, allow Retry on remaining.
          Concurrent edits (another user moves an item
          out from under you): refresh banner and
          re-fetch. Item with very long name: truncate
          with tooltip on hover. Rapid selection
          toggling: state stays consistent. Drag from
          desktop: the drop triggers an upload via the
          File Upload System.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over folder source. The explorer powers
          internal file managers, customer-facing file
          UIs, asset libraries, anywhere file-explorer
          mental models apply.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Filenames as text.
          File sizes via Intl. Sort uses
          <code> Intl.Collator</code> for locale-aware
          string ordering.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>List vs grid vs gallery views</h3>
        <p>
          Each fits different use cases — list for
          metadata-heavy browsing, grid for visual
          scanning, gallery for image-heavy folders. We
          support all three; the user picks per
          preference.
        </p>

        <h3>Client-side vs server-side filter</h3>
        <p>
          Client-side is fast for small folders; server-
          side handles large ones. We adapt: if the
          folder is small enough to load fully, filter
          locally; otherwise server search. Threshold
          configurable.
        </p>

        <h3>Auto-expand on hover during drag</h3>
        <p>
          Auto-expand mimics OS file managers and feels
          natural; the cost is occasional accidental
          expansions. We delay slightly (~500 ms) so a
          quick fly-over doesn&rsquo;t expand
          everything.
        </p>

        <h3>Rubber-band vs only click-to-select</h3>
        <p>
          Rubber-band is essential for power users who
          select many items. Click-only is simpler but
          loses a key affordance. We support both.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Smart folders (saved searches with
          auto-update). Tagging and tag-based filters.
          Recent files surface. Cross-folder
          multi-select via a dragged-out tray.
          Offline mode with sync. AI-suggested
          organization (auto-rename, auto-tag).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How are thumbnails lazy-loaded?</strong>{" "}
          IntersectionObserver per item: when in
          viewport, set the image src. Until then,
          placeholder icon based on file type.
          <code> loading=&quot;lazy&quot;</code> as
          fallback for older browsers.
        </p>

        <p>
          <strong>2. How does multi-select work?</strong>{" "}
          Set of selected ids. Click replaces; ctrl-
          click toggles; shift-click ranges. Rubber-band
          selects items intersecting a drawn box on
          empty space.
        </p>

        <p>
          <strong>3. How does drag-and-drop into folders
          work?</strong> Drag selected items; targets in
          breadcrumb/tree highlight when valid; hover-
          on-folder for 500 ms auto-expands. Drop
          optimistically moves; server confirms;
          rollback on failure.
        </p>

        <p>
          <strong>4. How do bulk operations report
          progress?</strong> Each operation shows
          per-item progress (or summary for batch APIs).
          Partial failures list specifics with Retry.
          User can cancel mid-operation.
        </p>

        <p>
          <strong>5. How does this handle large folders
          (10k items)?</strong> Server-side pagination
          (cursor-based). Virtualization keeps DOM
          bounded. Filter via server search. Sort
          server-side when needed.
        </p>

        <p>
          <strong>6. How is keyboard accessibility handled
          in grid view?</strong> Arrow keys move focus
          across the grid (down/right forward, up/left
          back). Enter activates; Space toggles select.
          Context menu via Shift-F10. Cut/Paste for
          drag alternative.
        </p>

        <p>
          <strong>7. How does the context menu adapt to
          selection?</strong> Action registry filters by
          selection context. Single selection shows
          per-file actions (rename, download); multi
          shows bulk actions (move, delete). Permissions
          hide unauthorized actions.
        </p>

        <p>
          <strong>8. How does this differ from Tree
          View?</strong> Tree View is the folder
          hierarchy navigator (left side). File
          Explorer UI is the content area (right side)
          showing files within a selected folder. They
          compose to form the full file browsing
          experience.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A file explorer UI is a{" "}
          <strong>virtualized item view</strong> with
          list/grid/gallery modes, multi-select, drag-
          and-drop with auto-expand, context menus
          adaptive to selection, and bulk operations
          with partial-failure reporting. Composing it
          with the Tree View on the left produces the
          full file browsing experience users expect
          from desktop file managers — fast, accessible,
          familiar.
        </p>
      </section>
    </ArticleLayout>
  );
}
