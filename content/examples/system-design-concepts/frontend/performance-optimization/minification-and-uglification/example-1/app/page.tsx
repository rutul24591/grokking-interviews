import BuildLab from "./build-lab";

type Asset = {
  name: string;
  originalBytes: number;
  minifiedBytes: number;
  gzipBytes: number;
  sourceMapMode: string;
};

async function getAssets(): Promise<Asset[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4190";
  const response = await fetch(`${origin}/assets`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as Asset[];
}

export default async function Page() {
  const assets = await getAssets();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f3f4f6_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Build Output</p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight">
            Minify aggressively, but keep source-map and mangling policies safe for production.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-700">
            This dashboard shows what happens after whitespace removal, identifier mangling, compression, and
            source-map policy selection for a real frontend build.
          </p>
        </header>

        <section className="mt-10 grid gap-6 xl:grid-cols-3">
          {assets.map((asset) => (
            <article key={asset.name} className="rounded-[1.8rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{asset.name}</div>
              <div className="mt-4 text-3xl font-semibold">{asset.minifiedBytes} bytes</div>
              <dl className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <dt>Original</dt>
                  <dd>{asset.originalBytes}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Gzip transfer</dt>
                  <dd>{asset.gzipBytes}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Source maps</dt>
                  <dd>{asset.sourceMapMode}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>

        <BuildLab />
      </div>
    </main>
  );
}
