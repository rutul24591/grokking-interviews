"use client";

import { useEffect, useState } from "react";

type RegistrationState = {
  name: string;
  email: string;
  company: string;
  submitted: boolean;
  reviewRequired: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RegistrationState | null>(null);
  const [name, setName] = useState("Avery Quinn");
  const [email, setEmail] = useState("avery@example.com");
  const [company, setCompany] = useState("Acme Corp");
  const [employeeCount, setEmployeeCount] = useState(1200);

  async function refresh() {
    const response = await fetch("/api/registration/state");
    setState((await response.json()) as RegistrationState);
  }

  async function submit() {
    const response = await fetch("/api/registration/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, employeeCount })
    });
    setState((await response.json()) as RegistrationState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">User Registration</h1>
      <p className="mt-2 text-slate-300">Capture registration details, classify enterprise onboarding, and transition the user into the next provisioning step.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Company</label>
          <input value={company} onChange={(event) => setCompany(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Employee count</label>
          <input type="number" value={employeeCount} onChange={(event) => setEmployeeCount(Number(event.target.value))} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={submit} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Submit registration</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Submitted: <span className="font-semibold text-slate-100">{state?.submitted ? "yes" : "no"}</span></p>
          <p className="mt-2">Enterprise review required: <span className="font-semibold text-slate-100">{state?.reviewRequired ? "yes" : "no"}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
