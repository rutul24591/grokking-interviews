import { issueAccess, issueRefresh } from "../../../../lib/serverTokens";
import { setRefreshCookie } from "../../../../lib/cookies";

export async function POST() {
  // Demo: authenticate user "u1". Production: validate credentials / OIDC, etc.
  const userId = "u1";
  const refresh = issueRefresh(userId);
  const access = issueAccess(userId, 5000); // 5s access token
  return Response.json(
    { ok: true, accessToken: access.token, accessExpMs: access.expMs, refreshFamily: refresh.familyId },
    { headers: { "Set-Cookie": setRefreshCookie(refresh.token) } }
  );
}

