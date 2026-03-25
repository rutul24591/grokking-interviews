import fs from "node:fs";
import { createHash } from "node:crypto";

const input = process.argv[2] ?? "example.js";
const buf = fs.readFileSync(input);
const hash = createHash("sha384").update(buf).digest("base64");
process.stdout.write(`sha384-${hash}\n`);

