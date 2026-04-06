import type {
  CommentNode,
  ThreadFetchResponse,
  ChildrenFetchResponse,
} from '../lib/comment-types';

export interface ApiError {
  message: string;
  status: number;
  retryable: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText || 'Unknown error',
      status: response.status,
      retryable: response.status >= 500 || response.status === 429,
    };

    try {
      const body = await response.json();
      error.message = body.message || error.message;
    } catch {
      // Body not parseable — use default message
    }

    throw error;
  }

  return response.json();
}

/**
 * Fetches the first page (or next page) of root-level comments.
 * Cursor-based pagination.
 */
export async function fetchThread(
  cursor: string | null = null,
  limit: number = 20
): Promise<ThreadFetchResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);

  return request<ThreadFetchResponse>(`/comments?${params.toString()}`);
}

/**
 * Fetches child comments for a given parent (lazy loading).
 */
export async function fetchChildren(
  parentId: string
): Promise<ChildrenFetchResponse> {
  return request<ChildrenFetchResponse>(`/comments/${parentId}/children`);
}

/**
 * Posts a new comment. Returns the server-created comment.
 */
export async function postComment(data: {
  parentId: string | null;
  content: string;
}): Promise<{ comment: CommentNode }> {
  return request<{ comment: CommentNode }>('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Edits an existing comment. Returns the updated comment.
 */
export async function editComment(data: {
  commentId: string;
  content: string;
}): Promise<{ comment: CommentNode }> {
  return request<{ comment: CommentNode }>(`/comments/${data.commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content: data.content }),
  });
}

/**
 * Deletes a comment. Returns the deleted comment metadata.
 */
export async function deleteComment(
  commentId: string
): Promise<{ commentId: string }> {
  return request<{ commentId: string }>(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}

/**
 * Likes/unlikes a comment. Returns the updated like count.
 */
export async function likeComment(
  commentId: string
): Promise<{ commentId: string; likeCount: number; hasLiked: boolean }> {
  return request<{ commentId: string; likeCount: number; hasLiked: boolean }>(
    `/comments/${commentId}/like`,
    { method: 'POST' }
  );
}
