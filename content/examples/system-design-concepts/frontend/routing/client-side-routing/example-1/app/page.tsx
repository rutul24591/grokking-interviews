import RoutingWorkbench from "./routing-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Client-side routing without full document reloads</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app simulates route transitions, preserved view state, and router-managed navigation history.</p>
        <RoutingWorkbench />
      </div>
    </main>
  );
}
