"use client";

import { useEffect, useId, useRef, useState } from "react";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function checkUsernameAvailability(username: string) {
  await sleep(250);
  const taken = new Set(["admin", "support", "root", "test"]);
  return !taken.has(username.toLowerCase());
}

export default function Page() {
  const id = useId();
  const helpId = `${id}-help`;
  const statusId = `${id}-status`;

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [message, setMessage] = useState("");
  const lastRequest = useRef(0);

  useEffect(() => {
    const q = username.trim();
    if (q.length < 3) {
      setStatus("idle");
      setMessage("Enter at least 3 characters.");
      return;
    }

    setStatus("checking");
    setMessage("Checking availability…");

    const reqId = ++lastRequest.current;
    const t = window.setTimeout(() => {
      void (async () => {
        const ok = await checkUsernameAvailability(q);
        if (reqId !== lastRequest.current) return; // stale response
        setStatus(ok ? "available" : "taken");
        setMessage(ok ? "Username is available." : "Username is taken.");
      })();
    }, 250);

    return () => window.clearTimeout(t);
  }, [username]);

  const isInvalid = status === "taken";
  const describedBy = [helpId, statusId].join(" ");

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Async validation with aria-live</h1>
        <p className="mt-2 text-slate-300">
          Status updates should be polite and debounced. Don’t spam screen reader users on every keystroke.
        </p>
      </header>

      <form className="rounded-xl border border-white/10 bg-white/5 p-6" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username" className="text-sm font-semibold text-slate-100">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : undefined}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
          autoComplete="username"
        />
        <p id={helpId} className="mt-2 text-sm text-slate-300">
          Usernames must be unique. We check availability asynchronously.
        </p>

        <div id={statusId} role="status" aria-live="polite" aria-atomic="true" className="mt-2 text-sm">
          <span
            className={[
              "font-semibold",
              status === "taken" ? "text-rose-300" : status === "available" ? "text-emerald-200" : "text-slate-300"
            ].join(" ")}
          >
            {message}
          </span>
        </div>

        <button
          type="submit"
          disabled={isInvalid || status === "checking" || username.trim().length < 3}
          className="mt-6 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30 disabled:opacity-40"
        >
          Continue
        </button>
      </form>
    </main>
  );
}

