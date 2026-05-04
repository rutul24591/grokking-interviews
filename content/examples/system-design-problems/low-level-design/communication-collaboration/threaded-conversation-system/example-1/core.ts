export type CommentId = string;

export type Comment = {
  id: CommentId;
  parentId: CommentId | null;
  authorId: string;
  text: string;
  createdAt: number;
};

export type ThreadState = {
  byId: Record<CommentId, Comment>;
  children: Record<CommentId | "root", CommentId[]>;
};

export function upsert(state: ThreadState, comments: Comment[]) {
  const byId = { ...state.byId };
  const children = { ...state.children } as any;

  for (const c of comments) {
    byId[c.id] = { ...byId[c.id], ...c };
    const key = (c.parentId ?? "root") as any;
    const arr = children[key] ? [...children[key]] : [];
    if (!arr.includes(c.id)) arr.push(c.id);
    arr.sort((a, b) => (byId[a]?.createdAt ?? 0) - (byId[b]?.createdAt ?? 0));
    children[key] = arr;
  }

  return { ...state, byId, children };
}
