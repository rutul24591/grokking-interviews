export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Robots policy</h1>
      <p className="text-sm opacity-80">
        Visit <code>/robots.txt</code>. In non-prod environments we disallow all indexing.
      </p>
    </main>
  );
}

