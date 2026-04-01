"use client";

import { useEffect, useState } from "react";

type EditorState = {
  title: string;
  body: { type: "paragraph" | "heading" | "callout"; text: string }[];
  activeFormat: "paragraph" | "heading" | "callout";
  validationIssues: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<EditorState | null>(null);

  async function refresh() {
    const response = await fetch("/api/editor/state");
    setState((await response.json()) as EditorState);
  }

  async function act(type: "format" | "append") {
    const response = await fetch("/api/editor/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as EditorState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Rich Text Authoring</h1>
      <p className="mt-2 text-slate-300">Manage structured blocks, formatting mode, and document validation before an article is published.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex gap-3">
            <button onClick={() => void act("format")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Cycle format</button>
            <button onClick={() => void act("append")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Append block</button>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {state?.body.map((block, index) => (
              <div key={index} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">{block.type}</span>
                <div className="mt-1">{block.text}</div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Editor mode</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.activeFormat}</div>
          <div className="mt-4 space-y-2">
            {state?.validationIssues.map((issue) => (
              <div key={issue} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">{issue}</div>
            ))}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
