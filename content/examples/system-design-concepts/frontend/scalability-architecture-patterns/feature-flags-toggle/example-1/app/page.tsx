import { cookies } from "next/headers";
import Link from "next/link";
import { evaluateAllFlags } from "@/lib/flags";
import { readSession } from "@/lib/session";

export default async function Page() {
  const cookieStore = await cookies();
  const session = readSession(cookieStore);
  const flags = evaluateAllFlags({ user: session.user });

  const navVariant = flags["nav.variant"];
  const isNewCheckout = flags["checkout.newFlow"];

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Server-driven feature flags</h1>
        <p className="mt-2 text-slate-300">
          Session user: <span className="font-semibold text-slate-100">{session.user.userId}</span> · country{" "}
          <span className="font-semibold text-slate-100">{session.user.country}</span>
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">What you see</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-white/10 bg-black/30 p-5">
            <h3 className="text-base font-semibold text-slate-100">Navigation</h3>
            <p className="mt-2 text-sm text-slate-300">
              Variant: <span className="font-semibold text-slate-100">{navVariant}</span>
            </p>
            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-3 text-sm">
              {navVariant === "new" ? (
                <ul className="flex flex-wrap gap-3 text-slate-200">
                  <li className="rounded-md bg-indigo-500/20 px-3 py-2">Home</li>
                  <li className="rounded-md bg-indigo-500/20 px-3 py-2">Explore</li>
                  <li className="rounded-md bg-indigo-500/20 px-3 py-2">Profile</li>
                </ul>
              ) : (
                <ul className="flex flex-wrap gap-3 text-slate-200">
                  <li className="rounded-md bg-white/10 px-3 py-2">Home</li>
                  <li className="rounded-md bg-white/10 px-3 py-2">Docs</li>
                  <li className="rounded-md bg-white/10 px-3 py-2">Account</li>
                </ul>
              )}
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-black/30 p-5">
            <h3 className="text-base font-semibold text-slate-100">Checkout</h3>
            <p className="mt-2 text-sm text-slate-300">
              New checkout flow:{" "}
              <span className={isNewCheckout ? "font-semibold text-emerald-200" : "font-semibold text-slate-100"}>
                {String(isNewCheckout)}
              </span>
            </p>
            <p className="mt-4 text-sm text-slate-300">
              This is evaluated server-side, so crawlers/clients don’t see a “flash” of old UI.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Next steps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Open <Link href="/admin">Admin</Link> and change country/user id; the rollout should be deterministic.
          </li>
          <li>Hit refresh multiple times; flags should stay stable for a user (same bucket).</li>
          <li>Inspect `lib/flags.ts` for targeting and kill-switch patterns.</li>
        </ul>
      </section>
    </main>
  );
}

