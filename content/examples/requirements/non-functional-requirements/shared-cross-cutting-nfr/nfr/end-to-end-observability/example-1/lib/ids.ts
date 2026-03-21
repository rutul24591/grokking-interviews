import { randomBytes } from "node:crypto";

export function traceId(): string {
  return randomBytes(16).toString("hex");
}

export function spanId(): string {
  return randomBytes(8).toString("hex");
}

