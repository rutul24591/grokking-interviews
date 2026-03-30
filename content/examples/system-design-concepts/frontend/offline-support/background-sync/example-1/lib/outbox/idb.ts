export type UpgradeFn = (db: IDBDatabase, oldVersion: number, newVersion: number) => void | Promise<void>;

export async function openDb(params: { name: string; version: number; upgrade: UpgradeFn }): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(params.name, params.version);

    req.onupgradeneeded = (event) => {
      const db = req.result;
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion ?? params.version;
      void params.upgrade(db, oldVersion, newVersion);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("indexedDB open failed"));
  });
}

export function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("transaction failed"));
    tx.onabort = () => reject(tx.error ?? new Error("transaction aborted"));
  });
}

export async function getAll<T>(store: IDBObjectStore): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error ?? new Error("getAll failed"));
  });
}

export async function put(store: IDBObjectStore, value: unknown): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const req = store.put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("put failed"));
  });
}

export async function del(store: IDBObjectStore, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error("delete failed"));
  });
}

