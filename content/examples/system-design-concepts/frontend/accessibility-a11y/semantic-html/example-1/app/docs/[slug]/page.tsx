import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/docs";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.description
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

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
            {doc.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article className="rounded-xl border border-white/10 bg-white/5 p-6">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
            <p className="mt-2 text-slate-300">{doc.description}</p>
            <p className="mt-4 text-sm text-slate-300">
              Updated <time dateTime={doc.updatedAt}>{doc.updatedAt}</time>
            </p>
          </header>

          {doc.sections.map((s) => (
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
              Semantics improve navigation for assistive tech and keep the DOM easier to understand for maintenance.
            </p>
          </footer>
        </article>

        <aside className="space-y-4">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <h2 className="text-base font-semibold text-slate-100">On this page</h2>
            <nav aria-label="On this page" className="mt-3">
              <ol className="list-decimal space-y-2 pl-5">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a className="hover:underline" href={`#${s.id}`}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <h2 className="text-base font-semibold text-slate-100">Tip</h2>
            <p className="mt-2">
              Use <code>&lt;button&gt;</code> for actions and <code>&lt;a&gt;</code> for navigation — don’t fake them
              with divs.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

