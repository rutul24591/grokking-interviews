export default function Protected() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Protected action</h1>
      <p className="text-sm text-white/70">
        If you can see this inside an iframe on the attacker page, clickjacking defenses failed.
      </p>
      <button className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white">Dangerous action</button>
    </main>
  );
}

