"use client";

import { useMemo, useState } from "react";
import { uploadItems, uploadPolicies } from "@/lib/store";

export default function Page() {
  const [items, setItems] = useState(uploadItems);
  const [selectedName, setSelectedName] = useState("release-notes.png");
  const [selectedSize, setSelectedSize] = useState("6");
  const summary = useMemo(() => {
    const blocking = items.filter((item) => item.status === "failed" || item.status === "processing");
    return blocking.length === 0 ? "All attachments are ready for submit." : `${blocking.length} attachment(s) still need attention before submit.`;
  }, [items]);

  function addFile() {
    const ext = selectedName.split(".").pop() ?? "";
    const sizeMb = Number(selectedSize);
    const accepted = uploadPolicies.acceptedExtensions.includes(ext) && sizeMb <= uploadPolicies.maxSizeMb && items.length < uploadPolicies.maxFiles;
    setItems((current) => accepted ? [...current, { id: String(current.length + 1), name: selectedName, sizeMb, status: "queued", progress: 0, retryable: false }] : current);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">File upload queue workbench</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
              <input value={selectedName} onChange={(event) => setSelectedName(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
              <input value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
              <button onClick={addFile} className="rounded-2xl bg-amber-300 px-4 py-3 font-medium text-slate-950">Queue file</button>
            </div>
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-100">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.sizeMb} MB · {item.status}</div>
                    </div>
                    {item.retryable ? (
                      <button onClick={() => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, status: "uploading", progress: 20, retryable: false } : candidate))} className="rounded-xl border border-rose-400/40 px-3 py-2 text-rose-100">
                        Retry
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-amber-300" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Acceptance policy</div>
              <p className="mt-2">Max files: {uploadPolicies.maxFiles}</p>
              <p className="mt-1">Max size: {uploadPolicies.maxSizeMb} MB</p>
              <p className="mt-1">Extensions: {uploadPolicies.acceptedExtensions.join(", ")}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Submission readiness</div>
              <p className="mt-2">{summary}</p>
              <p className="mt-2 text-slate-400">{uploadPolicies.warning}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
