import type { ObjectStore } from "./stores.js";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

export async function runObjectStoreContract(store: ObjectStore, name: string) {
  const key = `contract/${name}/alpha.txt`;

  await store.put(key, "v1");
  const r1 = await store.get(key);
  assert(r1?.value === "v1", `${name}: get after put should return v1`);

  // Contract: put overwrites.
  await store.put(key, "v2");
  const r2 = await store.get(key);
  assert(r2?.value === "v2", `${name}: put should overwrite to v2`);

  // Contract: list includes the key.
  const list = await store.list("contract/");
  assert(list.some((o) => o.key === key), `${name}: list should include key`);

  // Contract: delete returns true when present, false when absent.
  const d1 = await store.del(key);
  assert(d1 === true, `${name}: delete should return true for existing key`);
  const d2 = await store.del(key);
  assert(d2 === false, `${name}: delete should return false for missing key`);

  // Contract: get returns null for missing.
  const r3 = await store.get(key);
  assert(r3 === null, `${name}: get missing should be null`);
}

