import Link from "next/link";
import { listPosts } from "@/lib/posts";

export default function Page() {
  const posts = listPosts();

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Hybrid rendering strategies</h1>
        <p className="mt-2 text-slate-300">
          Use SSG/ISR for public SEO pages; use SSR (often uncached) for personalized pages; keep non-indexable
          pages out of search.
        </p>
      </header>

      <section aria-labelledby="blog" className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 id="blog" className="text-xl font-semibold">
          Blog (SSG + ISR)
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link className="hover:underline" href={`/blog/${p.slug}`}>
                {p.title}
              </Link>{" "}
              <span className="text-slate-400">(revalidate {p.revalidateSeconds}s)</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="account" className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 id="account" className="text-xl font-semibold">
          Account (SSR + noindex)
        </h2>
        <p className="mt-3 text-slate-300">
          Personalized pages often depend on cookies/headers and should not be indexed. This page sets{" "}
          <code>robots: noindex</code>.
        </p>
        <p className="mt-4">
          <Link className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm hover:bg-indigo-500/30" href="/account">
            Open account page
          </Link>
        </p>
      </section>
    </main>
  );
}

