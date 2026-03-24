export type Post = { id: string; title: string };

const POSTS: Post[] = Array.from({ length: 25 }, (_, i) => ({
  id: `p${i + 1}`,
  title: `Post ${i + 1}`
}));

export async function listPosts(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const items = POSTS.slice(start, start + pageSize);
  return { items, total: POSTS.length };
}

