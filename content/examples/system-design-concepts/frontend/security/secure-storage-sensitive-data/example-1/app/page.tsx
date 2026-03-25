"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [lsValue, setLsValue] = useState("demo-token-in-localStorage");
  const [cookieStatus, setCookieStatus] = useState<any>(null);
  const [docCookie, setDocCookie] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem("access_token", lsValue);
    } catch {}
    setDocCookie(document.cookie);
  }, [lsValue]);

  async function setHttpOnlyCookie() {
    await fetch("/api/set-cookie", { method: "POST" });
    await refreshCookieStatus();
    setDocCookie(document.cookie);
  }

  async function refreshCookieStatus() {
    const res = await fetch("/api/read-cookie", { cache: "no-store" });
    setCookieStatus(await res.json().catch(() => null));
  }

  function simulateXssSteal() {
    const stolen = localStorage.getItem("access_token");
    alert(`Simulated XSS exfiltration: localStorage.access_token = ${stolen}`);
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Secure storage: HttpOnly cookies vs localStorage</h1>
        <p className="text-sm text-white/70">
          XSS can read localStorage. HttpOnly cookies do not appear in <code>document.cookie</code>.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">localStorage (JS-readable)</h2>
          <input
            value={lsValue}
            onChange={(e) => setLsValue(e.target.value)}
            className="mt-3 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={simulateXssSteal}
            className="mt-3 rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400"
          >
            Simulate XSS stealing localStorage token
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">HttpOnly cookie (JS-not-readable)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={setHttpOnlyCookie}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Set HttpOnly cookie
            </button>
            <button
              onClick={refreshCookieStatus}
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Check cookie (server-side)
            </button>
          </div>
          <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">
{cookieStatus ? JSON.stringify(cookieStatus, null, 2) : "—"}
          </pre>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">document.cookie</h2>
        <div className="mt-3 rounded bg-black/20 p-3 text-xs whitespace-pre-wrap">{docCookie || "(empty)"}</div>
        <p className="mt-2 text-sm text-white/60">
          The HttpOnly cookie does not show up here, but the server can still read it on requests.
        </p>
      </section>
    </main>
  );
}

