export default function InboxPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 id="route-title" tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none">
          Inbox
        </h1>
        <p className="mt-2 text-slate-300">The focus manager targets this heading after navigation.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Messages</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Message 1</li>
          <li>Message 2</li>
          <li>Message 3</li>
        </ul>
      </section>
    </section>
  );
}

