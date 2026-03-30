import { ConditionalRefreshClient } from "./refresh-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Periodic refresh with conditional fetch</h1>
      <p className="mt-3 text-white/80">
        Background refresh should be cheap. This example uses <code>ETag</code> and <code>If-None-Match</code> so a
        refresh often costs only a small 304 response instead of a full payload download.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <ConditionalRefreshClient />
      </div>
    </main>
  );
}

