"use client";

import { useEffect, useState } from "react";

type PhoneVerificationState = {
  phone: string;
  status: "unverified" | "code-sent" | "verified";
  code: string;
  attempts: number;
  resendAvailableIn: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PhoneVerificationState | null>(null);
  const [phone, setPhone] = useState("+1 415 555 0123");
  const [code, setCode] = useState("482911");

  async function refresh() {
    const response = await fetch("/api/phone/state");
    setState((await response.json()) as PhoneVerificationState);
  }

  async function sendCode() {
    const response = await fetch("/api/phone/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    setState((await response.json()) as PhoneVerificationState);
  }

  async function verifyCode() {
    const response = await fetch("/api/phone/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    setState((await response.json()) as PhoneVerificationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Phone Verification Flow</h1>
      <p className="mt-2 text-slate-300">
        Capture a phone number, send a verification code, and confirm possession before enabling SMS-based account recovery.
      </p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Phone number</label>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={sendCode} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Send verification code</button>
          <label className="mt-6 block text-sm text-slate-300">Verification code</label>
          <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono" />
          <button onClick={verifyCode} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Verify phone</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Status: <span className="font-semibold text-slate-100">{state?.status ?? "loading"}</span></p>
          <p className="mt-2">Attempts: <span className="font-semibold text-slate-100">{state?.attempts ?? 0}</span></p>
          <p className="mt-2">Resend cooldown: <span className="font-semibold text-slate-100">{state?.resendAvailableIn ?? 0}s</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
