"use client";

import { useMemo, useState } from "react";

function now() {
  return new Date().toLocaleTimeString();
}

export default function Page() {
  const [events, setEvents] = useState<string[]>([]);
  const push = (msg: string) => setEvents((e) => [`${now()} — ${msg}`, ...e].slice(0, 12));

  const rows = useMemo(
    () => [
      {
        title: "Real button (recommended)",
        node: (
          <button
            type="button"
            className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30"
            onClick={() => push("button: click")}
            onKeyDown={(e) => push(`button: keydown ${e.key}`)}
          >
            Save changes
          </button>
        ),
        notes: "Automatically supports Space/Enter activation, focus, and accessibility name."
      },
      {
        title: "Real link (navigation)",
        node: (
          <a
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
            href="#target"
            onClick={() => push("link: click (navigates)")}
            onKeyDown={(e) => push(`link: keydown ${e.key}`)}
          >
            Jump to target
          </a>
        ),
        notes: "Use links for navigation. Don’t use buttons to navigate."
      },
      {
        title: "div role=button (avoid unless necessary)",
        node: (
          <div
            role="button"
            tabIndex={0}
            className="select-none rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold hover:bg-black/40"
            onClick={() => push("div(role=button): click")}
            onKeyDown={(e) => {
              push(`div(role=button): keydown ${e.key}`);
              // If you forget this logic, Space/Enter won’t activate. This is why native elements are safer.
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                push("div(role=button): activated (manual)");
              }
            }}
          >
            Custom action
          </div>
        ),
        notes:
          "You must implement keyboard activation, focus styling, and sometimes ARIA states yourself. Prefer native."
      }
    ],
    []
  );

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Interactive semantics</h1>
        <p className="mt-2 text-slate-300">
          The easiest way to get accessibility right is to use the correct native element.
        </p>
      </header>

      <section aria-labelledby="controls" className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 id="controls" className="text-xl font-semibold">
          Controls
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rows.map((r) => (
            <article key={r.title} className="rounded-lg border border-white/10 bg-black/30 p-4">
              <h3 className="text-sm font-semibold text-slate-100">{r.title}</h3>
              <div className="mt-3">{r.node}</div>
              <p className="mt-3 text-sm text-slate-300">{r.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="log" className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 id="log" className="text-xl font-semibold">
            Event log
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Try keyboard: Tab into each control and press Space/Enter. Notice how much you “get for free” with
            <code>&lt;button&gt;</code>.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {events.length === 0 ? <li className="text-slate-400">No events yet.</li> : null}
            {events.map((e) => (
              <li key={e} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
                {e}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Rule of thumb</h2>
          <p className="mt-2">
            If it “does something”, it’s usually a <code>&lt;button&gt;</code>. If it “goes somewhere”, it’s a{" "}
            <code>&lt;a&gt;</code>.
          </p>
          <p className="mt-3" id="target">
            Target anchor.
          </p>
        </aside>
      </section>
    </main>
  );
}

