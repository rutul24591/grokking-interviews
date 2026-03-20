import { sha256Etag, type ObjectRef, type ObjectStore, type PutResult } from "@/lib/objectStore";

type JsonObject = Record<string, unknown>;

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

export class S3CompatibleObjectStore implements ObjectStore {
  readonly provider = "s3mock" as const;
  readonly capabilities = { presignedGet: true, multipartUpload: true } as const;

  constructor(private readonly baseUrl: string) {}

  async putText(key: string, value: string): Promise<PutResult> {
    const r = await json<{ ok: true; ref: ObjectRef }>(`${this.baseUrl}/objects/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    return { ref: r.ref };
  }

  async getText(key: string): Promise<{ ref: ObjectRef; value: string } | null> {
    const res = await fetch(`${this.baseUrl}/objects/${encodeURIComponent(key)}`, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const body = (await res.json()) as JsonObject;
    const value = String(body.value ?? "");
    const ref = body.ref as ObjectRef;
    return { ref: { ...ref, etag: ref.etag || sha256Etag(value) }, value };
  }

  async list(prefix?: string): Promise<ObjectRef[]> {
    const qs = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
    const r = await json<{ ok: true; objects: ObjectRef[] }>(`${this.baseUrl}/objects${qs}`, { method: "GET" });
    return r.objects;
  }

  async delete(key: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/objects/${encodeURIComponent(key)}`, { method: "DELETE" });
    if (res.status === 404) return false;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return true;
  }
}

