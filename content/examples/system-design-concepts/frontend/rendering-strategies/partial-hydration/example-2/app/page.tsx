import EditorSlot from "@/app/_components/EditorSlot";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Partial Hydration: Defer Heavy Islands</h1>
        <p className="mt-1 text-sm text-slate-300">
          Server-render the shell; dynamically import heavy client widgets only when needed.
        </p>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-100">
          <p>
            In content-heavy products, many users read and leave without using heavy interaction widgets (e.g., editors,
            charts). Don’t pay hydration costs unless the user needs them.
          </p>
        </article>

        <EditorSlot />
      </div>
    </main>
  );
}

