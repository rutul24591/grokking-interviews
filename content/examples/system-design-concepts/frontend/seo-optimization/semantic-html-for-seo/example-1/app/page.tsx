import Link from "next/link";
import { listArticles } from "@/lib/articles";

export default function HomePage() {
  const articles = listArticles();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Semantic HTML for SEO</h1>
        <p className="mt-2 text-slate-300">
          This demo focuses on the HTML structure that helps crawlers extract “main content” reliably.
        </p>
      </header>

      <section aria-labelledby="latest-articles" className="space-y-4">
        <h2 id="latest-articles" className="text-xl font-semibold">
          Latest articles
        </h2>

        <ul className="grid gap-4 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <header>
                  <h3 className="text-lg font-semibold">
                    <Link className="hover:underline" href={`/articles/${a.slug}`}>
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">{a.description}</p>
                </header>

                <footer className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>
                    <time dateTime={a.publishedAt}>{a.publishedAt}</time> · {a.readingMinutes} min read
                  </span>
                  <Link className="rounded-md bg-indigo-500/20 px-3 py-1 hover:bg-indigo-500/30" href={`/articles/${a.slug}`}>
                    Read
                  </Link>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">What to verify</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            “View Source” includes the article’s main text (not an empty shell).
          </li>
          <li>
            The article page uses a single <code>&lt;article&gt;</code> for the main content, and an{" "}
            <code>&lt;aside&gt;</code> for related content.
          </li>
          <li>
            Navigation is inside <code>&lt;nav&gt;</code> elements (primary + breadcrumbs + on-page TOC).
          </li>
        </ul>
      </aside>
    </>
  );
}

