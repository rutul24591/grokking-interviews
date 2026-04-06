export interface AuthorInfo {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface CommentNode {
  id: string;
  parentId: string | null;
  author: AuthorInfo;
  content: string; // sanitized HTML
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  isOptimistic: boolean;
  isDeleted: boolean;
  childrenIds: string[];
  depth: number;
  moderationStatus?: 'visible' | 'flagged' | 'hidden' | 'removed';
}

export type CommentActionType =
  | 'POST'
  | 'EDIT'
  | 'DELETE'
  | 'LIKE'
  | 'ROLLBACK';

export interface BaseCommentAction {
  type: CommentActionType;
}

export interface PostAction extends BaseCommentAction {
  type: 'POST';
  payload: {
    parentId: string | null;
    content: string;
    optimisticId: string;
  };
}

export interface EditAction extends BaseCommentAction {
  type: 'EDIT';
  payload: {
    commentId: string;
    content: string;
  };
}

export interface DeleteAction extends BaseCommentAction {
  type: 'DELETE';
  payload: {
    commentId: string;
  };
}

export interface LikeAction extends BaseCommentAction {
  type: 'LIKE';
  payload: {
    commentId: string;
  };
}

export interface RollbackAction extends BaseCommentAction {
  type: 'ROLLBACK';
  payload: {
    commentId: string;
    snapshot: CommentNode;
  };
}

export type CommentAction =
  | PostAction
  | EditAction
  | DeleteAction
  | LikeAction
  | RollbackAction;

export interface ThreadState {
  comments: Record<string, CommentNode>;
  rootIds: string[];
  collapsedThreads: Set<string>;
  paginationCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  rollbackSnapshots: Record<string, CommentNode>;
  pendingRequests: Map<string, Promise<unknown>>;
  bufferedComments: Record<string, CommentNode[]>; // parentId -> buffered children
}

export interface ThreadFetchResponse {
  comments: CommentNode[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ChildrenFetchResponse {
  comments: CommentNode[];
}

export interface WebSocketMessage {
  type: 'NEW_REPLY' | 'NEW_ROOT' | 'COMMENT_EDITED' | 'COMMENT_DELETED';
  payload: CommentNode;
}

export const MAX_DEPTH = 5;
