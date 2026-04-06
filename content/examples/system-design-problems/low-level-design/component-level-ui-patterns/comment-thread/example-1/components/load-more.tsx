'use client';

import { useCallback } from 'react';
import { useCommentStore } from '../lib/comment-store';

interface LoadMoreProps {
  onLoadMore?: () => void;
}

export function LoadMore({ onLoadMore }: LoadMoreProps) {
  const hasMore = useCommentStore((state) => state.hasMore);
  const isLoading = useCommentStore((state) => state.isLoading);

  const handleClick = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  if (!hasMore) return null;

  return (
    <div className="flex justify-center py-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="rounded-md border border-accent bg-accent/10 px-6 py-2 text-sm font-medium text-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Load more comments"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            Loading...
          </span>
        ) : (
          'Load More Comments'
        )}
      </button>
    </div>
  );
}
