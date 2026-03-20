import { API_ORIGIN } from "@/lib/origin";

export const revalidate = 10;

type OriginContent = {
  version: number;
  updatedAt: string;
  headline: string;
  body: string;
};

async function getContent() {
  const res = await fetch(`${API_ORIGIN}/content`, { next: { revalidate } });
  if (!res.ok) throw new Error(`Origin failed (${res.status})`);
  return (await res.json()) as OriginContent;
}

export default async function Page() {
  const content = await getContent();
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Time-based ISR</h1>
        <p className="mt-1 text-sm text-slate-300">
          Revalidate window: <span className="font-mono">{revalidate}s</span>
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Cached content snapshot
          </div>
          <div className="mt-3 text-sm text-slate-100">
            <div>
              Version: <span className="font-mono">{content.version}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Updated at origin: {new Date(content.updatedAt).toLocaleString()}
            </div>
          </div>
          <div className="mt-4 text-lg font-semibold text-slate-100">
            {content.headline}
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
            {content.body}
          </div>

          <form action="/api/publish-origin" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-slate-50 hover:border-indigo-400"
            >
              Publish new version (origin)
            </button>
            <div className="mt-2 text-xs text-slate-500">
              Publishing does NOT revalidate the page; it only changes origin. The page updates after the time window.
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

