import RestApiBoard from "./rest-api-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#faf5ff_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Model article resources with stable REST semantics</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app browses articles, fetches a single resource by id, and creates comments through explicit nouns, methods, and status codes.
        </p>
        <RestApiBoard />
      </div>
    </main>
  );
}
