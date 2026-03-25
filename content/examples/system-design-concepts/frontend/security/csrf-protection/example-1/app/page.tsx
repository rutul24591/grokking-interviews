import { cookies } from "next/headers";
import { TransferClient } from "./TransferClient";

export default async function Page() {
  const csrf = (await cookies()).get("csrf")?.value ?? "";

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">CSRF protection: token + origin</h1>
        <p className="text-sm text-white/70">
          Middleware sets an HttpOnly CSRF cookie. SSR embeds the token into the page. The client echoes it in a header.
        </p>
      </header>

      <TransferClient csrfToken={csrf} />

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">How to test</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
          <li>Open DevTools → Network and inspect <code>Origin</code> + <code>X-CSRF-Token</code>.</li>
          <li>Try removing the header (edit &amp; resend) and see the request rejected.</li>
        </ul>
      </section>
    </main>
  );
}

