import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { sha256Etag, type ObjectRef, type ObjectStore, type PutResult } from "@/lib/objectStore";

const ROOT_DIR = path.join(process.cwd(), "data", "object-store");

function encodeKey(key: string): string {
  return Buffer.from(key, "utf-8").toString("base64url");
}

function decodeKey(fileName: string): string | null {
  try {
    return Buffer.from(fileName, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}

async function ensureDir() {
  await fs.mkdir(ROOT_DIR, { recursive: true });
}

function filePathForKey(key: string): string {
  return path.join(ROOT_DIR, encodeKey(key));
}

export class LocalFsObjectStore implements ObjectStore {
  readonly provider = "local" as const;
  readonly capabilities = { presignedGet: false, multipartUpload: false } as const;

  async putText(key: string, value: string): Promise<PutResult> {
    await ensureDir();
    const fp = filePathForKey(key);
    const tmp = `${fp}.${crypto.randomBytes(6).toString("hex")}.tmp`;
    await fs.writeFile(tmp, value, "utf-8");
    await fs.rename(tmp, fp);
    const stat = await fs.stat(fp);
    const ref: ObjectRef = { key, size: stat.size, updatedAt: stat.mtimeMs, etag: sha256Etag(value) };
    return { ref };
  }

  async getText(key: string): Promise<{ ref: ObjectRef; value: string } | null> {
    await ensureDir();
    const fp = filePathForKey(key);
    try {
      const value = await fs.readFile(fp, "utf-8");
      const stat = await fs.stat(fp);
      const ref: ObjectRef = { key, size: stat.size, updatedAt: stat.mtimeMs, etag: sha256Etag(value) };
      return { ref, value };
    } catch {
      return null;
    }
  }

  async list(prefix?: string): Promise<ObjectRef[]> {
    await ensureDir();
    const entries = await fs.readdir(ROOT_DIR);
    const out: ObjectRef[] = [];
    for (const file of entries) {
      const key = decodeKey(file);
      if (!key) continue;
      if (prefix && !key.startsWith(prefix)) continue;
      const fp = path.join(ROOT_DIR, file);
      const stat = await fs.stat(fp);
      const value = await fs.readFile(fp, "utf-8");
      out.push({ key, size: stat.size, updatedAt: stat.mtimeMs, etag: sha256Etag(value) });
    }
    out.sort((a, b) => b.updatedAt - a.updatedAt);
    return out;
  }

  async delete(key: string): Promise<boolean> {
    await ensureDir();
    try {
      await fs.unlink(filePathForKey(key));
      return true;
    } catch {
      return false;
    }
  }

  async resetForDemo(): Promise<void> {
    await fs.rm(ROOT_DIR, { recursive: true, force: true });
  }
}

