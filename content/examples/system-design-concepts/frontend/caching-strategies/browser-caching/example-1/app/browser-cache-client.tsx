"use client";

import { useState } from "react";

export function BrowserCacheClient() {
  const [responseInfo, setResponseInfo] = useState<string>('No request yet');

  async function loadProduct() {
    const etag = window.sessionStorage.getItem('browser-cache-etag') ?? '';
    const response = await fetch('/api/product', {
      headers: etag ? { 'If-None-Match': etag } : {}
    });
    const nextEtag = response.headers.get('etag');
    if (nextEtag) window.sessionStorage.setItem('browser-cache-etag', nextEtag);
    setResponseInfo(`${response.status} · cache-control=${response.headers.get('cache-control')} · etag=${nextEtag}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Browser caching</p>
        <h1 className="mt-2 text-3xl font-semibold">Header inspection lab</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">HTML policy: <code>no-cache</code></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">API policy: <code>private, max-age=0, must-revalidate</code></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Asset policy: <code>public, max-age=31536000, immutable</code></div>
        </div>
        <button className="mt-6 rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950" onClick={() => void loadProduct()}>Call conditional API</button>
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{responseInfo}</div>
      </section>
    </main>
  );
}
