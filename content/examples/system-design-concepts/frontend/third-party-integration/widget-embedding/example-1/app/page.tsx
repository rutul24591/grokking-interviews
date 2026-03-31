import WidgetHost from "./widget-host";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#ecfeff_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Embed third-party widgets without giving them host-page control</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app embeds a widget in an iframe, listens for size updates over `postMessage`, and keeps the host shell isolated when the widget misbehaves.
        </p>
        <WidgetHost />
      </div>
    </main>
  );
}
