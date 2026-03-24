import { assetUrl } from "@/lib/assetUrl";

export default async function Page() {
  const appVersion = process.env.APP_VERSION ?? "dev";

  const logo = assetUrl("logo.svg");
  const hero = assetUrl("hero.svg");

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Asset Versioning & Cache Busting</h1>
        <p className="text-sm opacity-80">
          App version: <code>{appVersion}</code>
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Hashed asset URLs</h2>
        <p className="mt-2 text-sm opacity-80">
          These URLs come from <code>lib/generated/assets-manifest.json</code>. Update <code>public/assets/logo.svg</code>{" "}
          or <code>public/assets/hero.svg</code>, restart <code>pnpm dev</code>, and the URL hash changes.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Logo</div>
            <div className="mt-2 text-xs break-all">
              <code>{logo}</code>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mt-3 h-16 w-auto rounded bg-white p-2" src={logo} alt="Logo" />
          </div>

          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Hero</div>
            <div className="mt-2 text-xs break-all">
              <code>{hero}</code>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mt-3 h-24 w-full rounded bg-white p-2" src={hero} alt="Hero" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Cache policy</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-80">
          <li>
            Hashed URLs (<code>/assets-hashed/*</code>) can be cached for a year with <code>immutable</code>.
          </li>
          <li>
            Non-hashed URLs (<code>/assets/*</code>) should use short TTLs (minutes) or revalidation.
          </li>
        </ul>
        <p className="mt-3 text-sm opacity-80">
          In practice, pair this with a CDN. The browser/CDN caches aggressively, and deployments are safe because the URL changes on content
          change.
        </p>
      </section>
    </main>
  );
}
