import { add, del, getAll, getOne, openDb, put, txDone } from "./idb";

export type Doc = {
  id: string;
  title: string;
  body: string;
  updatedAt: number; // local wall clock
  localVersion: number;
  serverVersion: number; // last known server version (0 means never synced)
};

export type OutboxItem =
  | {
      id?: number; // auto-increment in IDB
      status: "pending";
      idempotencyKey: string;
      docId: string;
      baseServerVersion: number;
      payload: Pick<Doc, "title" | "body" | "updatedAt" | "localVersion" | "serverVersion">;
      createdAt: number;
    }
  | {
      id?: number;
      status: "conflict";
      idempotencyKey: string;
      docId: string;
      baseServerVersion: number;
      payload: Pick<Doc, "title" | "body" | "updatedAt" | "localVersion" | "serverVersion">;
      serverDoc: ServerDoc;
      createdAt: number;
    };

export type ServerDoc = {
  docId: string;
  title: string;
  body: string;
  serverVersion: number;
  updatedAt: number;
};

const DB_NAME = "offline-first-example-1";
const DB_VERSION = 1;

function randomId() {
  return crypto.randomUUID();
}

async function db() {
  return openDb({
    name: DB_NAME,
    version: DB_VERSION,
    upgrade: (db) => {
      if (!db.objectStoreNames.contains("docs")) db.createObjectStore("docs", { keyPath: "id" });
      if (!db.objectStoreNames.contains("outbox")) db.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
    }
  });
}

export async function listDocs(): Promise<Doc[]> {
  const d = await db();
  const tx = d.transaction(["docs"], "readonly");
  const docs = await getAll<Doc>(tx.objectStore("docs"));
  await txDone(tx);
  docs.sort((a, b) => b.updatedAt - a.updatedAt);
  return docs;
}

export async function getDoc(id: string): Promise<Doc | null> {
  const d = await db();
  const tx = d.transaction(["docs"], "readonly");
  const doc = await getOne<Doc>(tx.objectStore("docs"), id);
  await txDone(tx);
  return doc;
}

export async function upsertDoc(input: Partial<Doc> & Pick<Doc, "title" | "body"> & { id?: string }): Promise<Doc> {
  const now = Date.now();
  const existing = input.id ? await getDoc(input.id) : null;

  const next: Doc = {
    id: existing?.id ?? input.id ?? randomId(),
    title: input.title,
    body: input.body,
    updatedAt: now,
    localVersion: (existing?.localVersion ?? 0) + 1,
    serverVersion: existing?.serverVersion ?? 0
  };

  const d = await db();
  const tx = d.transaction(["docs", "outbox"], "readwrite");
  await put(tx.objectStore("docs"), next);

  const item: OutboxItem = {
    status: "pending",
    idempotencyKey: crypto.randomUUID(),
    docId: next.id,
    baseServerVersion: next.serverVersion,
    payload: {
      title: next.title,
      body: next.body,
      updatedAt: next.updatedAt,
      localVersion: next.localVersion,
      serverVersion: next.serverVersion
    },
    createdAt: now
  };
  await add(tx.objectStore("outbox"), item);
  await txDone(tx);

  return next;
}

export async function replaceDocWithServer(serverDoc: ServerDoc): Promise<void> {
  const d = await db();
  const tx = d.transaction(["docs"], "readwrite");
  const next: Doc = {
    id: serverDoc.docId,
    title: serverDoc.title,
    body: serverDoc.body,
    updatedAt: Date.now(),
    localVersion: 0,
    serverVersion: serverDoc.serverVersion
  };
  await put(tx.objectStore("docs"), next);
  await txDone(tx);
}

export async function listOutbox(): Promise<(OutboxItem & { id: number })[]> {
  const d = await db();
  const tx = d.transaction(["outbox"], "readonly");
  const items = await getAll<OutboxItem & { id: number }>(tx.objectStore("outbox"));
  await txDone(tx);
  items.sort((a, b) => a.id - b.id);
  return items;
}

export async function markConflict(id: number, serverDoc: ServerDoc): Promise<void> {
  const d = await db();
  const tx = d.transaction(["outbox"], "readwrite");
  const store = tx.objectStore("outbox");
  const existing = await getOne<OutboxItem & { id: number }>(store, id);
  if (!existing) return;

  const next: OutboxItem & { id: number } = {
    ...existing,
    status: "conflict",
    serverDoc
  };
  await put(store, next);
  await txDone(tx);
}

export async function deleteOutboxItem(id: number): Promise<void> {
  const d = await db();
  const tx = d.transaction(["outbox"], "readwrite");
  await del(tx.objectStore("outbox"), id);
  await txDone(tx);
}

export async function createOverwriteMutation(params: { doc: Doc; baseServerVersion: number }): Promise<void> {
  const d = await db();
  const tx = d.transaction(["outbox"], "readwrite");
  const item: OutboxItem = {
    status: "pending",
    idempotencyKey: crypto.randomUUID(),
    docId: params.doc.id,
    baseServerVersion: params.baseServerVersion,
    payload: {
      title: params.doc.title,
      body: params.doc.body,
      updatedAt: params.doc.updatedAt,
      localVersion: params.doc.localVersion,
      serverVersion: params.doc.serverVersion
    },
    createdAt: Date.now()
  };
  await add(tx.objectStore("outbox"), item);
  await txDone(tx);
}

