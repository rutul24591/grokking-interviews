import SseBoard from "./sse-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#ecfeff_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Push one-way article updates with Server-Sent Events</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app streams editorial updates from the origin to the browser through an `EventSource`, without requiring full duplex sockets.
        </p>
        <SseBoard />
      </div>
    </main>
  );
}
