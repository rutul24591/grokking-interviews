type TodoV1 = { id: string; text: string; done: boolean };
type TodoV2 = TodoV1 & { createdAt: number };

export async function openTodosDb(version: 1 | 2): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("offline-first-migrations", version);

    req.onupgradeneeded = (event) => {
      const db = req.result;
      const oldVersion = event.oldVersion;

      if (oldVersion < 1) {
        db.createObjectStore("todos", { keyPath: "id" });
      }

      if (oldVersion < 2) {
        // v2: add createdAt to existing rows.
        const tx = req.transaction;
        if (!tx) return;
        const store = tx.objectStore("todos");
        const cursorReq = store.openCursor();
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (!cursor) return;
          const v1 = cursor.value as TodoV1;
          const v2: TodoV2 = { ...v1, createdAt: Date.now() };
          cursor.update(v2);
          cursor.continue();
        };
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("open failed"));
  });
}

export async function seedV1Todos(): Promise<void> {
  const db = await openTodosDb(1);
  const tx = db.transaction(["todos"], "readwrite");
  const store = tx.objectStore("todos");
  store.put({ id: "a", text: "Write locally first", done: false } satisfies TodoV1);
  store.put({ id: "b", text: "Queue mutations (outbox)", done: false } satisfies TodoV1);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("seed failed"));
  });
  db.close();
}

export async function listTodos(): Promise<(TodoV1 | TodoV2)[]> {
  const db = await openTodosDb(2);
  const tx = db.transaction(["todos"], "readonly");
  const store = tx.objectStore("todos");
  const req = store.getAll();
  const items = await new Promise<(TodoV1 | TodoV2)[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as (TodoV1 | TodoV2)[]);
    req.onerror = () => reject(req.error ?? new Error("getAll failed"));
  });
  db.close();
  return items;
}

export async function deleteDb(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase("offline-first-migrations");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error("delete failed"));
  });
}

