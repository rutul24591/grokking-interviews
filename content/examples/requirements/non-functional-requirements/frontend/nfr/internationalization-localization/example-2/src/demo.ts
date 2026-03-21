type Locale = "en" | "fr" | "ar";
const supported: Locale[] = ["en", "fr", "ar"];

type Pref = { tag: string; q: number };

function parseAcceptLanguage(v: string): Pref[] {
  return v
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [tag, ...params] = p.split(";").map((x) => x.trim());
      const q = params.find((x) => x.startsWith("q="));
      const qv = q ? Number(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(qv) ? qv : 0 };
    })
    .sort((a, b) => b.q - a.q);
}

function negotiate(v: string): Locale {
  for (const p of parseAcceptLanguage(v)) {
    const base = p.tag.split("-")[0] || p.tag;
    if (supported.includes(p.tag as Locale)) return p.tag as Locale;
    if (supported.includes(base as Locale)) return base as Locale;
  }
  return "en";
}

const header = "fr-CA,fr;q=0.9,en;q=0.8,ar;q=0.7";
console.log(
  JSON.stringify(
    {
      header,
      prefs: parseAcceptLanguage(header),
      chosen: negotiate(header),
    },
    null,
    2,
  ),
);

