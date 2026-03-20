import CommentsSlot from "@/app/_components/CommentsSlot";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Islands: Hydrate on Visibility</h1>
        <p className="mt-1 text-sm text-slate-300">
          The article is server-rendered. The comments island is imported only when it scrolls near the viewport.
        </p>

        <article className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-100">
          {Array.from({ length: 18 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1}: In an islands architecture, you keep most content static and hydrate only the interactive
              parts. This reduces shipped JS and limits hydration costs to hotspots.
            </p>
          ))}
        </article>

        <div className="mt-6">
          <CommentsSlot />
        </div>
      </div>
    </main>
  );
}

