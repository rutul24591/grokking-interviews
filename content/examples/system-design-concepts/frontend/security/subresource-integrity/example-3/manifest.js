import { createHash } from "node:crypto";

function sri(buf) {
  return `sha384-${createHash("sha384").update(buf).digest("base64")}`;
}

const assets = {
  "https://cdn.example.com/lib@1.2.3.min.js": Buffer.from("console.log('lib')\n", "utf8"),
  "https://cdn.example.com/widget@9.9.9.min.js": Buffer.from("console.log('widget')\n", "utf8")
};

const manifest = {};
for (const [url, buf] of Object.entries(assets)) manifest[url] = sri(buf);

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);

