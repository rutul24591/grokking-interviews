export type Post = {
  slug: string;
  title: string;
  summary: string;
};

const POSTS: Post[] = [
  {
    slug: "edge-cache",
    title: "Edge Cache",
    summary: "How cache keys, TTLs, and invalidation impact perceived performance."
  },
  {
    slug: "crawler-friendly-html",
    title: "Crawler-Friendly HTML",
    summary: "Why stable metadata and indexable routes matter for discoverability."
  }
];

export async function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export async function listPosts() {
  return POSTS;
}

