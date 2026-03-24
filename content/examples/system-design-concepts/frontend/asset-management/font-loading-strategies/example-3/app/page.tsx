import { getPublicEnv } from "@/lib/env";

export default function Page() {
  const { NEXT_PUBLIC_FONT_CDN_ORIGIN } = getPublicEnv();

  const css = `
  @font-face {
    font-family: "SoraCDN";
    src: url("${NEXT_PUBLIC_FONT_CDN_ORIGIN}/fonts/sora-400.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  .cdn-font { font-family: "SoraCDN", ui-sans-serif, system-ui; }
  `;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Cross-origin font hosting</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <p>
          Font CDN origin: <code>{NEXT_PUBLIC_FONT_CDN_ORIGIN}</code>
        </p>
        <p className="mt-2">
          The font server sets <code>Access-Control-Allow-Origin: *</code>. Without CORS, browsers will block cross-origin font loads.
        </p>
      </section>

      <style>{css}</style>
      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="cdn-font text-lg">
          This paragraph uses a cross-origin font file loaded via <code>@font-face</code>.
        </p>
      </section>
    </main>
  );
}

