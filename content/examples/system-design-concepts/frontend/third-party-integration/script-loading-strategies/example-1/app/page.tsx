import ScriptLoadingLab from "./script-loading-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fef3c7_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Load third-party scripts at the right time, not all at once</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app compares eager, deferred, idle, and interaction-triggered script boot so the host page can keep the critical path clean.
        </p>
        <ScriptLoadingLab />
      </div>
    </main>
  );
}
