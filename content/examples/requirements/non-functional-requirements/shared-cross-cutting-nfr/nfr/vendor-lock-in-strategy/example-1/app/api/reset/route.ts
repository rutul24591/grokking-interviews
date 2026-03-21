import { jsonOk } from "@/lib/http";
import { providerFromRequest } from "@/lib/objectStore";
import { LocalFsObjectStore } from "@/lib/objectStores/localFs";
import { mockS3Reset } from "@/lib/mockS3Store";

export async function POST(req: Request) {
  const provider = providerFromRequest(req);
  if (provider === "local") {
    const local = new LocalFsObjectStore();
    await local.resetForDemo();
  } else {
    mockS3Reset();
  }
  return jsonOk({ ok: true, provider });
}

