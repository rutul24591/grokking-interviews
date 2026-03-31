import PeerRoomBoard from "./peer-room-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#ecfeff_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Use a signaling server to establish direct peer paths</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app models the full WebRTC control plane: clients join a room, exchange offers and ICE candidates through signaling, then transition to a direct peer session.
        </p>
        <PeerRoomBoard />
      </div>
    </main>
  );
}
