import Demo from "@/app/_components/Demo";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Selective Hydration: Event Types</h1>
        <p className="mt-1 text-sm text-slate-300">
          Discrete events (click) vs continuous events (mousemove) around a suspended hydration boundary.
        </p>
        <div className="mt-6">
          <Demo />
        </div>
      </div>
    </main>
  );
}

