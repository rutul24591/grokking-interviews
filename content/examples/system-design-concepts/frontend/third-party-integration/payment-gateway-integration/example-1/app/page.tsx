import PaymentWorkbench from "./payment-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Start checkout in the browser, finish payment state on the backend</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app creates a checkout session, simulates the gateway redirect, and polls the backend until payment state is finalized for the article subscription.
        </p>
        <PaymentWorkbench />
      </div>
    </main>
  );
}
