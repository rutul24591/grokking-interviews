import Link from "next/link";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">SSG Preview Mode</h1>
        <p className="mt-1 text-sm text-slate-300">
          Open the published post, then enable draft mode to preview changes without rebuilding.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <Link href="/posts/hello-world" className="text-sm font-semibold text-slate-100 hover:underline">
            View post: hello-world
          </Link>
          <div className="mt-3 text-xs text-slate-500">
            Enable draft mode via <span className="font-mono">/api/draft?secret=dev</span>.
          </div>
        </div>
      </div>
    </main>
  );
}

