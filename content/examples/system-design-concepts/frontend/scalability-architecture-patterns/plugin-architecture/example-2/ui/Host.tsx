"use client";

import { useMemo, useState } from "react";
import { createHost } from "@/lib/host";
import { PublisherPlugin, ReaderPlugin } from "@/lib/plugins";

export function Host() {
  const [selected, setSelected] = useState<"reader" | "publisher">("reader");

  const plugin = selected === "reader" ? ReaderPlugin : PublisherPlugin;
  const host = useMemo(() => createHost(plugin), [plugin]);

  const [result, setResult] = useState<string>("");

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Run plugin</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="p"
            checked={selected === "reader"}
            onChange={() => setSelected("reader")}
          />
          Reader (read-content)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="p"
            checked={selected === "publisher"}
            onChange={() => setSelected("publisher")}
          />
          Publisher (publish)
        </label>
      </div>

      <button
        type="button"
        className="mt-4 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        onClick={() => {
          try {
            const r = plugin.run(host.api);
            setResult(`${r.ok ? "OK" : "ERR"}: ${r.message}`);
          } catch (e) {
            setResult(`ERR: ${(e as Error).message}`);
          }
        }}
      >
        Run
      </button>

      <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
        <p>
          Manifest: <code>{host.manifest.id}</code> · capabilities {host.manifest.capabilities.join(", ") || "none"}
        </p>
        <p className="mt-2">
          Result: <span className="font-semibold text-slate-100">{result || "(none)"}</span>
        </p>
      </div>
    </section>
  );
}

