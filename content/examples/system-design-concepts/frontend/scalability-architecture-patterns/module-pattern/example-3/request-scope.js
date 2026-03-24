import { AsyncLocalStorage } from "node:async_hooks";

const als = new AsyncLocalStorage();

function createRequestModule() {
  return {
    getUserId: () => {
      const store = als.getStore();
      if (!store) throw new Error("no request context");
      return store.userId;
    }
  };
}

const requestModule = createRequestModule();

async function handleRequest(userId) {
  return als.run({ userId }, async () => {
    await new Promise((r) => setTimeout(r, 10));
    return { userId: requestModule.getUserId() };
  });
}

const [a, b] = await Promise.all([handleRequest("user-a"), handleRequest("user-b")]);
process.stdout.write(`${JSON.stringify(a)}\n`);
process.stdout.write(`${JSON.stringify(b)}\n`);

