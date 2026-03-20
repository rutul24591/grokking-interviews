import postsData from "@/content/posts.json";

export type Post = {
  slug: string;
  title: string;
  updatedAt: string;
  excerpt: string;
  body: string;
};

export function listPosts(): Post[] {
  return (postsData as { posts: Post[] }).posts.slice();
}

export function getPost(slug: string): Post | null {
  return listPosts().find((p) => p.slug === slug) ?? null;
}

