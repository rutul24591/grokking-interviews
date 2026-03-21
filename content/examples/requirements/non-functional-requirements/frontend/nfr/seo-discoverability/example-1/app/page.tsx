import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">SEO & discoverability — core primitives</h1>
        <p className="text-sm text-slate-300">
          A Next.js demo of: metadata, canonical URLs, robots, sitemap, and JSON-LD structured data.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Articles</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="rounded-lg bg-slate-950/40 p-3">
              <Link className="font-medium text-slate-200 underline" href={`/articles/${a.slug}`}>
                {a.title}
              </Link>
              <div className="mt-1 text-xs text-slate-400">{a.description}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Check generated endpoints</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            <code className="rounded bg-slate-800 px-1">/robots.txt</code>
          </li>
          <li>
            <code className="rounded bg-slate-800 px-1">/sitemap.xml</code>
          </li>
        </ul>
      </section>
    </main>
  );
}

