import HashRouterLab from "./hash-router-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Hash-based routing for static-hosted flows</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app demonstrates client-only route state anchored in the hash fragment, including the operational tradeoffs of static hosting.</p>
        <HashRouterLab />
      </div>
    </main>
  );
}
