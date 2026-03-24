import { Section } from "@/components/Section";
import { buildToc, type DocModel } from "@/lib/outline";

const doc: DocModel = {
  title: "Component-library heading strategy",
  sections: [
    {
      title: "Rule 1: one h1 per page",
      level: 2,
      body: "Treat the page title as the single h1. Avoid h1 inside cards, sidebars, or widgets."
    },
    {
      title: "Rule 2: don’t skip heading levels",
      level: 2,
      body: "Jumping from h2 → h4 implies a missing grouping and can confuse both crawlers and assistive tech.",
      children: [
        {
          title: "Subsections are h3",
          level: 3,
          body: "Use h3 within a section to represent nested structure, and keep nesting shallow."
        }
      ]
    },
    {
      title: "Rule 3: TOC is navigation",
      level: 2,
      body: "A TOC is a nav landmark. Putting it in <nav aria-label=\"Table of contents\"> helps structure extraction."
    }
  ]
};

export default function Page() {
  const toc = buildToc(doc);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <article className="rounded-xl border border-white/10 bg-white/5 p-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
          <p className="mt-2 text-slate-300">
            This page is built from a structured doc model so headings can be validated and rendered consistently.
          </p>
        </header>

        {doc.sections.map((s) => (
          <Section key={s.id ?? s.title} node={s} />
        ))}
      </article>

      <aside className="space-y-4">
        <nav aria-label="Table of contents" className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold">Table of contents</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
            {toc.map((t) => (
              <li key={t.id} className={t.level === 3 ? "pl-4" : ""}>
                <a className="hover:underline" href={`#${t.id}`}>
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Try breaking it</h2>
          <p className="mt-2">
            Change a section’s <code>level</code> to skip from 2 → 4 in <code>app/page.tsx</code> and the validation will throw.
          </p>
        </section>
      </aside>
    </div>
  );
}

