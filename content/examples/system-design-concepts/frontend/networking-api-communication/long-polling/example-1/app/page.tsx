import LongPollingBoard from "./long-polling-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Keep the connection open until the next article event is ready</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This dashboard publishes editorial events to a Node origin and uses long polling to deliver them without a permanent socket.
        </p>
        <LongPollingBoard />
      </div>
    </main>
  );
}
