import { randomUUID } from "node:crypto";

globalThis.__SINGLETON__ ??= { id: randomUUID() };
process.stdout.write(`pid=${process.pid} singletonId=${globalThis.__SINGLETON__.id}\n`);

