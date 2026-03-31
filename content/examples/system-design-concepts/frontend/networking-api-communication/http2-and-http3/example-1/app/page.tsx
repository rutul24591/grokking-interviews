import ProtocolWorkbench from "./protocol-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Compare HTTP/1.1, HTTP/2, and HTTP/3 under the same article page workload</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This lab loads the same asset graph through three transport profiles and highlights where multiplexing, connection reuse,
          and QUIC help or do not help.
        </p>
        <ProtocolWorkbench />
      </div>
    </main>
  );
}
