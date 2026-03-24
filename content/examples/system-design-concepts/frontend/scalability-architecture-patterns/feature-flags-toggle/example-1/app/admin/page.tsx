import { cookies } from "next/headers";
import { readSession } from "@/lib/session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = readSession(cookieStore);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-2 text-slate-300">
          Update the session cookie to simulate different users and observe deterministic bucketing.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Session</h2>
        <p className="mt-2 text-sm text-slate-300">
          Current user: <span className="font-semibold text-slate-100">{session.user.userId}</span> · country{" "}
          <span className="font-semibold text-slate-100">{session.user.country}</span>
        </p>

        <form action="/api/session" method="post" className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            User ID
            <input
              name="userId"
              defaultValue={session.user.userId}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
            />
          </label>
          <label className="text-sm text-slate-300">
            Country
            <select
              name="country"
              defaultValue={session.user.country}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            >
              <option value="US">US</option>
              <option value="IN">IN</option>
              <option value="GB">GB</option>
              <option value="DE">DE</option>
              <option value="BR">BR</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
            >
              Update session
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

