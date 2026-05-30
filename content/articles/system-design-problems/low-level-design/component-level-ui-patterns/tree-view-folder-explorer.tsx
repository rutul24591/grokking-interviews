"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-tree-view-folder-explorer",
  title: "Design a Tree View / Folder Explorer",
  description:
    "Complete LLD solution for a production-grade tree view / folder explorer with lazy loading nodes, move/copy operations, multi-select, drag-and-drop, context menus, search/filter, and keyboard navigation.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "tree-view-folder-explorer",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "tree-view",
    "folder-explorer",
    "lazy-loading",
    "drag-and-drop",
    "multi-select",
    "context-menu",
    "keyboard-navigation",
  ],
  relatedTopics: [
    "drag-drop-list",
    "infinite-scroll-virtualized-list",
    "search-autocomplete",
    "data-table",
  ],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Tree View Folder Explorer</h1><h2>Definition &amp; Context</h2><p>Design a Tree View Folder Explorer is an implementation-heavy low-level design problem covering lazy child loading, expansion state, keyboard traversal, selection, virtualized flattening, rename, move validation, and focus restoration. A principal-level answer must define state ownership, durable boundaries, lifecycle cleanup, degraded behavior, privacy, cost, and observability.</p><p>Store nodes by stable id and derive a visible flattened preorder list from expanded branches. Paths and labels can change without invalidating identity. The core structures are node map, parent-child index, expanded set, loaded-child cursors, visible preorder list, focused id, selected ids, mutation journal, version etag, and pending request map.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/tree-view-folder-explorer-runtime.svg" alt="Design a Tree View Folder Explorer runtime" caption="Topic-specific runtime stages from user intent through durable projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p>{/* Section 1: Problem Clarification */}
      <section>
        <h3>Problem Clarification</h3>
        <HighlightBlock as="p" tier="crucial">
          We need to design a reusable tree view / folder explorer component for a
          large-scale React application. The component must display hierarchical data
          (files, folders, organizational units) with expand/collapse functionality,
          support lazy loading of child nodes on demand, enable single and multi-select
          with keyboard modifiers, allow drag-and-drop reorganization between parent
          nodes with circular reference prevention, provide a right-click context menu
          for common operations (rename, delete, move, copy, new folder/file), support
          real-time search and filter with match highlighting, and offer full keyboard
          navigation. The component must handle arbitrary nesting depth without performance
          degradation and display a breadcrumb trail showing the current path for any
          selected node.
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <HighlightBlock as="li" tier="important">
            Tree nodes represent files and folders, each with a unique ID, name, type
            (file/folder), and optional metadata (size, modified date, extension).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            The tree can contain thousands of nodes; not all are loaded upfront. Children
            are fetched on-demand when a parent folder is expanded.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Drag-and-drop must prevent circular references (e.g., dropping a folder into
            one of its own descendants).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Multi-select supports Ctrl+Click for individual toggles and Shift+Click for
            range selection.
          </HighlightBlock>
          <li>
            Search filters the tree in real-time, showing only matching nodes and their
            ancestor paths.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h3>Requirements</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Tree Structure:</strong> Display hierarchical nodes with
            expand/collapse toggle. Support arbitrary nesting depth. Each node has an
            icon (folder open/closed, file type by extension).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Lazy Loading:</strong> When a folder node is expanded for the first
            time, fetch its children from an API. Show a loading indicator per node
            during fetch. Cache loaded children to avoid redundant fetches.
          </HighlightBlock>
          <li>
            <strong>Selection:</strong> Single-select by click. Multi-select via
            Ctrl+Click (toggle individual). Range select via Shift+Click (select all
            nodes between last-selected and current). Select all / deselect all.
          </li>
          <li>
            <strong>Drag and Drop:</strong> Drag a node onto another folder to move it.
            Validate drop target (must be a folder, must not be a descendant of the
            dragged node). Show visual drop indicator.
          </li>
          <li>
            <strong>Copy Operations:</strong> Right-click context menu supports copy
            (copy node to clipboard), paste (into target folder). Copy creates a
            duplicate subtree with new IDs.
          </li>
          <li>
            <strong>Context Menu:</strong> Right-click on any node shows a menu with
            Rename, Delete, Move, Copy, New Folder, New File. Menu dismisses on click
            outside or Escape key.
          </li>
          <li>
            <strong>Search/Filter:</strong> Text input filters tree by node name.
            Matching nodes and their full ancestor paths remain visible. Non-matching
            branches are hidden. Match text is highlighted.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Keyboard Navigation:</strong> ArrowRight expands, ArrowLeft collapses.
            Enter selects node. Space toggles checkbox (multi-select mode). Home/End
            navigate to first/last visible node.
          </HighlightBlock>
          <li>
            <strong>Breadcrumb:</strong> Display the full path from root to the currently
            selected node. Each breadcrumb segment is clickable to navigate to that
            ancestor.
          </li>
          <li>
            <strong>Bulk Operations:</strong> Select multiple nodes, then perform move,
            copy, or delete on all selected nodes simultaneously.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Initial render should not mount all DOM nodes.
            Use virtualization for large visible lists. Expand/collapse should not cause
            visible jank.
          </HighlightBlock>
          <li>
            <strong>Scalability:</strong> The component should handle trees with 10,000+
            total nodes (mostly lazy-loaded) without memory leaks. Visible nodes at any
            depth should render smoothly.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Reliability:</strong> Circular reference detection must be O(d) where
            d is the tree depth, not O(n) full-tree traversal. Move/copy operations must
            be atomic — failure rolls back the entire operation.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Accessibility:</strong> Full keyboard navigation, ARIA treegrid roles,
            screen reader announcements for expand/collapse, selection changes, and
            drag-and-drop outcomes.
          </HighlightBlock>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for TreeNode,
            TreeAction, SelectionState, ContextMenuAction types.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Expanding a folder whose children fail to load (API error) — show retry UI
            per node.
          </li>
          <li>
            Dragging a folder into its own descendant — must be detected and rejected
            with visual feedback.
          </li>
          <li>
            Searching while nodes are lazy-loading — search results must incorporate
            currently loaded nodes and indicate unloaded branches.
          </li>
          <li>
            Deleting a node that is currently selected — selection must clear or move to
            the nearest sibling.
          </li>
          <li>
            Renaming a node to a name that already exists in the same parent — show
            conflict error.
          </li>
          <li>
            Very deep nesting (50+ levels) — breadcrumbs must handle overflow, tree
            indentation must not push content off-screen.
          </li>
          <li>
            SSR rendering — the tree must not attempt DOM measurements or access
            localStorage during SSR.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h3>High-Level Approach</h3>
        <HighlightBlock as="p" tier="important">
          The core idea is to separate the <strong>tree state management</strong> from
          the <strong>tree rendering</strong> using a global store (Zustand) and a
          recursive component rendering strategy. The store manages the flat node map
          (keyed by ID), expanded state, selection state, lazy-load status, and exposes
          actions for expand/collapse, move, copy, delete, rename, and search. The
          rendering layer builds the visual tree from the flat map using parent-child
          relationships, renders each node with its icon, label, checkbox, and handles
          user interactions (click, right-click, drag).
        </HighlightBlock>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Nested object tree (recursive structure):</strong> Intuitive but
            makes operations like move, copy, and find-by-ID require full tree traversal.
            Updating nested state immutably is complex and error-prone. Flat map with
            parent pointers simplifies all operations to O(1) or O(d).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Local state per TreeNode component:</strong> Each node manages its own
            expanded state. This works for small trees but makes cross-cutting concerns
            (multi-select, search, drag-and-drop validation) extremely difficult because
            state is scattered across components. A centralized store is necessary.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Redux:</strong> Viable but adds significant boilerplate for what is
            essentially a local UI component. Zustand provides the same global
            accessibility with less overhead and better selector-based performance.
          </HighlightBlock>
        </ul>
        <HighlightBlock as="p" tier="important">
          <strong>Why Flat Map + Zustand is optimal:</strong> Storing nodes in a flat
          Map&lt;id, TreeNode&gt; with parent pointers enables O(1) lookups, O(d) ancestor
          traversal for cycle detection, and simple immutable updates. The tree hierarchy
          is derived at render time by filtering nodes with a given parentId. Zustand
          provides selector-based subscriptions so only affected TreeNode components
          re-render on state changes. This pattern is used by production tree components
          in file explorers, IDE project panels, and org-chart renderers.
        </HighlightBlock>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h3>System Design</h3>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/tree-view-folder-explorer-architecture.svg"
          alt="Tree view folder explorer architecture showing node state, lazy loading, virtualization, and keyboard navigation"
          caption="Architecture Overview"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Tree Types &amp; Interfaces (<code>tree-types.ts</code>)</h4>
          <HighlightBlock as="p" tier="crucial">
            Defines the <code>TreeNode</code> interface with fields for id, name, type
            (file/folder), parentId, children (array of child IDs, lazy-loaded), isExpanded,
            isLoading, isLoaded, isSelected, metadata (size, extension, modifiedAt). The
            <code>SelectionState</code> tracks selected IDs, lastSelectedId (for Shift+Click
            range), and mode (single/multi). The <code>TreeAction</code> union types all
            possible operations (expand, collapse, select, move, copy, delete, rename,
            search). The <code>ContextMenuAction</code> union covers rename, delete, move,
            copy, paste, newFolder, newFile. See the Example tab for the complete type
            definitions.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Tree Store (<code>tree-store.ts</code>)</h4>
          <p>
            Manages the global tree state using Zustand. Stores the flat node map, expanded
            node IDs, selection state, and lazy-load status. Exposes actions for
            expand/collapse (with lazy-load trigger), select/deselect, move (with cycle
            detection), copy (deep clone subtree), delete, rename, and search. Cycle
            detection traverses ancestors from the target folder up to root, checking if
            any ancestor matches the dragged node ID.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>nodes: Map&lt;string, TreeNode&gt;</code> — flat map of all nodes
            </li>
            <li>
              <code>rootIds: string[]</code> — IDs of top-level nodes
            </li>
            <li>
              <code>selectedIds: Set&lt;string&gt;</code> — currently selected node IDs
            </li>
            <li>
              <code>expandedIds: Set&lt;string&gt;</code> — currently expanded folder IDs
            </li>
            <li>
              <code>loadingIds: Set&lt;string&gt;</code> — nodes currently fetching children
            </li>
            <li>
              <code>searchQuery: string</code> — active search filter
            </li>
            <li>
              <code>searchResults: Set&lt;string&gt;</code> — IDs matching search query
            </li>
          </ul>
          <p className="mt-3">
            <strong>Key actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>expandNode(id)</code> — if folder and not loaded, trigger lazy load
            </li>
            <li>
              <code>moveNode(sourceId, targetParentId)</code> — validate, reparent, cycle check
            </li>
            <li>
              <code>copyNode(sourceId, targetParentId)</code> — deep clone subtree, new IDs
            </li>
            <li>
              <code>deleteNode(id)</code> — remove node and all descendants
            </li>
            <li>
              <code>renameNode(id, newName)</code> — update name, validate uniqueness
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Tree Utilities (<code>tree-utils.ts</code>)</h4>
          <p>
            Pure functions for tree operations: <code>buildTree</code> converts flat node
            map into a nested structure for rendering; <code>findNode</code> retrieves a
            node by ID; <code>getPath</code> returns the ancestor chain from root to a
            given node (for breadcrumbs); <code>detectCircularRef</code> checks if moving
            node A into folder B would create a cycle by walking B&apos;s ancestors;
            <code>filterTree</code> returns a Set of visible node IDs given a search query,
            including ancestor paths of matches.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Custom Hooks</h4>
          <p>
            Four focused hooks encapsulate specific behaviors:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>useTreeNode(id)</code> — per-node hook: expand/collapse with lazy load,
              selection, context menu trigger, drag source setup.
            </li>
            <li>
              <code>useTreeSelection()</code> — multi-select logic: Ctrl+Click toggle,
              Shift+Click range, select/deselect all.
            </li>
            <li>
              <code>useTreeDrag()</code> — drag source and drop target setup, cycle detection
              on drop, visual drop indicator.
            </li>
            <li>
              <code>useTreeSearch()</code> — debounced search input, filter computation,
              highlight extraction.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Components</h4>
          <p>
            Six components composing the tree UI:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>TreeView</code> — root container with keyboard navigation, subscribes
              to store for root IDs.
            </li>
            <li>
              <code>TreeNodeList</code> — renders a list of nodes at a given depth level,
              handles indentation.
            </li>
            <li>
              <code>TreeNode</code> — individual node with icon (by type/extension), label,
              checkbox, expand/collapse chevron, context menu, drag handle.
            </li>
            <li>
              <code>TreeContextMenu</code> — absolutely positioned menu with rename, delete,
              move, copy, new folder/file options.
            </li>
            <li>
              <code>TreeBreadcrumb</code> — displays path from root to selected node, each
              segment clickable.
            </li>
            <li>
              <code>TreeSearchBar</code> — text input with real-time filtering, clear button.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <HighlightBlock as="p" tier="important">
          The Zustand store is the single source of truth. Nodes are stored in a flat Map
          for O(1) lookup. The tree hierarchy is implicit via parentId references. When a
          folder is expanded, the store checks if children are already loaded. If not, it
          sets a loading flag, calls the fetch function, and on success inserts children
          into the node map and adds their IDs to the parent&apos;s children array.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Selection uses a Set for O(1) add/remove/has operations. Shift+Click range
          selection computes the range by finding all visible nodes between the
          lastSelectedId and the current clicked node in the visible node order.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Move operations validate the target: the target must be a folder, and the
          dragged node must not be an ancestor of the target (cycle detection). Cycle
          detection walks the target&apos;s ancestor chain (following parentId pointers)
          and checks if any ancestor matches the dragged node ID — O(d) where d is depth.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            TreeView mounts, subscribes to store for rootIds, renders TreeNodeList with
            depth 0.
          </li>
          <li>
            TreeNodeList renders each TreeNode with appropriate indentation.
          </li>
          <li>
            User clicks expand chevron on a folder. useTreeNode calls store.expandNode(id).
          </li>
          <HighlightBlock as="li" tier="important">
            Store checks if node.isLoaded. If not, sets loading flag, calls fetch API,
            receives child nodes, inserts into map, marks as loaded.
          </HighlightBlock>
          <li>
            Store adds node ID to expandedIds. Zustand notifies subscribers.
          </li>
          <li>
            TreeNodeList for the expanded folder renders its children (now in the map).
          </li>
          <li>
            User drags node A onto folder B. useTreeDrag validates: B is folder, A is
            not ancestor of B. If valid, store.moveNode(A.id, B.id) reparents A.
          </li>
          <li>
            User right-clicks node. Context menu renders at cursor position. User selects
            &quot;Rename&quot;, inline input appears. On submit, store.renameNode(id, newName).
          </li>
          <li>
            User types in search bar. useTreeSearch debounces query, calls store.search(query).
            Store computes matching IDs, updates searchResults. TreeView filters visible
            nodes accordingly.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h3>Data Flow / Execution Flow</h3>
        <HighlightBlock as="p" tier="important">
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions. This ensures predictable behavior and makes the system testable
          in isolation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Lazy Load Flow</h3>
        <HighlightBlock as="p" tier="crucial">
          When a folder is expanded for the first time, the store sets the node&apos;s
          loading flag and triggers the fetch. The TreeNode component subscribes to the
          loading flag and renders a spinner. On fetch success, children are inserted into
          the node map, the parent&apos;s children array is updated, and the loading flag
          is cleared. The TreeNodeList for the parent re-renders with the new children.
          On fetch failure, an error state is set and a retry button is rendered.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cycle Detection Flow</h3>
        <HighlightBlock as="p" tier="important">
          When attempting to move node A into folder B, the store calls
          <code>detectCircularRef(A.id, B.id, nodes)</code>. This function starts at B
          and follows parentId pointers upward, checking at each step if the current
          ancestor equals A.id. If a match is found, the move is rejected. If the root
          is reached without a match, the move is allowed. This is O(d) where d is the
          depth of B in the tree, avoiding full-tree traversal.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Search Filter Flow</h3>
        <HighlightBlock as="p" tier="important">
          When the user types in the search bar, the query is debounced (300ms). The
          store iterates all loaded nodes, checks if the node name includes the query
          (case-insensitive), and marks matching IDs. For each match, all ancestors are
          also marked visible (so the path to the match is shown). The TreeView then
          filters its rendering to only show nodes in the visible set. Matching text
          within node names is highlighted using a split-and-wrap approach: the name is
          split by the query, and matching segments are wrapped in a highlight span.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Lazy load failure:</strong> The store sets an error state on the node
            and clears the loading flag. The TreeNode renders a retry button that calls
            the fetch function again. The expandedIds set is not cleared so the user sees
            the error state within the expanded folder.
          </HighlightBlock>
          <li>
            <strong>Drag into descendant:</strong> Cycle detection rejects the move and
            the drop target shows a red highlight with a tooltip &quot;Cannot move folder
            into its own descendant.&quot; The source node snaps back to its original
            position.
          </li>
          <li>
            <strong>Search during lazy load:</strong> Search only considers loaded nodes.
            Unloaded branches are indicated with a badge (&quot;+ more&quot;) when a
            parent matches but children are not yet fetched. This prevents false negatives
            where a matching node exists on the server but hasn&apos;t been loaded yet.
          </li>
          <li>
            <strong>Node deletion during selection:</strong> When a selected node is
            deleted, selection moves to the next sibling (or parent if no sibling exists).
            The store computes the new selection atomically with the deletion.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h3>Implementation</h3>
        <HighlightBlock as="p" tier="important">
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </HighlightBlock>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 13 files:
            TypeScript types, Zustand store with cycle detection and move/copy operations,
            tree utility functions, four custom hooks (per-node, selection, drag, search),
            six components (tree view, tree node, tree node list, context menu, breadcrumb,
            search bar), and a full EXPLANATION.md walkthrough. Click the <strong>Example</strong>{" "}
            toggle at the top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Tree Types (tree-types.ts)</h3>
        <HighlightBlock as="p" tier="important">
          Defines the <code>TreeNode</code> interface with id, name, type (&quot;file&quot;
          or &quot;folder&quot;), parentId, children array (child IDs), metadata (size,
          extension, modifiedAt), isExpanded, isLoading, isLoaded, isSelected. The
          <code>SelectionState</code> interface tracks selectedIds (Set), lastSelectedId,
          and selection mode. The <code>TreeAction</code> discriminated union covers all
          possible operations. The <code>ContextMenuAction</code> union covers rename,
          delete, move, copy, paste, newFolder, newFile.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Tree Store (tree-store.ts)</h3>
        <HighlightBlock as="p" tier="crucial">
          The store manages the flat node map, expanded state, selection, loading state,
          and search results. Key design decisions include: using a Map for O(1) node
          lookup, cycle detection via ancestor traversal (O(d)), deep clone for copy
          operations with ID regeneration, atomic move operations (validate then apply),
          and lazy-load caching (children fetched once, stored in map).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Tree Utilities (tree-utils.ts)</h3>
        <p>
          Pure functions operating on the flat node map: <code>buildTree</code> constructs
          a nested array from rootIds and the node map; <code>findNode</code> does O(1)
          Map lookup; <code>getPath</code> walks parentId pointers from a node to root,
          returning the ancestor chain; <code>detectCircularRef</code> checks if moving A
          into B would create a cycle; <code>filterTree</code> computes visible node IDs
          given a search query.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Custom Hooks</h3>
        <HighlightBlock as="p" tier="important">
          <code>useTreeNode</code> encapsulates per-node behavior: expand/collapse with
          lazy load trigger, selection state, context menu position, drag source setup.
          <code>useTreeSelection</code> manages multi-select with Ctrl/Shift modifiers
          and range computation. <code>useTreeDrag</code> handles drag source and drop
          target logic with cycle detection on drop. <code>useTreeSearch</code> provides
          debounced search with highlight extraction.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Components</h3>
        <HighlightBlock as="p" tier="important">
          <code>TreeView</code> is the root container with global keyboard navigation
          (ArrowLeft/Right for expand/collapse, Enter for select, Space for checkbox).
          <code>TreeNodeList</code> renders nodes at a given depth with proper indentation
          (24px per level). <code>TreeNode</code> renders a single node with icon (folder
          open/closed, file type by extension), label, checkbox, expand chevron, and
          context menu trigger. <code>TreeContextMenu</code> renders an absolutely
          positioned menu with action items. <code>TreeBreadcrumb</code> shows the path
          from root to selected node. <code>TreeSearchBar</code> provides a search input
          with real-time filtering.
        </HighlightBlock>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h3>Performance &amp; Scalability</h3>

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
                <td className="p-2">findNode</td>
                <td className="p-2">O(1) — Map lookup</td>
                <td className="p-2">O(n) — stores n nodes</td>
              </tr>
              <tr>
                <td className="p-2">expandNode</td>
                <td className="p-2">O(1) — set add + fetch</td>
                <td className="p-2">O(k) — k children loaded</td>
              </tr>
              <tr>
                <td className="p-2">moveNode</td>
                <td className="p-2">O(d) — cycle check</td>
                <td className="p-2">O(1) — reparent</td>
              </tr>
              <tr>
                <td className="p-2">copyNode</td>
                <td className="p-2">O(s) — s = subtree size</td>
                <td className="p-2">O(s) — cloned nodes</td>
              </tr>
              <tr>
                <td className="p-2">deleteNode</td>
                <td className="p-2">O(s) — remove subtree</td>
                <td className="p-2">O(1) — removals</td>
              </tr>
              <tr>
                <td className="p-2">getPath</td>
                <td className="p-2">O(d) — ancestor walk</td>
                <td className="p-2">O(d) — path array</td>
              </tr>
              <tr>
                <td className="p-2">detectCircularRef</td>
                <td className="p-2">O(d) — ancestor walk</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">filterTree (search)</td>
                <td className="p-2">O(n) — scan all nodes</td>
                <td className="p-2">O(n) — visible set</td>
              </tr>
              <tr>
                <td className="p-2">Range select (Shift+Click)</td>
                <td className="p-2">O(v) — v = visible nodes</td>
                <td className="p-2">O(v) — selected set</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is total nodes, <code>d</code> is tree depth, <code>s</code>{" "}
          is subtree size, and <code>v</code> is currently visible nodes. For a tree with
          10,000 nodes (mostly lazy-loaded), only loaded nodes contribute to complexity.
          Typical depth d is 5-15, making cycle detection and path computation sub-millisecond.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Search over large loaded trees:</strong> O(n) scan of all loaded nodes
            on every keystroke (after debounce). For 5,000+ loaded nodes, this can take
            5-10ms. Mitigation: use a trie or fuzzy-search index (e.g., Fuse.js) for
            O(log n) search. For most use cases, the flat scan is fast enough.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Re-render cascades on expand:</strong> Expanding a folder with many
            children causes all TreeNodeList and TreeNode children to mount and render.
            Mitigation: use virtualization (e.g., @tanstack/react-virtual) for the visible
            node list. Only render nodes within the viewport.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Deep copy of large subtrees:</strong> Copying a folder with 500
            descendants requires cloning all nodes and regenerating IDs. O(s) operation
            that blocks the main thread. Mitigation: perform copy in a Web Worker for
            large subtrees, or use structuredClone for off-main-thread cloning.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each TreeNode subscribes to
            its own node by ID via Zustand selector. Expanding one folder does not
            re-render unrelated nodes. This is critical for trees with 1,000+ loaded nodes.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Virtualization:</strong> For flat lists of visible nodes at any depth,
            use windowing to render only visible items. Compute a flat visible node array
            (via BFS from rootIds through expanded nodes) and pass to a virtualizer.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Debounced search:</strong> 300ms debounce prevents search computation
            on every keystroke. Combined with O(n) scan, this keeps search responsive.
          </HighlightBlock>
          <li>
            <strong>Stable node IDs:</strong> Use unique, server-assigned IDs. Avoid
            generating IDs client-side during copy — use <code>crypto.randomUUID()</code>{" "}
            to prevent collisions.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h3>Security Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <HighlightBlock as="p" tier="important">
          Node names may contain user-generated content (e.g., file names from a shared
          drive). When rendering node names, always render as text content (React&apos;s
          default escaping) rather than using <code>dangerouslySetInnerHTML</code>.
          Search highlighting should use text splitting and wrapping, not HTML injection.
          Rename operations should validate against reserved characters (/, \, :, *, ?,
          &quot;, &lt;, &gt;, |) that are invalid in file systems.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Drag-and-Drop Security</h3>
        <p>
          External drag events (files dragged from the OS into the browser) should be
          handled separately from internal tree drag-and-drop. The HTML5 Drag and Drop
          API exposes dragged data, which could contain malicious payloads. Validate the
          <code>dataTransfer</code> type and only accept internal drag events (identified
          by a custom data type like <code>application/x-tree-node-id</code>). Reject
          external drops in the tree component.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              ArrowRight expands a collapsed folder; ArrowLeft collapses an expanded
              folder (or moves focus to parent if already collapsed).
            </HighlightBlock>
            <li>
              Enter selects the focused node. Space toggles the checkbox in multi-select
              mode.
            </li>
            <li>
              ArrowDown/ArrowUp moves focus to the next/previous visible node.
            </li>
            <li>
              Home/End moves focus to the first/last visible node.
            </li>
            <HighlightBlock as="li" tier="important">
              Context menu is triggered via a dedicated button (not just right-click) for
              keyboard users, typically triggered by the Menu key or Shift+F10.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <HighlightBlock as="p" tier="important">
            The tree uses <code>role=&quot;treegrid&quot;</code> for the container (if
            tabular data like size/type is shown) or <code>role=&quot;tree&quot;</code>{" "}
            for a simple hierarchical list. Each node has <code>role=&quot;treeitem&quot;</code>{" "}
            with <code>aria-expanded</code> for folders, <code>aria-selected</code> for
            selection state, and <code>aria-level</code> for nesting depth. Screen
            readers announce &quot;folder, collapsed&quot; or &quot;expanded, 5 items&quot;{" "}
            on expand. Selection changes are announced via <code>aria-live</code> regions.
            See the Example tab for the exact markup.
          </HighlightBlock>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Authorization</h3>
        <HighlightBlock as="p" tier="crucial">
          In a real file system, not all nodes may be accessible to the current user.
          The API that serves lazy-loaded children must enforce access control. The
          client should not display nodes the user doesn&apos;t have permission to see.
          Move/copy operations must also be authorized — the server should reject moves
          to restricted parent folders.
        </HighlightBlock>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h3>Testing Strategy</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Tree utilities:</strong> Test buildTree produces correct nested
            structure from flat list. Test findNode returns correct node. Test getPath
            returns ancestor chain. Test detectCircularRef correctly identifies cycles
            (A is ancestor of B) and non-cycles. Test filterTree returns correct visible
            IDs for various search queries.
          </HighlightBlock>
          <li>
            <strong>Store actions:</strong> Test expandNode triggers lazy load when not
            loaded, marks as expanded when loaded. Test moveNode validates cycle detection
            and reparents correctly. Test copyNode deep clones subtree with new IDs.
            Test deleteNode removes node and all descendants. Test renameNode validates
            uniqueness.
          </li>
          <li>
            <strong>Selection logic:</strong> Test Ctrl+Click toggles individual selection.
            Test Shift+Click selects range between lastSelectedId and current. Test
            selectAll/deselectAll.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Lazy load lifecycle:</strong> Render TreeView, expand a folder, assert
            loading spinner appears, mock API resolves, assert children render. Test
            retry on failure.
          </HighlightBlock>
          <li>
            <strong>Drag and drop:</strong> Render tree with nested folders, drag a node
            onto a valid folder, assert node moves. Drag a folder onto its own descendant,
            assert rejection with error feedback.
          </li>
          <li>
            <strong>Search and filter:</strong> Type a query, assert only matching nodes
            and their ancestors are visible. Assert match text is highlighted. Clear search,
            assert full tree restores.
          </li>
          <li>
            <strong>Context menu:</strong> Right-click a node, assert menu renders with
            correct options. Click &quot;Rename&quot;, assert inline input appears. Submit
            new name, assert store updates.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify TreeView renders without errors during SSR (no DOM access
            in store or hooks).
          </li>
          <li>
            Very deep tree (50+ levels): verify indentation doesn&apos;t cause horizontal
            overflow, breadcrumb handles overflow with truncation.
          </li>
          <HighlightBlock as="li" tier="important">
            Rapid expand/collapse: verify loading state doesn&apos;t flicker, duplicate
            API calls are prevented (idempotent expand).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Bulk delete of 100 selected nodes: verify all descendants are removed, store
            state is consistent, no memory leaks.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            Accessibility: run axe-core automated checks on rendered tree, verify
            treegrid/tree roles, aria-expanded, aria-selected, keyboard navigation, and
            screen reader announcements.
          </HighlightBlock>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h3>Interview-Focused Insights</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using nested object structure instead of flat map:</strong> Candidates
            often model the tree as a recursive object (children as nested arrays). This
            makes move, copy, and find-by-ID operations require full tree traversal (O(n)).
            Interviewers expect a flat map with parent pointers for O(1) lookup and O(d)
            ancestor traversal.
          </li>
          <li>
            <strong>Not handling cycle detection:</strong> When implementing drag-and-drop
            move, candidates forget to check for circular references (moving a folder into
            its own descendant). This creates an infinite loop in tree traversal. The
            correct approach is O(d) ancestor walking.
          </li>
          <li>
            <strong>Mounting all tree nodes in DOM:</strong> For large trees, rendering
            every node as a DOM element causes severe performance issues. Interviewers
            expect candidates to discuss virtualization — flattening the visible tree into
            an array and rendering only items in the viewport.
          </li>
          <li>
            <strong>Ignoring lazy load state management:</strong> Not tracking loading
            state per node leads to duplicate API calls when a user rapidly clicks
            expand/collapse. The store must track loadingIds and prevent duplicate fetches.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Forgetting accessibility:</strong> Tree views have well-defined ARIA
            patterns (tree/treeitem/treegrid). Rendering plain divs without roles,
            aria-expanded, aria-level, and keyboard support is a critical oversight.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Flat Map vs Nested Tree</h4>
          <HighlightBlock as="p" tier="crucial">
            A nested tree structure (children as nested arrays) is intuitive for rendering
            but makes mutations expensive. Moving a node requires finding it in the nested
            structure (O(n)), removing it, and inserting it at the new location. A flat
            Map with parentId references makes every operation O(1) or O(d). The trade-off
            is that rendering requires building the tree structure from the flat map, which
            is a simple O(n) filter operation. For trees under 10,000 nodes, the flat map
            is strictly superior. For rendering optimization, the flat visible array can
            be memoized and passed to a virtualizer.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Recursive Components vs Flat List with Indentation</h4>
          <HighlightBlock as="p" tier="important">
            Recursive TreeNode components (each node renders its children) are simple to
            write but create deep component trees that are harder to virtualize. A flat
            list approach (compute a flat array of visible nodes via BFS, then render with
            indentation based on depth) enables virtualization with libraries like
            @tanstack/react-virtual. The trade-off is that recursive components naturally
            handle expand/collapse through React&apos;s tree reconciliation, while flat
            lists require explicit visibility computation. For production file explorers
            with 1,000+ visible nodes, flat list + virtualization is the right choice.
          </HighlightBlock>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">HTML5 Drag and Drop API vs Pointer Events</h4>
          <p>
            The HTML5 Drag and Drop API provides built-in dragstart, dragover, drop events
            and works with OS-level drag (e.g., dragging files from the desktop). However,
            it has quirks: the drag image is browser-controlled, styling the drag ghost is
            limited, and it doesn&apos;t work on touch devices. Pointer events (pointerdown,
            pointermove, pointerup) give full control over the drag experience, custom
            drag ghosts, and work on touch. The trade-off is implementation complexity.
            For an internal file explorer, HTML5 DnD is sufficient. For a polished
            product with touch support, pointer events are preferred.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a tree with 100,000+ nodes?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualization is essential. Compute a flat array of visible nodes via
              BFS from rootIds through expanded nodes, then pass to @tanstack/react-virtual.
              Only the ~20-50 nodes in the viewport render. The flat Map store handles
              100,000 entries without issue (Maps are optimized in V8). Lazy loading ensures
              most nodes aren&apos;t in memory until expanded. For search, use a server-side
              search API rather than client-side scanning.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement undo/redo for tree operations?
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a command history stack. Each operation (move, copy, delete,
              rename) records a reverse command (e.g., move records the original parentId,
              delete records the entire subtree). Undo pops the last command and executes
              the reverse. Redo re-applies the original command. Limit the stack size
              (e.g., 50 entries) to bound memory. For copy operations, the reverse command
              is a delete of the copied subtree.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you sync the tree with a backend file system in real-time?
            </p>
            <p className="mt-2 text-sm">
              A: Use WebSockets or Server-Sent Events for real-time file system events
              (file created, renamed, moved, deleted). On receiving an event, update the
              flat Map store accordingly. If the affected node isn&apos;t loaded yet, no
              UI update is needed. If it is loaded, apply the change and notify subscribers.
              Handle conflicts with optimistic updates — if the server rejects an operation,
              roll back the local state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement fuzzy search (not just substring match)?
            </p>
            <p className="mt-2 text-sm">
              A: Integrate a fuzzy search library like Fuse.js. Index all loaded node names
              on mount and on node add/delete. On search query, run the fuzzy search against
              the index, get ranked results, and mark the top N IDs as visible. Highlighting
              fuzzy matches requires tracking matched character positions from the search
              result and wrapping them individually. This is more expensive than substring
              match but provides better UX for large trees.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle concurrent edits (two users modifying the same tree)?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Use Operational Transformation (OT) or Conflict-free Replicated Data
              Types (CRDTs) for eventual consistency. Each operation gets a unique
              timestamp and user ID. The server merges operations and broadcasts the
              transformed result to all clients. For a simpler approach, use optimistic
              locking — each node has a version number. Operations include the expected
              version. If the server version differs, reject and re-sync the affected
              subtree. For file explorers, server-authoritative with optimistic client
              updates and conflict resolution on sync is the standard approach.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add file preview when hovering over a file node?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: On mouse enter of a file node, start a debounced (500ms) preview fetch.
              Fetch a lightweight preview (thumbnail for images, first page for PDFs, code
              snippet for source files) and render it in an absolutely positioned tooltip
              near the node. Use a Portal for the tooltip to avoid z-index issues. Cancel
              the fetch on mouse leave. Cache previews in a Map to avoid redundant fetches.
              For large files, the server should generate previews asynchronously and serve
              pre-computed thumbnails.
            </HighlightBlock>
          </div>
        </div>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize input before applying typed transitions. Separate draft, preview, committed state, derived projection, integration effects, and bounded telemetry. Every timer, listener, observer, request, worker, and persisted preference needs an explicit owner and cleanup path.</p><p>Store nodes by stable id and derive a visible flattened preorder list from expanded branches. Paths and labels can change without invalidating identity. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/tree-view-folder-explorer-recovery.svg" alt="Design a Tree View Folder Explorer recovery decisions" caption="Recovery flow: invalidate obsolete work, preserve recoverable state, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Rendering a nested list is enough for small trees; a normalized lazy tree is justified for large hierarchies, mutations, keyboard traversal, and virtualization.</p><p>The server tree is authoritative. Expansion and focus are local projections; node mutations are optimistic only with stable ids, versions, and deterministic rollback. The scale risks are deep trees, huge folders, lazy branches, rapid expansion, recursive move hazards, permission changes, and concurrent rename. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit state unions, versioned persistence, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, retries, restoration, and constrained devices.</p><p>Measure transition latency, blocked actions, stale drops, rollbacks, cache pressure, retry exhaustion, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include mixing draft and commit, trusting arrival order, leaking resources, accepting obsolete async completion, and hiding rollback from the user.</p><p>For this topic, dedupe child loads, cancel collapsed-branch requests, reject recursive moves, preserve focus after refresh, retain tombstones when needed, and reload affected parents on conflict. Validate untrusted input, authorize durable mutations server-side, and bound resource usage.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to repeated workflows where browser, persistence, and policy boundaries can fail independently. Reuse the controller structure while injecting product-specific policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Store nodes by stable id and derive a visible flattened preorder list from expanded branches. Paths and labels can change without invalidating identity.</p><h3>What breaks at scale?</h3><p>deep trees, huge folders, lazy branches, rapid expansion, recursive move hazards, permission changes, and concurrent rename. I would bound expensive work and cancel obsolete effects.</p><h3>What consistency model applies?</h3><p>The server tree is authoritative. Expansion and focus are local projections; node mutations are optimistic only with stable ids, versions, and deterministic rollback.</p><h3>How do you recover?</h3><p>I would dedupe child loads, cancel collapsed-branch requests, reject recursive moves, preserve focus after refresh, retain tombstones when needed, and reload affected parents on conflict.</p><h3>Why this architecture?</h3><p>Rendering a nested list is enough for small trees; a normalized lazy tree is justified for large hierarchies, mutations, keyboard traversal, and virtualization.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li></ul></section>
</ArticleLayout>}
