import { jsonError, jsonOk } from "@/lib/http";
import { listUsers, toV1, toV2 } from "@/lib/users";
import { parseVersion, versionHeaders } from "@/lib/versioning";

export async function GET(req: Request) {
  const v = parseVersion(req);
  const users = listUsers();

  if (v === 1) {
    return jsonOk(
      {
        ok: true,
        version: 1,
        users: users.map(toV1)
      },
      { headers: versionHeaders(1) }
    );
  }

  if (v === 2) {
    return jsonOk(
      {
        ok: true,
        version: 2,
        users: users.map(toV2)
      },
      { headers: versionHeaders(2) }
    );
  }

  return jsonError(400, "unsupported_version");
}

