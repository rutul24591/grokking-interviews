"use client";

import { useMemo, useReducer, useState } from "react";

type Draft = { id: string; title: string; status: "draft" | "review" | "archived"; owner: string; notes: number };
type State = { drafts: Draft[]; activity: string[] };
type Action =
  | { type: "save"; id: string; title: string }
  | { type: "archive"; id: string }
  | { type: "promote"; id: string }
  | { type: "undo-archive"; id: string };

const initialDrafts: Draft[] = [
  { id: "d1", title: "Homepage IA", status: "draft", owner: "Ada", notes: 4 },
  { id: "d2", title: "Search ranking notes", status: "review", owner: "Lin", notes: 8 },
  { id: "d3", title: "Billing settings copy", status: "draft", owner: "Mina", notes: 2 },
  { id: "d4", title: "Archived onboarding audit", status: "archived", owner: "Ravi", notes: 6 }
];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "save":
      return {
        drafts: state.drafts.map((draft) => (draft.id === action.id ? { ...draft, title: action.title } : draft)),
        activity: [`Saved ${action.id} as "${action.title}"`, ...state.activity].slice(0, 8)
      };
    case "archive":
      return {
        drafts: state.drafts.map((draft) => (draft.id === action.id ? { ...draft, status: "archived" } : draft)),
        activity: [`Archived ${action.id}`, ...state.activity].slice(0, 8)
      };
    case "promote":
      return {
        drafts: state.drafts.map((draft) => (draft.id === action.id ? { ...draft, status: "review" } : draft)),
        activity: [`Moved ${action.id} to review`, ...state.activity].slice(0, 8)
      };
    case "undo-archive":
      return {
        drafts: state.drafts.map((draft) => (draft.id === action.id ? { ...draft, status: "draft" } : draft)),
        activity: [`Restored ${action.id}`, ...state.activity].slice(0, 8)
      };
    default:
      return state;
  }
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, { drafts: initialDrafts, activity: ["Workspace ready"] });
  const [statusFilter, setStatusFilter] = useState<"all" | Draft["status"]>("all");
  const [selectedId, setSelectedId] = useState(initialDrafts[0].id);
  const selected = state.drafts.find((draft) => draft.id === selectedId) ?? state.drafts[0];
  const [draftTitle, setDraftTitle] = useState(selected.title);

  const visibleDrafts = useMemo(() => {
    return state.drafts.filter((draft) => statusFilter === "all" || draft.status === statusFilter);
  }, [state.drafts, statusFilter]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-sky-950/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Local component state</p>
              <h1 className="mt-2 text-3xl font-semibold">Editorial workspace</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">All interactions stay local because this page owns the workflow. No URL sync, no server cache, no global store.</p>
            </div>
            <select className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
              <option value="all">All states</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="mt-6 grid gap-3">
            {visibleDrafts.map((draft) => (
              <button
                key={draft.id}
                className={`rounded-2xl border px-4 py-4 text-left transition ${selectedId === draft.id ? "border-sky-400 bg-sky-500/10" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}
                onClick={() => {
                  setSelectedId(draft.id);
                  setDraftTitle(draft.title);
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{draft.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">Owner {draft.owner} · {draft.notes} open notes</p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{draft.status}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-sky-950/30">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Focused editor</p>
          <h2 className="mt-2 text-2xl font-semibold">Reducer-backed transitions</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Title draft
              <input className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl bg-sky-500 px-4 py-3 font-medium text-slate-950" onClick={() => dispatch({ type: "save", id: selected.id, title: draftTitle })}>Save title</button>
              <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => dispatch({ type: "promote", id: selected.id })}>Move to review</button>
              <button className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100" onClick={() => dispatch({ type: "archive", id: selected.id })}>Archive</button>
              <button className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-100" onClick={() => dispatch({ type: "undo-archive", id: selected.id })}>Restore</button>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="font-medium">Recent local transitions</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                {state.activity.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
