"use client";

import { useMemo, useState } from "react";
import { orientationPolicies, orientationRecovery, orientationSessions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [sensorMode, setSensorMode] = useState(false);
  const [rotationBurst, setRotationBurst] = useState(false);
  const session = orientationSessions[selected];

  const layoutPlan = useMemo(() => {
    if (session.permission === "denied") return "Do not depend on sensors. Keep a manual orientation switch and safe static composition.";
    if (!sensorMode) return "Sensor features are disabled. Keep the base responsive layout and wait for explicit opt-in.";
    if (rotationBurst) return "Freeze non-critical panels, debounce media resizing, and avoid tearing during rapid rotation.";
    return session.orientation === "landscape"
      ? "Expand the media pane, pin controls to the lower rail, and compact metadata."
      : "Keep article-first portrait layout with reduced chrome and accessible touch targets.";
  }, [rotationBurst, sensorMode, session]);

  const permissionMessage = useMemo(() => {
    if (session.permission === "prompt") return "Permission is not yet granted. Offer the request only from a user action such as tapping rotate mode.";
    if (session.permission === "granted") return `Sensor is available. Last stable rotation happened ${session.lastRotationMs}ms ago.`;
    return "Sensor access is denied. Fallback layout must be complete and non-degraded.";
  }, [session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Device orientation console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Model permission flow, orientation-aware layout changes, and safe fallback behavior for motion-sensitive mobile surfaces.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {orientationSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={sensorMode} onChange={(event) => setSensorMode(event.target.checked)} /> Enable orientation-aware layout</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={rotationBurst} onChange={(event) => setRotationBurst(event.target.checked)} /> Simulate rapid rotation burst</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Session snapshot</div>
                <p className="mt-2">Orientation: {session.orientation}</p>
                <p className="mt-2">Tilt: {session.tilt}°</p>
                <p className="mt-2">Active pane: {session.activePane}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Permission status</div>
                <p className="mt-2">{permissionMessage}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Layout plan</div>
              <p className="mt-2">{layoutPlan}</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{orientationPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery playbook</div><ul className="mt-2 space-y-2">{orientationRecovery.map((item) => <li key={item.risk}><span className="font-medium text-slate-100">{item.risk}:</span> {item.action}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Fallback readiness</div><p className="mt-2">{session.fallbackReady ? "Fallback layout is prepared for denied sensors and unsupported browsers." : "Fallback is missing. Shipping would strand denied-sensor users."}</p></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
