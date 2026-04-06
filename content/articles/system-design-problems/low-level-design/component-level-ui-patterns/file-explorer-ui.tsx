"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-explorer-ui",
  title: "Design a File Explorer UI",
  description:
    "Complete LLD solution for a production-grade file explorer with thumbnails, context menus, bulk operations, search/filter, drag-and-drop, breadcrumb navigation, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "file-explorer-ui",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "file-explorer",
    "thumbnails",
    "context-menu",
    "bulk-operations",
    "drag-and-drop",
    "accessibility",
    "state-management",
  ],
  relatedTopics: [
    "context-menu",
    "drag-drop-list",
    "data-table",
    "search-autocomplete",
    "tree-view-folder-explorer",
  ],
};

export default function FileExplorerUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable file explorer UI component for a large-scale
          web application. The file explorer allows users to browse, manage, and
          interact with files and folders in a hierarchical directory structure. It
          must support two view modes — a grid view with visual thumbnails and a
          list view with sortable table columns — and users can toggle between them.
          Each file or folder displays a thumbnail: image previews for image files,
          and file-type-specific icons for non-image files, with lazy loading powered
          by IntersectionObserver to avoid rendering off-screen thumbnails. Right-clicking
          on any item opens a context menu with operations like open, rename, delete,
          move, copy, download, and view properties.
        </p>
        <p>
          The explorer must support multi-selection: single click selects one item,
          Ctrl+click (Cmd+click on Mac) toggles individual items, Shift+click selects
          a range from the last clicked item to the current one, and Ctrl+A selects
          all visible items. Bulk operations act on selected items — delete, move,
          copy, or download as a zip archive — with progress tracking for long-running
          operations. A search and filter bar lets users narrow the file list by name,
          file type, date modified, and size range. Breadcrumb navigation shows the
          current path as clickable segments for quick navigation up the directory tree.
          Files can be sorted by name, size, type, or date modified in ascending or
          descending order. Drag-and-drop enables moving files between folders within
          the explorer and accepting files dragged from the desktop. Full keyboard
          navigation maps arrow keys to selection movement, Enter to open, Delete to
          remove, and F2 to rename. The component must be fully accessible with proper
          ARIA roles, aria-selected states, and live region announcements for screen
          readers.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with Zustand for state management.
          </li>
          <li>
            File metadata (name, size, type, modified date, thumbnail URL) is provided
            by a backend API or a local file system abstraction.
          </li>
          <li>
            The explorer operates on a single directory at a time. Navigating into a
            folder replaces the current file list.
          </li>
          <li>
            Maximum visible items in grid/list view is governed by the viewport and
            virtualization is optional for directories with 1000+ items.
          </li>
          <li>
            Bulk operations (delete, move, copy, download) are asynchronous and report
            progress via a progress indicator.
          </li>
          <li>
            Drag-and-drop works both within the explorer (between folders) and from
            the desktop (native file drop).
          </li>
          <li>
            The application supports both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>View Modes:</strong> Toggle between grid view (thumbnail cards in a
            responsive grid layout) and list view (table with sortable columns for name,
            size, type, date modified).
          </li>
          <li>
            <strong>Thumbnails:</strong> Render image previews for image files (JPEG, PNG,
            GIF, SVG, WebP). For non-image files, render a file-type-specific icon (document,
            spreadsheet, video, audio, archive, code, etc.). Thumbnails lazy-load using
            IntersectionObserver — images only fetch when they enter or are about to enter
            the viewport.
          </li>
          <li>
            <strong>Context Menu:</strong> Right-click on any file or folder opens a
            context menu with options: Open, Rename, Delete, Move to, Copy to, Download,
            and Properties. The menu positions itself to stay within the viewport and
            closes on outside click or Escape key.
          </li>
          <li>
            <strong>Selection Model:</strong> Click selects a single item. Ctrl+click
            (Cmd+click on Mac) toggles an item in the selection set. Shift+click selects
            all items from the last anchor item to the clicked item (range selection).
            Ctrl+A selects all visible items. Clicking an unselected item without modifier
            keys clears the previous selection.
          </li>
          <li>
            <strong>Bulk Operations:</strong> When one or more items are selected, a bulk
            action bar appears at the bottom showing the count of selected items and buttons
            for Delete, Move, Copy, and Download as ZIP. Each operation shows a progress
            indicator and can be cancelled mid-operation.
          </li>
          <li>
            <strong>Search and Filter:</strong> A text input filters files by name (case-
            insensitive substring match). Additional filter dropdowns allow filtering by
            file type (e.g., Images, Documents, Videos), date modified (today, this week,
            this month, custom range), and size range (slider or min/max input).
          </li>
          <li>
            <strong>Breadcrumb Navigation:</strong> Displays the current directory path as
            a sequence of clickable segments (e.g., Home / Documents / Projects / frontend).
            Clicking any segment navigates to that directory. The breadcrumb updates on
            navigation and supports overflow truncation with a dropdown for hidden segments.
          </li>
          <li>
            <strong>Sorting:</strong> Files can be sorted by name, size, type, or date
            modified. Each column header is clickable to toggle ascending/descending. A
            small arrow icon indicates the current sort direction. Sorting is stable —
            items with equal sort keys retain their relative order.
          </li>
          <li>
            <strong>Drag and Drop:</strong> Files and folders can be dragged within the
            explorer and dropped onto folders to move them. Dropping files from the desktop
            onto the explorer triggers an upload flow. Drag preview shows a semi-transparent
            representation of the dragged items. Drop targets (folders) highlight on drag
            over.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow keys move the selection focus up,
            down, left, or right through the grid/list. Enter opens the focused item.
            Delete removes the selected items. F2 initiates inline rename. Escape cancels
            the current operation (context menu, rename input, selection).
          </li>
          <li>
            <strong>Accessibility:</strong> Grid view uses <code>role=&quot;grid&quot;</code>
            with <code>role=&quot;gridcell&quot;</code> for each item. List view uses
            <code>role=&quot;treegrid&quot;</code> or <code>role=&quot;row&quot;</code>.
            Each item has <code>aria-selected</code> reflecting its selection state.
            Screen readers announce selection changes, navigation, and operation results
            via <code>aria-live</code> regions.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Rendering 500+ items should not cause visible
            jank. Thumbnails use lazy loading. Sorting and filtering should complete within
            100ms for up to 5000 items. Grid/list re-renders use React memo and key
            stabilization.
          </li>
          <li>
            <strong>Scalability:</strong> The system should handle directories with 10,000+
            items. Virtualization (windowing) is recommended for list view beyond 500 items.
            Grid view should paginate or virtualize beyond the viewport capacity.
          </li>
          <li>
            <strong>Reliability:</strong> Bulk operations must be atomic where possible —
            if a bulk delete partially fails, the UI reflects which items were deleted and
            which failed. Progress tracking shows real-time status.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for file item types,
            view modes, sort configurations, selection state, context menu state, and
            filter criteria.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Directory with 10,000+ files — rendering all thumbnails at once would freeze
            the main thread. Lazy loading and virtualization are mandatory.
          </li>
          <li>
            User selects items, navigates into a folder, then navigates back — should
            the previous selection be restored or cleared? (Assumption: cleared on
            navigation, restored on back navigation via history.)
          </li>
          <li>
            Drag-and-drop a file onto itself — should be a no-op with visual feedback
            indicating the operation is invalid.
          </li>
          <li>
            Bulk delete while a file is being uploaded — operation conflict. The upload
            should be cancelled or the delete should exclude in-flight items.
          </li>
          <li>
            Rename a file to a name that already exists in the directory — should show
            a conflict resolution dialog (overwrite, keep both with suffix, cancel).
          </li>
          <li>
            Search filter returns zero results — show an empty state with a message
            (&quot;No files match your search&quot;) and a clear filters button.
          </li>
          <li>
            Thumbnail URL returns 404 or the image is corrupted — fall back to the
            file-type icon with a graceful error state.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The file explorer is composed of several cooperating modules, each responsible
          for a distinct concern. The <strong>Zustand store</strong> holds the canonical
          state: the current file list, view mode (grid or list), selection state, sort
          configuration, search and filter criteria, context menu state (open/closed,
          position, target item), and breadcrumb path. Derived state (filtered and sorted
          file list) is computed via store selectors to avoid stale or redundant data.
        </p>
        <p>
          The <strong>rendering layer</strong> consists of a root explorer component that
          composes the toolbar (view toggle, search input, sort dropdown, bulk action
          buttons), breadcrumb navigation, and either the file grid or file list based on
          the current view mode. Each file item in the grid or list renders a thumbnail
          component that handles lazy loading via IntersectionObserver and falls back to
          a file-type icon for non-image files.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>React Context + useReducer:</strong> Viable for the store, but the
            file explorer has many independent slices of state (selection, sort, filter,
            context menu, breadcrumbs) that change at different frequencies. Context
            triggers re-renders for all consumers when any part of the value changes,
            unless split into multiple contexts. Zustand&apos;s selector-based subscriptions
            prevent unnecessary re-renders more elegantly.
          </li>
          <li>
            <strong>Redux Toolkit:</strong> Provides excellent DevTools and middleware
            support but introduces significant boilerplate (slices, thunks, selectors)
            for a single-component feature. Overkill for a localized UI pattern.
          </li>
          <li>
            <strong>Local component state:</strong> Would tightly couple all explorer
            sub-components and make sharing state (e.g., selection count in the toolbar,
            context menu target across grid and list views) cumbersome through prop
            drilling or callback chains.
          </li>
        </ul>
        <p>
          <strong>Why Zustand is optimal:</strong> The file explorer is a self-contained
          feature with complex, interdependent state. Zustand provides a lightweight,
          selector-based global store with zero boilerplate. Each sub-component subscribes
          only to the state slice it needs, minimizing re-renders. The store can be scoped
          to a single explorer instance (supporting multiple explorers on the same page)
          via store factories or context-wrapped store providers.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of ten modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>explorer-types.ts</code>)</h4>
          <p>
            Defines the core data model. The <code>FileItem</code> interface includes
            id, name, type (file or folder), mimeType, size, modifiedAt, thumbnailUrl,
            parentId, and metadata. The <code>ViewMode</code> union is
            <code>&quot;grid&quot; | &quot;list&quot;</code>. <code>SortConfig</code>
            has a key (name, size, type, dateModified) and direction (asc, desc).
            <code>SelectionState</code> tracks selected IDs, the last clicked anchor
            for Shift+click, and a &quot;select all&quot; flag.
            <code>ContextMenuState</code> tracks open/closed status, x/y position, and
            the target FileItem. <code>FilterCriteria</code> bundles text query, type
            filter, date range, and size range.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Zustand Store (<code>explorer-store.ts</code>)</h4>
          <p>
            Central state container. Holds the current directory&apos;s file list, view mode,
            selection state, sort configuration, filter criteria, context menu state,
            breadcrumb path, and bulk operation progress. Exposes actions: setViewMode,
            toggleSelection, selectRange, selectAll, clearSelection, setSortConfig,
            setFilter, openContextMenu, closeContextMenu, navigateToFolder, setFileList,
            and bulk operation actions (startDelete, startMove, startCopy, startDownload,
            cancelOperation, completeOperation).
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>fileList: FileItem[]</code> — all items in the current directory
            </li>
            <li>
              <code>viewMode: ViewMode</code> — &quot;grid&quot; or &quot;list&quot;
            </li>
            <li>
              <code>selection: SelectionState</code> — selected IDs, anchor, selectAll flag
            </li>
            <li>
              <code>sortConfig: SortConfig</code> — key and direction
            </li>
            <li>
              <code>filter: FilterCriteria</code> — text, type, date range, size range
            </li>
            <li>
              <code>contextMenu: ContextMenuState</code> — open, x, y, targetItem
            </li>
            <li>
              <code>breadcrumb: string[]</code> — directory path segments
            </li>
            <li>
              <code>bulkOperation: BulkOperationState | null</code> — progress tracking
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. File Utilities (<code>file-utils.ts</code>)</h4>
          <p>
            Pure utility functions for file operations. <code>detectFileType()</code> maps
            file extensions to categories (image, document, video, audio, archive, code,
            spreadsheet, presentation, font, executable, other). <code>getFileIcon()</code>
            returns the appropriate icon component or SVG path data for each category.
            <code>formatFileSize()</code> converts bytes to human-readable strings
            (B, KB, MB, GB, TB) with appropriate precision. <code>generateThumbnailUrl()</code>
            constructs the thumbnail URL for a given file, applying size constraints and
            fallback logic.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Bulk Operations (<code>bulk-operations.ts</code>)</h4>
          <p>
            Handles multi-file operations with progress tracking. <code>bulkDelete()</code>
            removes selected files sequentially or in parallel, reporting progress as a
            percentage. <code>bulkMove()</code> relocates files to a target directory.
            <code>bulkCopy()</code> duplicates files to a target. <code>downloadAsZip()</code>
            uses JSZip to package selected files into a downloadable archive, with progress
            based on bytes processed. Each operation returns an abort controller so the UI
            can cancel mid-operation. Results include success and failure counts with
            per-item error details.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Selection Hook (<code>use-file-selection.ts</code>)</h4>
          <p>
            Encapsulates selection logic. <code>handleClick(item, event)</code> dispatches
            to single select, toggle select (Ctrl+click), or range select (Shift+click)
            based on modifier keys. <code>handleSelectAll()</code> selects every visible
            (filtered) item. <code>handleDeselectAll()</code> clears the selection.
            The hook reads the current file list from the store to compute range endpoints
            and updates the store&apos;s selection state.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Sort Hook (<code>use-file-sort.ts</code>)</h4>
          <p>
            Takes the file list and sort configuration, returns a sorted copy. Sorting is
            stable via <code>Array.prototype.toSorted()</code> with a comparison function
            that handles the sort key (string comparison for name/type, numeric for size,
            timestamp for dateModified). Folders are pinned to the top regardless of sort
            key, then files follow. The hook memoizes its output so re-sorting only occurs
            when the input list or sort config changes.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Filter Hook (<code>use-file-filter.ts</code>)</h4>
          <p>
            Takes the file list and filter criteria, returns a filtered copy. Text filter
            performs case-insensitive substring matching on the file name. Type filter
            matches the file category. Date range filter compares modifiedAt against the
            range boundaries. Size range filter compares the file size against min/max
            thresholds. Filters compose — all criteria must match (AND logic). The hook
            memoizes output for performance.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. Drag and Drop Hook (<code>use-drag-drop.ts</code>)</h4>
          <p>
            Manages drag-and-drop interactions. <code>onDragStart(item, event)</code> sets
            the drag data transfer with file IDs and creates a drag preview.
            <code>onDragOver(event)</code> prevents default to allow dropping and identifies
            drop targets. <code>onDrop(event)</code> processes the drop — if dropped on a
            folder, moves the dragged items into that folder; if dropped on the explorer
            background from desktop, triggers the upload flow. The hook tracks the current
            drag source (internal vs. external) and the hovered drop target for visual
            highlighting.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">9. Thumbnail Component (<code>file-thumbnail.tsx</code>)</h4>
          <p>
            Renders a thumbnail for a file item. For images, it uses an
            <code>&lt;img&gt;</code> tag with lazy loading via IntersectionObserver.
            The observer is set up in a useEffect with a rootMargin buffer (load slightly
            before entering viewport). For non-image files, it renders a file-type icon
            (SVG inline icon mapped by category). If the image fails to load, it falls
            back to the file-type icon. A loading placeholder renders as a skeleton while
            the image fetches.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">10. Context Menu (<code>file-context-menu.tsx</code>)</h4>
          <p>
            Renders a positioned context menu when open. The menu subscribes to the
            store&apos;s contextMenu state. It computes its position to stay within the
            viewport (flipping to the left if overflowing the right edge, flipping up if
            overflowing the bottom). It renders menu items for Open, Rename, Delete,
            Move to, Copy to, Download, and Properties. Keyboard navigation (arrow keys,
            Enter, Escape) is supported. The menu closes on outside click or Escape key
            via a useEffect with event listeners.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth. The file list, view mode,
          selection, sort config, filter criteria, context menu state, breadcrumb path,
          and bulk operation state all live in one store. Derived state — the filtered
          and sorted file list — is computed via hooks that consume store state and
          memoize their output. This ensures that filtering and sorting only re-run when
          their inputs change, not on every render.
        </p>
        <p>
          Selection is the most complex piece. The store tracks a Set of selected IDs,
          an anchor ID (last clicked item, used as the range start for Shift+click), and
          a selectAll boolean. When the user Ctrl+clicks, the item&apos;s ID is toggled
          in the Set. When Shift+click fires, the hook finds the indices of the anchor
          item and the clicked item in the filtered/sorted list and selects all items
          between them. Select all adds every visible item&apos;s ID to the Set.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/file-explorer-ui-architecture.svg"
          alt="File explorer UI architecture showing file store, virtualized rendering, and selection management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User navigates to a directory. The explorer fetches the file list via API
            and sets it in the store. Breadcrumb updates to reflect the path.
          </li>
          <li>
            FileGrid or FileList renders based on viewMode. Each item renders a
            FileThumbnail. IntersectionObserver begins tracking off-screen thumbnails.
          </li>
          <li>
            User clicks an item. useFileSelection.handleClick dispatches to the store,
            which updates the selection Set. The item&apos;s aria-selected updates.
          </li>
          <li>
            User right-clicks an item. Store opens the context menu at the cursor
            position with the item as target. ContextMenu renders.
          </li>
          <li>
            User selects &quot;Rename&quot; from context menu. An inline input appears
            on the item. On Enter, the store updates the file name via API call.
          </li>
          <li>
            User selects multiple items via Shift+click. BulkActionBar appears showing
            the count. User clicks &quot;Download as ZIP&quot;.
          </li>
          <li>
            bulkOperations.downloadAsZip() begins. Progress bar updates in the
            BulkActionBar. On completion, the browser triggers the file download.
          </li>
          <li>
            User types in the search bar. useFileFilter applies the text filter.
            The displayed list shrinks. Selection clears if selected items are filtered
            out.
          </li>
          <li>
            User clicks a column header. useFileSort re-sorts the list. The grid/list
            re-renders with the new order.
          </li>
          <li>
            User drags a file onto a folder. useDragDrop highlights the folder as a
            drop target. On drop, the file moves into the folder. The view refreshes.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The file explorer follows a unidirectional data flow. All user interactions
          dispatch actions to the Zustand store. The store updates its state and notifies
          subscribers. Components re-render based on their selectors. Derived data
          (filtered and sorted list) flows through custom hooks that memoize their output,
          preventing unnecessary computation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Pipeline: Filter then Sort</h3>
        <p>
          The data pipeline processes the raw file list in two stages. First, the filter
          hook applies all active filter criteria (text, type, date, size) using AND logic,
          producing a subset of the original list. Second, the sort hook takes the
          filtered output and sorts it according to the current sort configuration. This
          ordering — filter before sort — is deliberate: sorting a smaller dataset is
          faster, and the sort result is what the user sees rendered. Both stages are
          memoized, so if neither the input list nor the criteria change, the cached
          result is returned without computation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Large directories (10,000+ items):</strong> Rendering all items at
            once would block the main thread. The list view uses virtualization (react-window
            or a custom implementation) to render only visible rows plus a buffer. The grid
            view lazy-loads thumbnails via IntersectionObserver and can paginate or
            virtualize for extreme cases. Filter and sort operations use
            <code>toSorted()</code> and <code>filter()</code> which are optimized in
            modern JavaScript engines — 10,000 items sort in under 50ms on modern hardware.
          </li>
          <li>
            <strong>Selection during navigation:</strong> When the user navigates into a
            folder, the selection clears because the previous selection IDs are no longer
            in the current file list. On navigating back (via breadcrumb or back button),
            the explorer can restore the previous selection if it stores navigation history
            with selection snapshots.
          </li>
          <li>
            <strong>Thumbnail 404 fallback:</strong> If a thumbnail image fails to load
            (network error, corrupted file), the &lt;img&gt; onError handler swaps the
            rendering to the file-type icon fallback. This ensures the UI never shows
            broken image placeholders.
          </li>
          <li>
            <strong>Context menu viewport overflow:</strong> The context menu calculates
            its position relative to the viewport dimensions. If the menu would render
            beyond the right edge, it shifts left. If it would render below the bottom
            edge, it shifts up. This is computed in a useEffect after the menu renders
            with an initial position, using getBoundingClientRect.
          </li>
          <li>
            <strong>Bulk operation cancellation:</strong> Each bulk operation uses an
            AbortController. When the user clicks cancel, the controller aborts, the
            operation stops at the next checkpoint, and the UI reflects the partial
            result (e.g., &quot;3 of 5 files deleted, 2 failed&quot;).
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 16 files: TypeScript
            interfaces, Zustand store with selection/sort/filter/context menu state, file
            utilities for type detection and formatting, bulk operations with progress
            tracking, four custom hooks (selection, sort, filter, drag-and-drop), and eight
            React components (root explorer, grid view, list view, thumbnail, context menu,
            toolbar, bulk action bar). Click the <strong>Example</strong> toggle at the top
            of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (explorer-types.ts)</h3>
        <p>
          Defines the <code>FileItem</code> interface with fields for id, name, type
          (file or folder), mimeType, size, modifiedAt, thumbnailUrl, parentId, and a
          metadata bag for extension-specific properties. <code>ViewMode</code> is a
          string literal union. <code>SortConfig</code> bundles the sort key and direction.
          <code>SelectionState</code> tracks a Set of selected IDs, the anchor ID for
          range selection, and a selectAll flag. <code>ContextMenuState</code> holds the
          open flag, x/y coordinates, and target FileItem. <code>FilterCriteria</code>
          combines text, type, date range, and size range. <code>BulkOperationState</code>
          tracks the operation type, progress percentage, abort controller, and result
          summary.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (explorer-store.ts)</h3>
        <p>
          The store manages all explorer state. Key design decisions include: using
          <code>Set</code> for selected IDs for O(1) add/remove/has operations, storing
          the sort config as a simple object to enable shallow comparison selectors,
          and keeping the context menu state separate from the file list to avoid
          coupling. The store is factory-created so multiple explorer instances can
          coexist on the same page without state collision.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: File Utilities (file-utils.ts)</h3>
        <p>
          Pure utility functions with no side effects. <code>detectFileType()</code> uses
          a lookup map from file extension to category, with a fallback to &quot;other&quot;.
          <code>getFileIcon()</code> returns inline SVG path data for each category — no
          external icon library dependencies. <code>formatFileSize()</code> uses binary
          prefixes (KiB, MiB, GiB) with configurable decimal precision. Thumbnail URL
          generation applies a size query parameter for server-side resizing.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Bulk Operations (bulk-operations.ts)</h3>
        <p>
          Each operation accepts an array of FileItem IDs and an AbortController. Progress
          is reported via a callback that computes the percentage based on completed items
          over total items. Delete operations remove items from the store. Move and copy
          operations update parentId fields. Download as Zip uses JSZip to create an
          archive, adding files sequentially and reporting byte-level progress. On
          cancellation, the AbortController signal is checked between each item operation,
          allowing clean termination.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Selection Hook (use-file-selection.ts)</h3>
        <p>
          The hook reads the current file list and selection state from the store.
          <code>handleClick(item, event)</code> inspects event.ctrlKey, event.shiftKey,
          and event.metaKey to determine the selection mode. Single click sets the
          selection to only the clicked item and updates the anchor. Ctrl+click toggles
          the item in the selected Set. Shift+click computes the range between the anchor
          index and the clicked item index in the filtered/sorted list and selects all
          items in that range. <code>handleSelectAll()</code> adds every filtered item&apos;s
          ID to the Set.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Sort Hook (use-file-sort.ts)</h3>
        <p>
          Uses <code>useMemo</code> to memoize the sorted output. The comparison function
          handles each sort key: locale-aware string comparison for name (using
          <code>localeCompare</code>), numeric comparison for size, string comparison for
          type (by category), and timestamp comparison for dateModified. Folders are
          always pinned above files — the comparison function first checks the type field
          and returns a negative value if a is a folder and b is a file. The sort is
          stable by using <code>toSorted()</code>, which preserves the original order for
          equal elements.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Filter Hook (use-file-filter.ts)</h3>
        <p>
          Uses <code>useMemo</code> with a compound dependency array. The filter function
          chains predicates: name match (case-insensitive includes), type match (category
          equality), date range (modifiedAt within bounds), and size range (size within
          min/max). Each predicate is skipped if its corresponding filter criterion is
          unset, so a text-only filter does not evaluate date or size checks. The composed
          predicate runs in a single pass over the file list.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Drag and Drop Hook (use-drag-drop.ts)</h3>
        <p>
          Wraps the native HTML Drag and Drop API. <code>onDragStart</code> sets
          <code>event.dataTransfer.setData</code> with the dragged item IDs as JSON and
          configures the drag effect. A custom drag image can be set via
          <code>setDragImage()</code>. <code>onDragOver</code> prevents default, identifies
          the target element under the cursor via <code>document.elementFromPoint</code>,
          and sets the allowed drop action. <code>onDrop</code> reads the data transfer,
          determines if the source is internal (file IDs) or external (FileList from
          desktop), and dispatches the appropriate action. The hook exposes
          <code>isDragging</code>, <code>dragSource</code>, and <code>dropTarget</code>
          state for visual feedback.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Thumbnail Component (file-thumbnail.tsx)</h3>
        <p>
          Uses IntersectionObserver in a useEffect to lazy-load images. The observer has
          a rootMargin of &quot;200px&quot; to start loading slightly before the image
          enters the viewport. A loading state renders a skeleton placeholder. On load
          success, the image renders. On error, the component falls back to the file-type
          icon. The component accepts size variants (small, medium, large) for use in
          both grid and list views. For the list view, thumbnails are smaller (32x32)
          while grid view uses larger thumbnails (128x128 or responsive).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Context Menu (file-context-menu.tsx)</h3>
        <p>
          Renders a fixed-position div at the stored x/y coordinates. Uses a useEffect
          to attach outside-click and Escape key listeners for dismissal. Menu items
          render as buttons with appropriate icons and labels. Each menu item&apos;s
          onClick dispatches the corresponding action to the store. Submenus (e.g.,
          &quot;Move to&quot; showing recent folders) render on hover or arrow key
          navigation. The menu uses <code>role=&quot;menu&quot;</code> with
          <code>role=&quot;menuitem&quot;</code> for accessibility.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: Explorer Toolbar (explorer-toolbar.tsx)</h3>
        <p>
          Renders the view mode toggle (grid/list icons), search input with debounced
          text entry, sort dropdown (selecting key and direction), and bulk action buttons
          (visible only when items are selected). The search input uses a debounced value
          (300ms) to avoid filtering on every keystroke. The sort dropdown shows the
          current sort key and toggles direction on click.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: Bulk Action Bar (bulk-action-bar.tsx)</h3>
        <p>
          Conditionally renders when the selection Set is non-empty. Shows the count of
          selected items and action buttons (Delete, Move, Copy, Download as ZIP). During
          a bulk operation, a progress bar replaces the action buttons. A cancel button
          aborts the in-flight operation via the AbortController.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Filter (text only)</td>
                <td className="p-2">O(n) — single pass</td>
                <td className="p-2">O(k) — k matching items</td>
              </tr>
              <tr>
                <td className="p-2">Filter (all criteria)</td>
                <td className="p-2">O(n) — single pass, all predicates</td>
                <td className="p-2">O(k) — k matching items</td>
              </tr>
              <tr>
                <td className="p-2">Sort</td>
                <td className="p-2">O(k log k) — comparison sort</td>
                <td className="p-2">O(k) — sorted copy</td>
              </tr>
              <tr>
                <td className="p-2">Toggle selection</td>
                <td className="p-2">O(1) — Set add/delete</td>
                <td className="p-2">O(s) — s selected items</td>
              </tr>
              <tr>
                <td className="p-2">Range selection</td>
                <td className="p-2">O(r) — r items in range</td>
                <td className="p-2">O(s + r)</td>
              </tr>
              <tr>
                <td className="p-2">Select all</td>
                <td className="p-2">O(k) — iterate filtered list</td>
                <td className="p-2">O(k)</td>
              </tr>
              <tr>
                <td className="p-2">Bulk delete</td>
                <td className="p-2">O(s) — per-item operation</td>
                <td className="p-2">O(s) — result tracking</td>
              </tr>
              <tr>
                <td className="p-2">Download as Zip</td>
                <td className="p-2">O(totalBytes) — compression</td>
                <td className="p-2">O(totalBytes) — archive buffer</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the total file list size, <code>k</code> is the filtered
          list size, <code>s</code> is the number of selected items, and <code>r</code> is
          the range size. For 5000 items, filter + sort completes in under 100ms on modern
          hardware.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rendering large file lists:</strong> Rendering 1000+ DOM nodes for a
            directory causes layout thrashing and paint delays. Mitigation: use
            virtualization (react-window or react-virtuoso) for the list view. For grid
            view, use CSS grid with lazy thumbnail loading via IntersectionObserver. Only
            render items within or near the viewport.
          </li>
          <li>
            <strong>Thumbnail image loading:</strong> Loading 500+ image thumbnails
            simultaneously saturates the network and blocks the main thread with decode
            operations. Mitigation: IntersectionObserver with a 200px rootMargin ensures
            images load only when about to enter the viewport. Server-side thumbnail
            generation with size query parameters reduces payload size.
          </li>
          <li>
            <strong>Filter + sort on every keystroke:</strong> If the filter hook re-runs
            on every render, typing in the search bar triggers unnecessary computation.
            Mitigation: debounce the search input (300ms) and memoize the filter and sort
            outputs with useMemo keyed on their inputs.
          </li>
          <li>
            <strong>Re-render cascades from store updates:</strong> If components select
            the entire store state, any update triggers a re-render of all subscribers.
            Mitigation: use Zustand selectors to subscribe to specific state slices.
            FileGrid subscribes only to viewMode and the sorted/filtered list. FileList
          subscribes to the same. Toolbar subscribes to viewMode, filter, and sortConfig
          only.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Virtualization:</strong> For directories with 500+ items, wrap the
            list view in a virtualized scroller that renders only the visible rows plus a
            small buffer (e.g., 5 rows above and below). This reduces DOM node count from
            thousands to tens.
          </li>
          <li>
            <strong>Stable keys:</strong> Use <code>fileItem.id</code> as the React key
            for list/grid items. Avoid array index keys, which cause incorrect selection
            state and animation bugs when the list reorders.
          </li>
          <li>
            <strong>React.memo on item components:</strong> Wrap FileGridItem and
            FileListItem in React.memo with a custom comparison function that checks if
            the item data and selection state changed. This prevents re-rendering unchanged
            items when only one item&apos;s selection state changes.
          </li>
          <li>
            <strong>Web Worker for heavy sorting:</strong> For directories exceeding 10,000
            items, offload sort and filter operations to a Web Worker to avoid blocking
            the main thread. Post the file list and sort config to the worker, receive
            the sorted indices back.
          </li>
          <li>
            <strong>Thumbnail pre-generation:</strong> Generate thumbnails server-side at
            multiple resolutions (small for list view, medium for grid view, large for
            preview). Serve the appropriate size via URL query parameters. This avoids
            client-side image decoding and resizing.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          File names, paths, and metadata may contain user-controlled input. File names
          rendered as text content are safe by default in React (auto-escaped). However,
          if file names are used in URLs (e.g., download links), they must be URL-encoded
          to prevent injection attacks. Path traversal attacks (e.g., a file named
          <code>../../../etc/passwd</code>) must be validated server-side — the UI should
          never construct file paths from user input without sanitization.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">XSS via Thumbnail URLs</h3>
        <p>
          Thumbnail URLs are set as <code>src</code> attributes on <code>&lt;img&gt;</code>
          tags. If the URL comes from user-controlled input (e.g., a user-uploaded file
          with a malicious URL), it could point to a tracking pixel or an XSS vector.
          Validate that thumbnail URLs originate from a trusted CDN or storage bucket.
          Use Content Security Policy (CSP) headers to restrict image sources to
          whitelisted domains.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Drag and Drop from External Sources</h3>
        <p>
          Files dragged from the desktop (external drag) are provided as a
          <code>DataTransfer</code> object with <code>FileList</code>. These files are
          not automatically uploaded — the drop handler must explicitly read them and
          trigger an upload flow. Validate file types and sizes before processing. Reject
          files with disallowed extensions (e.g., executables, scripts) to prevent
          accidental execution of malicious content.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Arrow keys move focus through the grid or list. In grid view, arrow keys
              navigate in two dimensions (up/down/left/right). In list view, arrow keys
              navigate vertically.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> opens
              the focused item (navigates into folder or previews file).
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Delete</kbd>{" "}
              triggers a confirmation dialog for deleting selected items.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">F2</kbd> initiates
              inline rename on the focused item.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Ctrl+A</kbd> selects
              all visible items.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> cancels
              the current operation (context menu, rename, selection).
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Space</kbd> toggles
              selection of the focused item without changing focus.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <ul className="space-y-2">
            <li>
              Grid view uses <code>role=&quot;grid&quot;</code> on the container,
              <code>role=&quot;row&quot;</code> on each row (or implicit rows via CSS
              grid), and <code>role=&quot;gridcell&quot;</code> on each cell. Each cell
              has <code>aria-selected</code> reflecting its selection state.
            </li>
            <li>
              List view uses <code>role=&quot;treegrid&quot;</code> if folders are
              expandable inline, or <code>role=&quot;row&quot;</code> with
              <code>role=&quot;gridcell&quot;</code> for flat list rows.
            </li>
            <li>
              The context menu uses <code>role=&quot;menu&quot;</code> with
              <code>role=&quot;menuitem&quot;</code> for each action item.
            </li>
            <li>
              An <code>aria-live=&quot;polite&quot;</code> region announces selection
              changes (&quot;3 items selected&quot;), navigation (&quot;Entered Documents
              folder&quot;), and operation results (&quot;5 files deleted&quot;).
            </li>
            <li>
              The bulk action bar uses <code>role=&quot;toolbar&quot;</code> with
              <code>aria-label</code> describing the available actions.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bulk Operation Safety</h3>
        <ul className="space-y-2">
          <li>
            <strong>Delete confirmation:</strong> Bulk delete requires a confirmation
            dialog showing the count of items to be deleted. This prevents accidental mass
            deletion from a mis-click or keyboard shortcut.
          </li>
          <li>
            <strong>Move/Copy validation:</strong> Before moving or copying files, verify
            that the target directory exists and the user has write permissions. If a file
            with the same name exists at the target, prompt the user with a conflict
            resolution dialog (overwrite, rename with suffix, skip).
          </li>
          <li>
            <strong>Download as Zip size limits:</strong> Cap the maximum archive size
            (e.g., 2GB) to prevent memory exhaustion. If the selected files exceed the
            limit, show an error message suggesting the user select fewer files.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>File utilities:</strong> Test detectFileType for common extensions
            (.jpg, .pdf, .mp4, .zip, .js, .docx). Test formatFileSize for boundary
            values (0 bytes, 1023 bytes, 1024 bytes, 1 GB). Test getFileIcon returns
            the correct SVG path for each category.
          </li>
          <li>
            <strong>Sort hook:</strong> Test ascending and descending sort for each key
            (name, size, type, dateModified). Verify folders pin to the top. Verify
            stability — items with equal sort keys retain their original order.
          </li>
          <li>
            <strong>Filter hook:</strong> Test text filter with case variations, partial
            matches, and no matches. Test type filter for each category. Test date range
            filter with boundary dates. Test size range with min/max. Test compound
            filters (text + type + date + size).
          </li>
          <li>
            <strong>Selection hook:</strong> Test single click sets selection to one
            item. Test Ctrl+click toggles. Test Shift+click selects the correct range.
            Test Ctrl+A selects all filtered items. Test deselect all clears the Set.
          </li>
          <li>
            <strong>Bulk operations:</strong> Test bulkDelete removes items from the store.
            Test downloadAsZip produces a valid archive. Test cancellation mid-operation
            stops processing and reports partial results.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full explorer render:</strong> Render the FileExplorer component with
            a mock file list. Assert the toolbar, breadcrumb, and grid/list views render.
            Assert the correct number of items display.
          </li>
          <li>
            <strong>View mode toggle:</strong> Click the grid/list toggle. Assert the
            view switches and the file list re-renders with the correct layout.
          </li>
          <li>
            <strong>Selection flow:</strong> Click item 1, assert selected. Ctrl+click
            item 3, assert both selected. Shift+click item 5, assert items 1 through 5
            are selected.
          </li>
          <li>
            <strong>Context menu:</strong> Right-click an item, assert the context menu
            renders at the correct position. Click &quot;Rename&quot;, assert the inline
            input appears. Type a new name and press Enter, assert the file name updates.
          </li>
          <li>
            <strong>Search and filter:</strong> Type &quot;report&quot; in the search
            input, assert only files with &quot;report&quot; in the name display. Apply
            a type filter, assert the list further narrows. Clear the search, assert all
            files of the filtered type display.
          </li>
          <li>
            <strong>Drag and drop:</strong> Drag a file item onto a folder, assert the
            folder highlights as a drop target. Drop, assert the file moves into the
            folder and the view refreshes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Empty directory: assert an empty state message renders (&quot;This folder is
            empty&quot;).
          </li>
          <li>
            Search with zero matches: assert the empty state shows &quot;No files match
            your search&quot; with a &quot;Clear filters&quot; button.
          </li>
          <li>
            Thumbnail 404: simulate a failed image load, assert the file-type icon fallback
            renders.
          </li>
          <li>
            Context menu at viewport edge: trigger a right-click near the right/bottom
            edge, assert the menu repositions to stay within bounds.
          </li>
          <li>
            Bulk delete with 100 selected items: assert the progress bar updates, the
            operation completes, and all items are removed from the store.
          </li>
          <li>
            Keyboard navigation: focus the grid, press arrow keys, assert focus moves
            correctly. Press Enter on a folder, assert navigation occurs. Press F2,
            assert rename input appears.
          </li>
          <li>
            Accessibility: run axe-core automated checks on the rendered explorer. Verify
            aria-selected states, role attributes, and aria-live announcements. Test with
            a screen reader (VoiceOver, NVDA) for announcement correctness.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not separating filter and sort:</strong> Candidates often combine
            filtering and sorting into a single function that mutates the original array.
            This causes bugs when the view mode changes or when the user clears filters
            (the original order is lost). Interviewers expect candidates to keep the raw
            list immutable and compute derived views (filtered, then sorted) as separate
            memoized steps.
          </li>
          <li>
            <strong>Ignoring selection state on filter:</strong> When the user filters
            the file list, previously selected items may no longer be visible. Candidates
            often forget to handle this — the selection count shows 5 selected items but
            only 2 are visible, creating a confusing UX. The selection should either clear
            on filter change or persist with a visual indicator showing which selected
            items are currently hidden.
          </li>
          <li>
            <strong>Rendering all thumbnails eagerly:</strong> Rendering 500+ images at
            once blocks the main thread with network requests and image decoding.
            Interviewers look for candidates who mention IntersectionObserver-based lazy
            loading or virtualization.
          </li>
          <li>
            <strong>Not handling Shift+click range correctly:</strong> The range must be
            computed on the <em>filtered and sorted</em> list, not the raw file list.
            If the user filtered the list, Shift+click should select the range within the
            visible items, not the hidden ones.
          </li>
          <li>
            <strong>Forgetting accessibility:</strong> File explorers are heavily used by
            keyboard users (developers, power users). Rendering a grid of divs without
            keyboard navigation, ARIA roles, or screen reader announcements is a critical
            oversight.
          </li>
          <li>
            <strong>Context menu positioning:</strong> Rendering the context menu at the
            raw mouse event coordinates without checking viewport bounds causes it to
            render off-screen. Interviewers expect viewport-aware positioning.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Grid View vs List View</h4>
          <p>
            Grid view excels at visual browsing — users can quickly scan image thumbnails
            and visually identify files. List view excels at detailed inspection — users
            can compare file sizes, types, and dates, and sort by any column. The trade-off
            is information density versus visual recognition. Production file explorers
            (Finder, Explorer, Google Drive) offer both because different tasks benefit
            from different views. Grid view is better for media files; list view is better
            for code, documents, and administrative tasks.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Client-Side vs Server-Side Filtering</h4>
          <p>
            Client-side filtering is fast and responsive for directories with up to 5000
            items — no network round trip, instant feedback. Beyond 5000 items, the
            filtering cost grows and the memory footprint of storing all file metadata
            client-side becomes significant. Server-side filtering offloads computation
            to the backend and only transfers matching results, but introduces latency
            (network round trip) and requires debouncing to avoid excessive API calls.
            For most desktop-like applications, client-side filtering is preferred because
            directories rarely exceed a few hundred items. Server-side filtering is
            appropriate for cloud storage platforms (Google Drive, Dropbox) where users
            may have hundreds of thousands of files.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Virtualization vs Pagination</h4>
          <p>
            Virtualization (windowing) renders only the visible items plus a buffer,
            providing seamless scrolling with a constant DOM size. Pagination renders a
            fixed page of items with navigation controls, requiring explicit page changes.
            Virtualization is better for file explorers because users expect continuous
            scrolling (like their OS file manager). Pagination is simpler to implement
            and reduces initial load time (fewer API calls), but breaks the mental model
            of browsing files in a directory. The trade-off is implementation complexity
            (virtualization requires precise height calculations and scroll position
            tracking) versus UX familiarity.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Optimistic vs Pessimistic Bulk Operations</h4>
          <p>
            Optimistic bulk operations update the UI immediately (remove items from the
            list, show a progress indicator) and revert if the operation fails. This
            provides the best UX — the user sees instant feedback. Pessimistic operations
            wait for the backend to confirm before updating the UI, showing a loading
            state throughout. Optimistic is preferred for delete operations (the user
            expects instant removal) but requires a robust rollback mechanism. Pessimistic
            is safer for move/copy operations where data integrity is critical and a
            failed move could leave files in an inconsistent state.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle real-time file changes (e.g., a file being modified
              by another process while the explorer is open)?
            </p>
            <p className="mt-2 text-sm">
              A: Use a WebSocket or Server-Sent Events (SSE) connection to receive file
              change events from the backend. When an event arrives (file created, modified,
              deleted), update the store&apos;s file list accordingly. If the changed file
              is currently selected, update its metadata in the selection state. If it was
              deleted and is selected, remove it from the selection Set. Throttle updates
              to avoid excessive re-renders — batch multiple events into a single store
              update using requestAnimationFrame.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement file versioning in the explorer?
            </p>
            <p className="mt-2 text-sm">
              A: Add a &quot;Version History&quot; option to the context menu. When
              selected, open a side panel or modal showing the file&apos;s version timeline
              (timestamp, author, size, change summary). Each version can be previewed,
              restored, or downloaded. The backend stores versions with unique IDs and
              diff metadata. The UI renders a vertical timeline with clickable version
              nodes. Restoring a version creates a new latest version with the old content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add collaborative editing indicators (showing who is
              currently viewing/editing a file)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a presence layer to the store. Each connected user broadcasts their
              current location (which file or folder they have open) via WebSocket. The
              store maintains a map of fileId to user IDs currently viewing it. The UI
              renders small avatar badges on file thumbnails showing active viewers.
              Clicking an avatar shows the viewer&apos;s name and last activity timestamp.
              Presence updates are debounced to avoid network spam, and stale entries
              (no heartbeat for 30 seconds) are automatically removed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle file permission indicators and permission-aware UI?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>permissions</code> field to the FileItem interface (read,
              write, delete, share booleans). The UI renders permission icons (lock icon
              for read-only, pencil for editable) next to each file name. Context menu
              items are disabled based on permissions — if the user lacks delete
              permission, the Delete option is grayed out with a tooltip explaining why.
              Bulk operations filter out items the user cannot act on, showing a warning
              (&quot;3 of 5 selected items will be deleted — 2 lack permission&quot;).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add a &quot;Recent Files&quot; or &quot;Quick Access&quot;
              section?
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a separate store slice for recent files, updated on every file
              open action. Store the file ID and opened timestamp in a capped LRU list
              (max 20 entries). Render a &quot;Quick Access&quot; section at the top of
              the explorer (above the current directory contents) or as a separate view
              accessible via the sidebar. Each recent file entry shows the file name,
              parent directory path (as a clickable breadcrumb), and relative time
              (&quot;2 hours ago&quot;). Pinning a file to Quick Access adds it to a
              separate pinned list that does not expire.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you optimize the download-as-Zip operation for large file sets?
            </p>
            <p className="mt-2 text-sm">
              A: For large archives, client-side Zip creation blocks the main thread and
              consumes significant memory. Instead, offload archive creation to the
              backend: send the list of file IDs to a /api/download endpoint, the server
              streams a Zip archive back as a response body. The UI shows a progress bar
              based on Content-Length and bytes received (using the Fetch API with a
              ReadableStream reader). This approach avoids client-side memory pressure,
              leverages server-side compression efficiency, and supports resuming
              interrupted downloads via Range requests.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — HTML Drag and Drop API
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Grid Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/menu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Menu Pattern — Context Menu Accessibility
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Stuk/jszip"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSZip — Client-Side Zip Archive Library
            </a>
          </li>
          <li>
            <a
              href="https://bvaughn.github.io/react-window/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Window — Virtualization Library for React Lists and Grids
            </a>
          </li>
          <li>
            <a
              href="https://zustand-demo.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/bulk-operations/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Bulk Operations UX Guidelines
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}