import { cookies } from "next/headers";
import { bumpRefreshCount, issueAccess, rotateRefresh } from "../../../../lib/serverTokens";
import { refreshCookieName, setRefreshCookie } from "../../../../lib/cookies";

export async function POST() {
  const count = bumpRefreshCount();
  const token = (await cookies()).get(refreshCookieName())?.value;
  if (!token) return Response.json({ error: "missing_refresh", refreshCalls: count }, { status: 401 });

  const rotated = rotateRefresh(token);
  if (!rotated.ok) return Response.json({ error: rotated.error, refreshCalls: count }, { status: 401 });

  const access = issueAccess(rotated.userId, 5000);
  return Response.json(
    { ok: true, accessToken: access.token, accessExpMs: access.expMs, refreshCalls: count },
    { headers: { "Set-Cookie": setRefreshCookie(rotated.nextToken) } }
  );
}

