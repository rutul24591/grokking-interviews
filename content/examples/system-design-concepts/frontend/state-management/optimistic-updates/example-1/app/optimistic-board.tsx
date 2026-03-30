"use client";

import { useState } from "react";

type Task = { id: string; title: string; status: "pending" | "done"; optimistic?: boolean };
const initial: Task[] = [
  { id: 'task-1', title: 'Prepare rollout note', status: 'pending' },
  { id: 'task-2', title: 'Call support lead', status: 'pending' }
];

export function OptimisticBoard() {
  const [tasks, setTasks] = useState(initial);
  const [log, setLog] = useState<string[]>(['UI ready']);

  async function completeTask(id: string) {
    const previous = tasks;
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status: 'done', optimistic: true } : task));
    setLog((entries) => [`Optimistically completed ${id}`, ...entries].slice(0, 6));
    const response = await fetch('/api/optimistic', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      setTasks(previous);
      setLog((entries) => [`Rolled back ${id} after server failure`, ...entries].slice(0, 6));
      return;
    }
    setTasks((current) => current.map((task) => task.id === id ? { ...task, optimistic: false } : task));
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Optimistic updates</p>
        <h1 className="mt-2 text-3xl font-semibold">Operations checklist</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{task.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{task.status}{task.optimistic ? ' · pending server confirmation' : ''}</p>
                  </div>
                  <button className="rounded-xl bg-amber-400 px-3 py-2 font-medium text-slate-950" onClick={() => void completeTask(task.id)}>Mark done</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Mutation log</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">{log.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
