import { fetchJson } from "@/lib/fetchJson";

type SidebarResponse = {
  source: "sidebar";
  delayMs: number;
  items: { id: string; label: string }[];
  ts: string;
};

export default async function SidebarPanel(props: {
  originApi: string;
  delayMs: number;
}) {
  const url = new URL("/api/sidebar", props.originApi);
  url.searchParams.set("delayMs", String(props.delayMs));
  const data = await fetchJson<SidebarResponse>(url.toString(), { timeoutMs: 6_000 });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Sidebar (slow)
      </div>
      <ul className="mt-3 space-y-2 text-sm text-slate-100">
        {data.items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
            {item.label}
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-slate-500">
        Origin delay: <span className="font-mono">{data.delayMs}ms</span> ·{" "}
        <span className="font-mono">{data.ts}</span>
      </div>
    </div>
  );
}

