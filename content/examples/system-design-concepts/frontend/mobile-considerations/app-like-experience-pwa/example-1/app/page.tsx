"use client";

import { useMemo, useState } from "react";
import { installMoments, pwaPolicies, recoveryPlaybook } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const scenario = installMoments[selected];

  const installDecision = useMemo(() => {
    if (installed) return "Installed state: replace the install CTA with app shortcuts, resume links, and push onboarding.";
    if (!scenario.installEligible) return "Do not show install yet. Let the user finish a meaningful session and warm the shell first.";
    if (scenario.shellStatus !== "healthy") return "Installability is blocked by shell health. Fix offline shell readiness before prompting.";
    return "Show the install prompt contextually after the current reading action completes.";
  }, [installed, scenario]);

  const offlineSummary = useMemo(() => {
    if (!offline) return "Online mode keeps background refresh, reading-pack updates, and queued sync available.";
    if (scenario.shellStatus === "healthy") return `Offline shell is ready. ${scenario.offlineQueueDepth} action(s) remain queued until reconnect.`;
    return "Offline shell is degraded. Serve a minimal reading fallback and suspend queue-heavy actions.";
  }, [offline, scenario]);

  const nextAction = useMemo(() => {
    if (syncInProgress && offline) return "Pause sync and warn that queued saves will flush when the connection returns.";
    if (syncInProgress) return "Sync queued drafts first, then refresh downloaded content packs in the background.";
    return scenario.resumeActions[0];
  }, [offline, scenario, syncInProgress]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">App-like PWA experience lab</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review install timing, offline shell health, queued work, and post-install re-engagement for a reading application.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <label className="block text-xs uppercase tracking-wide text-slate-500">Scenario</label>
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {installMoments.map((moment, index) => (
                <option key={moment.id} value={index}>{moment.label}</option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={installed} onChange={(event) => setInstalled(event.target.checked)} /> Installed</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={offline} onChange={(event) => setOffline(event.target.checked)} /> Offline</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={syncInProgress} onChange={(event) => setSyncInProgress(event.target.checked)} /> Sync queued work</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Engagement snapshot</div>
              <p className="mt-2">{scenario.engagement}</p>
              <p className="mt-2">Shell health: {scenario.shellStatus}</p>
              <p className="mt-2">Push eligible: {scenario.pushEligible ? "yes" : "no"}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Install decision</div>
                <p className="mt-2">{installDecision}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Offline summary</div>
                <p className="mt-2">{offlineSummary}</p>
              </div>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Resume action</div>
              <p className="mt-2">{nextAction}</p>
              <ul className="mt-3 space-y-2">
                {scenario.resumeActions.map((action) => <li key={action}>• {action}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Policies</div>
              <ul className="mt-2 space-y-2">{pwaPolicies.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Recovery playbook</div>
              <ul className="mt-2 space-y-2">
                {recoveryPlaybook.map((entry) => <li key={entry.issue}><span className="font-medium text-slate-100">{entry.issue}:</span> {entry.action}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
