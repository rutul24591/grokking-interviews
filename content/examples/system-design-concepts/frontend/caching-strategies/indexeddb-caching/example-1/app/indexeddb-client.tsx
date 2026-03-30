"use client";

import { useState } from "react";

async function openDb() {
  return await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('cache-strategy-demo', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('articles', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function IndexedDbCacheClient() {
  const [status, setStatus] = useState('No cache action yet');
  const [offlineMode, setOfflineMode] = useState(false);

  async function seed() {
    const db = await openDb();
    const tx = db.transaction('articles', 'readwrite');
    tx.objectStore('articles').put({ id: 'a1', title: 'Large offline article', cachedAt: Date.now() });
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
    setStatus('Stored article a1 in IndexedDB');
  }

  async function read() {
    const db = await openDb();
    const tx = db.transaction('articles', 'readonly');
    const request = tx.objectStore('articles').get('a1');
    request.onsuccess = () => setStatus(`Loaded ${request.result?.title ?? 'nothing'}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">IndexedDB caching</p>
        <h1 className="mt-2 text-3xl font-semibold">Large client cache demo</h1>
        <div className="mt-6 flex gap-3">
          <button className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950" onClick={() => void seed()}>Seed cache</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => void read()}>Read cache</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => setOfflineMode((value) => !value)}>{offlineMode ? "Offline read path" : "Online read path"}</button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{status}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">{offlineMode ? "Serving large article data from IndexedDB because the network path is unavailable." : "IndexedDB acts as the durable local cache for later offline reads."}</div>
        </div>
      </section>
    </main>
  );
}
