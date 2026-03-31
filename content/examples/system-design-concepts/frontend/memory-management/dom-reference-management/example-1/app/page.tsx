import RefWorkspace from "./ref-workspace";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Manage DOM refs without leaking stale nodes</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app registers dynamic article section refs, supports focus jumps, and removes stale references when sections disappear.</p>
        <RefWorkspace />
      </div>
    </main>
  );
}
