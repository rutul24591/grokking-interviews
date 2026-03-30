"use client";
import { useMemo, useState } from "react";
export function FeatureDetectionClient() {
  const [surface, setSurface] = useState<"reader" | "editor" | "offline">("editor");
  const capabilities = useMemo(() => ({
    broadcastChannel: typeof window !== 'undefined' && 'BroadcastChannel' in window,
    serviceWorker: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    fileSystemAccess: typeof window !== 'undefined' && 'showOpenFilePicker' in window
  }), []);
  const recommendation = useMemo(() => {
    if (surface === "reader") return capabilities.serviceWorker ? "Enable offline article caching." : "Keep plain network-only article reads.";
    if (surface === "editor") return capabilities.fileSystemAccess ? "Offer local draft import/export." : "Fallback to textarea uploads and server drafts.";
    return capabilities.broadcastChannel ? "Sync offline queue state across tabs." : "Use localStorage event fallback with reduced fidelity.";
  }, [capabilities, surface]);
  return <main className="mx-auto min-h-screen max-w-5xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Browser feature detection</p><h1 className="mt-2 text-3xl font-semibold">Capability-based UX lab</h1><p className="mt-2 max-w-3xl text-sm text-slate-400">Drive product decisions from capability checks, not browser branding. Each surface can opt into richer behavior only when the platform supports it.</p></div><select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={surface} onChange={(event) => setSurface(event.target.value as "reader" | "editor" | "offline")}><option value="reader">Reader surface</option><option value="editor">Editor surface</option><option value="offline">Offline surface</option></select></div><div className="mt-6 grid gap-3 md:grid-cols-3">{Object.entries(capabilities).map(([name, supported]) => <article key={name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300"><p className="font-medium">{name}</p><p className="mt-2">{String(supported)}</p></article>)}</div><div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"><article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><h2 className="text-lg font-medium">Decision for {surface}</h2><p className="mt-3 text-sm text-slate-400">{recommendation}</p></article><article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><h2 className="text-lg font-medium">Implementation rule</h2><ul className="mt-3 space-y-2 text-sm text-slate-300"><li>Feature-detect once near the boundary.</li><li>Expose a functional fallback instead of a broken control.</li><li>Log capability gaps so support policy stays intentional.</li></ul></article></div></section></main>;
}
