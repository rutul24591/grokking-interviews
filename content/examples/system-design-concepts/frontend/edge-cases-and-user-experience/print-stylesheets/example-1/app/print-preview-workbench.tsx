"use client";

import { useState } from "react";

const sections = [
  { id: "summary", title: "Executive summary", body: "Keep the architectural conclusion visible in print." },
  { id: "tradeoffs", title: "Trade-offs", body: "Avoid truncating long bullets across page breaks." },
  { id: "references", title: "References", body: "Expose URLs so printed material remains actionable." },
] as const;

export function PrintPreviewWorkbench() {
  const [showNotes, setShowNotes] = useState(true);
  const [showLinks, setShowLinks] = useState(true);
  const [includeSidebar, setIncludeSidebar] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8 print:max-w-none print:p-0">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 print:border-0 print:bg-white print:text-black">
        <div className="print:hidden">
          <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Print stylesheets</p>
          <h1 className="mt-2 text-3xl font-semibold">Print preview workbench</h1>
          <p className="mt-2 text-sm text-slate-400">
            Toggle the print-specific controls, then use browser print preview. The screen chrome disappears,
            article content becomes high contrast, and references remain useful on paper.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className={`rounded-2xl px-4 py-3 ${showNotes ? "bg-violet-400 font-medium text-slate-950" : "border border-slate-700"}`}
              onClick={() => setShowNotes((value) => !value)}
            >
              {showNotes ? "Hide editor notes" : "Show editor notes"}
            </button>
            <button
              className={`rounded-2xl px-4 py-3 ${showLinks ? "bg-violet-400 font-medium text-slate-950" : "border border-slate-700"}`}
              onClick={() => setShowLinks((value) => !value)}
            >
              {showLinks ? "Hide link hints" : "Show link hints"}
            </button>
            <button
              className={`rounded-2xl px-4 py-3 ${includeSidebar ? "bg-violet-400 font-medium text-slate-950" : "border border-slate-700"}`}
              onClick={() => setIncludeSidebar((value) => !value)}
            >
              {includeSidebar ? "Hide sidebar" : "Show sidebar"}
            </button>
          </div>
        </div>

        <article className="mt-8 grid gap-6 xl:grid-cols-[1fr_280px] print:mt-0 print:block">
          <div className="space-y-6">
          <header className="border-b border-slate-800 pb-6 print:border-slate-300">
            <h2 className="text-2xl font-semibold">Printable system design article</h2>
            <p className="mt-2 text-sm text-slate-300 print:text-black">
              Screen controls should disappear in print, but core narrative, page-break-safe sections, and useful
              references should remain.
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 print:break-inside-avoid print:border-slate-300 print:bg-transparent">
              <h3 className="text-lg font-medium">{section.title}</h3>
              <p className="mt-2 text-sm text-slate-300 print:text-black">{section.body}</p>
              {showNotes ? <p className="mt-3 print:hidden text-xs text-slate-500">Editor note: verify page breaks and orphan handling.</p> : null}
            </section>
          ))}

          {showLinks ? (
            <footer className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 print:border-slate-300 print:bg-transparent print:text-black">
              Related links: `system-design.example/articles/printing`, `system-design.example/checklists/ux`
            </footer>
          ) : null}
          </div>

          {includeSidebar ? (
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 print:hidden">
              <h3 className="text-lg font-medium">Print readiness checklist</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>Verify hidden navigation does not leave empty whitespace.</li>
                <li>Check long tables and code blocks for page-break behavior.</li>
                <li>Append explicit URLs for links that matter offline.</li>
              </ul>
            </aside>
          ) : null}
        </article>
      </section>
    </main>
  );
}
