import RetryWorkbench from "./retry-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#ecfccb_100%)] text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Retry transient failures without creating a retry storm</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app calls a flaky article API, applies exponential backoff with jitter, and shows each attempt before the request succeeds.
        </p>
        <RetryWorkbench />
      </div>
    </main>
  );
}
