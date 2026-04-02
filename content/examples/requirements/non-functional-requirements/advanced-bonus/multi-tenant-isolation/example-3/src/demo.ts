import { AsyncLocalStorage } from "async_hooks";

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ---------------------------
// 1) Broken: global mutable context
// ---------------------------
let currentTenant: string | null = null;

async function handleRequestBroken(tenantId: string) {
  currentTenant = tenantId;
  await sleep(Math.random() * 10);
  return queryDbBroken();
}

function queryDbBroken() {
  // Imagine this is used for authz / row-level filtering.
  return { tenantSeenByDb: currentTenant };
}

// ---------------------------
// 2) Better: AsyncLocalStorage context
// ---------------------------
type Ctx = { tenantId: string };
const als = new AsyncLocalStorage<Ctx>();

async function handleRequestAls(tenantId: string) {
  return als.run({ tenantId }, async () => {
    await sleep(Math.random() * 10);
    return queryDbAls();
  });
}

function queryDbAls() {
  const ctx = als.getStore();
  return { tenantSeenByDb: ctx?.tenantId ?? "missing" };
}

async function main() {
  const tenants = ["tenant-A", "tenant-B", "tenant-C"];

  const broken = await Promise.all(tenants.map((t) => handleRequestBroken(t)));
  const fixed = await Promise.all(tenants.map((t) => handleRequestAls(t)));

  console.log(
    JSON.stringify(
      {
        broken,
        fixed,
        interpretation:
          "Broken output often shows the wrong tenant due to async interleaving. ALS keeps tenant context isolated per request.",
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

