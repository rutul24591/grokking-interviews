"use client";

import { useMemo, useState } from "react";
import { peerSessions, webrtcPolicies, webrtcRecovery } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [retryIce, setRetryIce] = useState(false);
  const session = peerSessions[selected];

  const callPlan = useMemo(() => {
    if (session.iceState === "failed") return "Connection is broken. Retry ICE, downgrade to audio-only, and keep the user in a reconnecting call shell.";
    if (session.renegotiationPending) return "Renegotiation is active. Freeze extra device toggles and show the current offer/answer progress.";
    if (!videoEnabled) return "Video is disabled manually. Keep audio flowing and preserve peer state so video can resume without a full reconnect.";
    return "Peer session is healthy. Maintain device controls and monitor ICE drift in the background.";
  }, [retryIce, session, videoEnabled]);

  const stateSummary = useMemo(() => {
    if (retryIce && session.iceState !== "connected") return "ICE retry in progress. Keep the call shell stable while candidate gathering restarts.";
    return `Signaling ${session.signalingState}, ICE ${session.iceState}, media ${session.mediaState}.`;
  }, [retryIce, session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">WebRTC peer session console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review signaling, ICE, media flow, and fallback strategies for peer-to-peer media sessions.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {peerSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={videoEnabled} onChange={(event) => setVideoEnabled(event.target.checked)} /> Video enabled</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={retryIce} onChange={(event) => setRetryIce(event.target.checked)} /> Retry ICE</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Peer session</div>
                <p className="mt-2">Local device: {session.localDevice}</p>
                <p className="mt-2">Remote device: {session.remoteDevice}</p>
                <p className="mt-2">Renegotiation pending: {session.renegotiationPending ? "yes" : "no"}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Transport states</div>
                <p className="mt-2">Signaling: {session.signalingState}</p>
                <p className="mt-2">ICE: {session.iceState}</p>
                <p className="mt-2">Media: {session.mediaState}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Call plan</div><p className="mt-2">{callPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">State summary</div><p className="mt-2">{stateSummary}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{webrtcPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{webrtcRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
