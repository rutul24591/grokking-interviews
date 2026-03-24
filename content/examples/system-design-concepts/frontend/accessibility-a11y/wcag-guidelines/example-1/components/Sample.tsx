export function Sample({ bad }: { bad: boolean }) {
  return (
    <div className="space-y-5">
      <a className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black" href="#main">
        Skip to main content
      </a>

      <header className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h1 className="text-xl font-semibold">Sample screen</h1>
        <p className="mt-1 text-sm text-slate-300">Toggle bad variant to introduce common WCAG failures.</p>
      </header>

      <main id="main" tabIndex={-1} className="rounded-lg border border-white/10 bg-white/5 p-4 outline-none">
        <h2 className="text-lg font-semibold">Main content</h2>
        <form className="mt-4 space-y-3">
          {bad ? (
            <>
              <input className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="Email" />
              <button className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30">
                <span aria-hidden="true">🔍</span>
              </button>
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" />
            </>
          ) : (
            <>
              <label className="text-sm font-semibold text-slate-100" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                placeholder="name@company.com"
                autoComplete="email"
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30"
              >
                Search
              </button>
              <img
                alt="Decorative placeholder"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              />
            </>
          )}
        </form>
      </main>
    </div>
  );
}

