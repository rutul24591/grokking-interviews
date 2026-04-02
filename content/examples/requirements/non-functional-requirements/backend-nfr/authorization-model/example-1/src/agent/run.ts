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

async function getJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const adminDelete = await getJson(b + "/api/authz/eval?userId=u_admin&docId=d1&action=delete");
  assert(adminDelete.status === 200 && adminDelete.body.allowed === true, "admin should delete");

  const editorDelete = await getJson(b + "/api/authz/eval?userId=u_editor&docId=d1&action=delete");
  assert(editorDelete.body.allowed === false, "editor cannot delete");

  const crossOrg = await getJson(b + "/api/authz/eval?userId=u_admin&docId=d3&action=read");
  assert(crossOrg.body.allowed === false, "cross org must deny");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

