import { unstable_cache } from "next/cache";
import { z } from "zod";
import { sleep } from "@/lib/sleep";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  sections: Array<{ id: string; heading: string; body: string }>;
};

const PostsBySlug: Record<string, Post> = {
  "edge-caching-and-ssr": {
    slug: "edge-caching-and-ssr",
    title: "Edge caching and SSR: avoiding the hot path",
    excerpt: "Cache SSR data loaders to reduce double-fetch and keep TTFB predictable.",
    publishedAt: "2026-03-24",
    sections: [
      {
        id: "double-fetch",
        heading: "The double-fetch problem",
        body: "A common SSR pitfall: metadata and page rendering each hit the database. Under load, that doubles your QPS and cost."
      },
      {
        id: "cache-loader",
        heading: "Cache the loader, not the component",
        body: "Use Next caching primitives to cache data fetches. Keep rendering pure: given data, render HTML."
      }
    ]
  },
  "ssr-waterfalls": {
    slug: "ssr-waterfalls",
    title: "Prevent SSR waterfalls with parallelism",
    excerpt: "Parallelize independent work with Promise.all and avoid chained awaits.",
    publishedAt: "2026-03-24",
    sections: [
      {
        id: "parallelize",
        heading: "Parallelize independent calls",
        body: "Fetch main data and secondary modules (related posts, nav) in parallel when possible."
      }
    ]
  }
};

const SlugSchema = z.string().min(1);

async function dbGetPost(slug: string): Promise<Post | null> {
  SlugSchema.parse(slug);
  await sleep(120);
  return PostsBySlug[slug] ?? null;
}

async function dbGetRelated(slug: string): Promise<Array<Pick<Post, "slug" | "title">>> {
  SlugSchema.parse(slug);
  await sleep(80);
  return Object.values(PostsBySlug)
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title }));
}

export function listPostSlugs() {
  return Object.keys(PostsBySlug);
}

export async function getPost(slug: string) {
  // Cache across requests for SEO pages; also dedupes if metadata + page both call it.
  const cached = unstable_cache(() => dbGetPost(slug), ["post", slug], { revalidate: 60 });
  return cached();
}

export async function getRelatedPosts(slug: string) {
  const cached = unstable_cache(() => dbGetRelated(slug), ["related", slug], { revalidate: 120 });
  return cached();
}

