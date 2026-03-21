import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  requests: z.coerce.number().int().min(1).max(500).default(50),
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  let etag = "";
  let bytes = 0;
  let notModified = 0;

  for (let i = 0; i < args.requests; i++) {
    const res = await fetch(`${baseUrl}/api/feed?limit=25`, {
      headers: etag ? { "If-None-Match": etag } : {},
    });
    if (res.status === 304) {
      notModified++;
      continue;
    }
    const text = await res.text();
    bytes += text.length;
    etag = res.headers.get("etag") ?? etag;
  }

  console.log(JSON.stringify({ requests: args.requests, bytesDownloaded: bytes, notModified }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

