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

export function getDraftPost(slug: string): Post | null {
  // In real systems, draft content comes from a CMS. Keep it local and obvious for the demo.
  if (slug !== "hello-world") return null;
  return {
    slug,
    title: "Hello World (DRAFT)",
    updatedAt: new Date().toISOString(),
    excerpt: "Draft content served in draft mode.",
    body:
      "This is DRAFT content.\n\nDraft Mode bypasses static caching and allows previewing unpublished changes.\n\nDo not enable it publicly without auth.\n",
  };
}

