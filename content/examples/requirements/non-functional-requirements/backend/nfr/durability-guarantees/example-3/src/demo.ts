import { createHash } from "node:crypto";

function checksum(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

type Entry = { payload: string; checksum: string };

function verify(e: Entry) {
  return checksum(e.payload) === e.checksum;
}

const good: Entry = { payload: "hello", checksum: checksum("hello") };
const bad: Entry = { payload: "hello", checksum: checksum("bye") };

console.log(JSON.stringify({ good: verify(good), bad: verify(bad) }, null, 2));

