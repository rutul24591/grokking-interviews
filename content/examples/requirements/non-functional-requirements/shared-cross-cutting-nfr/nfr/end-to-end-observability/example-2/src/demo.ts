import { randomBytes } from "node:crypto";
import { shouldSample } from "./sampling";

const rate = 0.1;
let sampled = 0;
const total = 1000;

for (let i = 0; i < total; i++) {
  const traceId = randomBytes(16).toString("hex");
  if (shouldSample(traceId, rate)) sampled++;
}

console.log({ total, rate, sampled, approx: sampled / total });

