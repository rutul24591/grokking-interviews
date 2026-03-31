import CorsPanel from "./cors-panel";
export default function Page() {
  return <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f0fdf4_100%)] text-slate-900"><div className="mx-auto max-w-5xl px-6 py-10"><h1 className="font-serif text-5xl tracking-tight">Let the browser talk only to origins you explicitly trust</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app simulates allowed and rejected cross-origin requests so the client can inspect the policy outcome.</p><CorsPanel /></div></main>;
}
