export type Comment = { id: string; parentId: string | null; text: string; createdAt: number };

export function indexTree(comments: Comment[]) {
  const children: Record<string, string[]> = { root: [] };
  for (const c of comments) {
    const k = c.parentId ?? "root";
    (children[k] ??= []).push(c.id);
  }
  for (const k of Object.keys(children)) children[k].sort();
  return children;
}
