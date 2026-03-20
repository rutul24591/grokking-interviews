import { fetchJson } from "@/lib/fetchJson";

type RecommendationsResponse = {
  source: "recommendations";
  delayMs: number;
  items: { id: string; title: string; reason: string }[];
  ts: string;
};

export default async function RecommendationsPanel(props: {
  originApi: string;
  delayMs: number;
}) {
  const url = new URL("/api/recommendations", props.originApi);
  url.searchParams.set("delayMs", String(props.delayMs));
  const data = await fetchJson<RecommendationsResponse>(url.toString(), { timeoutMs: 7_000 });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Recommendations (slower)
      </div>
      <div className="mt-3 grid gap-3">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3"
          >
            <div className="text-sm font-semibold text-slate-100">{item.title}</div>
            <div className="mt-1 text-xs text-slate-400">{item.reason}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Origin delay: <span className="font-mono">{data.delayMs}ms</span> ·{" "}
        <span className="font-mono">{data.ts}</span>
      </div>
    </div>
  );
}

