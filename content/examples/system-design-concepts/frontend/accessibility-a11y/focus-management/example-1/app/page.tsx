import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-6">
      <header>
        <h1 id="route-title" tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none">
          Home
        </h1>
        <p className="mt-2 text-slate-300">
          Navigate to other pages with the links. After navigation, focus moves to the new page’s main heading.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <p className="mt-2 text-sm text-slate-300">Demonstrates focus move on route change.</p>
          <p className="mt-4">
            <Link className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30" href="/inbox">
              Go to Inbox
            </Link>
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">Settings</h2>
          <p className="mt-2 text-sm text-slate-300">Also uses route heading focus + polite announcement.</p>
          <p className="mt-4">
            <Link className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30" href="/settings">
              Go to Settings
            </Link>
          </p>
        </article>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Why staff engineers care</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            SPAs can “trap” focus on navigation links, making screen reader users re-traverse headers repeatedly.
          </li>
          <li>Focus-on-navigation is a cross-cutting platform concern; implement once in the app shell.</li>
        </ul>
      </section>
    </section>
  );
}

