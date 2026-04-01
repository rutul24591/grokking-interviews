"use client";

import { useEffect, useState } from "react";

type MfaState = {
  setupStarted: boolean;
  enrolled: boolean;
  secret: string;
  challengeCode: string;
  backupCodesRemaining: number;
  trustedDeviceEnabled: boolean;
  attemptsRemaining: number;
  enrollmentStage: "idle" | "qr-issued" | "verified";
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<MfaState | null>(null);
  const [code, setCode] = useState("258147");
  const [trustDevice, setTrustDevice] = useState(true);

  async function refresh() {
    const response = await fetch("/api/mfa/state");
    setState((await response.json()) as MfaState);
  }

  async function setup() {
    const response = await fetch("/api/mfa/setup", { method: "POST" });
    setState((await response.json()) as MfaState);
  }

  async function verify() {
    const response = await fetch("/api/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, trustDevice })
    });
    setState((await response.json()) as MfaState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">MFA Enrollment Workbench</h1>
      <p className="mt-2 text-slate-300">
        Start factor enrollment, inspect the shared secret, verify the one-time code, and confirm backup-code posture.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[360px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={setup} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
            Start MFA setup
          </button>
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">Shared secret</div>
            <div className="mt-2 font-mono text-slate-100">{state?.secret}</div>
            <div className="mt-3 text-xs text-slate-400">Enrollment stage: {state?.enrollmentStage}</div>
          </div>
          <label className="mt-5 block">Authenticator code</label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono"
          />
          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(event) => setTrustDevice(event.target.checked)}
            />
            Mark this device as trusted after enrollment
          </label>
          <button onClick={verify} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">
            Verify code
          </button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
              <div className="text-xs uppercase tracking-wide text-slate-400">Enrollment status</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{state?.enrolled ? "Enrolled" : "Pending"}</div>
              <div className="mt-2">Attempts remaining: {state?.attemptsRemaining ?? 0}</div>
            </div>
            <div className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
              <div className="text-xs uppercase tracking-wide text-slate-400">Recovery posture</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{state?.backupCodesRemaining ?? 0} backup codes</div>
              <div className="mt-2">Trusted device: {state?.trustedDeviceEnabled ? "enabled" : "disabled"}</div>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">Operator guidance</div>
            <ul className="mt-3 space-y-2">
              <li>1. Start setup and register the shared secret in the authenticator app.</li>
              <li>2. Verify the first one-time code before enforcing MFA at sign-in.</li>
              <li>3. Confirm backup-code inventory before considering enrollment complete.</li>
            </ul>
            <p className="mt-4">{state?.lastMessage}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
