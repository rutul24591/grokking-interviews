import { headers } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const h = headers();
  const edgeRegion = h.get("x-edge-region") ?? "missing";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Region: {region}</h1>
        <p className="mt-2 text-sm text-slate-300">
          Rewritten at the edge via middleware. Response header{" "}
          <span className="font-mono">x-edge-region</span>:{" "}
          <span className="font-mono">{edgeRegion}</span>
        </p>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Typical Use Cases
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-100">
            <li>Geo routing (closest region)</li>
            <li>Failover routing (route away from unhealthy regions)</li>
            <li>Canary / experiment routing (stable bucketing)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

