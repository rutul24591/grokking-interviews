"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { validateEmail } from "@/lib/validate";

export default function Page() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const error = submitted ? validateEmail(email) : null;

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">ARIA wiring: label + help + error</h1>
        <p className="mt-2 text-slate-300">
          The input’s accessible name comes from <code>&lt;label&gt;</code>; its description comes from help/error
          via <code>aria-describedby</code>.
        </p>
      </header>

      <form
        className="rounded-xl border border-white/10 bg-white/5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field
          label="Work email"
          help="We’ll use this for account recovery and security alerts."
          error={error ?? undefined}
        >
          {(props) => (
            <input
              {...props}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              inputMode="email"
              autoComplete="email"
              placeholder="name@company.com"
            />
          )}
        </Field>

        <button
          type="submit"
          className="mt-6 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          Continue
        </button>
      </form>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Notes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Prefer visible labels. <code>aria-label</code> is a last resort.
          </li>
          <li>
            When both help and error exist, include both IDs in <code>aria-describedby</code>.
          </li>
          <li>
            Use <code>aria-invalid</code> only when invalid; don’t permanently mark fields invalid.
          </li>
        </ul>
      </section>
    </main>
  );
}

