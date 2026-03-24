import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not found" };

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-300">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-100">
            {article.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article className="rounded-xl border border-white/10 bg-white/5 p-6">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
            <p className="mt-2 text-slate-300">{article.description}</p>
            <p className="mt-4 text-sm text-slate-300">
              <time dateTime={article.publishedAt}>{article.publishedAt}</time> · Updated{" "}
              <time dateTime={article.updatedAt}>{article.updatedAt}</time>
            </p>
          </header>

          <nav aria-label="On this page" className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <h2 className="text-sm font-semibold text-slate-100">On this page</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-300">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a className="hover:underline" href={`#${s.id}`}>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {article.sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id} className="mt-8">
              <h2 id={s.id} className="text-xl font-semibold">
                {s.heading}
              </h2>
              <p className="mt-2 text-slate-200">{s.body}</p>
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300">
            <p>
              Tip: use semantic boundaries so crawlers can focus on the main article text, not global navigation.
            </p>
          </footer>
        </article>

        <aside className="space-y-4">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold">Key takeaways</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Use one clear <code>&lt;main&gt;</code> landmark per page.</li>
              <li>Prefer sectioning elements (<code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>) over divs.</li>
              <li>Don’t use ARIA to “add semantics” that native elements already provide.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold">Explore</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Back to index
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}

