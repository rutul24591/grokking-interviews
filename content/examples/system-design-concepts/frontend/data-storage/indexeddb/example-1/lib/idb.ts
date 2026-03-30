export type NoteRecord = {
  id: string;
  title: string;
  body: string;
  tag: string;
};

const DB_NAME = "indexeddb-notes";
const STORE = "notes";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      const store = db.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("byTag", "tag", { unique: false });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function initDb() {
  const db = await openDb();
  db.close();
}

export async function addNote(note: NoteRecord) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(note);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getAllNotes() {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).getAll();
  const items = await new Promise<NoteRecord[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as NoteRecord[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return items;
}

export async function getByTag(tag: string) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).index("byTag").getAll(tag);
  const items = await new Promise<NoteRecord[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as NoteRecord[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return items;
}

