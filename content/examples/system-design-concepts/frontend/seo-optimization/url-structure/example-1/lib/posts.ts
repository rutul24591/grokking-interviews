export type Post = { id: string; slug: string; title: string; body: string };

const POSTS: Post[] = [
  {
    id: "42",
    slug: "edge-cache-for-staff",
    title: "Edge cache for staff engineers",
    body: "A stable ID is the canonical identity. Slugs can change without breaking links."
  }
];

export async function getPostById(id: string) {
  return POSTS.find((p) => p.id === id) ?? null;
}

