"use client";

import { useState } from "react";

type LoginResult = {
  ok: boolean;
  requiresMfa: boolean;
  rememberMe: boolean;
  remainingAttempts?: number;
  message: string;
};

export default function Page() {
  const [email, setEmail] = useState("owner@example.com");
  const [password, setPassword] = useState("CorrectHorseBatteryStaple");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("Submit the form to simulate login UI behavior.");
  const [result, setResult] = useState<LoginResult | null>(null);

  async function submit() {
    const response = await fetch("/api/login-ui/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe })
    });
    const body = (await response.json()) as LoginResult;
    setResult(body);
    setMessage(body.message);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Login Interface</h1>
      <p className="mt-2 text-slate-300">
        Collect primary credentials, show remaining-attempt posture, and indicate whether the next authentication step is MFA.
      </p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" />
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            Remember this device after successful MFA
          </label>
          <button onClick={submit} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Submit login</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Primary authentication: <span className="font-semibold text-slate-100">{result?.ok ? "passed" : "pending / failed"}</span></p>
          <p className="mt-2">MFA required: <span className="font-semibold text-slate-100">{result?.requiresMfa ? "yes" : "no"}</span></p>
          <p className="mt-2">Remaining attempts: <span className="font-semibold text-slate-100">{result?.remainingAttempts ?? "—"}</span></p>
          <p className="mt-4">{message}</p>
        </article>
      </section>
    </main>
  );
}
