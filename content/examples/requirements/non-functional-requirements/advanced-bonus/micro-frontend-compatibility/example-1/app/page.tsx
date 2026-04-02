"use client";

import { useEffect, useMemo, useState } from "react";
import { installHostContract, type HostEvent } from "@/lib/host";

function loadRemote(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function fetchToken(audience?: string) {
  const url = audience ? `/api/token?aud=${encodeURIComponent(audience)}` : "/api/token";
  const res = await fetch(url);
  const json = (await res.json()) as { token: string };
  return json.token;
}

export default function Page() {
  const [remote, setRemote] = useState<"profile-v1" | "profile-v2">("profile-v1");
  const [events, setEvents] = useState<HostEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const contract = installHostContract({
      fetchToken,
      onEvent: (e) => setEvents((prev) => [e, ...prev].slice(0, 50)),
    });
    contract.emit({ type: "telemetry", name: "host_ready", value: contract.version, remote: "host" });
  }, []);

  useEffect(() => {
    setError("");
    // Note: customElements can't redefine the same tag without a full page reload.
    // For the demo, switching remotes is best done via refresh.
    loadRemote(`/remotes/${remote}.js`).catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [remote]);

  const navigateEvents = useMemo(() => events.filter((e) => e.type === "navigate"), [events]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Micro-frontend Compatibility</h1>
        <p className="mt-2 text-slate-300">
          Host shell loads a remote custom-element microfrontend and communicates via a versioned contract.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">Important limitation</div>
          <p className="mt-1 text-slate-300">
            Custom elements can’t be re-defined under the same tag without a reload. Switch remote then refresh.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Remote</h2>
          <select
            className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={remote}
            onChange={(e) => setRemote(e.target.value as any)}
          >
            <option value="profile-v1">profile-v1</option>
            <option value="profile-v2">profile-v2</option>
          </select>

          <div className="mt-5 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Last navigation</div>
            <div className="mt-2 text-xs text-slate-300">
              {navigateEvents[0] ? (
                <span className="font-mono">{(navigateEvents[0] as any).to}</span>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Host shell</h2>
          <p className="mt-1 text-sm text-slate-300">
            The host embeds a microfrontend as a custom element.
          </p>

          <div className="mt-4">
            {/* The remote defines this element */}
            <mf-profile user-id="u-123" theme="dark"></mf-profile>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-200">Event log</h3>
            <div className="mt-2 space-y-2">
              {events.map((e, idx) => (
                <div key={idx} className="rounded border border-slate-800 bg-black/30 p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-slate-300">{e.ts}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-semibold text-slate-200">
                      {e.type}
                    </span>
                  </div>
                  <pre className="mt-2 overflow-auto rounded bg-black/40 p-2 text-slate-100">
{JSON.stringify(e, null, 2)}
                  </pre>
                </div>
              ))}
              {!events.length ? (
                <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                  No events yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

