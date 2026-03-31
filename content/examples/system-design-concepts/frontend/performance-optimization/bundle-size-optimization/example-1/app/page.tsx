import LoadAnalysis from "./load-analysis";
import { formatDate } from "@/lib/formatDate";

type Item = {
  id: string;
  title: string;
  updatedAt: string;
  note: string;
};

async function getItems(): Promise<Item[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4110";
  const res = await fetch(`${origin}/bundle-report`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Item[];
}

export default async function Page() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fbfd_0%,_#eef5f7_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Bundle size optimization</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Keep the initial route small, move optional experiences into secondary chunks, and prefer tiny
          utilities over heavy general-purpose dependencies.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {formatDate(item.updatedAt)}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
            </article>
          ))}
        </section>

        <LoadAnalysis />
      </div>
    </main>
  );
}

