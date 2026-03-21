type Candidate = { w: number; url: string };

function makeSrcset(base: string, widths: number[]) {
  const candidates: Candidate[] = widths.map((w) => ({ w, url: `${base}?w=${w}` }));
  return candidates.map((c) => `${c.url} ${c.w}w`).join(", ");
}

function pickSizes() {
  // Example policy: the image is full width on mobile, 50% on desktop.
  return "(max-width: 768px) 100vw, 50vw";
}

const widths = [320, 480, 768, 1024, 1200];

console.log(
  JSON.stringify(
    {
      widths,
      sizes: pickSizes(),
      srcset: makeSrcset("/api/media/hero", widths),
      note: [
        "Prefer a small set of width buckets to keep CDN cache hit-rate high.",
        "Use `sizes` to communicate layout intent; otherwise the browser may download too-large assets.",
      ],
    },
    null,
    2,
  ),
);

