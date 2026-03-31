import Image from "next/image";

type Asset = {
  id: string;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  placeholder: string;
  note: string;
};

async function getAssets(): Promise<Asset[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4160";
  const response = await fetch(`${origin}/assets`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as Asset[];
}

export default async function Page() {
  const assets = await getAssets();
  const [hero, ...gallery] = assets;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f2eee6_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Image Delivery</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight">
              Prioritize the hero, right-size the gallery, reserve layout before bytes arrive.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">
              This page uses a prioritized hero image, intrinsic dimensions, lightweight SVG placeholders, and
              right-sized gallery media so the content shell stays stable and bandwidth stays proportional to the
              viewport.
            </p>
          </div>

          <aside className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(90,54,11,0.08)]">
            <div className="text-sm font-semibold">Operational checks</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>Hero image uses `priority` and fixed intrinsic dimensions.</li>
              <li>Gallery images use responsive sizing and placeholders.</li>
              <li>Each card explains what the optimization is buying you.</li>
            </ul>
          </aside>
        </header>

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(90,54,11,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-[360px]">
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                placeholder="blur"
                blurDataURL={hero.placeholder}
                className="object-cover"
              />
            </div>
            <div className="p-7">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Hero</div>
              <h2 className="mt-3 font-serif text-3xl tracking-tight">{hero.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{hero.note}</p>
              <div className="mt-6 text-xs text-slate-500">
                {hero.width}×{hero.height} source, placeholder SVG embedded for early paint stability.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {gallery.map((asset) => (
            <article key={asset.id} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(90,54,11,0.08)]">
              <div className="overflow-hidden rounded-[1.25rem]">
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  width={asset.width}
                  height={asset.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={asset.placeholder}
                  className="h-auto w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{asset.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{asset.note}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
