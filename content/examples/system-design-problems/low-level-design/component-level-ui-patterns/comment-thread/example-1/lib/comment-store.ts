import { create } from 'zustand';
import type {
  CommentNode,
  ThreadState,
  WebSocketMessage,
} from './comment-types';
import { MAX_DEPTH } from './comment-types';

interface CommentStoreState extends Omit<ThreadState, 'pendingRequests'> {
  pendingRequests: Map<string, Promise<unknown>>;
  // Actions
  setComments: (comments: CommentNode[], cursor: string | null, hasMore: boolean) => void;
  appendComments: (comments: CommentNode[], cursor: string | null, hasMore: boolean) => void;
  addChildComments: (parentId: string, children: CommentNode[]) => void;
  applyOptimisticInsert: (
    optimisticId: string,
    parentId: string | null,
    content: string,
    author: CommentNode['author']
  ) => void;
  confirmOptimisticInsert: (optimisticId: string, serverComment: CommentNode) => void;
  rollbackMutation: (commentId: string) => void;
  snapshotComment: (commentId: string, comment: CommentNode) => void;
  updateComment: (commentId: string, updates: Partial<CommentNode>) => void;
  toggleCollapse: (commentId: string) => void;
  mergeWebSocketUpdate: (message: WebSocketMessage) => void;
  registerPendingRequest: (key: string, promise: Promise<unknown>) => void;
  clearPendingRequest: (key: string) => void;
  clearStore: () => void;
}

export const useCommentStore = create<CommentStoreState>((set, get) => ({
  comments: {},
  rootIds: [],
  collapsedThreads: new Set<string>(),
  paginationCursor: null,
  hasMore: false,
  isLoading: false,
  rollbackSnapshots: {},
  pendingRequests: new Map<string, Promise<unknown>>(),
  bufferedComments: {},

  setComments: (comments, cursor, hasMore) => {
    const commentMap: Record<string, CommentNode> = {};
    const rootIds: string[] = [];

    for (const c of comments) {
      commentMap[c.id] = c;
      if (c.parentId === null) {
        rootIds.push(c.id);
      }
    }

    set({
      comments: commentMap,
      rootIds,
      paginationCursor: cursor,
      hasMore,
    });
  },

  appendComments: (comments, cursor, hasMore) => {
    set((state) => {
      const newComments = { ...state.comments };
      const newRootIds = [...state.rootIds];

      for (const c of comments) {
        newComments[c.id] = c;
        if (c.parentId === null) {
          newRootIds.push(c.id);
        }
      }

      return {
        comments: newComments,
        rootIds: newRootIds,
        paginationCursor: cursor,
        hasMore,
      };
    });
  },

  addChildComments: (parentId, children) => {
    set((state) => {
      const newComments = { ...state.comments };
      const parent = newComments[parentId];

      if (!parent) {
        // Parent not loaded — buffer the children
        const buffered = { ...state.bufferedComments };
        buffered[parentId] = [...(buffered[parentId] || []), ...children];
        return { bufferedComments: buffered };
      }

      const childIds = children.map((c) => c.id);
      for (const c of children) {
        newComments[c.id] = { ...c, depth: parent.depth + 1 };
      }

      newComments[parentId] = {
        ...parent,
        childrenIds: [...parent.childrenIds, ...childIds],
      };

      return { comments: newComments };
    });
  },

  applyOptimisticInsert: (optimisticId, parentId, content, author) => {
    set((state) => {
      const optimisticComment: CommentNode = {
        id: optimisticId,
        parentId,
        author,
        content,
        likeCount: 0,
        hasLiked: false,
        createdAt: new Date().toISOString(),
        isEdited: false,
        isOptimistic: true,
        isDeleted: false,
        childrenIds: [],
        depth: parentId && state.comments[parentId]
          ? state.comments[parentId].depth + 1
          : 0,
      };

      const newComments = { ...state.comments, [optimisticId]: optimisticComment };

      if (parentId) {
        const parent = newComments[parentId];
        if (parent) {
          newComments[parentId] = {
            ...parent,
            childrenIds: [...parent.childrenIds, optimisticId],
          };
        }
      } else {
        // Root comment — prepend (newest first)
        return {
          comments: newComments,
          rootIds: [optimisticId, ...state.rootIds],
        };
      }

      return { comments: newComments };
    });
  },

  confirmOptimisticInsert: (optimisticId, serverComment) => {
    set((state) => {
      const newComments = { ...state.comments };

      // Replace optimistic with server comment
      newComments[serverComment.id] = serverComment;
      delete newComments[optimisticId];

      // Update rootIds if needed
      const rootIds = state.rootIds.map((id) =>
        id === optimisticId ? serverComment.id : id
      );

      // Update parent's childrenIds if needed
      if (serverComment.parentId && newComments[serverComment.parentId]) {
        const parent = newComments[serverComment.parentId];
        newComments[serverComment.parentId] = {
          ...parent,
          childrenIds: parent.childrenIds.map((id) =>
            id === optimisticId ? serverComment.id : id
          ),
        };
      }

      return { comments: newComments, rootIds };
    });
  },

  rollbackMutation: (commentId) => {
    set((state) => {
      const snapshot = state.rollbackSnapshots[commentId];
      if (!snapshot) return state;

      const newComments = { ...state.comments };
      newComments[commentId] = snapshot;

      const newSnapshots = { ...state.rollbackSnapshots };
      delete newSnapshots[commentId];

      return { comments: newComments, rollbackSnapshots: newSnapshots };
    });
  },

  snapshotComment: (commentId, comment) => {
    set((state) => ({
      rollbackSnapshots: { ...state.rollbackSnapshots, [commentId]: comment },
    }));
  },

  updateComment: (commentId, updates) => {
    set((state) => {
      const comment = state.comments[commentId];
      if (!comment) return state;

      return {
        comments: {
          ...state.comments,
          [commentId]: { ...comment, ...updates },
        },
      };
    });
  },

  toggleCollapse: (commentId) => {
    set((state) => {
      const collapsed = new Set(state.collapsedThreads);
      if (collapsed.has(commentId)) {
        collapsed.delete(commentId);
      } else {
        collapsed.add(commentId);
      }
      return { collapsedThreads: collapsed };
    });
  },

  mergeWebSocketUpdate: (message) => {
    set((state) => {
      const { type, payload } = message;
      const newComments = { ...state.comments };

      switch (type) {
        case 'NEW_REPLY': {
          const parent = payload.parentId ? newComments[payload.parentId] : null;
          if (parent) {
            newComments[payload.id] = {
              ...payload,
              depth: Math.min(parent.depth + 1, MAX_DEPTH),
            };
            newComments[payload.parentId!] = {
              ...parent,
              childrenIds: [...parent.childrenIds, payload.id],
            };
          } else {
            // Parent not loaded — buffer
            const buffered = { ...state.bufferedComments };
            const parentId = payload.parentId!;
            buffered[parentId] = [...(buffered[parentId] || []), payload];
            return { bufferedComments: buffered };
          }
          break;
        }
        case 'NEW_ROOT': {
          newComments[payload.id] = { ...payload, depth: 0 };
          return {
            comments: newComments,
            rootIds: [...state.rootIds, payload.id],
          };
        }
        case 'COMMENT_EDITED': {
          const existing = newComments[payload.id];
          if (existing) {
            newComments[payload.id] = { ...existing, ...payload };
          }
          break;
        }
        case 'COMMENT_DELETED': {
          const deleted = newComments[payload.id];
          if (deleted) {
            newComments[payload.id] = { ...deleted, isDeleted: true };
            // Re-root children to grandparent or null
            for (const childId of deleted.childrenIds) {
              const child = newComments[childId];
              if (child) {
                newComments[childId] = {
                  ...child,
                  parentId: deleted.parentId,
                };
              }
            }
            if (deleted.parentId) {
              const parent = newComments[deleted.parentId];
              if (parent) {
                newComments[deleted.parentId] = {
                  ...parent,
                  childrenIds: parent.childrenIds.filter(
                    (id) => id !== payload.id
                  ),
                };
              }
            } else {
              return {
                comments: newComments,
                rootIds: state.rootIds.filter((id) => id !== payload.id),
              };
            }
          }
          break;
        }
      }

      return { comments: newComments };
    });
  },

  registerPendingRequest: (key, promise) => {
    set((state) => {
      const pending = new Map(state.pendingRequests);
      pending.set(key, promise);
      return { pendingRequests: pending };
    });
  },

  clearPendingRequest: (key) => {
    set((state) => {
      const pending = new Map(state.pendingRequests);
      pending.delete(key);
      return { pendingRequests: pending };
    });
  },

  clearStore: () => {
    set({
      comments: {},
      rootIds: [],
      collapsedThreads: new Set(),
      paginationCursor: null,
      hasMore: false,
      isLoading: false,
      rollbackSnapshots: {},
      pendingRequests: new Map(),
      bufferedComments: {},
    });
  },
}));
