'use client';

import { useState, useCallback, useMemo } from 'react';
import type { CommentNode } from '../lib/comment-types';
import { useCommentStore } from '../lib/comment-store';
import { flattenSubtree } from '../lib/comment-tree-utils';
import { CommentForm } from './comment-form';
import { CommentActions } from './comment-actions';

interface CommentNodeProps {
  comment: CommentNode;
}

export function CommentNode({ comment }: CommentNodeProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [childrenLoaded, setChildrenLoaded] = useState(false);
  const [showFlattened, setShowFlattened] = useState(false);

  const comments = useCommentStore((state) => state.comments);
  const collapsedThreads = useCommentStore((state) => state.collapsedThreads);
  const toggleCollapse = useCommentStore((state) => state.toggleCollapse);
  const currentUserId = useCommentStore((state) => 'current-user-id'); // Placeholder

  const isOwner = comment.author.id === currentUserId;
  const isCollapsed = collapsedThreads.has(comment.id);
  const hasChildren = comment.childrenIds.length > 0;

  const children = useMemo(() => {
    return comment.childrenIds
      .map((id) => comments[id])
      .filter(Boolean);
  }, [comments, comment.childrenIds]);

  // Flattened children for "see more" (beyond max depth)
  const flattenedChildren = useMemo(() => {
    const node = comment as CommentNode & { _flattenedChildren?: CommentNode[] };
    return node._flattenedChildren || [];
  }, [comment]);

  const handleToggleCollapse = useCallback(() => {
    toggleCollapse(comment.id);
  }, [toggleCollapse, comment.id]);

  const handleReplyClick = useCallback(() => {
    setIsReplying((prev) => !prev);
    setIsEditing(false);
  }, []);

  const handleEditClick = useCallback(() => {
    setIsEditing((prev) => !prev);
    setIsReplying(false);
  }, []);

  const handleReplySubmit = useCallback(
    (_content: string) => {
      setIsReplying(false);
      // The actual post action is handled by useCommentActions in the parent
    },
    []
  );

  const handleEditSubmit = useCallback(
    (content: string) => {
      setIsEditing(false);
      // The actual edit action is handled by useCommentActions in the parent
    },
    []
  );

  const formatTimestamp = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const indentClass = comment.depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : '';

  return (
    <div
      className={`flex flex-col gap-3 ${indentClass}`}
      role="article"
      aria-label={`Comment by ${comment.author.username}`}
      aria-busy={comment.isOptimistic}
      tabIndex={0}
    >
      {/* Author info */}
      <div className="flex items-center gap-2">
        <img
          src={comment.author.avatarUrl}
          alt={`${comment.author.username}'s avatar`}
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm font-semibold">{comment.author.username}</span>
        <span className="text-xs text-muted">
          {formatTimestamp(comment.createdAt)}
        </span>
        {comment.isEdited && (
          <span className="text-xs italic text-muted">(edited)</span>
        )}
        {comment.isOptimistic && (
          <span className="text-xs text-accent animate-pulse">Posting...</span>
        )}
      </div>

      {/* Comment content */}
      {isEditing ? (
        <CommentForm
          initialContent={comment.content}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          isEditing
        />
      ) : (
        <div
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      )}

      {/* Actions */}
      <CommentActions
        commentId={comment.id}
        likeCount={comment.likeCount}
        hasLiked={comment.hasLiked}
        isOwner={isOwner}
        onLike={() => {}} // Wired via useCommentActions in parent
        onReply={handleReplyClick}
        onEdit={handleEditClick}
        onDelete={() => {}} // Wired via useCommentActions in parent
        canReply={comment.depth < 5}
      />

      {/* Collapse/Expand toggle */}
      {hasChildren && (
        <button
          type="button"
          onClick={handleToggleCollapse}
          className="text-xs text-accent hover:underline"
        >
          {isCollapsed
            ? `Show ${children.length} replies`
            : 'Collapse thread'}
        </button>
      )}

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="flex flex-col gap-3">
          {children.map((child) => (
            <CommentNode key={child.id} comment={child} />
          ))}
        </div>
      )}

      {/* Flattened children (beyond max depth) */}
      {flattenedChildren.length > 0 && (
        <div>
          {showFlattened ? (
            <div className="flex flex-col gap-3">
              {flattenedChildren.map((child) => (
                <div
                  key={child.id}
                  className="ml-4 border-l-2 border-muted pl-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{child.author.username}</span>
                    <span className="text-xs text-muted">
                      {formatTimestamp(child.createdAt)}
                    </span>
                  </div>
                  <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{ __html: child.content }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowFlattened(true)}
              className="text-xs text-accent hover:underline"
            >
              See {flattenedChildren.length} more replies
            </button>
          )}
        </div>
      )}

      {/* Reply form */}
      {isReplying && (
        <CommentForm
          onSubmit={handleReplySubmit}
          onCancel={() => setIsReplying(false)}
          placeholder={`Reply to ${comment.author.username}...`}
        />
      )}
    </div>
  );
}
