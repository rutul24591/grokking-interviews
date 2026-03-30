"use client";

import { useMemo, useState } from "react";
import {
  applyConflictChoice,
  createDraft,
  mergeDocuments,
  type Conflict,
  type Doc,
  type MergeResult
} from "../lib/merge";

const initialAncestor: Doc = {
  title: "Offline support guide",
  body: "Use an outbox to queue writes and replay them later.",
  tags: "offline, sync, queue"
};

const initialLocal = createDraft(initialAncestor, {
  title: "Offline support guide (mobile-first)",
  body: "Use an outbox to queue writes locally and replay them when the client reconnects."
});

const initialServer = createDraft(initialAncestor, {
  body: "Use an outbox to capture writes and replay them with idempotency keys.",
  tags: "offline, sync, idempotency"
});

function Editor(props: {
  title: string;
  doc: Doc;
  onChange: (next: Doc) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-3 text-sm font-semibold text-white/80">{props.title}</div>
      <div className="space-y-3">
        <label className="block text-sm">
          <div className="mb-1 text-white/60">Title</div>
          <input
            className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
            value={props.doc.title}
            onChange={(e) => props.onChange({ ...props.doc, title: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <div className="mb-1 text-white/60">Body</div>
          <textarea
            className="min-h-36 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
            value={props.doc.body}
            onChange={(e) => props.onChange({ ...props.doc, body: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <div className="mb-1 text-white/60">Tags</div>
          <input
            className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
            value={props.doc.tags}
            onChange={(e) => props.onChange({ ...props.doc, tags: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

function ConflictCard(props: {
  conflict: Conflict;
  onChoose: (winner: "local" | "server") => void;
}) {
  return (
    <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-4 text-sm">
      <div className="font-semibold text-amber-200">{props.conflict.field}</div>
      <div className="mt-2 space-y-1 text-white/80">
        <div>ancestor: <code>{props.conflict.ancestor}</code></div>
        <div>local: <code>{props.conflict.local}</code></div>
        <div>server: <code>{props.conflict.server}</code></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-3 py-1.5 font-semibold text-white hover:bg-indigo-400"
          onClick={() => props.onChoose("local")}
        >
          Keep local
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
          onClick={() => props.onChoose("server")}
        >
          Keep server
        </button>
      </div>
    </div>
  );
}

export function MergeWorkbench() {
  const [ancestor, setAncestor] = useState(initialAncestor);
  const [local, setLocal] = useState(initialLocal);
  const [server, setServer] = useState(initialServer);
  const [resolved, setResolved] = useState<MergeResult | null>(null);

  const preview = useMemo(() => mergeDocuments(ancestor, local, server), [ancestor, local, server]);

  function resolveConflict(conflict: Conflict, winner: "local" | "server") {
    setResolved((current) => {
      const base = current ?? preview;
      return applyConflictChoice(base, conflict.field, winner);
    });
  }

  function reset() {
    setAncestor(initialAncestor);
    setLocal(initialLocal);
    setServer(initialServer);
    setResolved(null);
  }

  const current = resolved ?? preview;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <Editor title="Ancestor" doc={ancestor} onChange={setAncestor} />
        <Editor title="Local draft" doc={local} onChange={setLocal} />
        <Editor title="Server version" doc={server} onChange={setServer} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={() => setResolved(preview)}
        >
          Recompute merge
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={reset}
        >
          Reset scenario
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="mb-3 text-sm font-semibold text-white/80">Merged document</div>
          <pre className="overflow-x-auto text-xs text-white/80">{JSON.stringify(current.merged, null, 2)}</pre>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
            <div>
              auto-resolved fields: <span className="font-semibold">{current.autoResolved.join(", ") || "none"}</span>
            </div>
            <div>
              conflicts: <span className="font-semibold">{current.conflicts.length}</span>
            </div>
          </div>
          {current.conflicts.map((conflict) => (
            <ConflictCard key={conflict.field} conflict={conflict} onChoose={(winner) => resolveConflict(conflict, winner)} />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
        <div className="font-semibold text-white/80">What this demonstrates</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Edits that touch different fields can be merged automatically.</li>
          <li>Only true overlapping edits become manual conflicts.</li>
          <li>Conflict resolution should preserve intent, not just pick the latest timestamp globally.</li>
        </ul>
      </div>
    </div>
  );
}

