"use client";

import { useState } from "react";
import { todoModule } from "../lib/todoModule";
import { useTodos } from "../lib/useTodos";

export default function Page() {
  const todos = useTodos();
  const [text, setText] = useState("");

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Module Pattern: revealing module (todos)</h1>
        <p className="text-sm text-white/70">
          The feature’s state and invariants live inside <code>todoModule</code>. UI calls its API.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            placeholder="Add todo…"
          />
          <button
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            onClick={() => {
              todoModule.add(text);
              setText("");
            }}
          >
            Add
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {todos.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2">
              <button className="text-left" onClick={() => todoModule.toggle(t.id)}>
                <span className={t.done ? "text-white/50 line-through" : ""}>{t.text}</span>
              </button>
              <button
                className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
                onClick={() => todoModule.remove(t.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

