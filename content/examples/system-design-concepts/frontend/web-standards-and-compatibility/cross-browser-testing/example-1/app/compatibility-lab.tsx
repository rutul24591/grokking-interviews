"use client";

import { useMemo, useState } from "react";

const journeys = [
  {
    id: "auth",
    name: "Authentication",
    cases: {
      Chrome: { status: "pass", note: "SSO redirect and cookie hand-off verified." },
      Safari: { status: "warn", note: "Storage partitioning changes remembered-login behavior." },
      Firefox: { status: "pass", note: "No engine-specific blockers." },
    },
  },
  {
    id: "composer",
    name: "Rich editor",
    cases: {
      Chrome: { status: "pass", note: "Clipboard and drag/drop flows stable." },
      Safari: { status: "fail", note: "Paste-from-Docs formatting strips nested lists." },
      Firefox: { status: "warn", note: "Selection restore differs after emoji insert." },
    },
  },
  {
    id: "upload",
    name: "Media upload",
    cases: {
      Chrome: { status: "pass", note: "Chunk retry and progress events match expectations." },
      Safari: { status: "warn", note: "Large HEIC uploads need alternate preview path." },
      Firefox: { status: "pass", note: "Drag/drop and camera capture validated." },
    },
  },
] as const;

const browsers = ["Chrome", "Safari", "Firefox"] as const;

export function CompatibilityLab() {
  const [selectedBrowser, setSelectedBrowser] = useState<(typeof browsers)[number]>("Safari");
  const [showOnlyGaps, setShowOnlyGaps] = useState(false);
  const [releaseMode, setReleaseMode] = useState<"blocked" | "mitigate" | "ship">("mitigate");

  const filteredJourneys = useMemo(
    () =>
      journeys.filter((journey) => {
        if (!showOnlyGaps) return true;
        return journey.cases[selectedBrowser].status !== "pass";
      }),
    [selectedBrowser, showOnlyGaps],
  );

  const summary = useMemo(() => {
    const statuses = journeys.map((journey) => journey.cases[selectedBrowser].status);
    return {
      pass: statuses.filter((status) => status === "pass").length,
      warn: statuses.filter((status) => status === "warn").length,
      fail: statuses.filter((status) => status === "fail").length,
    };
  }, [selectedBrowser]);

  const defects = useMemo(
    () =>
      journeys
        .filter((journey) => journey.cases[selectedBrowser].status !== "pass")
        .map((journey) => ({
          journey: journey.name,
          severity: journey.cases[selectedBrowser].status === "fail" ? "P1" : "P2",
          action:
            journey.cases[selectedBrowser].status === "fail"
              ? "Block release or land a workaround before ship."
              : "Document mitigation and monitor in post-release QA.",
        })),
    [selectedBrowser],
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Cross-browser testing</p>
            <h1 className="mt-2 text-3xl font-semibold">Compatibility release lab</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Review critical journeys per browser engine, isolate risky gaps, and decide whether the release
              should ship with a workaround, reduced support, or a blocker.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={selectedBrowser}
              onChange={(event) => setSelectedBrowser(event.target.value as (typeof browsers)[number])}
            >
              {browsers.map((browser) => (
                <option key={browser} value={browser}>
                  {browser}
                </option>
              ))}
            </select>
            <button
              className={`rounded-2xl px-4 py-3 ${showOnlyGaps ? "bg-cyan-400 font-medium text-slate-950" : "border border-slate-700"}`}
              onClick={() => setShowOnlyGaps((value) => !value)}
            >
              {showOnlyGaps ? "Showing gaps" : "Show only gaps"}
            </button>
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={releaseMode}
              onChange={(event) => setReleaseMode(event.target.value as "blocked" | "mitigate" | "ship")}
            >
              <option value="blocked">Blocked release</option>
              <option value="mitigate">Mitigate + ship</option>
              <option value="ship">Ship as-is</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Object.entries(summary).map(([label, count]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{count}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {filteredJourneys.map((journey) => {
              const current = journey.cases[selectedBrowser];
              return (
                <article key={journey.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-medium">{journey.name}</h2>
                      <p className="mt-1 text-sm text-slate-400">{current.note}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        current.status === "pass"
                          ? "bg-emerald-500/15 text-emerald-200"
                          : current.status === "warn"
                            ? "bg-amber-500/15 text-amber-200"
                            : "bg-rose-500/15 text-rose-200"
                      }`}
                    >
                      {current.status}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">Release decision</h2>
              <p className="mt-3 text-sm text-slate-300">
                Current posture: <span className="font-medium capitalize">{releaseMode.replace("-", " ")}</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Use browser-specific gaps and journey severity to choose between blocking, shipping with mitigations,
                or declaring reduced support.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">Defect backlog</h2>
              <div className="mt-4 space-y-3">
                {defects.length ? (
                  defects.map((defect) => (
                    <article key={defect.journey} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{defect.journey}</p>
                        <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-200">
                          {defect.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{defect.action}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No open compatibility defects for this browser.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
