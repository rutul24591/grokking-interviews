"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-tree-view-folder-explorer",
  title: "Design a Tree View / Folder Explorer",
  description:
    "LLD for a hierarchical Tree View: lazy node loading, expand/collapse, virtualization of flattened children, drag-and-drop move/copy, multi-select, and accessibility.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "tree-view-folder-explorer",
  wordCount: 6900,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "tree-view",
    "folder-explorer",
    "lazy-loading",
    "virtualization",
    "drag-and-drop",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "infinite-scroll-virtualized-list",
    "drag-drop-list",
  ],
};

export default function TreeViewFolderExplorerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a Tree View — the hierarchical
          navigator that powers folder explorers, file
          managers, organizational charts, taxonomies,
          configuration browsers, and any UI where data has
          a parent-child structure. Nodes expand to reveal
          children; users navigate, select, drag-and-drop to
          reorganize, and rename. The tree is the primary
          navigation surface in many products, so it must be
          fast (virtualized over the flattened visible
          tree), accessible (full keyboard navigation per
          ARIA tree pattern), and resilient (lazy-load
          children, handle deep trees, recover from network
          errors). Done well, the tree feels native to the
          OS (Finder, File Explorer); done poorly, it
          becomes a usability bottleneck.
        </p>
        <p>
          The hard problems are: virtualizing a flattened
          tree where nodes can expand and collapse
          dynamically; lazy-loading children on expand
          without losing scroll context; drag-and-drop
          across the tree with valid-target detection;
          multi-selection that respects hierarchy
          (selecting a parent shouldn&rsquo;t silently
          select all descendants without warning); search
          and reveal (jump to a node deep in the tree,
          expanding ancestors on the way); and keyboard
          navigation through the ARIA tree pattern with
          arrow keys, expand/collapse, and type-to-search.
        </p>

        <h3>User Context</h3>
        <p>
          End users navigate folders, select files, drag to
          move or copy, rename, delete. Internal users browse
          configuration trees, organizational hierarchies, or
          taxonomies. Engineering teams consume the tree via
          a hook-based API: declare a data source (or pass a
          tree directly), provide a node renderer, and let
          the tree handle expand/collapse, virtualization,
          and accessibility.
        </p>

        <h3>Assumptions</h3>
        <p>
          Trees can be deep (10+ levels) and wide (thousands
          of children per node). Children of a node may be
          unknown until the node expands (lazy-loading from
          a server). Drag-and-drop is opt-in per consumer.
          Multi-selection is opt-in. Modern browsers; we use
          IntersectionObserver for visibility, ResizeObserver
          for measured node heights, and the HTML5 drag-and-
          drop API for cross-component drag (with custom
          handling for accessibility).
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement file content viewing — that&rsquo;s
          the consumer&rsquo;s responsibility on row click.
          We do not implement server-side bulk operations
          beyond the move/copy action. Real-time
          collaborative tree editing (two users dragging at
          once) is out of scope; we support optimistic
          single-user edits with eventual sync.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Render a tree from a hierarchical data source,
          showing only expanded nodes&rsquo; children. Expand
          and collapse via click on a chevron or
          double-click on a node. Lazy-load children on
          expand if not yet loaded. Virtualize the flattened
          visible tree (only mounted nodes are visible
          ones plus overscan). Single-select via click;
          multi-select via Cmd-click and Shift-click. Drag-
          and-drop with valid-target indicators (can&rsquo;t
          drop into a descendant). Rename in-place with
          double-click. Delete via Delete key with
          confirmation. Search and reveal: search by name,
          jump to the matching node, expanding ancestors.
          Keyboard navigation via ARIA tree pattern: arrow
          keys (up/down move; right expands or moves into;
          left collapses or moves out), Home/End,
          type-to-search, Space/Enter for select.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Tri-state checkboxes for hierarchical multi-select
          (parent state derived from children).
          Expand-all / Collapse-all actions. Filter the tree
          by predicate, hiding non-matching nodes (with
          ancestors preserved for context). Pinned favorites
          at the top. Custom icons per node type. Inline
          actions on hover (rename, delete buttons).
          Undo/redo for tree edits.
        </p>

        <h3>Out of Scope</h3>
        <p>
          File content rendering, image previews, rich
          context menus beyond a small action set, real-time
          collaborative edits.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Smooth scroll at 60 fps even when 100k nodes are
          loaded across the tree. Expand action under 100 ms
          (excluding network for lazy-load).
          Type-to-search response under 50 ms.
          Drag-and-drop drag-over feedback under 16 ms per
          frame.
        </p>

        <h3>Reliability</h3>
        <p>
          Lazy-load failures don&rsquo;t corrupt the tree
          state — failed nodes show an error and a retry.
          Drag-and-drop is transactional: optimistic UI
          shows the new position, server confirms or
          reverts. Concurrent edits across tabs converge
          via broadcast.
        </p>

        <h3>Security</h3>
        <p>
          Node names render as text; HTML opt-in per node
          type with sanitizer. Drag-and-drop respects
          server-side authorization: the server rejects
          moves the user can&rsquo;t make, and the UI
          reverts.
        </p>

        <h3>Accessibility</h3>
        <p>
          ARIA tree pattern: <code>role=&quot;tree&quot;</code>,{" "}
          <code>role=&quot;treeitem&quot;</code>,
          <code> aria-expanded</code>,
          <code> aria-level</code>,
          <code> aria-selected</code>. Single tabstop with
          arrow-key navigation; Home/End; type-to-search.
          Loading states and error states announce via live
          region.
        </p>

        <h3>Maintainability</h3>
        <p>
          Node renderer is consumer-supplied. Data source is
          adapter-based (in-memory tree, lazy server
          source, hybrid). Drag-and-drop and multi-select
          are plugins.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/tree-view-folder-explorer-architecture.svg"
        alt="Tree View / Folder Explorer Architecture"
        caption="Tree Source (lazy or eager) → Tree Engine (flatten visible nodes, expand state, selection, drag state) → Virtualizer over flattened list → Node Renderer with chevron, indent, label, hover actions. ARIA tree pattern with single tabstop and arrow-key navigation."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The tree is structured around a <strong>tree
          source adapter</strong> (uniform interface over
          eager and lazy tree data), a <strong>tree engine</strong>{" "}
          that flattens the visible tree based on expand
          state, a <strong>virtualizer</strong> over the
          flattened list, and <strong>plugin systems</strong>{" "}
          for selection, drag-and-drop, and search.
        </p>
        <p>
          The <strong>tree engine</strong> maintains the
          expand state per node (a Set of expanded node
          ids) and computes the flattened visible list on
          demand. Flattening walks the tree depth-first,
          including each expanded node&rsquo;s children;
          collapsed nodes contribute themselves but skip
          their subtrees. The flattened list is what the
          virtualizer renders. When a node expands or
          collapses, the engine recomputes the affected
          slice of the flattened list incrementally — only
          the descendants of the changed node need to be
          inserted or removed.
        </p>
        <p>
          <strong>Lazy loading</strong>: when a user expands
          a node whose children aren&rsquo;t loaded, the
          engine asks the source for them. While loading,
          the engine inserts a loading-placeholder row at
          the appropriate position so the user sees
          progress. On response, the placeholder is
          replaced with real children. On error, the
          placeholder shows an error message with a Retry
          action; the parent stays expanded so the user can
          retry without re-expanding.
        </p>
        <p>
          <strong>Virtualization</strong> works on the
          flattened list as a 1D virtualizer: visible
          window plus overscan, mounted nodes only. Node
          heights are typically uniform but can be
          variable; if variable, we use the same
          measured-height pattern as the Infinite Scroll
          Virtualized List. Expanding a node mid-tree
          inserts new entries into the flattened list, but
          since virtualization windowing is by index, the
          insertion is just a list update; the virtualizer
          recomputes the visible window naturally.
        </p>
        <p>
          <strong>Indentation</strong> is rendered via CSS
          padding-left proportional to node depth. The
          engine tracks each node&rsquo;s depth so renderers
          can apply the right indent. Visual guides (the
          vertical lines connecting parents to children in
          some tree styles) are pseudo-elements positioned
          based on depth.
        </p>
        <p>
          <strong>Selection</strong>: single-select replaces;
          Cmd-click toggles a node; Shift-click selects a
          range from the last anchor through the current
          node, walking the flattened list (so the range
          is intuitive for users — it follows visible
          order, not tree structure). For tri-state
          checkboxes, the parent&rsquo;s state is derived
          from children: all-children-selected → parent
          checked; some-selected → indeterminate; none → unchecked. Selecting a parent prompts &ldquo;Select
          all 23 descendants?&rdquo; rather than silently
          selecting them, because users often misclick
          parents thinking they&rsquo;re selecting just the
          parent.
        </p>
        <p>
          <strong>Drag-and-drop</strong>: when the user
          starts dragging a node (or a multi-selection),
          the engine enters drag mode. As the user drags
          over potential drop targets, the engine
          highlights valid targets and rejects invalid
          ones (a node can&rsquo;t drop into itself or its
          descendants). Drop completes optimistically: the
          UI shows the new position immediately, the
          server is asked to confirm. On confirm, nothing
          visible happens (the optimistic change stands).
          On reject (e.g. permission denied), the UI
          reverts with an error message. Keyboard
          alternative: Cut (Ctrl-X), navigate to target,
          Paste (Ctrl-V) — this gives keyboard users
          parity with mouse drag.
        </p>
        <p>
          <strong>Search and reveal</strong>: a search input
          filters nodes by name. As the user types, the
          tree finds the first match, expands its
          ancestors, scrolls to it, and highlights. Arrow
          keys cycle through subsequent matches; Escape
          clears search. For very large trees, search runs
          via the source (server-side) when the local
          flattened list is incomplete; results return as
          a list of paths that the engine traverses to
          expand.
        </p>
        <p>
          On <strong>keyboard navigation</strong>: the focused
          node is the single tabstop. Up/Down move through
          the flattened visible list. Right expands a
          collapsed node, or moves to its first child if
          already expanded. Left collapses an expanded
          node, or moves to the parent if already
          collapsed. Home/End move to first/last visible
          node. Type-to-search jumps to the next node
          whose name matches the typed prefix.
          Space/Enter activate (select or open).
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>TreeProvider</strong> instantiates the
          engine, source adapter, virtualizer, and plugins.
          <strong> TreeEngine</strong> manages expand state
          and flattened-list computation.
          <strong> TreeSource</strong> is the adapter;
          built-ins include
          <code> EagerTreeSource</code> (full tree in
          memory) and <code>LazyServerSource</code>
          (children fetched on demand).
          <strong> TreeVirtualizer</strong> handles 1D
          virtualization over the flattened list.
          <strong> TreeNode</strong> renders one node with
          chevron, indent, label, hover actions.
          <strong> SelectionPlugin</strong> tracks selected
          ids. <strong>DragDropPlugin</strong> handles
          drag-and-drop with valid-target detection.
          <strong> SearchPlugin</strong> handles search and
          reveal.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The engine&rsquo;s state — expand set, flattened
          list, focused node id — lives in an external
          store. Per-node data lives in a node cache keyed
          by id. Selection, drag, and search state are
          plugin-owned slices. Lazy-load status per node
          (loading, loaded, error) lives alongside the
          node cache so renderers can show the right state.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>source</code> (adapter),
          <code> renderNode(node, props)</code>,
          <code> defaultExpanded</code>,
          <code> onSelect</code>,
          <code> onMove(source, target)</code>,
          <code> onRename(node, newName)</code>. Node
          shape:{" "}
          <code>{` { id, name, parentId?, hasChildren?, ...customFields } `}</code>.
          Stable ids are required; without them,
          virtualization and reconciliation break.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          Virtualization scopes mounted DOM to ~30 nodes.
          Node components memoize by (node id, expand
          state, selection state). The flattened list is
          recomputed incrementally on expand/collapse:
          only the affected subtree is re-flattened, not
          the whole tree. Indentation is CSS-only, no JS
          per render. Drag-over highlights use a single
          CSS overlay on the target node, not per-node
          state, to avoid re-renders during drag.
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX</h2>
        <p>
          Chevron rotates on expand/collapse with a short
          animation. Loading state shows a small spinner
          inside the parent node where children would
          appear. Error state shows an inline message with
          Retry. Drag-over indicators are clear (a
          highlight on the drop target plus an indicator
          line for &ldquo;before&rdquo; or &ldquo;inside&rdquo;
          drops). Multi-select with parent confirmation
          prevents accidental bulk selection. Inline
          rename: double-click the name, edit in place,
          Enter commits, Escape cancels.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          ARIA tree pattern: tree role, treeitem role,
          <code> aria-expanded</code> on parent nodes,
          <code> aria-level</code> indicating depth,
          <code> aria-selected</code> on selected nodes,
          <code> aria-setsize</code> and
          <code> aria-posinset</code> for context. Single
          tabstop on the focused node; others
          <code> tabIndex=-1</code>. Arrow-key navigation
          per pattern. Drag-and-drop is keyboard-accessible
          via Cut/Paste shortcuts. Selection and expand
          state announce via live region. Loading and
          error states announce.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Node names render as text; HTML opt-in per node
          type with sanitizer. Server-side authorization is
          authoritative — the client&rsquo;s drag-and-drop
          might appear to succeed but the server rejects
          and the UI reverts. CSRF tokens on every move
          request.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the engine: flatten correctness,
          incremental flatten on expand/collapse, lazy-
          load state machine. Integration tests: expand
          and verify children appear, drag-and-drop with
          mock server, search-and-reveal, multi-select
          with parent confirmation. Accessibility tests
          for ARIA attributes and keyboard navigation
          parity. Performance tests on 100k-node trees.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User expands a node, navigates away before the
          children load, comes back: the load completes
          and the children appear, with the user&rsquo;s
          intent preserved. User collapses a node mid-
          load: the load completes silently into the
          cache; on next expand, children render
          immediately. Drag a node into one of its
          descendants: rejected by valid-target detection.
          Drag a multi-selection containing a parent and
          one of its descendants: the descendant is
          implicitly part of the parent move; we drop
          only the parent and let the descendants follow.
          Network failure on lazy-load: error state with
          Retry; tree state otherwise intact. Very deep
          tree (10+ levels): indentation works as long
          as we cap depth indication; beyond a threshold,
          we switch to a path-breadcrumb display to keep
          the visual structure usable.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The tree engine is generic over node type. The
          source adapter pattern lets consumers wire any
          backend. Node renderer is consumer-supplied, so
          the same engine powers folder explorers,
          taxonomy editors, organizational charts, and
          configuration browsers without modification.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Node labels and action strings via i18n. RTL
          flips indentation direction (padding-inline-start
          via CSS logical properties). Type-to-search uses
          locale-aware string matching via
          <code> Intl.Collator</code> for consistent
          comparison.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Eager vs lazy data source</h3>
        <p>
          Eager (full tree in memory) is simple and
          handles search-and-filter well; lazy is
          essential for trees larger than client memory.
          The adapter pattern lets consumers choose; for
          medium trees, hybrid (a top-level eager fetch
          plus lazy children at deep levels) is often
          right.
        </p>

        <h3>Tri-state vs single checkboxes</h3>
        <p>
          Tri-state respects hierarchy intuitively but
          adds complexity. We default to single checkboxes
          with an explicit &ldquo;Select all
          descendants&rdquo; affordance; tri-state is
          opt-in for products where hierarchical selection
          is core.
        </p>

        <h3>Drag-and-drop optimistic vs confirmed-first</h3>
        <p>
          Optimistic feels fast but requires revert on
          failure. Confirmed-first feels slow but never
          shows a wrong state. Optimistic is the right
          default with prompt revert; confirmed-first is
          for high-stakes operations.
        </p>

        <h3>Virtualize the flattened list, not the tree</h3>
        <p>
          The tree is hierarchical; the visible content is
          a flat list of expanded nodes. Virtualizing the
          flattened list is straightforward 1D
          virtualization; trying to virtualize the
          hierarchy directly would be more complex without
          benefit.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Server-side search with full-text indexing.
          Filter that hides non-matching nodes while
          preserving ancestor context. Bulk operations
          (move many nodes at once). Real-time
          collaborative tree editing via CRDTs. Offline
          mode with sync on reconnect. Custom node groups
          and pinned favorites.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How is the tree virtualized?</strong> By
          flattening the visible (expanded) tree to a 1D
          list, then applying standard 1D virtualization.
          Expand and collapse update the flattened list
          incrementally.
        </p>

        <p>
          <strong>2. How do you handle lazy loading?</strong>{" "}
          On expand, if children aren&rsquo;t loaded, ask
          the source. Show a placeholder while loading.
          Replace with real children on response; show
          error with retry on failure. Parent stays
          expanded throughout.
        </p>

        <p>
          <strong>3. How is drag-and-drop made
          accessible?</strong> Keyboard-accessible via
          Cut/Paste shortcuts. The drag flow is mirrored:
          select the source, navigate to target, paste.
          ARIA announcements update the user on progress.
        </p>

        <p>
          <strong>4. How do you prevent dropping a node into
          its descendant?</strong> Valid-target detection at
          drag-over time: walk up from the candidate target
          to the root; if the dragged node is encountered,
          reject. The visual indicator reflects the
          decision in real time.
        </p>

        <p>
          <strong>5. How does search and reveal work?</strong>{" "}
          Search returns a list of matching node ids
          (locally for in-memory trees, server-side for
          lazy trees). For each match, the engine expands
          ancestors, scrolls to the node, and highlights
          it. Arrow keys cycle through subsequent matches.
        </p>

        <p>
          <strong>6. What happens to selection on
          collapse?</strong> Selected descendants remain
          selected but become invisible; they re-appear
          when the parent re-expands. The selection set
          is by id, so structural changes don&rsquo;t lose
          selection.
        </p>

        <p>
          <strong>7. How is keyboard navigation handled?</strong>{" "}
          ARIA tree pattern: arrow keys move through the
          visible flattened list (Up/Down), expand/collapse
          (Right/Left), and Home/End. Type-to-search jumps
          to matching nodes. Single tabstop on the focused
          node.
        </p>

        <p>
          <strong>8. How does this scale to a million
          nodes?</strong> Lazy loading: never fetch all
          million; fetch children on demand.
          Virtualization on the flattened visible list
          keeps DOM bounded. Server-side search handles
          finds across the full tree without local
          materialization.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A Tree View is a{" "}
          <strong>flattened-list virtualization</strong>{" "}
          over a hierarchy, with lazy loading on expand,
          drag-and-drop with valid-target detection,
          multi-select with parent-confirmation semantics,
          and full ARIA tree pattern keyboard support. The
          adapter pattern handles eager and lazy data
          sources interchangeably. Virtualizing the
          flattened list (not the hierarchy) is the
          architectural insight that makes everything
          tractable. Done well, the tree feels like the
          OS file explorer — instant, predictable,
          accessible.
        </p>
      </section>
    </ArticleLayout>
  );
}
