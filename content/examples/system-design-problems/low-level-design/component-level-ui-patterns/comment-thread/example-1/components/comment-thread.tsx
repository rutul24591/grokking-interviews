'use client';

import { useMemo } from 'react';
import { useCommentStore } from '../lib/comment-store';
import { buildTree } from '../lib/comment-tree-utils';
import { CommentNode } from './comment-node';
import { LoadMore } from './load-more';

export function CommentThread() {
  const comments = useCommentStore((state) => state.comments);
  const rootIds = useCommentStore((state) => state.rootIds);
  const hasMore = useCommentStore((state) => state.hasMore);
  const isLoading = useCommentStore((state) => state.isLoading);

  const tree = useMemo(
    () => buildTree(comments, rootIds),
    [comments, rootIds]
  );

  if (isLoading && tree.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" role="feed" aria-busy={isLoading} aria-label="Comment thread">
      {tree.map((comment) => (
        <CommentNode key={comment.id} comment={comment} />
      ))}

      {hasMore && <LoadMore />}

      {tree.length === 0 && !isLoading && (
        <p className="py-8 text-center text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}
    </div>
  );
}
