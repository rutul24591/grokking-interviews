import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
});

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    out[key] = value;
  }
  return ArgsSchema.parse(out);
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function getText(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const en = await getText(baseUrl + "/en");
  assert(en.status === 200, "expected /en 200");
  assert(en.text.includes("Internationalization"), "expected English title present");
  assert(en.text.includes('lang="en"'), "expected lang=en on html");

  const fr = await getText(baseUrl + "/fr");
  assert(fr.status === 200, "expected /fr 200");
  assert(fr.text.includes("Internationalisation"), "expected French title present");
  assert(fr.text.includes('lang="fr"'), "expected lang=fr on html");

  const root = await getText(baseUrl + "/", { headers: { "accept-language": "fr-CA,fr;q=0.9,en;q=0.8" } });
  assert(root.status === 200 || root.status === 307 || root.status === 308, "expected root redirect or 200");

  const previewFr = await getJson(baseUrl + "/api/i18n/preview?locale=fr&amount=12.5&ts=2026-03-20T00:00:00Z");
  assert(previewFr.status === 200, "expected i18n preview 200");
  assert(previewFr.json && previewFr.json.locale === "fr", "expected preview locale fr");
  assert(typeof previewFr.json.amount === "string" && previewFr.json.amount.includes("€"), "expected EUR formatting");

  const previewAr = await getJson(baseUrl + "/api/i18n/preview?amount=1", { headers: { "accept-language": "ar" } });
  assert(previewAr.status === 200, "expected i18n preview ar 200");
  assert(previewAr.json && previewAr.json.locale === "ar", "expected preview locale ar");
  assert(previewAr.json.dir === "rtl", "expected rtl dir for ar");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
