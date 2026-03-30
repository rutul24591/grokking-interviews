/* eslint-disable no-restricted-globals */
const DB_NAME = "bg-sync-demo";
const DB_VERSION = 1;
const STORE = "outbox";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("idb open failed"));
  });
}

function getAll(store) {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error || new Error("getAll failed"));
  });
}

function del(store, key) {
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error("delete failed"));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("tx failed"));
    tx.onabort = () => reject(tx.error || new Error("tx aborted"));
  });
}

async function drainOutbox() {
  const db = await openDb();
  const tx = db.transaction([STORE], "readwrite");
  const store = tx.objectStore(STORE);
  const items = await getAll(store);

  const applied = [];
  const failed = [];

  for (const item of items) {
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-idempotency-key": item.idempotencyKey
        },
        body: JSON.stringify({ id: item.id, idempotencyKey: item.idempotencyKey, payload: item.payload })
      });
      if (!res.ok) throw new Error(`http-${res.status}`);
      await del(store, item.id);
      applied.push(item.id);
    } catch {
      failed.push(item.id);
    }
  }

  await txDone(tx);
  return { ok: failed.length === 0, applied, failed };
}

self.addEventListener("sync", (event) => {
  if (event.tag === "outbox-sync") {
    event.waitUntil(drainOutbox());
  }
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "DRAIN_OUTBOX" && event.ports && event.ports[0]) {
    event.waitUntil(
      (async () => {
        const result = await drainOutbox();
        event.ports[0].postMessage(result);
      })(),
    );
  }
});

