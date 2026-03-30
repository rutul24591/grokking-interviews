type ServerDoc = {
  docId: string;
  title: string;
  body: string;
  serverVersion: number;
  updatedAt: number;
};

type StoredResponse =
  | { status: 200; body: { status: "applied"; serverDoc: ServerDoc } }
  | { status: 409; body: { serverDoc: ServerDoc } };

declare global {
  // eslint-disable-next-line no-var
  var __offlineFirstDocs: Map<string, ServerDoc> | undefined;
  // eslint-disable-next-line no-var
  var __offlineFirstIdem: Map<string, StoredResponse> | undefined;
}

function docs() {
  if (!globalThis.__offlineFirstDocs) globalThis.__offlineFirstDocs = new Map();
  return globalThis.__offlineFirstDocs;
}

function idem() {
  if (!globalThis.__offlineFirstIdem) globalThis.__offlineFirstIdem = new Map();
  return globalThis.__offlineFirstIdem;
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 400, headers: { "content-type": "application/json" } });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        idempotencyKey?: string;
        docId?: string;
        baseServerVersion?: number;
        payload?: { title?: string; body?: string };
      }
    | null;

  if (!body?.idempotencyKey) return badRequest("missing idempotencyKey");
  if (!body.docId) return badRequest("missing docId");
  if (typeof body.baseServerVersion !== "number") return badRequest("missing baseServerVersion");
  if (!body.payload || typeof body.payload.title !== "string" || typeof body.payload.body !== "string") {
    return badRequest("missing payload.title/body");
  }

  const previous = idem().get(body.idempotencyKey);
  if (previous) {
    return new Response(JSON.stringify(previous.body), {
      status: previous.status,
      headers: { "content-type": "application/json", "x-idempotency-replay": "true" }
    });
  }

  const existing = docs().get(body.docId) ?? {
    docId: body.docId,
    title: "",
    body: "",
    serverVersion: 0,
    updatedAt: 0
  };

  if (existing.serverVersion !== body.baseServerVersion) {
    const resp: StoredResponse = { status: 409, body: { serverDoc: existing } };
    idem().set(body.idempotencyKey, resp);
    return new Response(JSON.stringify(resp.body), { status: 409, headers: { "content-type": "application/json" } });
  }

  const next: ServerDoc = {
    docId: body.docId,
    title: body.payload.title,
    body: body.payload.body,
    serverVersion: existing.serverVersion + 1,
    updatedAt: Date.now()
  };
  docs().set(body.docId, next);

  const resp: StoredResponse = { status: 200, body: { status: "applied", serverDoc: next } };
  idem().set(body.idempotencyKey, resp);

  return new Response(JSON.stringify(resp.body), { status: 200, headers: { "content-type": "application/json" } });
}

