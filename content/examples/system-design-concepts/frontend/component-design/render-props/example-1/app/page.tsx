import RenderPropsLab from "./render-props-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#f0fdf4_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Use render props for customizable shared behavior</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app shares a filterable article-loading state machine once and renders it as cards, briefings, and recommendation summaries through render callbacks.
        </p>
        <RenderPropsLab />
      </div>
    </main>
  );
}
