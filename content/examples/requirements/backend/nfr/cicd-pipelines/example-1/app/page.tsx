import { getBuildInfo } from "@/lib/buildInfo";

export default function Page() {
  const build = getBuildInfo();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">CI/CD pipelines</h1>
      <p className="mt-2 text-sm text-gray-300">
        This app exposes build identity + health checks that a CI/CD pipeline can gate on.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Build identity</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
          {JSON.stringify(build, null, 2)}
        </pre>
        <div className="mt-4 text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>GET /api/health</code> — basic runtime liveness
          </li>
          <li>
            <code>GET /api/build</code> — build stamping (gitSha, buildId)
          </li>
          <li>
            <code>POST /api/smoke</code> — a minimal “deploy candidate” check
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s http://localhost:3000/api/health | jq
curl -s http://localhost:3000/api/build | jq
curl -s -X POST http://localhost:3000/api/smoke | jq`}
        </pre>
      </div>
    </main>
  );
}

