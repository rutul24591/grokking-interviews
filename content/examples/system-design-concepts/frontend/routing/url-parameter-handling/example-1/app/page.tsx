import UrlParamsLab from "./url-params-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fefce8_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">URL parameter handling for durable application state</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app treats query params as an addressable state contract for search, sorting, pagination, and filters.</p>
        <UrlParamsLab />
      </div>
    </main>
  );
}
