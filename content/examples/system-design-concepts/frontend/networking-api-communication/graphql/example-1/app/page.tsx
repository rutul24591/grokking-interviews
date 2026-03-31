import QueryPanel from "./query-panel";
export default function Page() {
  return <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#faf5ff_100%)] text-slate-900"><div className="mx-auto max-w-5xl px-6 py-10"><h1 className="font-serif text-5xl tracking-tight">Ask for exactly the fields the client needs</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app sends a small GraphQL-like query payload to a Node API and renders the shape-specific response.</p><QueryPanel /></div></main>;
}
