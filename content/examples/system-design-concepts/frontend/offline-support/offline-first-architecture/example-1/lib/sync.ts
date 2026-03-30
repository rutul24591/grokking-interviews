import {
  createOverwriteMutation,
  deleteOutboxItem,
  getDoc,
  listOutbox,
  markConflict,
  replaceDocWithServer,
  type Doc,
  type ServerDoc
} from "./store";

type SyncResponse =
  | { status: "applied"; serverDoc: ServerDoc }
  | { status: "conflict"; serverDoc: ServerDoc };

export async function syncOutbox(params: { apiPath?: string; onProgress?: (msg: string) => void }): Promise<{
  applied: number;
  conflicts: number;
  stoppedEarly: boolean;
}> {
  const apiPath = params.apiPath ?? "/api/sync";
  let applied = 0;
  let conflicts = 0;

  const items = await listOutbox();
  for (const item of items) {
    if (item.status !== "pending") continue;

    params.onProgress?.(`Syncing #${item.id} (doc=${item.docId})…`);
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: item.idempotencyKey,
          docId: item.docId,
          baseServerVersion: item.baseServerVersion,
          payload: item.payload
        }),
        cache: "no-store"
      });

      if (res.status === 409) {
        const body = (await res.json()) as { serverDoc: ServerDoc };
        await markConflict(item.id, body.serverDoc);
        conflicts++;
        continue;
      }

      if (!res.ok) throw new Error(`sync failed: HTTP ${res.status}`);
      const body = (await res.json()) as SyncResponse;

      if (body.status === "applied") {
        await replaceDocWithServer(body.serverDoc);
        await deleteOutboxItem(item.id);
        applied++;
      } else if (body.status === "conflict") {
        await markConflict(item.id, body.serverDoc);
        conflicts++;
      }
    } catch (e) {
      params.onProgress?.(`Stopped (network error): ${e instanceof Error ? e.message : String(e)}`);
      return { applied, conflicts, stoppedEarly: true };
    }
  }

  params.onProgress?.("Sync complete.");
  return { applied, conflicts, stoppedEarly: false };
}

export async function resolveByAcceptingServer(params: { serverDoc: ServerDoc; outboxId: number }): Promise<void> {
  await replaceDocWithServer(params.serverDoc);
  await deleteOutboxItem(params.outboxId);
}

export async function resolveByOverwritingServer(params: { outboxId: number; serverDoc: ServerDoc }): Promise<void> {
  const local = await getDoc(params.serverDoc.docId);
  if (!local) {
    await deleteOutboxItem(params.outboxId);
    return;
  }

  const overwriteDoc: Doc = { ...local, serverVersion: params.serverDoc.serverVersion };
  await createOverwriteMutation({ doc: overwriteDoc, baseServerVersion: params.serverDoc.serverVersion });
  await deleteOutboxItem(params.outboxId);
}

