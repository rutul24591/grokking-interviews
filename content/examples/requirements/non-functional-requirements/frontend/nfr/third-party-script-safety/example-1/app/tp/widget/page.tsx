export default function WidgetPage() {
  return (
    <div className="h-full p-4">
      <div className="font-semibold mb-2">Third-party widget (simulated)</div>
      <p className="text-xs text-slate-300">
        This script runs in a sandboxed iframe and communicates via <code className="rounded bg-slate-800 px-1">postMessage</code>.
      </p>
      <button
        id="emit"
        className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
      >
        Emit metric
      </button>
      <script src="/third-party.js"></script>
    </div>
  );
}
