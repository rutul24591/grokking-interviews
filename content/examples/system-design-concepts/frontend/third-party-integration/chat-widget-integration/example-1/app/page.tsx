import ChatWidgetShell from "./chat-widget-shell";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Load support chat only when the user needs it</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app lazy-loads a mock chat provider, passes article context into the widget session, and falls back cleanly when the provider is unavailable.
        </p>
        <ChatWidgetShell />
      </div>
    </main>
  );
}
