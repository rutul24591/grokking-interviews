"use client";

import { useState } from "react";
import { deleteDb, listTodos, openTodosDb, seedV1Todos } from "../lib/idbMigrate";

export function MigrationClient() {
  const [rows, setRows] = useState<unknown[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function run(fn: () => Promise<void>) {
    setMsg(null);
    try {
      await fn();
      setMsg("ok");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={() =>
            run(async () => {
              await seedV1Todos();
            })
          }
        >
          Seed v1 data
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={() =>
            run(async () => {
              const db = await openTodosDb(2);
              db.close();
            })
          }
        >
          Open as v2 (migrate)
        </button>
        <button
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          onClick={() =>
            run(async () => {
              setRows(await listTodos());
            })
          }
        >
          List rows
        </button>
        <button
          className="rounded-lg border border-rose-300/20 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/30"
          onClick={() =>
            run(async () => {
              await deleteDb();
              setRows([]);
            })
          }
        >
          Delete DB
        </button>
      </div>

      <p className="text-sm text-white/70">
        The migration adds <code>createdAt</code> to every existing todo during <code>onupgradeneeded</code> when opening
        DB version 2.
      </p>

      {msg ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white/80">
          Result: <code>{msg}</code>
        </div>
      ) : null}

      <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-white/80">
{JSON.stringify(rows, null, 2)}
      </pre>
    </div>
  );
}

