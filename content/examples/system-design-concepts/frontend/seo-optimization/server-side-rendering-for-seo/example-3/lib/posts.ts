export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  revalidateSeconds: number;
  sections: Array<{ id: string; heading: string; body: string }>;
};

const POSTS: Post[] = [
  {
    slug: "ssg-isr-hybrid",
    title: "SSG + ISR hybrid for SEO content",
    excerpt: "Pre-render for crawl reliability; revalidate for freshness.",
    publishedAt: "2026-03-24",
    revalidateSeconds: 300,
    sections: [
      {
        id: "why-ssg",
        heading: "Why SSG is reliable for SEO",
        body: "Static HTML is immediately crawlable by all bots, regardless of JS support."
      },
      {
        id: "why-isr",
        heading: "Why ISR improves freshness",
        body: "ISR lets you keep static performance while updating content periodically or via on-demand revalidation."
      }
    ]
  },
  {
    slug: "when-to-ssr",
    title: "When SSR is the right choice",
    excerpt: "SSR is great for dynamic public pages—but personalize carefully and avoid indexing private data.",
    publishedAt: "2026-03-24",
    revalidateSeconds: 300,
    sections: [
      {
        id: "public-vs-private",
        heading: "Public vs private pages",
        body: "Public pages can be indexed. Personalized pages should be noindex and typically avoid shared caching."
      }
    ]
  }
];

const BySlug = new Map(POSTS.map((p) => [p.slug, p] as const));

export function listPosts() {
  return POSTS;
}

export function getPost(slug: string) {
  return BySlug.get(slug) ?? null;
}

export function hasPost(slug: string) {
  return BySlug.has(slug);
}

