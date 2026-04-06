'use client';

interface CommentActionsProps {
  commentId: string;
  likeCount: number;
  hasLiked: boolean;
  isOwner: boolean;
  onLike: () => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canReply: boolean;
}

export function CommentActions({
  commentId,
  likeCount,
  hasLiked,
  isOwner,
  onLike,
  onReply,
  onEdit,
  onDelete,
  canReply,
}: CommentActionsProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      {/* Like */}
      <button
        type="button"
        onClick={onLike}
        className={`flex items-center gap-1 hover:text-accent ${
          hasLiked ? 'text-accent' : ''
        }`}
        aria-label={`Like comment. Current count: ${likeCount}`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill={hasLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span>{likeCount}</span>
      </button>

      {/* Reply */}
      {canReply && (
        <button
          type="button"
          onClick={onReply}
          className="hover:text-accent"
          aria-label="Reply to this comment"
        >
          Reply
        </button>
      )}

      {/* Edit (owner only) */}
      {isOwner && (
        <button
          type="button"
          onClick={onEdit}
          className="hover:text-accent"
          aria-label="Edit your comment"
        >
          Edit
        </button>
      )}

      {/* Delete (owner only) */}
      {isOwner && (
        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 hover:text-red-400"
          aria-label="Delete your comment"
        >
          Delete
        </button>
      )}
    </div>
  );
}
