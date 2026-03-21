import crypto from "node:crypto";

function bucket01(input: string): number {
  const h = crypto.createHash("sha256").update(input).digest();
  return h.readUInt32BE(0) / 2 ** 32;
}

function assert(condition: unknown, msg: string) {
  if (!condition) throw new Error(msg);
}

const a = bucket01("salt:user_1");
const b = bucket01("salt:user_1");
assert(a === b, "bucketing must be stable");

console.log(JSON.stringify({ ok: true, bucket: a }, null, 2));

