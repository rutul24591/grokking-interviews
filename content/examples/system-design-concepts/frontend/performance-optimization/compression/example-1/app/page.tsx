type CompressionReport = {
  encoding: string;
  rawBytes: number;
  transferredBytes: number;
  note: string;
};

async function getReports(): Promise<CompressionReport[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4130";
  const res = await fetch(`${origin}/reports`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as CompressionReport[];
}

export default async function Page() {
  const reports = await getReports();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f4efe1_100%)] text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Compression</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Text responses benefit heavily from Brotli or gzip. Images and video usually do not. The main question
          is whether transfer savings justify the CPU spent encoding at your traffic shape.
        </p>
        <div className="mt-4 rounded-3xl border border-stone-200 bg-white/80 p-4 text-sm leading-7 text-stone-600">
          This demo exposes a real negotiated endpoint at <code className="font-mono text-xs">/payload</code>. Use
          <code className="ml-1 font-mono text-xs">curl -H 'Accept-Encoding: br' http://localhost:4130/payload -I</code>
          to verify <code className="font-mono text-xs">Content-Encoding</code> and <code className="font-mono text-xs">Vary</code>.
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <article key={report.encoding} className="rounded-[1.6rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{report.encoding}</div>
              <div className="mt-4 text-2xl font-semibold">{report.transferredBytes} bytes</div>
              <div className="mt-1 text-sm text-stone-500">from {report.rawBytes} raw bytes</div>
              <p className="mt-4 text-sm leading-6 text-stone-600">{report.note}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
