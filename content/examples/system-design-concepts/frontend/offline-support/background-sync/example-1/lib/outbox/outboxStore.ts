import { del, getAll, openDb, put, txDone } from "./idb";

const DB_NAME = "bg-sync-demo";
const DB_VERSION = 1;
const STORE = "outbox";

export type OutboxItem = {
  id: string;
  idempotencyKey: string;
  payload: unknown;
  createdAt: number;
};

async function db() {
  return await openDb({
    name: DB_NAME,
    version: DB_VERSION,
    upgrade: (db) => {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    }
  });
}

export async function addOutboxItem(payload: unknown): Promise<OutboxItem> {
  const item: OutboxItem = {
    id: crypto.randomUUID(),
    idempotencyKey: crypto.randomUUID(),
    payload,
    createdAt: Date.now()
  };
  const d = await db();
  const tx = d.transaction([STORE], "readwrite");
  await put(tx.objectStore(STORE), item);
  await txDone(tx);
  return item;
}

export async function listOutboxItems(): Promise<OutboxItem[]> {
  const d = await db();
  const tx = d.transaction([STORE], "readonly");
  const items = await getAll<OutboxItem>(tx.objectStore(STORE));
  await txDone(tx);
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteOutboxItem(id: string): Promise<void> {
  const d = await db();
  const tx = d.transaction([STORE], "readwrite");
  await del(tx.objectStore(STORE), id);
  await txDone(tx);
}

