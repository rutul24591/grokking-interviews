import { z } from "zod";

const ArgsSchema = z.object({ baseUrl: z.string().url() });

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

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const v1 = await post(b + "/api/schema/register", {
    subject: "user.created",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "email", type: "string", required: false }
    ]
  });
  assert(v1.status === 200 && v1.body.schema.version === 1, "expected v1 registered");

  const v2 = await post(b + "/api/schema/register", {
    subject: "user.created",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "email", type: "string", required: false },
      { name: "displayName", type: "string", required: false }
    ]
  });
  assert(v2.status === 200 && v2.body.schema.version === 2, "expected v2 registered");

  const bad = await post(b + "/api/schema/register", {
    subject: "user.created",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "email", type: "string", required: true }
    ]
  });
  assert(bad.status === 409 && bad.body.error === "incompatible_schema", "expected incompatible schema rejected");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

