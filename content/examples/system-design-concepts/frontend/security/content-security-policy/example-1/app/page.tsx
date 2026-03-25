export default function Page() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">CSP: nonce-based script policy</h1>
        <p className="text-sm text-white/70">
          Open the demo route to see a CSP header with a per-request nonce that allows one inline script and blocks
          another.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <a
          className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          href="/csp-demo"
          target="_blank"
          rel="noreferrer"
        >
          Open CSP demo
        </a>
        <p className="mt-3 text-sm text-white/60">
          Tip: check DevTools → Network → Response headers for <code>content-security-policy</code>.
        </p>
      </section>
    </main>
  );
}

