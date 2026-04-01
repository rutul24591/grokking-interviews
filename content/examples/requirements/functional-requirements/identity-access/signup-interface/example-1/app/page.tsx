"use client";

import { useEffect, useState } from "react";

type SignupState = {
  submitted: boolean;
  email: string;
  invited: boolean;
  pendingVerification: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SignupState | null>(null);
  const [email, setEmail] = useState("candidate@example.com");
  const [password, setPassword] = useState("StrongerPass!42");
  const [invited, setInvited] = useState(false);

  async function refresh() {
    const response = await fetch("/api/signup/state");
    setState((await response.json()) as SignupState);
  }

  async function submit() {
    const response = await fetch("/api/signup/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, invited })
    });
    setState((await response.json()) as SignupState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Signup Interface</h1>
      <p className="mt-2 text-slate-300">Collect registration details, handle invite-based signup, and move the account into verification state.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" />
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={invited} onChange={(event) => setInvited(event.target.checked)} />Account was pre-invited</label>
          <button onClick={submit} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Create account</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Submitted: <span className="font-semibold text-slate-100">{state?.submitted ? "yes" : "no"}</span></p>
          <p className="mt-2">Pending verification: <span className="font-semibold text-slate-100">{state?.pendingVerification ? "yes" : "no"}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
