import Link from "next/link";
import { cookies } from "next/headers";
import { getFeed, getProfile } from "@/lib/api";
import { LikeButton } from "@/components/LikeButton";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = (params.q ?? "").trim() || null;

  const uid = cookies().get("uid")?.value ?? null;

  // Avoid SSR waterfalls: fetch independent data in parallel.
  const [profile, feed] = await Promise.all([
    getProfile({ uid }).catch(() => null),
    getFeed({ uid, q }),
  ]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">SSR Reader</h1>
            <p className="mt-1 text-sm text-slate-300">
              HTML is rendered on the server per request; interactive pieces hydrate after JS loads.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <a
                className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 hover:border-slate-500"
                href="/api/session?uid=alice"
              >
                Set user: Alice
              </a>
              <a
                className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 hover:border-slate-500"
                href="/api/session?uid=bob"
              >
                Set user: Bob
              </a>
              <a
                className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 hover:border-slate-500"
                href="/api/session"
              >
                Clear user
              </a>
              <span className="ml-2 font-mono text-slate-400">
                uid={uid ?? "guest"}
              </span>
            </div>
          </div>

          <div className="w-full md:w-[26rem]">
            <form method="get" className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                Server-rendered search (full request)
              </label>
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Try: caching, react, hydration..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
              />
              <div className="mt-2 text-xs text-slate-500">
                This form does a real navigation, so the server re-renders HTML for the new query.
              </div>
            </form>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-[1fr_18rem]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200">Feed</h2>
              <span className="text-xs text-slate-500">{feed.items.length} items</span>
            </div>

            <ul className="mt-4 space-y-3">
              {feed.items.map((it) => (
                <li key={it.id}>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/articles/${encodeURIComponent(it.id)}`}
                          className="text-sm font-semibold text-slate-100 hover:underline"
                        >
                          {it.title}
                        </Link>
                        <div className="mt-1 text-xs text-slate-400">
                          Updated {new Date(it.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <LikeButton />
                    </div>
                    <div className="mt-2 text-sm text-slate-300">{it.excerpt}</div>
                    {it.personalizedReason ? (
                      <div className="mt-2 text-xs text-indigo-200/90">
                        Personalized: {it.personalizedReason}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {it.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800/60 px-2 py-1 text-[11px] text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200">Server context</h2>
            <div className="mt-3 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                  Profile (SSR)
                </div>
                <div className="mt-2 text-sm">
                  {profile ? (
                    <>
                      <div>{profile.displayName}</div>
                      <div className="mt-1 text-xs text-slate-500">Plan: {profile.plan}</div>
                    </>
                  ) : (
                    <div className="text-slate-400">Guest</div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Because the page depends on cookies, it’s dynamic: caching must include the user in the cache key.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

