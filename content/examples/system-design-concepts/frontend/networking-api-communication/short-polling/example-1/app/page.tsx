import ShortPollingBoard from "./short-polling-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fee2e2_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Poll on a timer when freshness requirements are modest</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app polls article status every second, which is simpler than long-lived connections when update frequency is low.
        </p>
        <ShortPollingBoard />
      </div>
    </main>
  );
}
