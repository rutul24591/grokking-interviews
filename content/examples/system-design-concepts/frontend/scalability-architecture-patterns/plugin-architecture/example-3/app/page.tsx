"use client";

import { ErrorBoundary } from "@/ui/ErrorBoundary";
import { SafePlugin, ThrowingPlugin } from "@/ui/Plugins";

export default function Page() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Plugin failure isolation</h1>
        <p className="mt-2 text-slate-300">
          One plugin throws; the host continues rendering others because each plugin is wrapped in its own boundary.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Plugins</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ErrorBoundary pluginId="safe">
            <SafePlugin />
          </ErrorBoundary>
          <ErrorBoundary pluginId="throws">
            <ThrowingPlugin />
          </ErrorBoundary>
        </div>
      </section>
    </main>
  );
}

