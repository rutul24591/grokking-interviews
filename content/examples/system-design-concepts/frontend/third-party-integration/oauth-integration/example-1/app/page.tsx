import OAuthWorkbench from "./oauth-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f0fdf4_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Complete the OAuth redirect flow without trusting the browser blindly</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app starts a login redirect, receives a callback code, validates state, exchanges the code through a Node backend, and renders the signed-in user.
        </p>
        <OAuthWorkbench />
      </div>
    </main>
  );
}
