"use client";

import { useMemo, useState } from "react";

type Comment = { id: string; author: string; body: string };

const initial: Comment[] = [
  { id: "c1", author: "Ada", body: "Islands keep the shell fast and interactive parts focused." },
  { id: "c2", author: "Linus", body: "Be careful: too many tiny islands can cause request waterfalls." },
];

export default function CommentsIsland() {
  const [items, setItems] = useState<Comment[]>(initial);
  const [value, setValue] = useState("");

  const count = useMemo(() => items.length, [items.length]);

  return (
    <div>
      <div className="text-sm text-slate-100">
        Loaded island. Comments: <span className="font-mono">{count}</span>
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-xs font-semibold text-slate-200">{c.author}</div>
            <div className="mt-1 text-sm text-slate-100">{c.body}</div>
          </div>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const body = value.trim();
          if (!body) return;
          setItems((prev) => [
            ...prev,
            { id: `c-${Date.now()}`, author: "You", body },
          ]);
          setValue("");
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-600"
        />
        <button
          className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
          type="submit"
        >
          Post
        </button>
      </form>
    </div>
  );
}

