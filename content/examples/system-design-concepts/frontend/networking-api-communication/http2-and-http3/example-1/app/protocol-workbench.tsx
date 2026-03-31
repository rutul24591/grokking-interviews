"use client";

import { useState } from "react";

type AssetTiming = {
  name: string;
  sizeKb: number;
  durationMs: number;
};

const protocolLabels = [
  { key: "h1", label: "HTTP/1.1", tint: "bg-rose-50 text-rose-700" },
  { key: "h2", label: "HTTP/2", tint: "bg-sky-50 text-sky-700" },
  { key: "h3", label: "HTTP/3", tint: "bg-emerald-50 text-emerald-700" }
] as const;

export default function ProtocolWorkbench() {
  const [activeProtocol, setActiveProtocol] = useState<(typeof protocolLabels)[number]["key"]>("h2");
  const [report, setReport] = useState<{
    protocol: string;
    totalMs: number;
    observations: string[];
    assets: AssetTiming[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(protocol: (typeof protocolLabels)[number]["key"]) {
    setActiveProtocol(protocol);
    setReport(null);
    setError(null);
    const startedAt = performance.now();

    try {
      const response = await fetch(`http://localhost:4350/session?protocol=${protocol}`, { cache: "no-store" });
      if (!response.body) {
        throw new Error("Readable stream unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assets: AssetTiming[] = [];
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          assets.push(JSON.parse(line) as AssetTiming);
          setReport({
            protocol,
            totalMs: Math.round(performance.now() - startedAt),
            observations: [],
            assets: [...assets]
          });
        }
      }

      const summaryResponse = await fetch(`http://localhost:4350/summary?protocol=${protocol}`, { cache: "no-store" });
      const summary = (await summaryResponse.json()) as { observations: string[] };
      setReport({
        protocol,
        totalMs: Math.round(performance.now() - startedAt),
        observations: summary.observations,
        assets
      });
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  const currentLabel = protocolLabels.find((item) => item.key === activeProtocol);

  return (
    <section className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-3">
        {protocolLabels.map((protocol) => (
          <button
            key={protocol.key}
            type="button"
            onClick={() => void run(protocol.key)}
            className={`rounded-full px-4 py-3 text-sm font-semibold ${activeProtocol === protocol.key ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
          >
            Run {protocol.label}
          </button>
        ))}
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-700">{error}</div> : null}

      {!report && !error ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Choose a protocol to run a live streamed asset session.
        </div>
      ) : null}

      {report ? (
        <>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${currentLabel?.tint}`}>{currentLabel?.label}</div>
            <p className="mt-4 text-4xl font-semibold">{report.totalMs} ms</p>
            <p className="mt-2 text-sm text-slate-600">Measured browser time for the streamed article asset session.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Streamed asset timeline</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {report.assets.map((asset) => (
                <li key={asset.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>{asset.name} · {asset.sizeKb} KB</span>
                  <span>{asset.durationMs} ms</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Transport observations</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {report.observations.map((observation) => (
                <li key={observation} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {observation}
                </li>
              ))}
            </ul>
          </article>
        </>
      ) : null}
    </section>
  );
}
