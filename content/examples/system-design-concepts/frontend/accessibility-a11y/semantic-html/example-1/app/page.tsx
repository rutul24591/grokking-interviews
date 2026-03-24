import Link from "next/link";
import { listDocs } from "@/lib/docs";

export default function Page() {
  const docs = listDocs();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Semantic HTML foundations</h1>
        <p className="mt-2 text-slate-300">
          Use proper HTML elements first. ARIA should fill gaps, not replace semantics.
        </p>
      </header>

      <section aria-labelledby="docs" className="space-y-4">
        <h2 id="docs" className="text-xl font-semibold">
          Docs
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {docs.map((d) => (
            <li key={d.slug}>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">
                  <Link className="hover:underline" href={`/docs/${d.slug}`}>
                    {d.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-300">{d.description}</p>
                <p className="mt-4 text-sm text-slate-300">
                  Updated <time dateTime={d.updatedAt}>{d.updatedAt}</time>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Keyboard checklist</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Press <code>Tab</code>: the skip link becomes visible and moves focus to the main content.
          </li>
          <li>
            Each doc card uses a real link (<code>&lt;a&gt;</code>) so it’s naturally keyboard-accessible.
          </li>
          <li>
            The doc page uses a single <code>&lt;article&gt;</code> for primary content and <code>&lt;aside&gt;</code>{" "}
            for supporting content.
          </li>
        </ul>
      </aside>
    </>
  );
}

