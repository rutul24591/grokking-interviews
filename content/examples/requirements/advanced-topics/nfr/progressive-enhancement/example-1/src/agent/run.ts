import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  count: z.coerce.number().int().min(1).max(50).default(3),
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

  for (let i = 0; i < args.count; i++) {
    const fd = new FormData();
    fd.set("author", "agent");
    fd.set("message", `hello ${i} (progressive enhancement agent)`);
    const res = await fetch(`${baseUrl}/api/comments`, {
      method: "POST",
      headers: { accept: "application/json", "x-enhanced": "1" },
      body: fd,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  }

  const list = await fetch(`${baseUrl}/api/comments?limit=5`);
  console.log(await list.text());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

