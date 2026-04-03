"use client";

import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

type FeedResult = {
  ok: true;
  mode: "fast" | "slow";
  degraded: boolean;
  data: { posts: { id: string; title: string }[]; source: string; degraded?: boolean };
  report: { slaMs: number; elapsedMs: number; withinSla: boolean; timings: { step: string; ms: number; skipped?: boolean }[] };
};

async function runFeed(mode: "fast" | "slow", slaMs: number): Promise<{ result: FeedResult; serverTiming: string | null }> {
  const res = await fetch(`/api/feed?mode=${mode}&slaMs=${slaMs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return { result: (await res.json()) as FeedResult, serverTiming: res.headers.get("server-timing") };
}

const reviewNotes = [
  "An SLA budget should force a deliberate drop of optional work, not a random timeout.",
  "Degraded mode needs a visible operator signal so incident responders can correlate it with dependencies.",
  "Server-Timing should explain which phase consumed the budget and which phase was skipped.",
];

export default function Page() {
  const [slaMs, setSlaMs] = useState(250);
  const [response, setResponse] = useState<{ result: FeedResult; serverTiming: string | null } | null>(null);
  const [error, setError] = useState("");
  const report = useMemo(() => response?.result.report ?? null, [response]);
  const summary = useMemo(
    () => [
      {
        label: "SLA result",
        value: response ? (response.result.report.withinSla ? "Within target" : "Missed target") : "Not run",
        hint: "Budget misses should surface immediately before customers infer the problem from timeouts.",
      },
      {
        label: "Mode",
        value: response?.result.mode ?? "—",
        hint: "Compare the fast path with the slow dependency path using the same deadline.",
      },
      {
        label: "Elapsed",
        value: report ? `${report.elapsedMs}ms` : "—",
        hint: "Elapsed time matters only when paired with an explanation of degraded behavior.",
      },
    ],
    [report, response],
  );

  async function invoke(mode: "fast" | "slow") {
    setError("");
    try {
      setResponse(await runFeed(mode, slaMs));
    } catch (event) {
      setError(event instanceof Error ? event.message : String(event));
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Latency SLA Drill</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Exercise a deadline-aware backend endpoint and inspect what the service keeps, what it drops, and how the
          degradation is explained. This is the operational view teams need when they promise a p95 target but depend on
          variable downstream systems.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Deadline configuration</h2>
            <p className="mt-1 text-sm text-slate-400">
              Tighten the SLA, then compare a healthy dependency path with a slow one that should enter degraded mode.
            </p>
          </div>
          <label className="space-y-1 text-sm">
            <div className="text-slate-300">SLA budget (ms)</div>
            <input
              className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2"
              type="number"
              value={slaMs}
              onChange={(event) => setSlaMs(Number(event.target.value))}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => invoke("fast")}>Run fast dependency</button>
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={() => invoke("slow")}>Run slow dependency</button>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Review checklist</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {reviewNotes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
            <div className="mt-3 font-mono text-xs text-slate-500">Server-Timing: {response?.serverTiming ?? "—"}</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {summary.map((item) => (
              <SignalCard key={item.label} {...item} />
            ))}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Timing and degradation report</h2>
              <p className="mt-1 text-sm text-slate-400">
                A backend latency drill is only useful if it makes deadline tradeoffs explicit. Use this output to see
                whether optional work was skipped cleanly or whether the service simply ran out of time.
              </p>
            </div>
            <pre className="overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
