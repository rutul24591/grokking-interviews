import { MergeWorkbench } from "./workbench";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Conflict resolution workbench</h1>
      <p className="mt-3 max-w-3xl text-white/80">
        Compare ancestor, local, and server versions. The merge engine auto-resolves non-overlapping edits and surfaces
        true conflicts for manual choice.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <MergeWorkbench />
      </div>
    </main>
  );
}

