import Image from "next/image";
import { getPublicEnv } from "@/lib/env";

export default function Page() {
  const { NEXT_PUBLIC_CDN_ORIGIN } = getPublicEnv();
  const logoUrl = `${NEXT_PUBLIC_CDN_ORIGIN}/assets/logo.svg`;
  const heroUrl = `${NEXT_PUBLIC_CDN_ORIGIN}/assets/hero.a3d1c0ef.svg`;

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">CDN Strategy</h1>
        <p className="text-sm opacity-80">
          Static origin: <code>{NEXT_PUBLIC_CDN_ORIGIN}</code>
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">From a separate asset origin</h2>
        <p className="mt-2 text-sm opacity-80">
          The images below are served by a separate Node server simulating a CDN/static origin. In real deployments, this would be your CDN
          hostname (e.g. <code>https://cdn.example.com</code>).
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Mutable URL (short TTL)</div>
            <div className="mt-2 text-xs break-all">
              <code>{logoUrl}</code>
            </div>
            <div className="mt-3 rounded bg-white p-2">
              <Image src={logoUrl} alt="Logo" width={240} height={96} />
            </div>
          </div>

          <div className="rounded-md bg-black/30 p-3">
            <div className="text-xs uppercase opacity-70">Hashed URL (immutable)</div>
            <div className="mt-2 text-xs break-all">
              <code>{heroUrl}</code>
            </div>
            <div className="mt-3 rounded bg-white p-2">
              <Image src={heroUrl} alt="Hero" width={960} height={240} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <h2 className="font-semibold text-white">Operational notes</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Use a dedicated asset hostname for cacheability and isolation.</li>
          <li>Use content-hashed filenames to enable `immutable` caching and safe rollbacks.</li>
          <li>Make cache keys explicit (vary by only what’s necessary).</li>
        </ul>
      </section>
    </main>
  );
}

