export const runtime = "edge";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Edge Region Routing</h1>
        <p className="mt-2 text-sm text-slate-300">
          This page is usually rewritten by <span className="font-mono">middleware.ts</span>.
        </p>
      </div>
    </main>
  );
}

