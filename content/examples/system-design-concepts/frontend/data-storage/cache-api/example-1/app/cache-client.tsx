"use client";

import { useState } from "react";

const CACHE = "article-cache-v1";

export function CacheClient() {
  const [entries, setEntries] = useState<string[]>([]);
  const [status, setStatus] = useState("No cache action yet");

  async function refresh() {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    setEntries(keys.map((key) => key.url));
  }

  async function addEntry() {
    const cache = await caches.open(CACHE);
    const req = new Request("https://example.local/article/system-design");
    const res = new Response(JSON.stringify({ title: "System design notes", at: new Date().toISOString() }), {
      headers: { "Content-Type": "application/json" }
    });
    await cache.put(req, res);
    await refresh();
    setStatus("Stored request/response pair in Cache API.");
  }

  async function clearEntries() {
    await caches.delete(CACHE);
    setEntries([]);
    setStatus("Deleted cache namespace.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" onClick={() => void addEntry()}>Add cached response</button>
        <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" onClick={() => void refresh()}>Refresh list</button>
        <button className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 font-semibold text-white" onClick={() => void clearEntries()}>Delete cache</button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="rounded-md border border-white/10 bg-black/20 p-3">{status}</div>
        {entries.map((entry) => (
          <div key={entry} className="rounded-md border border-white/10 bg-black/20 p-3">{entry}</div>
        ))}
      </div>
    </div>
  );
}
