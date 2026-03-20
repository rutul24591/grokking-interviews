import { Controls } from "@/components/Controls";
import { getRequestOrigin } from "@/lib/origin";

export const revalidate = 3600;

type OriginState = { version: number; updatedAt: string; message: string };

async function getOriginState(origin: string) {
  const res = await fetch(`${origin}/api/origin`, {
    next: { tags: ["content"], revalidate },
  });
  if (!res.ok) throw new Error(`Origin failed (${res.status})`);
  return (await res.json()) as OriginState;
}

export default async function Page() {
  const origin = getRequestOrigin();
  const state = await getOriginState(origin);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">On-demand revalidation</h1>
        <p className="mt-1 text-sm text-slate-300">
          Cached for up to <span className="font-mono">{revalidate}s</span> unless you call revalidate.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Cached snapshot
          </div>
          <div className="mt-3 text-sm text-slate-100">
            Version: <span className="font-mono">{state.version}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Updated at origin: {new Date(state.updatedAt).toLocaleString()}
          </div>
          <div className="mt-3 text-sm text-slate-200">{state.message}</div>
        </div>

        <Controls />
      </div>
    </main>
  );
}

