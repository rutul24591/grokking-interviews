import { randomUUID } from "node:crypto";

export type Comment = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

type Store = {
  comments: Comment[];
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__PE_STORE__ as Store | undefined) ?? {
    comments: [],
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__PE_STORE__ = store;

export function addComment(params: { author: string; message: string }): Comment {
  const c: Comment = {
    id: randomUUID(),
    author: params.author,
    message: params.message,
    createdAt: new Date().toISOString(),
  };
  store.comments.unshift(c);
  return c;
}

export function listComments(params: { limit: number; cursor?: string | null }) {
  const sorted = store.comments;
  let start = 0;
  if (params.cursor) {
    const idx = sorted.findIndex((c) => c.id === params.cursor);
    start = idx >= 0 ? idx + 1 : 0;
  }
  const page = sorted.slice(start, start + params.limit);
  const nextCursor = page.length ? page[page.length - 1].id : null;
  return { comments: page, nextCursor: page.length === params.limit ? nextCursor : null };
}

