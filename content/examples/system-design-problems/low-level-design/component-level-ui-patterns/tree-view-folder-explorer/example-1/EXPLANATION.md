# Tree View / Folder Explorer — Implementation Walkthrough

## Overview

This implementation provides a production-grade tree view / folder explorer component with lazy loading, multi-select, drag-and-drop with cycle detection, context menus, search/filter, keyboard navigation, and breadcrumb display.

## Architecture

The system follows a **flat map + Zustand store** architecture:

- **Nodes are stored in a flat `Map<string, TreeNode>`** rather than a nested tree structure. This enables O(1) node lookup, O(d) ancestor traversal for cycle detection, and simple immutable updates.
- **Tree hierarchy is implicit** via `parentId` references. The visual tree is derived at render time by filtering nodes with a given `parentId`.
- **Zustand provides selector-based subscriptions** so only affected TreeNode components re-render on state changes.

## File Structure

```
example-1/
├── lib/
│   ├── tree-types.ts      — Type definitions (TreeNode, SelectionState, ContextMenuAction)
│   ├── tree-store.ts      — Zustand store with all tree operations
│   └── tree-utils.ts      — Pure utility functions (buildTree, getPath, detectCircularRef, filterTree)
├── hooks/
│   ├── use-tree-node.ts   — Per-node hook: expand/collapse, selection, context menu
│   ├── use-tree-selection.ts — Multi-select with Ctrl/Shift, range selection
│   ├── use-tree-drag.ts   — Drag-to-move with cycle detection
│   └── use-tree-search.ts — Debounced search with highlight extraction
└── components/
    ├── tree-view.tsx      — Root container with keyboard navigation
    ├── tree-node.tsx      — Individual node with icon, label, checkbox, drag
    ├── tree-node-list.tsx — List of nodes at a given depth
    ├── tree-context-menu.tsx — Right-click menu
    ├── tree-breadcrumb.tsx — Path breadcrumb for selected node
    └── tree-search-bar.tsx — Search input with real-time filtering
```

## Key Design Decisions

### Flat Map vs Nested Tree

A nested tree (children as nested arrays) makes move, copy, and find-by-ID operations require full tree traversal (O(n)). The flat Map approach:

- **O(1) lookup** via `Map.get(id)`
- **O(d) cycle detection** by walking `parentId` pointers upward
- **Simple immutable updates** — modify only affected entries in the Map
- **Easy deletion** — delete entries by ID from the Map

The trade-off is that rendering requires computing the visible tree via BFS from root IDs through expanded nodes. This is O(v) where v is visible nodes, which is small compared to total nodes in a lazy-loaded tree.

### Cycle Detection

When moving folder A into folder B, we must ensure A is not an ancestor of B. The algorithm:

1. Start at B and follow `parentId` upward.
2. At each step, check if the current node ID equals A's ID.
3. If match found → cycle detected, reject the move.
4. If root reached (parentId is null) → no cycle, allow the move.

This is O(d) where d is the depth of B. For a tree with depth 10, this is 10 comparisons — far more efficient than O(n) full-tree traversal.

### Lazy Loading

When a folder is expanded for the first time:

1. Store checks `isLoaded` flag. If false, sets `loading` flag.
2. Calls the provided `fetchChildren` function (an API call in production).
3. On success, children are inserted into the node Map, parent's `children` array is updated, `isLoaded` is set to true, `loading` is cleared.
4. On failure, `loading` is cleared but `isLoaded` remains false, allowing retry UI to render.

Duplicate fetches are prevented by checking the `loadingIds` set before starting a new fetch.

### Multi-Select

Three selection modes:

- **Single select**: Click clears previous selection, selects current node.
- **Ctrl+Click**: Toggles the clicked node without affecting others.
- **Shift+Click**: Selects all visible nodes between `lastSelectedId` and the current node.

The range computation finds the indices of both nodes in the visible node array and selects everything between them.

### Search/Filter

Search works in two passes:

1. **First pass**: Scan all loaded nodes, find those whose name contains the query (case-insensitive).
2. **Second pass**: For each match, walk up the ancestor chain (via `parentId`) and mark all ancestors as visible.

The TreeView then only renders nodes in the visible set. Matching text within node names is highlighted by splitting the name at match positions and wrapping matching segments in a `<mark>` element.

### Keyboard Navigation

The TreeView container handles global keyboard events:

| Key | Action |
|-----|--------|
| ArrowDown | Focus next visible node |
| ArrowUp | Focus previous visible node |
| ArrowRight | Expand collapsed folder |
| ArrowLeft | Collapse expanded folder (or focus parent) |
| Enter | Select focused node |
| Space | Toggle checkbox (multi-select mode) |
| Ctrl+A | Select all visible nodes |

ARIA roles (`role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-selected`, `aria-level`) ensure screen readers announce the tree structure correctly.

## Performance Considerations

- **Selector-based subscriptions**: Each TreeNode subscribes to its own node by ID. Expanding one folder does not re-render unrelated nodes.
- **Virtualization-ready**: The visible node array (computed via BFS) can be passed to `@tanstack/react-virtual` for windowed rendering. Only ~20-50 nodes in the viewport render at a time.
- **Debounced search**: 300ms debounce prevents O(n) scan on every keystroke.
- **Stable IDs**: Using `crypto.randomUUID()` for copy operations prevents ID collisions.

## Extension Points

- **Undo/Redo**: Add a command history stack. Each operation records a reverse command.
- **Real-time sync**: Use WebSockets for file system events, update the Map store accordingly.
- **Fuzzy search**: Replace substring matching with Fuse.js for ranked, fuzzy results.
- **File preview**: On hover, fetch and render a thumbnail in a portal-rendered tooltip.
