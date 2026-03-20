import { headers } from "next/headers";

export const revalidate = 20;

async function getOrigin() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${proto}://${host ?? "localhost:3000"}`;
}

export default async function PublicPage() {
  const origin = await getOrigin();
  const res = await fetch(`${origin}/api/public-content`, {
    next: { revalidate, tags: ["public"] },
  });
  const data = await res.json();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Public (ISR)</h1>
        <p className="mt-1 text-sm text-slate-300">
          Cache window: <span className="font-mono">{revalidate}s</span>
        </p>
        <pre className="mt-6 overflow-auto rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-100">
          {JSON.stringify(data, null, 2)}
        </pre>
        <div className="mt-4 text-xs text-slate-500">
          This route is safe to share/cache because it doesn’t depend on cookies/session.
        </div>
      </div>
    </main>
  );
}

