import { cookies } from "next/headers";
import { saveCookiePreferences } from "./actions";

export default async function Page() {
  const jar = await cookies();
  const theme = jar.get("theme")?.value ?? "dark";
  const viewerRole = jar.get("viewerRole")?.value ?? "staff";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Cookies across server and client</h1>
      <p className="mt-3 text-white/80">Cookies are useful when the server needs to read request-scoped state.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 text-sm text-white/70">
          server-read cookie values: theme=<code>{theme}</code>, viewerRole=<code>{viewerRole}</code>
        </div>
        <form action={saveCookiePreferences} className="space-y-4">
          <label className="block text-sm">
            <div className="mb-1 text-white/70">Theme</div>
            <select name="theme" defaultValue={theme} className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
              <option value="dark">dark</option>
              <option value="light">light</option>
            </select>
          </label>
          <label className="block text-sm">
            <div className="mb-1 text-white/70">Viewer role</div>
            <select name="viewerRole" defaultValue={viewerRole} className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
              <option value="staff">staff</option>
              <option value="principal">principal</option>
            </select>
          </label>
          <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" type="submit">Save cookies</button>
        </form>
      </div>
    </main>
  );
}

