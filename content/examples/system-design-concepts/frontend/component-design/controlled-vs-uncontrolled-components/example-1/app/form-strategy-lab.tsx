"use client";

import { useRef, useState } from "react";

type Submission = { mode: string; title: string; note: string };

export default function FormStrategyLab() {
  const [controlled, setControlled] = useState({ title: "SSR", note: "Controlled inputs make validation explicit." });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const uncontrolledTitleRef = useRef<HTMLInputElement>(null);
  const uncontrolledNoteRef = useRef<HTMLTextAreaElement>(null);

  async function submit(mode: "controlled" | "uncontrolled") {
    const payload = mode === "controlled"
      ? controlled
      : { title: uncontrolledTitleRef.current?.value ?? "", note: uncontrolledNoteRef.current?.value ?? "" };
    const response = await fetch("http://localhost:4525/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, ...payload })
    });
    const result = (await response.json()) as { submissions: Submission[] };
    setSubmissions(result.submissions);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Controlled form</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <input className="rounded-2xl border border-slate-200 px-3 py-2" value={controlled.title} onChange={(event) => setControlled((current) => ({ ...current, title: event.target.value }))} />
          <textarea className="min-h-32 rounded-2xl border border-slate-200 px-3 py-2" value={controlled.note} onChange={(event) => setControlled((current) => ({ ...current, note: event.target.value }))} />
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void submit("controlled")}>Submit controlled</button>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Uncontrolled form</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <input ref={uncontrolledTitleRef} defaultValue="CSR" className="rounded-2xl border border-slate-200 px-3 py-2" />
          <textarea ref={uncontrolledNoteRef} defaultValue="Uncontrolled inputs defer state ownership to the DOM." className="min-h-32 rounded-2xl border border-slate-200 px-3 py-2" />
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void submit("uncontrolled")}>Submit uncontrolled</button>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold text-slate-950">Submissions</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">{submissions.map((submission, index) => <li key={`${submission.mode}-${index}`} className="rounded-2xl bg-white px-4 py-3">{submission.mode} · {submission.title} · {submission.note}</li>)}</ul>
      </article>
    </section>
  );
}
