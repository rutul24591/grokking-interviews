import { useCallback } from 'react';
import { useCommentStore } from '../lib/comment-store';
import {
  postComment,
  editComment,
  deleteComment,
  likeComment,
} from '../services/comment-api';
import type { CommentNode } from '../lib/comment-types';

interface UseCommentActionsOptions {
  currentUserId: string;
  onError?: (message: string, retryable: boolean, retry?: () => void) => void;
}

export function useCommentActions({
  currentUserId,
  onError,
}: UseCommentActionsOptions) {
  const store = useCommentStore();
  const snapshotComment = store.snapshotComment;
  const updateComment = store.updateComment;
  const rollbackMutation = store.rollbackMutation;
  const applyOptimisticInsert = store.applyOptimisticInsert;
  const confirmOptimisticInsert = store.confirmOptimisticInsert;

  // Like with optimistic toggle and rollback
  const handleLike = useCallback(
    async (commentId: string) => {
      const comment = store.comments[commentId];
      if (!comment) return;

      // Snapshot for rollback
      snapshotComment(commentId, comment);

      // Optimistic toggle
      updateComment(commentId, {
        hasLiked: !comment.hasLiked,
        likeCount: comment.hasLiked
          ? comment.likeCount - 1
          : comment.likeCount + 1,
      });

      try {
        const response = await likeComment(commentId);
        // Confirm — update with server values
        updateComment(commentId, {
          likeCount: response.likeCount,
          hasLiked: response.hasLiked,
        });
      } catch (err) {
        // Rollback
        rollbackMutation(commentId);
        const apiError = err as { message: string; retryable: boolean };
        onError?.(apiError.message, apiError.retryable, () =>
          handleLike(commentId)
        );
      }
    },
    [store.comments, snapshotComment, updateComment, rollbackMutation, onError]
  );

  // Edit with optimistic update and rollback
  const handleEdit = useCallback(
    async (commentId: string, newContent: string) => {
      const comment = store.comments[commentId];
      if (!comment) return;

      // Snapshot for rollback
      snapshotComment(commentId, comment);

      // Optimistic update
      updateComment(commentId, {
        content: newContent,
        isEdited: true,
        updatedAt: new Date().toISOString(),
      });

      try {
        const response = await editComment({ commentId, content: newContent });
        // Confirm with server values
        updateComment(commentId, response.comment);
      } catch (err) {
        // Rollback
        rollbackMutation(commentId);
        const apiError = err as { message: string; retryable: boolean };
        onError?.(apiError.message, apiError.retryable, () =>
          handleEdit(commentId, newContent)
        );
      }
    },
    [store.comments, snapshotComment, updateComment, rollbackMutation, onError]
  );

  // Delete with optimistic removal and child re-rooting
  const handleDelete = useCallback(
    async (commentId: string) => {
      const comment = store.comments[commentId];
      if (!comment) return;

      // Snapshot for rollback
      snapshotComment(commentId, comment);

      // Optimistic removal
      updateComment(commentId, { isDeleted: true });

      try {
        await deleteComment(commentId);
      } catch (err) {
        // Rollback
        rollbackMutation(commentId);
        const apiError = err as { message: string; retryable: boolean };
        onError?.(apiError.message, apiError.retryable, () =>
          handleDelete(commentId)
        );
      }
    },
    [store.comments, snapshotComment, updateComment, rollbackMutation, onError]
  );

  // Post with optimistic insert
  const handlePost = useCallback(
    async (content: string, parentId: string | null, author: CommentNode['author']) => {
      const optimisticId = `optimistic-${crypto.randomUUID()}`;

      // Apply optimistic insert
      applyOptimisticInsert(optimisticId, parentId, content, author);

      try {
        const response = await postComment({ parentId, content });
        // Confirm — replace optimistic with server comment
        confirmOptimisticInsert(optimisticId, response.comment);
      } catch (err) {
        // Rollback — remove optimistic comment
        rollbackMutation(optimisticId);
        const apiError = err as { message: string; retryable: boolean };
        onError?.(apiError.message, apiError.retryable, () =>
          handlePost(content, parentId, author)
        );
      }
    },
    [applyOptimisticInsert, confirmOptimisticInsert, rollbackMutation, onError]
  );

  return { handleLike, handleEdit, handleDelete, handlePost };
}
