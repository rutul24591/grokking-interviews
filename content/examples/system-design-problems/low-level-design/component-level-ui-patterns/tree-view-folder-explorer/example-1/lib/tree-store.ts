import { create } from 'zustand';
import type { TreeNode, ContextMenuState } from './tree-types';
import { detectCircularRef } from './tree-utils';

interface TreeState {
  nodes: Map<string, TreeNode>;
  rootIds: string[];
  selectedIds: Set<string>;
  lastSelectedId: string | null;
  expandedIds: Set<string>;
  loadingIds: Set<string>;
  searchQuery: string;
  searchResults: Set<string>;
  clipboard: { nodeIds: string[]; action: 'copy' | 'cut' } | null;
  contextMenu: ContextMenuState;

  // Actions
  expandNode: (id: string, fetchChildren: (id: string) => Promise<TreeNode[]>) => void;
  collapseNode: (id: string) => void;
  selectNode: (id: string, multi: boolean, range: boolean, visibleIds: string[]) => void;
  deselectNode: (id: string) => void;
  selectAll: (visibleIds: string[]) => void;
  deselectAll: () => void;
  moveNode: (sourceId: string, targetParentId: string) => boolean;
  copyNode: (sourceId: string, targetParentId: string) => void;
  deleteNode: (id: string) => void;
  renameNode: (id: string, newName: string) => boolean;
  loadChildren: (parentId: string, children: TreeNode[]) => void;
  setLoading: (id: string, loading: boolean) => void;
  setSearch: (query: string) => void;
  setContextMenu: (state: Partial<ContextMenuState>) => void;
  setClipboard: (nodeIds: string[], action: 'copy' | 'cut') => void;
  clearClipboard: () => void;
  pasteClipboard: (targetParentId: string) => void;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  nodes: new Map(),
  rootIds: [],
  selectedIds: new Set(),
  lastSelectedId: null,
  expandedIds: new Set(),
  loadingIds: new Set(),
  searchQuery: '',
  searchResults: new Set(),
  clipboard: null,
  contextMenu: { visible: false, x: 0, y: 0, nodeId: null },

  expandNode: (id, fetchChildren) => {
    const { nodes, expandedIds, loadingIds } = get();
    const node = nodes.get(id);
    if (!node || node.type !== 'folder') return;
    if (expandedIds.has(id)) return; // already expanded

    if (node.isLoaded) {
      // Just mark as expanded
      set((state) => ({
        expandedIds: new Set(state.expandedIds).add(id),
      }));
      return;
    }

    if (loadingIds.has(id)) return; // already loading

    // Start loading
    set((state) => ({
      loadingIds: new Set(state.loadingIds).add(id),
      expandedIds: new Set(state.expandedIds).add(id),
    }));

    fetchChildren(id).then(
      (children) => {
        get().loadChildren(id, children);
      },
      () => {
        // On error, clear loading but keep expanded so error UI shows
        set((state) => ({
          loadingIds: new Set(state.loadingIds),
        }));
        get().setLoading(id, false);
      }
    );
  },

  collapseNode: (id) => {
    set((state) => {
      const expanded = new Set(state.expandedIds);
      expanded.delete(id);
      return { expandedIds: expanded };
    });
  },

  selectNode: (id, multi, range, visibleIds) => {
    set((state) => {
      const selectedIds = new Set(state.selectedIds);

      if (range && state.lastSelectedId) {
        // Range selection: select all visible nodes between lastSelected and current
        const lastIdx = visibleIds.indexOf(state.lastSelectedId);
        const currentIdx = visibleIds.indexOf(id);
        if (lastIdx !== -1 && currentIdx !== -1) {
          const start = Math.min(lastIdx, currentIdx);
          const end = Math.max(lastIdx, currentIdx);
          for (let i = start; i <= end; i++) {
            selectedIds.add(visibleIds[i]);
          }
        }
      } else if (multi) {
        // Ctrl+Click: toggle
        if (selectedIds.has(id)) {
          selectedIds.delete(id);
        } else {
          selectedIds.add(id);
        }
      } else {
        // Single select
        selectedIds.clear();
        selectedIds.add(id);
      }

      return {
        selectedIds,
        lastSelectedId: id,
      };
    });
  },

  deselectNode: (id) => {
    set((state) => {
      const selectedIds = new Set(state.selectedIds);
      selectedIds.delete(id);
      return { selectedIds };
    });
  },

  selectAll: (visibleIds) => {
    set(() => ({
      selectedIds: new Set(visibleIds),
      lastSelectedId: visibleIds[visibleIds.length - 1] || null,
    }));
  },

  deselectAll: () => {
    set(() => ({ selectedIds: new Set(), lastSelectedId: null }));
  },

  moveNode: (sourceId, targetParentId) => {
    const { nodes } = get();
    const sourceNode = nodes.get(sourceId);
    const targetNode = nodes.get(targetParentId);

    if (!sourceNode || !targetNode) return false;
    if (targetNode.type !== 'folder') return false;
    if (sourceNode.parentId === targetParentId) return false; // same parent

    // Cycle detection: cannot move a folder into its own descendant
    if (sourceNode.type === 'folder' && detectCircularRef(sourceId, targetParentId, nodes)) {
      return false;
    }

    // Perform the move
    set((state) => {
      const newNodes = new Map(state.nodes);

      // Remove from old parent
      const oldParent = sourceNode.parentId
        ? newNodes.get(sourceNode.parentId)
        : null;
      if (oldParent) {
        newNodes.set(oldParent.id, {
          ...oldParent,
          children: oldParent.children.filter((c) => c !== sourceId),
        });
      }

      // Add to new parent
      const newParent = newNodes.get(targetParentId)!;
      newNodes.set(targetParentId, {
        ...newParent,
        children: [...newParent.children, sourceId],
      });

      // Update source node
      newNodes.set(sourceId, {
        ...sourceNode,
        parentId: targetParentId,
      });

      return { nodes: newNodes };
    });

    return true;
  },

  copyNode: (sourceId, targetParentId) => {
    const { nodes } = get();
    const sourceNode = nodes.get(sourceId);
    if (!sourceNode) return;

    // Deep clone the subtree
    const idMap = new Map<string, string>();
    const clonedNodes: TreeNode[] = [];

    const cloneSubtree = (nodeId: string, newParentId: string | null) => {
      const original = nodes.get(nodeId);
      if (!original) return;

      const newId = crypto.randomUUID();
      idMap.set(nodeId, newId);

      const cloned: TreeNode = {
        ...original,
        id: newId,
        parentId: newParentId,
        children: [],
        isExpanded: false,
        isLoading: false,
        isSelected: false,
        isLoaded: true, // cloned children are immediately available
      };
      clonedNodes.push(cloned);

      // Clone children recursively
      for (const childId of original.children) {
        cloneSubtree(childId, newId);
      }

      // Update children array with new IDs
      cloned.children = original.children.map((c) => idMap.get(c)!);
    };

    cloneSubtree(sourceId, targetParentId);

    set((state) => {
      const newNodes = new Map(state.nodes);
      for (const node of clonedNodes) {
        newNodes.set(node.id, node);
      }

      // Add root of cloned subtree to target parent
      const targetNode = newNodes.get(targetParentId);
      if (targetNode) {
        const clonedRootId = idMap.get(sourceId)!;
        newNodes.set(targetParentId, {
          ...targetNode,
          children: [...targetNode.children, clonedRootId],
        });
      }

      return { nodes: newNodes };
    });
  },

  deleteNode: (id) => {
    const { nodes } = get();
    const node = nodes.get(id);
    if (!node) return;

    // Collect all descendants
    const toDelete = new Set<string>();
    const collectDescendants = (nodeId: string) => {
      toDelete.add(nodeId);
      const n = nodes.get(nodeId);
      if (n && n.type === 'folder') {
        for (const childId of n.children) {
          collectDescendants(childId);
        }
      }
    };
    collectDescendants(id);

    set((state) => {
      const newNodes = new Map(state.nodes);

      // Remove from parent
      const parent = node.parentId ? newNodes.get(node.parentId) : null;
      if (parent) {
        newNodes.set(parent.id, {
          ...parent,
          children: parent.children.filter((c) => !toDelete.has(c)),
        });
      }

      // Delete all nodes
      for (const delId of toDelete) {
        newNodes.delete(delId);
      }

      // Clear selection for deleted nodes
      const selectedIds = new Set(state.selectedIds);
      for (const delId of toDelete) {
        selectedIds.delete(delId);
      }

      return { nodes: newNodes, selectedIds };
    });
  },

  renameNode: (id, newName) => {
    const { nodes } = get();
    const node = nodes.get(id);
    if (!node) return false;

    // Validate: no duplicates in same parent
    const parent = node.parentId ? nodes.get(node.parentId) : null;
    if (parent) {
      const siblingExists = parent.children.some((childId) => {
        const sibling = nodes.get(childId);
        return sibling && sibling.id !== id && sibling.name === newName;
      });
      if (siblingExists) return false;
    }

    set((state) => {
      const newNodes = new Map(state.nodes);
      newNodes.set(id, { ...node, name: newName });
      return { nodes: newNodes };
    });

    return true;
  },

  loadChildren: (parentId, children) => {
    set((state) => {
      const newNodes = new Map(state.nodes);
      const parent = newNodes.get(parentId);
      if (!parent) return state;

      const childIds: string[] = [];
      for (const child of children) {
        newNodes.set(child.id, child);
        childIds.push(child.id);
      }

      // Update parent
      newNodes.set(parentId, {
        ...parent,
        children: childIds,
        isLoaded: true,
        isLoading: false,
      });

      const loadingIds = new Set(state.loadingIds);
      loadingIds.delete(parentId);

      return { nodes: newNodes, loadingIds };
    });
  },

  setLoading: (id, loading) => {
    set((state) => {
      const loadingIds = new Set(state.loadingIds);
      if (loading) {
        loadingIds.add(id);
      } else {
        loadingIds.delete(id);
      }
      return { loadingIds };
    });
  },

  setSearch: (query) => {
    set(() => ({ searchQuery: query }));
  },

  setContextMenu: (partial) => {
    set((state) => ({
      contextMenu: { ...state.contextMenu, ...partial },
    }));
  },

  setClipboard: (nodeIds, action) => {
    set(() => ({ clipboard: { nodeIds, action } }));
  },

  clearClipboard: () => {
    set(() => ({ clipboard: null }));
  },

  pasteClipboard: (targetParentId) => {
    const { clipboard } = get();
    if (!clipboard) return;

    if (clipboard.action === 'copy') {
      for (const nodeId of clipboard.nodeIds) {
        get().copyNode(nodeId, targetParentId);
      }
    } else if (clipboard.action === 'cut') {
      for (const nodeId of clipboard.nodeIds) {
        get().moveNode(nodeId, targetParentId);
      }
    }

    get().clearClipboard();
  },
}));
