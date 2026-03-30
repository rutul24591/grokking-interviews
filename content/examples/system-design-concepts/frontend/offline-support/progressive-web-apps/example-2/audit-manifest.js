import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  process.stderr.write(`${msg}\n`);
  process.exitCode = 1;
}

function ok(msg) {
  process.stdout.write(`✓ ${msg}\n`);
}

function warn(msg) {
  process.stdout.write(`! ${msg}\n`);
}

const manifestPath = process.argv[2] || path.join(process.cwd(), "manifest.webmanifest");

if (!fs.existsSync(manifestPath)) {
  fail(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
} catch (e) {
  fail(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}

const required = ["name", "short_name", "start_url", "display", "icons"];
for (const k of required) {
  if (manifest[k] === undefined || manifest[k] === null || manifest[k] === "") {
    fail(`Missing required field: ${k}`);
  } else {
    ok(`Has ${k}`);
  }
}

if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail("icons must be a non-empty array");
} else {
  const hasAny512 = manifest.icons.some((i) => typeof i?.sizes === "string" && i.sizes.includes("512x512"));
  if (hasAny512) ok("Has a 512x512 icon (recommended)");
  else warn("No 512x512 icon found (recommended for installability)");
}

if (manifest.scope && manifest.start_url && typeof manifest.scope === "string" && typeof manifest.start_url === "string") {
  if (!manifest.start_url.startsWith(manifest.scope)) {
    warn(`start_url (${manifest.start_url}) does not start with scope (${manifest.scope})`);
  } else {
    ok("start_url aligns with scope");
  }
}

warn("Installability also depends on serving over HTTPS (or localhost) and having a service worker with fetch handling.");

