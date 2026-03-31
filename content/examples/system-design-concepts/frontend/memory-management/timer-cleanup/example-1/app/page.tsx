import TimerCleanupLab from "./timer-cleanup-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Clean up timers when widgets disappear</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app tracks active timers for a polling widget and shows how cleanup affects interval and timeout counts.</p>
        <TimerCleanupLab />
      </div>
    </main>
  );
}
