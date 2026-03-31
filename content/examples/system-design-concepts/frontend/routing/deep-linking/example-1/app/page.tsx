import DeepLinkWorkbench from "./deep-link-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f5f3ff_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Deep links that restore exact view context</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app encodes article identity and view state into shareable links so navigation returns users to the intended context.</p>
        <DeepLinkWorkbench />
      </div>
    </main>
  );
}
