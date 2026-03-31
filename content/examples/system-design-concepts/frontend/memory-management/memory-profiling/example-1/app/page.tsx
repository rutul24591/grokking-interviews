import MemoryProfilingLab from "./memory-profiling-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#f0fdf4_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Profile heap growth and snapshot diffs</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app compares memory snapshots so you can see which retainers shrink after cleanup and which ones continue to grow.</p>
        <MemoryProfilingLab />
      </div>
    </main>
  );
}
