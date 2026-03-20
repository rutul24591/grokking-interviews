import { randomUUID } from "node:crypto";
import { log } from "./logger";

const traceId = randomUUID();
const requestId = randomUUID();

log({
  level: "info",
  msg: "request received",
  traceId,
  requestId,
  fields: { path: "/api", authorization: "Bearer secret", user: "u1" },
});

log({
  level: "error",
  msg: "dependency failed",
  traceId,
  requestId,
  fields: { dependency: "payments", token: "secret-token", retry: 2 },
});

