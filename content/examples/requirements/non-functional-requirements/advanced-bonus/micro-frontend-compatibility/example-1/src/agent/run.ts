import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

function read(p: string) {
  return fs.readFileSync(p, "utf-8");
}

function main() {
  const root = process.cwd();
  const remotes = [
    path.join(root, "public", "remotes", "profile-v1.js"),
    path.join(root, "public", "remotes", "profile-v2.js"),
  ];

  for (const p of remotes) {
    const code = read(p);
    assert(code.includes("customElements.define"), `Remote missing customElements.define: ${p}`);
    assert(code.includes("mf-profile"), `Remote missing tag name: ${p}`);
    assert(code.includes("__MF_HOST__"), `Remote missing host contract access: ${p}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        checked: remotes.map((p) => path.basename(p)),
        note: "Static contract test only (in prod, also run browser-based tests).",
      },
      null,
      2,
    ),
  );
}

main();

