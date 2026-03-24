import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const childPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "child.js");

const a = fork(childPath, { stdio: "inherit" });
const b = fork(childPath, { stdio: "inherit" });

await new Promise((r) => setTimeout(r, 50));
a.kill();
b.kill();

