/**
 * Optimistic Comment Rollback — Handles failed comment posts with graceful recovery.
 *
 * Interview edge case: User posts a comment, it appears instantly (optimistic),
 * but the server returns 500. The comment must be removed and the user notified
 * with an option to retry. The original content must be preserved for retry.
 */

export interface CommentDraft {
  parentId: string | null;
  content: string;
  timestamp: number;
  retryCount: number;
}

export interface OptimisticComment {
  tempId: string;
  serverId: string | null;
  content: string;
  status: 'pending' | 'confirmed' | 'failed';
  error?: string;
}

/**
 * Manages optimistic comment posting with rollback on failure.
 */
export class OptimisticCommentManager {
  private pending: Map<string, OptimisticComment> = new Map();
  private drafts: Map<string, CommentDraft> = new Map();
  private maxRetries = 3;

  /**
   * Creates an optimistic comment and returns it for immediate rendering.
   */
  createOptimistic(parentId: string | null, content: string): OptimisticComment {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const comment: OptimisticComment = { tempId, serverId: null, content, status: 'pending' };
    this.pending.set(tempId, comment);

    // Save draft for potential retry
    this.drafts.set(tempId, { parentId, content, timestamp: Date.now(), retryCount: 0 });

    return comment;
  }

  /**
   * Confirms the comment after server acknowledgment.
   */
  confirm(tempId: string, serverId: string): void {
    const comment = this.pending.get(tempId);
    if (comment) {
      comment.serverId = serverId;
      comment.status = 'confirmed';
    }
    this.drafts.delete(tempId);
  }

  /**
   * Rolls back a failed comment and returns the draft for retry.
   */
  rollback(tempId: string, error: string): { draft: CommentDraft | null; canRetry: boolean } {
    const comment = this.pending.get(tempId);
    if (comment) {
      comment.status = 'failed';
      comment.error = error;
    }

    const draft = this.drafts.get(tempId);
    if (!draft) return { draft: null, canRetry: false };

    const canRetry = draft.retryCount < this.maxRetries;
    return { draft, canRetry };
  }

  /**
   * Retries a failed comment post.
   */
  retry(tempId: string): OptimisticComment | null {
    const draft = this.drafts.get(tempId);
    if (!draft || draft.retryCount >= this.maxRetries) return null;

    draft.retryCount++;
    this.pending.delete(tempId);

    return this.createOptimistic(draft.parentId, draft.content);
  }

  /**
   * Gets all pending and failed comments.
   */
  getPendingComments(): OptimisticComment[] {
    return Array.from(this.pending.values()).filter(
      (c) => c.status === 'pending' || c.status === 'failed',
    );
  }
}
