import crypto from "node:crypto";
import { baseUrlFromRequest } from "@/lib/http";
import { LocalFsObjectStore } from "@/lib/objectStores/localFs";
import { S3CompatibleObjectStore } from "@/lib/objectStores/s3Compatible";

export type ObjectRef = {
  key: string;
  size: number;
  updatedAt: number;
  etag: string;
};

export type PutResult = { ref: ObjectRef };

export interface ObjectStore {
  readonly provider: "local" | "s3mock";
  readonly capabilities: {
    readonly presignedGet: boolean;
    readonly multipartUpload: boolean;
  };

  putText(key: string, value: string): Promise<PutResult>;
  getText(key: string): Promise<{ ref: ObjectRef; value: string } | null>;
  list(prefix?: string): Promise<ObjectRef[]>;
  delete(key: string): Promise<boolean>;
}

export function sha256Etag(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function providerFromRequest(req: Request): "local" | "s3mock" {
  const override = req.headers.get("x-object-store");
  const env = process.env.OBJECT_STORE_PROVIDER;
  const raw = (override || env || "local").toLowerCase();
  return raw === "s3mock" ? "s3mock" : "local";
}

export function createObjectStore(req: Request): ObjectStore {
  const provider = providerFromRequest(req);
  if (provider === "s3mock") {
    const base = baseUrlFromRequest(req);
    return new S3CompatibleObjectStore(`${base}/api/mock-s3`);
  }
  return new LocalFsObjectStore();
}

