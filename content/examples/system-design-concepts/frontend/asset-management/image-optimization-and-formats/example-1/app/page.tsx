import { imgUrl } from "@/lib/imageUrl";
import Inspector from "./ui/Inspector";

export default function Page() {
  const v = "demo-v1";

  const avifSrcset = [480, 960].map((w) => `${imgUrl({ w, h: 240, fmt: "avif", v })} ${w}w`).join(", ");
  const webpSrcset = [480, 960].map((w) => `${imgUrl({ w, h: 240, fmt: "webp", v })} ${w}w`).join(", ");
  const pngFallback = imgUrl({ w: 960, h: 240, fmt: "png", v });

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Responsive images + modern formats</h1>
        <p className="text-sm opacity-80">
          Uses <code>&lt;picture&gt;</code> with AVIF → WebP → PNG fallback and <code>srcset</code>/<code>sizes</code>.
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Picture element</h2>
        <p className="mt-2 text-sm opacity-80">
          Resize the viewport and check which URL width is requested. AVIF is preferred when supported.
        </p>

        <div className="mt-4 overflow-hidden rounded bg-black/30 p-3">
          <picture>
            <source type="image/avif" srcSet={avifSrcset} sizes="(max-width: 768px) 100vw, 960px" />
            <source type="image/webp" srcSet={webpSrcset} sizes="(max-width: 768px) 100vw, 960px" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pngFallback} alt="Demo" className="h-auto w-full rounded" />
          </picture>
        </div>
      </section>

      <Inspector />
    </main>
  );
}

